const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = './images-to-optimize';
const OUTPUT_DIR = './public/gallery';
const MAX_WIDTH = 2000;
const QUALITY = 85;

// Gallery categories
const CATEGORIES = [
  'firstbirthday',
  'musicconcert', 
  'familysession',
  'housewarming',
  'maternity',
  'newborn',
  'portraits',
  'wedding'
];

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath, outputPath, category) {
  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`Processing: ${path.basename(inputPath)} (${metadata.width}x${metadata.height})`);

    // Calculate dimensions maintaining aspect ratio
    const width = metadata.width > MAX_WIDTH ? MAX_WIDTH : metadata.width;
    
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const stats = await fs.stat(outputPath);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`✓ Saved: ${path.basename(outputPath)} (${sizeInKB} KB)`);

    // Also create a JPEG version for compatibility
    const jpegPath = outputPath.replace('.webp', '.jpg');
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: QUALITY })
      .toFile(jpegPath);

    return {
      webp: outputPath,
      jpeg: jpegPath,
      originalName: path.basename(inputPath),
      category
    };
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
    return null;
  }
}

async function processCategory(category) {
  const inputCategoryDir = path.join(INPUT_DIR, category);
  const outputCategoryDir = path.join(OUTPUT_DIR, category);

  try {
    await ensureDirectoryExists(outputCategoryDir);
    const files = await fs.readdir(inputCategoryDir);
    
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp|tiff|bmp)$/i.test(file)
    );

    console.log(`\nProcessing ${category}: ${imageFiles.length} images found`);

    const results = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const inputPath = path.join(inputCategoryDir, file);
      const outputFileName = `${category}-${i + 1}.webp`;
      const outputPath = path.join(outputCategoryDir, outputFileName);

      const result = await optimizeImage(inputPath, outputPath, category);
      if (result) results.push(result);
    }

    return results;
  } catch (error) {
    console.log(`Category ${category} not found or empty, skipping...`);
    return [];
  }
}

async function generateImageManifest(allResults) {
  const manifest = {};
  
  for (const result of allResults) {
    if (!manifest[result.category]) {
      manifest[result.category] = [];
    }
    
    const webpName = path.basename(result.webp);
    const jpegName = path.basename(result.jpeg);
    
    manifest[result.category].push({
      src: `/gallery/${result.category}/${jpegName}`,
      webp: `/gallery/${result.category}/${webpName}`,
      alt: `${result.category.charAt(0).toUpperCase() + result.category.slice(1)} photo`
    });
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('\n✓ Image manifest created at public/gallery/manifest.json');
  return manifest;
}

async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('============================\n');
  
  console.log(`Input directory: ${INPUT_DIR}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Max width: ${MAX_WIDTH}px`);
  console.log(`Quality: ${QUALITY}%\n`);

  // Ensure directories exist
  await ensureDirectoryExists(INPUT_DIR);
  await ensureDirectoryExists(OUTPUT_DIR);

  // Create category folders in input directory
  for (const category of CATEGORIES) {
    await ensureDirectoryExists(path.join(INPUT_DIR, category));
  }

  console.log('📁 Created folder structure:');
  console.log(`${INPUT_DIR}/`);
  for (const category of CATEGORIES) {
    console.log(`  └── ${category}/`);
  }
  console.log('\n⚠️  Please place your images in the appropriate category folders above.');
  console.log('Then run this script again to optimize them.\n');

  // Process all categories
  const allResults = [];
  let hasImages = false;

  for (const category of CATEGORIES) {
    const results = await processCategory(category);
    if (results.length > 0) {
      hasImages = true;
      allResults.push(...results);
    }
  }

  if (hasImages) {
    // Generate manifest file
    const manifest = await generateImageManifest(allResults);
    
    console.log('\n📊 Summary:');
    console.log('===========');
    for (const [category, images] of Object.entries(manifest)) {
      console.log(`${category}: ${images.length} images`);
    }
    console.log(`\nTotal: ${allResults.length} images optimized`);
    console.log('\n✅ Optimization complete!');
  } else {
    console.log('No images found to process.');
    console.log('Please add images to the category folders and run again.');
  }
}

main().catch(console.error);