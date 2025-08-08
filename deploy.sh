#!/bin/bash

# WatchLog Deployment Helper Script
# This script helps prepare your WatchLog app for deployment

echo "🎬 WatchLog Deployment Helper"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from your WatchLog project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial WatchLog setup"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "=============================="

# Check for required files
echo "Checking project files..."

if [ -f "supabase/schema.sql" ]; then
    echo "✅ Database schema ready (supabase/schema.sql)"
else
    echo "❌ Missing database schema"
fi

if [ -f ".env.local.example" ]; then
    echo "✅ Environment example ready (.env.local.example)"
else
    echo "❌ Missing environment example file"
fi

if [ -f "README.md" ]; then
    echo "✅ Documentation ready (README.md)"
else
    echo "❌ Missing README.md"
fi

echo ""
echo "🚀 Next Steps:"
echo "==============="
echo "1. Push to GitHub:"
echo "   - Create new repository on GitHub"
echo "   - git remote add origin https://github.com/YOURUSERNAME/watchlog.git"
echo "   - git branch -M main"
echo "   - git push -u origin main"
echo ""
echo "2. Set up Supabase:"
echo "   - Visit https://supabase.com"
echo "   - Create new project"
echo "   - Run SQL from supabase/schema.sql"
echo "   - Get Project URL and anon key"
echo ""
echo "3. Get TMDb API Key:"
echo "   - Visit https://themoviedb.org"
echo "   - Create account → Settings → API"
echo "   - Request API key"
echo ""
echo "4. Deploy to Vercel:"
echo "   - Visit https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Add environment variables"
echo "   - Deploy!"
echo ""
echo "📖 For detailed instructions, see QUICK_DEPLOY.md"
echo ""

# Generate a random secret for NEXTAUTH_SECRET
if command -v openssl &> /dev/null; then
    SECRET=$(openssl rand -base64 32)
    echo "🔐 Generated NEXTAUTH_SECRET for you:"
    echo "   $SECRET"
    echo ""
    echo "   Copy this for your Vercel environment variables!"
else
    echo "🔐 Generate NEXTAUTH_SECRET at: https://generate-secret.vercel.app/32"
fi

echo ""
echo "🎉 Your WatchLog app is ready for deployment!"
echo "   Follow the steps above or check QUICK_DEPLOY.md for details."