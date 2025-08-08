# 🚀 Quick Deployment Guide

Follow these steps to get WatchLog deployed to Vercel in under 10 minutes!

## 📋 Prerequisites Checklist

- [ ] GitHub account
- [ ] Vercel account (sign up with GitHub at vercel.com)

## 🎯 Step-by-Step Deployment

### 1. 📤 Push to GitHub (5 minutes)

```bash
# In your WatchLog directory:
git init
git add .
git commit -m "Initial WatchLog setup"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOURUSERNAME/watchlog.git
git branch -M main
git push -u origin main
```

### 2. 🗄️ Set up Supabase (3 minutes)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose name: `watchlog` 
3. Wait for project creation
4. **SQL Editor** → **New Query** → Paste contents of `supabase/schema.sql` → **Run**
5. **Settings** → **API** → Copy:
   - Project URL: `https://xxxxx.supabase.co`
   - anon public key: `eyJhbGc...`

### 3. 🎬 Get TMDb API Key (2 minutes)

1. [themoviedb.org](https://www.themoviedb.org/) → **Sign Up**
2. **Settings** → **API** → **Create** → **Developer**
3. Fill form with your GitHub repo URL
4. Copy **API Key (v3 auth)**

### 4. 🚀 Deploy to Vercel (2 minutes)

1. [vercel.com](https://vercel.com) → **Import Project**
2. Select your `watchlog` repository
3. **Add Environment Variables:**

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
NEXT_PUBLIC_TMDB_API_KEY = your-tmdb-api-key
NEXTAUTH_SECRET = random-secret-string
NEXTAUTH_URL = https://your-app.vercel.app
```

4. **Deploy** → Wait for build to complete

### 5. ✅ Final Configuration

1. Copy your Vercel app URL (like `watchlog-abc123.vercel.app`)
2. **Vercel Dashboard** → **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` to your actual Vercel URL
4. **Redeploy** (happens automatically)

## 🎉 You're Done!

Your WatchLog app should now be live at your Vercel URL!

### Test Your Deployment:

1. ✅ Homepage loads
2. ✅ Can create account
3. ✅ Dashboard shows after login
4. ✅ Search works for movies/shows

## 🆘 Need Help?

**Common Issues:**
- **Build failed**: Check environment variables are set correctly
- **Can't sign up**: Verify Supabase URL and key
- **Search not working**: Check TMDb API key

**Get Support:**
- Check console errors in browser (F12)
- Verify all environment variables are set
- Make sure database schema was applied in Supabase

## 🔧 Generate Random Secret

For `NEXTAUTH_SECRET`, use one of these methods:

**Online:** Visit https://generate-secret.vercel.app/32

**Command line:**
```bash
openssl rand -base64 32
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

**Total Time: ~10 minutes** ⏱️

Your WatchLog app will be live on a global CDN with HTTPS, automatic deployments, and all the features working perfectly! 🎬✨