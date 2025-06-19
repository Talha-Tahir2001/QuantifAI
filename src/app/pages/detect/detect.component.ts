import { Component, ElementRef, inject, viewChild } from '@angular/core';
import {
  DetectionSettings,
  GeminiService,
} from '../../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, PercentPipe } from '@angular/common';
@Component({
  selector: 'app-detect',
  imports: [FormsModule, PercentPipe, DecimalPipe],
  templateUrl: './detect.component.html',
  styles: ``,
})
export class DetectComponent {
  geminiService: GeminiService = inject(GeminiService);
  isLoading = this.geminiService.isLoading;
  error = this.geminiService.error;
  result = this.geminiService.detectionResult;
  public file: File | null = null;
  // Preview image handling
  previewUrl: string | null = null;

  // Default settings matching UI
  settings: DetectionSettings = {
    confidenceThreshold: 70,    
    maxDetections: 10,
    model: 'Standard (Balanced)',
    autoEnhance: false,
    showBoundingBoxes: true,
    showConfidenceScores: true,
    showAnnotations: true,
  };

  async handleFileUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Create preview
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);

    try {
    await this.geminiService.detectObjectsFromFile(file, this.settings);
  } catch (err) {
    console.error('Error detecting objects:', err);
  }
  }

  resetDetection(): void {
    this.geminiService.resetState();
    this.previewUrl = null;
  }
  // Convert normalized bbox to pixel coordinates
  readonly previewImage =
    viewChild.required<ElementRef<HTMLImageElement>>('previewImage');
  denormalizeBbox(
    boundingBox: [number, number, number, number],
    width: number,
    height: number
  ): [number, number, number, number] {
    return [
      Math.round(boundingBox[0] * width),
      Math.round(boundingBox[1] * height),
      Math.round(boundingBox[2] * width),
      Math.round(boundingBox[3] * height),
    ];
  }
}
