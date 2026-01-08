
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// --- Configuration ---
const MAX_WIDTH = 2000;
const MAX_SIZE_BYTES = 500 * 1024; // 500 KB
const EXCLUDE_FILE = 'public/images/exterior/ship-inn-front-view.png';
const TARGET_DIR = 'public/images';
const SRC_DIR = 'src';
const CONTENT_DIR = 'content';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to normalize paths for comparison
const normalizePath = (p) => path.relative(ROOT_DIR, p).replace(/\\/g, '/');

async function getFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}

async function updateReferences(oldPath, newPath) {
    const oldRel = normalizePath(oldPath).replace(/^public\//, '/'); // e.g. /images/foo.jpg
    const newRel = normalizePath(newPath).replace(/^public\//, '/'); // e.g. /images/foo.webp

    // Also handle cases where path doesn't start with / in code (though less common for public assets)
    const oldRelNoSlash = oldRel.replace(/^\//, '');
    const newRelNoSlash = newRel.replace(/^\//, '');

    const searchDirs = [path.resolve(ROOT_DIR, SRC_DIR), path.resolve(ROOT_DIR, CONTENT_DIR)];

    console.log(`Updating references from '${oldRel}' to '${newRel}'...`);

    let count = 0;

    for (const dir of searchDirs) {
        // Check if directory exists before trying to read it
        try {
            await fs.access(dir);
        } catch (e) {
            console.warn(`Directory ${dir} does not exist, skipping...`);
            continue;
        }

        const files = await getFiles(dir);
        for (const file of files) {
            if (!file.match(/\.(tsx|ts|jsx|js|md|json)$/)) continue;

            let content = await fs.readFile(file, 'utf8');
            let changed = false;

            // Simple replace for exact matches of path
            // Note: This might need refinement if there are complex references, but this covers standard usages
            if (content.includes(oldRel)) {
                content = content.split(oldRel).join(newRel);
                changed = true;
            }
            if (content.includes(oldRelNoSlash)) {
                content = content.split(oldRelNoSlash).join(newRelNoSlash);
                changed = true;
            }

            if (changed) {
                await fs.writeFile(file, content, 'utf8');
                console.log(`  Updated ${normalizePath(file)}`);
                count++;
            }
        }
    }
    return count;
}


async function processImages() {
    const imagesDir = path.resolve(ROOT_DIR, TARGET_DIR);
    const allFiles = await getFiles(imagesDir);

    for (const filePath of allFiles) {
        // Only process images
        if (!filePath.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

        const relativePath = normalizePath(filePath);

        // Check exclusion
        if (relativePath === EXCLUDE_FILE) {
            console.log(`Skipping excluded file: ${relativePath}`);
            continue;
        }

        console.log(`Processing: ${relativePath}`);

        try {
            const image = sharp(filePath);
            const metadata = await image.metadata();

            let pipeline = image;

            // Resize if needed
            if (metadata.width > MAX_WIDTH) {
                console.log(`  Resizing from ${metadata.width}px to ${MAX_WIDTH}px`);
                pipeline = pipeline.resize({ width: MAX_WIDTH });
            }

            // Convert/Compress to WebP
            // Using nearLossless or quality to target size? 
            // WebP is generally efficient. Let's try quality 80 first.
            // If the original was already webp, we still re-process to ensure size/width constraints.

            const newFilePath = filePath.replace(/\.[^.]+$/, '.webp');

            // We process to a buffer first to check size
            let outputBuffer = await pipeline
                .webp({ quality: 80 })
                .toBuffer();

            let finalQuality = 80;
            while (outputBuffer.length > MAX_SIZE_BYTES && finalQuality > 10) {
                console.log(`  Size ${outputBuffer.length} > ${MAX_SIZE_BYTES}, reducing quality to ${finalQuality - 10}`);
                finalQuality -= 10;
                outputBuffer = await pipeline
                    .webp({ quality: finalQuality })
                    .toBuffer();
            }

            if (outputBuffer.length > MAX_SIZE_BYTES) {
                console.warn(`  WARNING: Could not compress ${relativePath} to under 500KB. Final size: ${(outputBuffer.length / 1024).toFixed(2)}KB`);
            }

            // Write new file
            await fs.writeFile(newFilePath, outputBuffer);
            console.log(`  Saved to ${normalizePath(newFilePath)} (${(outputBuffer.length / 1024).toFixed(2)}KB)`);

            // If extension changed, update references and delete old file
            if (filePath !== newFilePath) {
                await updateReferences(filePath, newFilePath);
                await fs.unlink(filePath);
                console.log(`  Deleted old file: ${relativePath}`);
            }

        } catch (err) {
            console.error(`  Error processing ${relativePath}:`, err);
        }
    }
}

processImages().catch(console.error);
