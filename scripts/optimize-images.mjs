import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// --- Configuration ---
const MAX_WIDTH = 2000;
const MAX_SIZE_BYTES = 500 * 1024; // 500 KB
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 65;
const TARGET_DIR = 'public/images';
const SEARCH_DIRS = ['src', 'outstatic', 'content', 'docs'];
const CONCURRENCY = 6;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to normalize paths for comparison
const normalizePath = (p) => path.relative(ROOT_DIR, p).replace(/\\/g, '/');

async function fileExists(p) {
    try {
        const stat = await fs.stat(p);
        return stat.size > 0;
    } catch {
        return false;
    }
}

async function getFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}

async function updateReferences(oldPath, newPath) {
    const oldRelPublic = normalizePath(oldPath); // e.g. public/images/foo.jpg
    const newRelPublic = normalizePath(newPath); // e.g. public/images/foo.webp

    const oldRel = oldRelPublic.replace(/^public\//, '/'); // e.g. /images/foo.jpg
    const newRel = newRelPublic.replace(/^public\//, '/'); // e.g. /images/foo.webp

    const oldRelEncoded = encodeURI(oldRel); // e.g. /images/Ship%20-new-thatch.jpg
    const newRelEncoded = encodeURI(newRel); // e.g. /images/Ship%20-new-thatch.webp

    const oldRelNoSlash = oldRel.replace(/^\//, ''); // e.g. images/foo.jpg
    const newRelNoSlash = newRel.replace(/^\//, ''); // e.g. images/foo.webp

    const oldBaseQuoted = `"${path.basename(oldPath)}"`;
    const newBaseQuoted = `"${path.basename(newPath)}"`;

    const replacements = [
        [oldRelPublic, newRelPublic],
        [oldRel, newRel],
        [oldRelEncoded, newRelEncoded],
        [oldRelNoSlash, newRelNoSlash],
        [oldBaseQuoted, newBaseQuoted],
    ];

    let count = 0;

    for (const relDir of SEARCH_DIRS) {
        const dir = path.resolve(ROOT_DIR, relDir);
        try {
            await fs.access(dir);
        } catch {
            continue;
        }

        const files = await getFiles(dir);
        for (const file of files) {
            if (!file.match(/\.(tsx|ts|jsx|js|md|json|html)$/i)) continue;

            let content = await fs.readFile(file, 'utf8');
            let changed = false;

            for (const [fromStr, toStr] of replacements) {
                if (fromStr !== toStr && content.includes(fromStr)) {
                    content = content.split(fromStr).join(toStr);
                    changed = true;
                }
            }

            if (changed) {
                await fs.writeFile(file, content, 'utf8');
                console.log(`  Updated reference in ${normalizePath(file)}: ${oldRel} -> ${newRel}`);
                count++;
            }
        }
    }
    return count;
}

async function generateWebpBuffer(filePath) {
    const metadata = await sharp(filePath).metadata();
    const shouldResize = metadata.width && metadata.width > MAX_WIDTH;

    let finalQuality = WEBP_QUALITY;
    let pipeline = sharp(filePath);
    if (shouldResize) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    let outputBuffer = await pipeline.webp({ quality: finalQuality }).toBuffer();

    while (outputBuffer.length > MAX_SIZE_BYTES && finalQuality > 20) {
        finalQuality -= 10;
        let retryPipeline = sharp(filePath);
        if (shouldResize) {
            retryPipeline = retryPipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
        }
        outputBuffer = await retryPipeline.webp({ quality: finalQuality }).toBuffer();
    }

    return outputBuffer;
}

async function generateAvifBuffer(filePath) {
    const metadata = await sharp(filePath).metadata();
    let pipeline = sharp(filePath);
    if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }
    return pipeline.avif({ quality: AVIF_QUALITY }).toBuffer();
}

async function runWithConcurrency(items, worker, concurrency = CONCURRENCY) {
    const queue = [...items];
    const runners = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
        while (queue.length > 0) {
            const item = queue.shift();
            if (item) await worker(item);
        }
    });
    await Promise.all(runners);
}

async function processImages() {
    const imagesDir = path.resolve(ROOT_DIR, TARGET_DIR);
    try {
        await fs.access(imagesDir);
    } catch {
        console.log(`Target directory ${TARGET_DIR} not found, skipping.`);
        return;
    }

    // 1. Convert all legacy image formats (.jpg, .jpeg, .png, .jfif) to .webp + .avif
    const initialFiles = await getFiles(imagesDir);
    const legacyFiles = initialFiles.filter((f) => f.match(/\.(jpg|jpeg|png|jfif)$/i));

    if (legacyFiles.length > 0) {
        console.log(`Found ${legacyFiles.length} legacy image(s) (.jpg/.jpeg/.png/.jfif) to convert to .webp and .avif...`);
    }

    for (const filePath of legacyFiles) {
        const relativePath = normalizePath(filePath);
        const webpPath = filePath.replace(/\.[^.]+$/, '.webp');
        const avifPath = filePath.replace(/\.[^.]+$/, '.avif');

        try {
            if (!(await fileExists(webpPath))) {
                const webpBuffer = await generateWebpBuffer(filePath);
                await fs.writeFile(webpPath, webpBuffer);
                console.log(`  Created ${normalizePath(webpPath)} (${(webpBuffer.length / 1024).toFixed(1)}KB)`);
            }

            if (!(await fileExists(avifPath))) {
                const avifBuffer = await generateAvifBuffer(filePath);
                await fs.writeFile(avifPath, avifBuffer);
                console.log(`  Created ${normalizePath(avifPath)} (${(avifBuffer.length / 1024).toFixed(1)}KB)`);
            }

            await updateReferences(filePath, webpPath);
            await fs.unlink(filePath);
            console.log(`  Removed legacy file: ${relativePath}`);
        } catch (err) {
            console.error(`  Error converting ${relativePath}:`, err);
        }
    }

    // 2. Ensure every .webp file has a matching .avif companion
    const currentFiles = await getFiles(imagesDir);
    const webpFiles = currentFiles.filter((f) => f.match(/\.webp$/i));
    const missingAvifTasks = [];

    for (const webpPath of webpFiles) {
        const avifPath = webpPath.replace(/\.webp$/i, '.avif');
        if (!(await fileExists(avifPath))) {
            missingAvifTasks.push({ webpPath, avifPath });
        }
    }

    if (missingAvifTasks.length > 0) {
        console.log(`Generating ${missingAvifTasks.length} missing .avif companion image(s)...`);
        let completed = 0;
        await runWithConcurrency(missingAvifTasks, async ({ webpPath, avifPath }) => {
            try {
                const avifBuffer = await generateAvifBuffer(webpPath);
                await fs.writeFile(avifPath, avifBuffer);
                completed++;
                if (completed % 25 === 0 || completed === missingAvifTasks.length) {
                    console.log(`  AVIF progress: ${completed}/${missingAvifTasks.length}`);
                }
            } catch (err) {
                console.error(`  Error generating AVIF for ${normalizePath(webpPath)}:`, err);
            }
        });
    } else {
        console.log('All images in public/images already have both .webp and .avif versions.');
    }
}

processImages().catch((err) => {
    console.error('Image optimization failed:', err);
    process.exit(1);
});
