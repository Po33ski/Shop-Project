# 🚀 Deployment Guide - Render.com

Complete guide to deploy this E-Commerce application on Render.com using Docker.

## 📋 Prerequisites

- GitHub account with this repository
- Render.com account (free tier available)
- Git installed locally

## 🐳 Docker Configuration

This project includes a complete Docker setup:
- **Dockerfile** - Multi-stage build for frontend + backend
- **nginx.conf** - Nginx reverse proxy configuration
- **supervisord.conf** - Process manager for nginx + json-server
- **start.sh** - Startup script

## 🎯 Deployment Steps

### Step 1: Push to GitHub

Make sure your code is on the `deploy` branch and pushed to GitHub:

```bash
git add .
git commit -m "Add Docker configuration for Render deployment"
git push origin deploy
```

### Step 2: Create Web Service on Render

1. **Go to [Render.com](https://render.com)** and sign in
2. Click **New** → **Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**

   - **Name**: `shop-ecommerce` (or any name you prefer)
   - **Region**: Frankfurt (or closest to you)
   - **Branch**: `deploy`
   - **Root Directory**: leave empty (uses root)
   - **Runtime**: `Docker`
   - **Instance Type**: `Free` (or paid for better performance)

5. **Advanced Settings:**
   - **Docker Command**: Leave empty (uses CMD from Dockerfile)
   - **Port**: `10000` (automatically set from EXPOSE in Dockerfile)

6. **Environment Variables**: None required (optional: add for customization)

7. Click **Create Web Service**

### Step 3: Wait for Deployment

Render will:
1. Clone your repository
2. Build the Docker image (this may take 5-10 minutes)
3. Deploy the container
4. Provide you with a URL: `https://shop-ecommerce.onrender.com`

### Step 4: Verify Deployment

Once deployed, visit your URL. You should see:
- Frontend running (React application)
- Backend API working (JSON Server)
- Product photos loading

## 🔍 How It Works

### Architecture

```
┌─────────────────────────────────────┐
│         Render Container            │
│                                     │
│  ┌──────────┐      ┌─────────────┐ │
│  │  Nginx   │◄────►│ JSON Server │ │
│  │  :10000  │      │   :3000     │ │
│  └──────────┘      └─────────────┘ │
│       │                             │
│       ▼                             │
│  Frontend (Static Files)            │
└─────────────────────────────────────┘
```

### Request Flow

1. **Frontend requests** → Nginx serves static files from `/var/www/html`
2. **API requests** (`/api/*`) → Nginx proxies to JSON Server on port 3000
3. **Product photos** (`/product-photos/*`) → Proxied to JSON Server

### Multi-Stage Docker Build

1. **Stage 1** (Build):
   - Uses Node.js 18 Alpine
   - Installs dependencies
   - Builds React frontend with Vite
   - Outputs to `dist` folder

2. **Stage 2** (Production):
   - Uses Node.js 18 Alpine
   - Installs Nginx + Supervisor
   - Copies built frontend to Nginx directory
   - Sets up JSON Server with database
   - Runs both services via Supervisor

## 🔧 Configuration Files

### Dockerfile
- Multi-stage build for optimization
- Frontend build + Backend setup
- Health check included

### nginx.conf
- Listens on port 10000 (Render requirement)
- Serves frontend static files
- Proxies `/api/*` to JSON Server
- Proxies `/product-photos/*` for images
- Gzip compression enabled
- Cache headers for optimization

### supervisord.conf
- Manages both Nginx and JSON Server processes
- Auto-restart on failure
- Logs to stdout/stderr

### start.sh
- Validates configuration before starting
- Checks database file exists
- Starts Supervisor

## 📊 Monitoring

### Health Check

The application includes a health check endpoint:
```
GET /health
```

Render will automatically use this to monitor your service.

### Logs

View logs in Render Dashboard:
- Go to your service
- Click **Logs** tab
- See real-time logs from Nginx and JSON Server

## 🐛 Troubleshooting

### Issue: Build fails

**Check:**
- Dockerfile syntax
- All required files are committed
- Dependencies are correct

**Solution:**
```bash
# Test build locally
docker build -t shop-test .
docker run -p 10000:10000 shop-test
```

### Issue: 404 on API calls

**Check:**
- Nginx proxy configuration
- JSON Server is running
- API endpoints are correct

**Solution:**
- Check logs for JSON Server errors
- Verify `/api/` proxy in nginx.conf

### Issue: Frontend shows blank page

**Check:**
- Frontend build succeeded
- Static files copied to `/var/www/html`
- Nginx is serving files

**Solution:**
- Check browser console for errors
- Verify API_URL is set to `/api`

### Issue: Database resets on restart

**Note:** Free tier Render uses ephemeral storage. Database changes are lost on restart.

**Solutions:**
1. Use Render Disk for persistent storage (paid feature)
2. Use external database (PostgreSQL, MongoDB)
3. Accept reset behavior for demo purposes

## 🎨 Customization

### Change API Endpoint

Edit `front-end/src/constants/api.js`:
```javascript
export const BACK_END_URL = import.meta.env.PROD ? "/api" : "http://localhost:3000";
```

### Add Environment Variables

In Render Dashboard:
1. Go to **Environment** tab
2. Add variables:
   - `NODE_ENV=production`
   - Custom variables as needed

### Modify Port

Edit `Dockerfile` and `nginx.conf` to change from 10000 to your preferred port.

## 💰 Cost

**Free Tier:**
- ✅ Suitable for demos and portfolios
- ⏸️ Spins down after 15 minutes of inactivity
- 🐌 First request after sleep: ~30 seconds
- 💾 Ephemeral storage (data resets)

**Paid Tier ($7/month):**
- ⚡ Always on
- 🚀 Better performance
- 💾 Persistent disk available
- 🔄 No cold starts

## 🔄 Updates and Redeployment

### Auto-Deploy

Enable auto-deploy in Render:
1. Go to **Settings** → **Build & Deploy**
2. Enable **Auto-Deploy** for `deploy` branch
3. Every push to `deploy` triggers automatic deployment

### Manual Deploy

In Render Dashboard:
1. Go to **Manual Deploy**
2. Click **Deploy latest commit**
3. Or select specific commit

### Rollback

1. Go to **Events** tab
2. Find previous successful deploy
3. Click **Rollback**

## ✅ Pre-Deployment Checklist

- [ ] All code committed to `deploy` branch
- [ ] Docker builds successfully locally
- [ ] Frontend API URL uses `/api` in production
- [ ] `.dockerignore` excludes unnecessary files
- [ ] Database file (`db.json`) is included
- [ ] Product photos are in `back-end/public/product-photos/`
- [ ] Pushed to GitHub

## 🌐 Post-Deployment

After successful deployment:

1. **Test the application:**
   - Browse products
   - Add to cart
   - Add to favorites
   - Verify images load

2. **Share your URL:**
   - Add to README
   - Share in portfolio
   - Add to GitHub repository description

3. **Monitor:**
   - Check logs periodically
   - Monitor uptime
   - Watch for errors

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 🎉 Done!

Your E-Commerce application is now live on Render.com!

**Next steps:**
- Share your live URL
- Add custom domain (optional)
- Monitor performance
- Collect feedback

Enjoy your deployed application! 🚀

