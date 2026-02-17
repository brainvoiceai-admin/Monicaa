# 🚀 Deployment Guide - Monica AI Skin Care App

This guide covers deploying your Monica AI application to free hosting platforms.

## ⚠️ Important Security Note

**NEVER commit your `.env` file or API keys to GitHub!** The `.env` file should be in `.gitignore`. Always use environment variables provided by the hosting platform.

---

## 📋 Prerequisites

1. **GitHub Account** - Create a repository and push your code
2. **Gemini API Key** - Get it from [Google AI Studio](https://aistudio.google.com/apikey)

---

## 🎯 Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest option for React/Vite apps with automatic deployments.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Go to [Vercel](https://vercel.com)**
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

4. **Add Environment Variable:**
   - Go to "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your_api_key_here`
   - Select all environments (Production, Preview, Development)

5. **Deploy!**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live at `https://your-app-name.vercel.app`

### ✅ Advantages:
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Zero configuration needed

---

## 🎯 Option 2: Netlify

Netlify is another excellent option with great free tier.

### Steps:

1. **Push your code to GitHub** (same as Vercel step 1)

2. **Go to [Netlify](https://netlify.com)**
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** `./` (leave empty)

4. **Add Environment Variable:**
   - Go to "Site settings" → "Environment variables"
   - Add: `GEMINI_API_KEY` = `your_api_key_here`

5. **Deploy!**
   - Click "Deploy site"
   - Your app will be live at `https://random-name.netlify.app`
   - You can change the site name in "Site settings" → "Change site name"

### ✅ Advantages:
- ✅ Free tier with good limits
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Form handling (if needed later)

---

## 🎯 Option 3: Render

Render offers free static site hosting.

### Steps:

1. **Push your code to GitHub** (same as above)

2. **Go to [Render](https://render.com)**
   - Sign up/login with GitHub
   - Click "New +" → "Static Site"

3. **Configure:**
   - **Name:** Your app name
   - **Repository:** Select your GitHub repo
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   - Scroll to "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your_api_key_here`

5. **Deploy!**
   - Click "Create Static Site"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-app-name.onrender.com`

### ⚠️ Note:
- Free tier spins down after inactivity (takes ~30 seconds to wake up)
- Consider upgrading to paid plan for always-on service

---

## 🎯 Option 4: GitHub Pages

GitHub Pages is free but requires some configuration changes.

### Steps:

1. **Update `vite.config.ts` for GitHub Pages:**
   ```typescript
   export default defineConfig({
     base: '/YOUR_REPO_NAME/', // Change this to your repo name
     // ... rest of config
   });
   ```

2. **Create GitHub Actions workflow:**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
           env:
             GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Add GitHub Secret:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Value: Your API key

4. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - Save

5. **Push your code:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push
   ```

6. **Wait for deployment:**
   - Check Actions tab for build status
   - Your app will be at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### ⚠️ Note:
- GitHub Pages doesn't support environment variables at runtime
- The API key is baked into the build (less secure, but works)
- Consider using Vercel/Netlify for better security

---

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - Make sure `.gitignore` includes `.env`
   - Check: `git status` should NOT show `.env`

2. **Use platform environment variables**
   - Always add `GEMINI_API_KEY` in the hosting platform's settings
   - Never hardcode API keys in your code

3. **Rotate keys if exposed**
   - If you accidentally commit a key, regenerate it immediately
   - Update the key in all deployment platforms

---

## 🧪 Testing Your Deployment

After deployment, test these features:

1. ✅ App loads without errors
2. ✅ Splash screen appears
3. ✅ Navigation works (Report, Routine, Scan, Stats, Chat)
4. ✅ Scan feature works (requires API key)
5. ✅ Chat feature works (requires API key)

---

## 📝 Troubleshooting

### Build fails with "API_KEY is undefined"
- Make sure you added `GEMINI_API_KEY` in the platform's environment variables
- Restart/redeploy after adding environment variables

### Blank screen after deployment
- Check browser console (F12) for errors
- Verify the build completed successfully
- Check that `base` path in `vite.config.ts` matches your deployment path

### API calls fail
- Verify `GEMINI_API_KEY` is set correctly
- Check API key is valid and has quota remaining
- Check browser console for specific error messages

---

## 🎉 Recommended Platform

**For this app, I recommend Vercel** because:
- ✅ Zero configuration needed
- ✅ Best developer experience
- ✅ Fastest deployments
- ✅ Automatic HTTPS and CDN
- ✅ Free tier is very generous

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Render Documentation](https://render.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/pages)
