# ✅ WatchLog Deployment Checklist

Use this checklist to deploy WatchLog to Vercel step-by-step.

## 📋 Pre-Deployment Setup

### GitHub Repository
- [ ] Code is committed to Git
- [ ] Repository is pushed to GitHub
- [ ] Repository is public or accessible to Vercel

### External Services Setup

#### Supabase (Database & Auth)
- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] New project created (choose any name/region)
- [ ] Database schema applied:
  - [ ] Go to SQL Editor → New Query
  - [ ] Copy entire `supabase/schema.sql` content
  - [ ] Execute SQL successfully
- [ ] API credentials noted:
  - [ ] Project URL: `https://xxxxx.supabase.co`
  - [ ] anon public key: `eyJhbGc...`

#### TMDb API (Movie/TV Data)
- [ ] TMDb account created at [themoviedb.org](https://themoviedb.org)
- [ ] API key requested (Settings → API → Developer)
- [ ] API Key (v3 auth) copied

## 🚀 Vercel Deployment

### Import Project
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] GitHub account connected to Vercel
- [ ] WatchLog repository imported to Vercel
- [ ] Next.js framework auto-detected

### Environment Variables
Add these in Vercel dashboard during import or in Settings → Environment Variables:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
- [ ] `NEXT_PUBLIC_TMDB_API_KEY` = `your-tmdb-api-key`
- [ ] `NEXTAUTH_SECRET` = `random-32-character-string`
- [ ] `NEXTAUTH_URL` = `https://your-app.vercel.app` (update after first deploy)

### Generate NEXTAUTH_SECRET
Choose one method to generate a secure secret:
- [ ] **Online**: https://generate-secret.vercel.app/32
- [ ] **Command**: `openssl rand -base64 32`
- [ ] **Node.js**: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

### First Deployment
- [ ] All environment variables added
- [ ] **Deploy** button clicked
- [ ] Build completed successfully
- [ ] App URL received (like `watchlog-abc123.vercel.app`)

### Post-Deployment Configuration
- [ ] Copy actual Vercel app URL
- [ ] Update `NEXTAUTH_URL` environment variable with real URL
- [ ] Redeploy triggered (automatic when env vars change)
- [ ] Final deployment successful

## ✅ Testing Your Deployment

### Basic Functionality
- [ ] Homepage loads at your Vercel URL
- [ ] "Get Started Free" button works
- [ ] Sign up form appears
- [ ] No console errors in browser (F12 → Console)

### User Registration
- [ ] Can create new account with email/username
- [ ] Email verification sent (check spam folder)
- [ ] Can verify email and complete signup
- [ ] Redirects to dashboard after verification

### Core Features
- [ ] Dashboard loads with mock data
- [ ] Search functionality works (try searching "Breaking Bad")
- [ ] Navigation works (Movies, TV Shows, etc.)
- [ ] Can mark content as watched
- [ ] Statistics page displays

### Authentication
- [ ] Can log out successfully
- [ ] Can log back in with same credentials
- [ ] Protected routes redirect to login when not authenticated
- [ ] Dashboard accessible after login

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ App loads without errors
- ✅ Users can sign up and log in
- ✅ All main features work
- ✅ Search returns TMDb results
- ✅ Database operations work (marking watched, etc.)

## 🆘 Troubleshooting

### Common Issues

**Build Fails**
- Check all environment variables are set
- Verify no typos in variable names
- Make sure all required dependencies are in package.json

**Can't Sign Up**
- Verify Supabase URL and anon key
- Check Supabase project is active
- Confirm database schema was applied correctly

**Search Doesn't Work**
- Verify TMDb API key is correct and active
- Check browser console for API errors
- Ensure CORS is properly configured

**Authentication Issues**
- Make sure NEXTAUTH_SECRET is set and secure
- Verify NEXTAUTH_URL matches your actual domain
- Check that auth callbacks are working

### Getting Help
- Check browser console (F12) for JavaScript errors
- Review Vercel function logs in dashboard
- Verify Supabase logs in dashboard
- Check environment variables are correctly set

## 🔄 Ongoing Maintenance

### Automatic Updates
- [ ] Push changes to GitHub → Vercel auto-deploys
- [ ] Environment variables updated as needed
- [ ] Monitor Vercel analytics for performance

### Optional Enhancements
- [ ] Add custom domain in Vercel settings
- [ ] Set up monitoring/analytics
- [ ] Configure error tracking (Sentry)
- [ ] Add more TMDb API features

---

**Estimated Total Time: 10-15 minutes** ⏱️

Once complete, you'll have a production-ready WatchLog app running on Vercel's global CDN! 🎬✨