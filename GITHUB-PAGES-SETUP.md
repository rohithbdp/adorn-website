# GitHub Pages Deployment Instructions

Follow these steps to deploy your Adorn Photography website to GitHub Pages:

## 1. Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name it: `adorn-website` (or any name you prefer)
4. Make it Public (required for free GitHub Pages)
5. Don't initialize with README, .gitignore, or license
6. Click "Create repository"

## 2. Push Your Code to GitHub

Copy and run these commands in your terminal (from the project directory):

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Adorn Photography website"

# Add your GitHub repository as origin
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/adorn-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"

## 4. Deploy Your Site

Run this command in your terminal:

```bash
npm run deploy
```

This will:
- Build your Next.js site
- Create the static files
- Deploy to GitHub Pages using the workflow

## 5. Access Your Site

After deployment (takes 2-5 minutes), your site will be available at:
```
https://YOUR_USERNAME.github.io/adorn-website/
```

## Updating Your Site

Whenever you make changes:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Update website"

# Push to GitHub
git push

# The GitHub Action will automatically deploy
```

## Troubleshooting

If deployment fails:
1. Check the "Actions" tab in your GitHub repository
2. Click on the failed workflow to see error details
3. Common issues:
   - Make sure repository is public
   - Ensure GitHub Pages is enabled
   - Check that all dependencies are installed

## Custom Domain (Optional)

To use a custom domain like `adornphotography.com`:
1. Buy a domain from a registrar
2. In repository Settings > Pages > Custom domain
3. Enter your domain
4. Follow DNS configuration instructions

Need help? Check the [GitHub Pages documentation](https://docs.github.com/en/pages)