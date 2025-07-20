import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Reads a JSON file and parses its contents.
 * Logs full path for debugging. If file doesn't exist, returns an empty array or object.
 * @param filePath Relative to project root (e.g., 'data/users.json')
 */
export const readJsonFile = async <T = any>(filePath: string): Promise<T> => {
  const rootDir = path.resolve(__dirname, '..'); // Go up from utils/ to backend/
  const fullPath = path.join(rootDir, filePath);
  console.log(`📄 Reading JSON from: ${fullPath}`);

  try {
    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`⚠️ File not found: ${fullPath}, returning empty array`);
      return [] as T;
    }
    console.error(`❌ Error reading ${filePath}:`, error);
    throw error;
  }
};

/**
 * Writes a JavaScript object or array as JSON to the given path.
 * Ensures the target directory exists.
 * @param filePath Relative to project root (e.g., 'data/users.json')
 */
export const writeJsonFile = async (filePath: string, data: unknown): Promise<void> => {
  const rootDir = path.resolve(__dirname, '..'); // Go up from utils/ to backend/
  const fullPath = path.join(rootDir, filePath);
  const dir = path.dirname(fullPath);

  console.log(`💾 Writing JSON to: ${fullPath}`);

  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`❌ Error writing to ${filePath}:`, error);
    throw error;
  }
};
