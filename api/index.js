import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverDistPath = join(__dirname, '../dist/quantif-ai/server/server.mjs');

// Vercel expects you to export a default handler from the file
export default import(serverDistPath).then(module => module.app);
