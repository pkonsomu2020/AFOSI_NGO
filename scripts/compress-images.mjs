import sharp from 'sharp';
import { readdirSync, statSync, renameSync } from 'fs';
import { join, extname, basename } from 'path';

const DIRS = ['public', 'public/TEAMS', 'public/PROJECT-IMAGES', 'public/NEWSLETTER'];
const MAX_WIDTH = 1920;
const QUALITY = 75;
const MIN_SIZE_KB = 300; // Only compress files larger than 300KB

let totalSaved = 0;

async function compressFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const stat = statSync(filePath);
  const sizeKB = stat.size / 1024;

  if (sizeKB < MIN_SIZE_KB) return;
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  try {
    const tempPath = filePath + '.tmp';
    
    let pipeline = sharp(filePath).resize({ width: MAX_WIDTH, withoutEnlargement: true });

    if (ext === '.png') {
      await pipeline.png({ quality: QUALITY, compressionLevel: 9 }).toFile(tempPath);
    } else {
      await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tempPath);
    }

    const newStat = statSync(tempPath);
    const saved = stat.size - newStat.size;

    if (saved > 0) {
      renameSync(tempPath, filePath);
      totalSaved += saved;
      console.log(`✓ ${basename(filePath)}: ${(stat.size/1024/1024).toFixed(2)}MB → ${(newStat.size/1024/1024).toFixed(2)}MB (saved ${(saved/1024).toFixed(0)}KB)`);
    } else {
      // Already optimized, remove temp
      renameSync(tempPath, filePath);
      console.log(`- ${basename(filePath)}: already optimized`);
    }
  } catch (err) {
    console.error(`✗ ${basename(filePath)}: ${err.message}`);
  }
}

async function processDir(dir) {
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      if (stat.isFile()) {
        await compressFile(fullPath);
      }
    }
  } catch (e) {
    // Directory may not exist
  }
}

console.log('🗜️  Compressing images...\n');
for (const dir of DIRS) {
  await processDir(dir);
}
console.log(`\n✅ Done! Total saved: ${(totalSaved/1024/1024).toFixed(2)}MB`);
