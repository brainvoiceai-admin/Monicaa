# ⚡ Quick Deployment Guide

## 🚀 Fastest Way: Vercel (5 minutes)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repo
   - Add environment variable: `GEMINI_API_KEY` = `your_key`
   - Click "Deploy"
   - ✅ Done! Your app is live

**That's it!** Your app will be live in ~2 minutes.

---

## 📋 Full Instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Detailed steps for Vercel, Netlify, Render, GitHub Pages
- Troubleshooting guide
- Security best practices

---

## 🔑 Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key
5. Add it as `GEMINI_API_KEY` in your hosting platform

---

## ⚠️ Important

- **Never commit `.env` file** - It's already in `.gitignore`
- Always add `GEMINI_API_KEY` in your hosting platform's environment variables
- The app works without API key, but Scan and Chat features won't work
