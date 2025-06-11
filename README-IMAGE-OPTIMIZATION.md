# Image Optimization Guide

## How to optimize your images:

1. **Folder Structure Created:**
   ```
   images-to-optimize/
   ├── weddings/
   ├── christening/
   ├── homeshoots/
   ├── babyshower/
   └── housewarming/
   ```

2. **Add Your Images:**
   - Place your original images in the appropriate category folders
   - Supported formats: JPG, JPEG, PNG, WEBP, TIFF, BMP

3. **Run Optimization:**
   ```bash
   npm run optimize-images
   ```

4. **What the script does:**
   - Resizes images to max 2000px width (maintains aspect ratio)
   - Converts to WebP format (85% quality)
   - Also creates JPEG versions for compatibility
   - Generates a manifest.json file
   - Outputs to `public/gallery/[category]/`

5. **Expected output size:**
   - Most images will be 200-500 KB
   - WebP format provides 25-35% better compression than JPEG

## Example:
If you have a 5MB wedding photo, after optimization:
- WebP version: ~300-400 KB
- JPEG version: ~400-500 KB
- Both maintain excellent visual quality

## Tips:
- Select your best 20-30 photos per category
- Name doesn't matter - script renames them automatically
- Run the script multiple times as you add more images