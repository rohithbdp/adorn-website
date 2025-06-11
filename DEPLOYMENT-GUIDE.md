# Deployment Guide for Adorn Photography Website

## Quick Deploy with Vercel (Recommended - FREE)

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Adorn Photography website"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

3. **Your site will be available at**:
   - `https://your-project-name.vercel.app`

## Add Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy, Google Domains)
2. In Vercel dashboard:
   - Go to your project settings
   - Click "Domains"
   - Add your domain
   - Follow DNS configuration instructions

## Alternative: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Or connect GitHub for automatic deploys

## Alternative: Static Export for Any Host

Since I've configured `output: 'export'`, you can also:

```bash
npm run build
```

This creates an `out` folder that can be uploaded to any static host:
- GitHub Pages
- AWS S3
- Google Cloud Storage
- Any web hosting service

## Environment Variables (if needed later)

If you add backend features, create `.env.local`:
```
NEXT_PUBLIC_API_URL=your-api-url
```

## Important Files
- `public/` - Contains all your images and static files
- `app/` - Your Next.js pages and components
- `scripts/optimize-images.js` - Image optimization tool

## Maintenance
- Run `npm run optimize-images` when adding new photos
- Keep dependencies updated: `npm update`

## Support
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs