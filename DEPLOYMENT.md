# Deployment Guide for WatchLog

This guide covers various deployment options for WatchLog, from simple cloud deployment to self-hosting.

## 🚀 Quick Deploy Options

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/watchlog)

### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/watchlog)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/watchlog)

## 📋 Prerequisites

Before deploying WatchLog, you'll need:

1. **Supabase Project**
   - Free tier: Up to 500MB database, 50,000 monthly active users
   - Sign up at [supabase.com](https://supabase.com)

2. **TMDb API Key**
   - Free with no usage limits for personal use
   - Sign up at [themoviedb.org](https://www.themoviedb.org/)

## 🌐 Cloud Deployment

### Vercel Deployment (Recommended)

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/watchlog.git
   cd watchlog
   ```

2. **Push to Your GitHub**
   ```bash
   git remote set-url origin https://github.com/YOURUSERNAME/watchlog.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and import your repository
   - Add environment variables (see Environment Variables section)
   - Deploy!

4. **Domain Setup (Optional)**
   - Add custom domain in Vercel dashboard
   - Update `NEXTAUTH_URL` environment variable

### Railway Deployment

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repository

2. **Environment Variables**
   - Add all required environment variables in Railway dashboard

3. **Custom Domain**
   - Generate Railway domain or add custom domain
   - Update `NEXTAUTH_URL` accordingly

### Netlify Deployment

1. **Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Environment Variables**
   - Add in Netlify dashboard under Site settings → Environment variables

## 🐳 Docker Deployment

### Using Docker Hub

```bash
# Pull the official image
docker pull watchlog/watchlog:latest

# Run with environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  -e NEXT_PUBLIC_TMDB_API_KEY=your-key \
  watchlog/watchlog:latest
```

### Building from Source

```bash
# Clone repository
git clone https://github.com/yourusername/watchlog.git
cd watchlog

# Build Docker image
docker build -t watchlog .

# Run container
docker run -p 3000:3000 --env-file .env.local watchlog
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  watchlog:
    image: watchlog/watchlog:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_TMDB_API_KEY=${NEXT_PUBLIC_TMDB_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: unless-stopped
```

## 🏠 Self-Hosting Options

### VPS/Dedicated Server

1. **Server Requirements**
   - 1GB RAM minimum (2GB recommended)
   - 10GB storage minimum
   - Node.js 18+
   - PM2 for process management

2. **Installation**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   
   # Clone and setup WatchLog
   git clone https://github.com/yourusername/watchlog.git
   cd watchlog
   npm install
   npm run build
   ```

3. **PM2 Configuration**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'watchlog',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   ```

4. **Start Application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/watchlog
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## ⚙️ Environment Variables

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# TMDb API
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key

# Authentication
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=https://your-domain.com
```

### Optional Variables

```env
# TMDb Read Access Token (preferred over API key)
TMDB_API_READ_ACCESS_TOKEN=your-read-access-token

# Supabase Service Role (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Analytics (if using)
NEXT_PUBLIC_GOOGLE_ANALYTICS=GA_MEASUREMENT_ID

# Error Tracking (if using)
SENTRY_DSN=your-sentry-dsn
```

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**
   - Never commit secrets to git
   - Use strong, unique secrets
   - Rotate keys regularly

2. **Database Security**
   - Enable Row Level Security (RLS) in Supabase
   - Use service role key only for admin operations
   - Regular backups

3. **Application Security**
   - Keep dependencies updated
   - Use HTTPS in production
   - Set up proper CORS policies

### Security Headers

```javascript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## 📊 Monitoring and Maintenance

### Health Checks

```bash
# Simple health check endpoint
curl https://your-domain.com/api/health

# Response should be:
# {"status": "ok", "timestamp": "2024-01-01T00:00:00.000Z"}
```

### Log Management

```bash
# View PM2 logs
pm2 logs watchlog

# Rotate logs
pm2 install pm2-logrotate
```

### Database Maintenance

```sql
-- Monitor database size
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Vacuum and analyze
VACUUM ANALYZE;
```

## 🔄 Updates and Migrations

### Updating WatchLog

```bash
# Backup database first!
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build updated application
npm run build

# Restart with PM2
pm2 restart watchlog
```

### Database Migrations

1. Always backup before migrations
2. Test migrations in development first
3. Use Supabase migration system when possible

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Database Connection Issues**
   - Check Supabase project status
   - Verify environment variables
   - Check network connectivity

3. **TMDb API Issues**
   - Verify API key validity
   - Check rate limits
   - Ensure correct base URLs

### Performance Optimization

1. **Enable Caching**
   ```javascript
   // next.config.ts
   const nextConfig = {
     images: {
       loader: 'custom',
       loaderFile: './lib/tmdb-image-loader.js',
     },
     experimental: {
       optimizeCss: true,
     }
   };
   ```

2. **Database Optimization**
   - Add proper indexes
   - Use connection pooling
   - Regular maintenance

## 🌍 Multi-Region Deployment

For global applications:

1. **CDN Setup**
   - Use Vercel Edge Network
   - Or Cloudflare for custom domains

2. **Database Replication**
   - Supabase read replicas
   - Consider region-based routing

3. **Image Optimization**
   - Use Vercel Image Optimization
   - Or implement custom image CDN

---

## 📞 Getting Help

If you encounter issues during deployment:

- 📖 Check the [documentation](https://watchlog-docs.vercel.app)
- 🐛 [Report deployment issues](https://github.com/yourusername/watchlog/issues)
- 💬 [Community discussions](https://github.com/yourusername/watchlog/discussions)
- 📧 Email: support@watchlog.app

Happy deploying! 🚀