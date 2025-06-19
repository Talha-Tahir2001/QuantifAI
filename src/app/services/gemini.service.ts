import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { GoogleGenAI } from '@google/genai';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface DetectionSettings {
  confidenceThreshold: number;
  maxDetections: number;
  model: string;
  autoEnhance: boolean;
  showBoundingBoxes: boolean;
  showConfidenceScores: boolean;
  showAnnotations?: boolean; // Optional for future use
}

export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DetectionResult {
  // description: string;
  objects: DetectedObject[];
  processedImage?: string; // Base64 encoded image with bounding boxes
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  isLoading = signal(false);
  error = signal<string | null>(null);
  detectionResult = signal<DetectionResult | null>(null);
  private sanitizer = inject(DomSanitizer);
  readonly genai = new GoogleGenAI({
    apiKey: environment.GOOGLE_GEMINI_API_KEY,
  });

  constructor() {
    if (typeof window !== 'undefined') {
      this.genai = new GoogleGenAI({
        apiKey: environment.GOOGLE_GEMINI_API_KEY,
      });
    }   
  }

  
  async detectObjectsFromFile(
    file: File,
    settings: DetectionSettings
  ): Promise<void> {
    if (!this.genai.models.get) {
      this.error.set('AI model not initialized');
      return;
    }

    this.resetState();
    this.isLoading.set(true);

    try {
      // Client-side validation
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Use JPG, PNG, or WEBP');
      }

      if (file.size > maxSize) {
        throw new Error('File too large. Max 10MB allowed');
      }

      // Prepare image for Gemini
      const base64Image = await this.fileToBase64(file);

      // Construct prompt based on settings
      const prompt = this.buildDetectionPrompt(settings);

      // Run detection
      const result = await this.detectObjects(prompt, base64Image, file.type);

      // Process and store results
      this.detectionResult.set({
        objects: this.parseDetectionOutput(result),
        processedImage: result,
        timestamp: Date.now(),
        // description: '',
      });
    } catch (error: any) {
      this.handleError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private buildDetectionPrompt(settings: DetectionSettings): string {
    return `
      You are an expert object detection system. Analyze the provided image and:
      1. Identify all visible objects
      2. For each object, provide:
         - Label (specific name)
         - Confidence score (0-1)
         - Bounding box [x, y, width, height] in normalized coordinates (0-1)
      
      Settings:
      - Confidence threshold: ${settings.confidenceThreshold / 100}
      - Maximum detections: ${settings.maxDetections}
      - Enhance image: ${settings.autoEnhance ? 'yes' : 'no'}
      - Show bounding boxes: ${settings.showBoundingBoxes ? 'yes' : 'no'}
      - Show confidence scores: ${settings.showConfidenceScores ? 'yes' : 'no'}
      
      IMPORTANT: Respond ONLY with valid JSON in this exact structure:
      {
        "objects": [
          {
            "label": "object name",
            "confidence": 0.95,
            "bbox": [0.25, 0.3, 0.4, 0.5]
          }
        ],
        }
        `;
      }
      // "description": "Brief summary of detected objects"
      
  private async detectObjects(
    prompt: string,
    image: string,
    mimeType: string
  ): Promise<string> {
    const imagePart = {
      inlineData: {
        data: image.split(',')[1], // Remove data:image/... header
        mimeType,
      },
    };

    const result = await this.genai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }, imagePart],
        },
      ],
      config: {
        temperature: 0.25,
        topP: 0.95,
        maxOutputTokens: 8192,
        // responseMimeType: 'application/json',
        // responseSchema: {
        //   type: 'object',
        //   properties: {
        //     objects: {
        //       type: 'array',
        //       items: {
        //         type: 'object',
        //         properties: {
        //           label: { type: 'string' },
        //           confidence: { type: 'number' },
        //           bbox: {
        //             type: 'array',
        //             items: { type: 'number' },
        //             minItems: 4,
        //             maxItems: 4,
        //           },
        //         },
        //         required: ['label', 'confidence', 'bbox'],
        //       },
        //     },
        //     description: { type: 'string' },
        //   },
        //   required: ['objects', 'description'],
        // },
        // safetySettings: [{}],
      },
    });
    const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No response content from Gemini');
    }
    // const jsonContent = JSON.stringify(content);
    return content;
  }

  private parseDetectionOutput(text: string): DetectedObject[] {
    try {
      // Extract JSON from Gemini response
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);

      const result = JSON.parse(jsonString);

      if (!result.objects || !Array.isArray(result.objects)) {
        throw new Error('Invalid response format from Gemini');
      }

      return result.objects.map((obj: any) => ({
        label: obj.label,
        confidence: obj.confidence,
        boundingBox: {
          x: obj.bbox[0],
          y: obj.bbox[1],
          width: obj.bbox[2],
          height: obj.bbox[3],
        },
      }));
    } catch (error) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('AI returned unexpected response format');
    }
  }

  private handleError(error: any): void {
    console.error('Detection error', error);

    if (error.message.includes('429')) {
      this.error.set('API rate limit exceeded. Please try again later.');
    } else if (error.message.includes('500')) {
      this.error.set('AI service unavailable. Please try again later.');
    } else if (error.message.includes('400')) {
      this.error.set('Invalid image format. Please upload JPG, PNG, or WEBP');
    } else {
      this.error.set(error.message || 'An unexpected error occurred');
    }
  }

  resetState(): void {
    this.detectionResult.set(null);
    this.error.set(null);
    this.isLoading.set(false);
  }

  getImagePreview(dataUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(dataUrl);
  }
}
