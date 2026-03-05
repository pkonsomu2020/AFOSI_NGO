# AFOSI Deployment Guide

## Production URLs

- **Main Website**: https://afosi.org (Vercel)
- **Admin Dashboard**: https://admin.afosi.org (Vercel)
- **Backend API**: https://api.afosi.org (cPanel Server)

## Architecture

```
Frontend (Vercel)          Backend (cPanel)         Database
─────────────────          ────────────────         ────────
afosi.org         ────→    api.afosi.org    ────→   Supabase
admin.afosi.org   ────→         ↑
                               │
                          (Port 5000)
```

## 1. Backend Deployment (cPanel Server)

### Prerequisites
- Node.js installed on cPanel server
- Access to cPanel File Manager or SSH
- Domain: afosi.org

### Steps

1. **Upload Backend Files to cPanel**
   - Upload the entire `backend/` folder to your server
   - Recommended path: `/home/username/backend/` or `/home/username/public_html/api/`

2. **Install Dependencies**
   ```bash
   cd /path/to/backend
   npm install --production
   ```

3. **Configure Environment Variables**
   - Ensure `backend/.env` has production settings:
   ```env
   SUPABASE_URL=https://pmigmljjnyucethipdtk.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://afosi.org
   ADMIN_URL=https://admin.afosi.org
   JWT_SECRET=your-strong-jwt-secret
   ```

4. **Setup Subdomain in cPanel**
   - Go to cPanel → Domains → Subdomains
   - Create subdomain: `api.afosi.org`
   - Point to backend directory

5. **Configure Node.js Application in cPanel**
   - Go to cPanel → Software → Setup Node.js App
   - Create application:
     - Node.js version: 18.x or higher
     - Application mode: Production
     - Application root: `/home/username/backend`
     - Application URL: `api.afosi.org`
     - Application startup file: `server.js`
   - Click "Create"

6. **Start the Application**
   ```bash
   npm start
   ```
   Or use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name afosi-backend
   pm2 save
   pm2 startup
   ```

7. **Configure .htaccess (if needed)**
   Create `.htaccess` in the api subdomain root:
   ```apache
   RewriteEngine On
   RewriteRule ^$ http://127.0.0.1:5000/ [P,L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://127.0.0.1:5000/$1 [P,L]
   ```

8. **Test Backend API**
   ```bash
   curl https://api.afosi.org/api/health
   ```
   Should return: `{"success": true, "message": "AFOSI Backend API is running"}`

## 2. Frontend Deployment (Vercel)

### Main Website (afosi.org)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Configure for production deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: `./` (root)
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Add Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://api.afosi.org/api
     ```

4. **Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add domain: `afosi.org`
   - Add domain: `www.afosi.org`
   - Follow DNS configuration instructions

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Admin Dashboard (admin.afosi.org)

1. **Deploy to Vercel**
   - Click "Add New Project"
   - Import the same repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: `ADMIN`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

2. **Add Environment Variables**
   ```
   VITE_API_URL=https://api.afosi.org/api
   ```

3. **Configure Custom Domain**
   - Add domain: `admin.afosi.org`
   - Follow DNS configuration instructions

## 3. DNS Configuration

Configure these DNS records in your domain registrar:

```
Type    Name    Value                           TTL
────────────────────────────────────────────────────
A       @       [Your cPanel Server IP]         3600
A       www     [Your cPanel Server IP]         3600
CNAME   api     [Your cPanel Server]            3600
CNAME   admin   cname.vercel-dns.com            3600
```

Or if using Vercel for main site:
```
Type    Name    Value                           TTL
────────────────────────────────────────────────────
A       @       76.76.21.21 (Vercel)            3600
CNAME   www     cname.vercel-dns.com            3600
CNAME   api     [Your cPanel Server]            3600
CNAME   admin   cname.vercel-dns.com            3600
```

## 4. SSL Certificates

### For Backend (cPanel)
- Go to cPanel → Security → SSL/TLS
- Use AutoSSL or Let's Encrypt
- Enable SSL for `api.afosi.org`

### For Frontend (Vercel)
- Vercel automatically provisions SSL certificates
- No action needed

## 5. Post-Deployment Checklist

- [ ] Backend API is accessible at https://api.afosi.org/api/health
- [ ] Main website loads at https://afosi.org
- [ ] Admin dashboard loads at https://admin.afosi.org
- [ ] Admin can login successfully
- [ ] CORS is working (no console errors)
- [ ] Images load correctly
- [ ] API calls work from frontend
- [ ] File uploads work in admin panel
- [ ] Database connections are stable
- [ ] SSL certificates are active
- [ ] Environment variables are set correctly

## 6. Monitoring & Maintenance

### Backend Monitoring
```bash
# Check if backend is running
pm2 status

# View logs
pm2 logs afosi-backend

# Restart backend
pm2 restart afosi-backend
```

### Update Deployment
```bash
# Backend
cd /path/to/backend
git pull origin main
npm install
pm2 restart afosi-backend

# Frontend (Vercel auto-deploys on git push)
git push origin main
```

## 7. Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` and `ADMIN_URL` in backend/.env
- Check backend/server.js allowedOrigins array

### API Connection Failed
- Test backend: `curl https://api.afosi.org/api/health`
- Check backend logs: `pm2 logs`
- Verify firewall allows port 5000

### Build Failures on Vercel
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure all dependencies are in package.json

### Database Connection Issues
- Verify Supabase credentials in backend/.env
- Check Supabase dashboard for connection limits
- Test connection: backend will log on startup

## 8. Environment Variables Summary

### Root .env (Main Website)
```env
VITE_API_URL=https://api.afosi.org/api
```

### ADMIN/.env (Admin Dashboard)
```env
VITE_API_URL=https://api.afosi.org/api
```

### backend/.env (Backend API)
```env
SUPABASE_URL=https://pmigmljjnyucethipdtk.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://afosi.org
ADMIN_URL=https://admin.afosi.org
JWT_SECRET=your-strong-secret
```

## Support

For issues, check:
- Vercel deployment logs
- Backend server logs (pm2 logs)
- Browser console for frontend errors
- Supabase dashboard for database issues
