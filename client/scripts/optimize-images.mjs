import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const imgsDir = fileURLToPath(new URL('../public/imgs/', import.meta.url));
const imagesDir = fileURLToPath(new URL('../images/', import.meta.url));

async function optimizeImages() {
    console.log('Оптимизация изображений в public/imgs/...');
    const files = await readdir(imgsDir);

    for (const file of files) {
        const filePath = join(imgsDir, file);
        if (!file.match(/\.(jpe?g|png)$/i)) continue;

        const inputBuffer = await readFile(filePath);
        const originalSize = inputBuffer.length;
        let pipeline = sharp(inputBuffer);
        const meta = await pipeline.metadata();

        if (file === '1.jpg') {
            // Главное превью для Open Graph и слайдера: 1200px ширина для супер-четкости в соцсетях
            pipeline = pipeline
                .resize({ width: 1200, withoutEnlargement: true })
                .jpeg({ quality: 82, progressive: true, mozjpeg: true });
        } else if (file.match(/^[2-8]\.jpg$/)) {
            // Слайдер коктейлей: ширина 800px (более чем достаточно для 300px ретины)
            pipeline = pipeline
                .resize({ width: 800, withoutEnlargement: true })
                .jpeg({ quality: 82, progressive: true, mozjpeg: true });
        } else if (['Max.jpg', 'telegram.jpg', 'vk.jpg'].includes(file)) {
            // Иконки соцсетей: отображаются 45-50px -> ресайз до 120px
            pipeline = pipeline
                .resize({ width: 120, height: 120, fit: 'cover' })
                .jpeg({ quality: 85, mozjpeg: true });
        } else {
            pipeline = pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true });
        }

        const outputBuffer = await pipeline.toBuffer();
        if (outputBuffer.length < originalSize) {
            await writeFile(filePath, outputBuffer);
            const savedPct = Math.round((1 - outputBuffer.length / originalSize) * 100);
            console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(1)} KB -> ${(outputBuffer.length / 1024).toFixed(1)} KB (-${savedPct}%)`);
        } else {
            console.log(`- ${file}: уже оптимален (${(originalSize / 1024).toFixed(1)} KB)`);
        }
    }

    console.log('\nОптимизация изображений в images/...');
    try {
        const bgFiles = await readdir(imagesDir);
        for (const file of bgFiles) {
            if (file === 'bg.jpg') {
                const filePath = join(imagesDir, file);
                const inputBuffer = await readFile(filePath);
                const originalSize = inputBuffer.length;
                const outputBuffer = await sharp(inputBuffer)
                    .resize({ width: 1920, withoutEnlargement: true })
                    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
                    .toBuffer();
                if (outputBuffer.length < originalSize) {
                    await writeFile(filePath, outputBuffer);
                    const savedPct = Math.round((1 - outputBuffer.length / originalSize) * 100);
                    console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(1)} KB -> ${(outputBuffer.length / 1024).toFixed(1)} KB (-${savedPct}%)`);
                }
            }
        }
    } catch (e) {
        console.log('Папка images пропущена:', e.message);
    }

    console.log('\nОптимизация изображений завершена.');
}

optimizeImages().catch(console.error);
