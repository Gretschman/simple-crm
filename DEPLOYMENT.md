# Deployment Guide

## Option 1: Vercel (Recommended - Free)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist`

5. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add `VITE_SUPABASE_URL` = `https://gkysjsylgqjrwglpvjzg.supabase.co`
   - Add `VITE_SUPABASE_ANON_KEY` = `your-anon-key`

6. **Redeploy** after setting env vars:
   ```bash
   vercel --prod
   ```

Your app will be live at: `https://your-app.vercel.app`

---

## Option 2: Netlify (Free)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add your Supabase credentials

---

## Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install -g gh-pages
   ```

2. **Add to package.json**:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.ts** - add base:
   ```typescript
   export default defineConfig({
     base: '/simple-crm/',
     // ... rest of config
   })
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

Your app will be at: `https://yourusername.github.io/simple-crm/`

---

## Option 4: Self-Host on Your Server

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Copy the `dist` folder** to your web server (Apache, Nginx, etc.)

3. **Configure your web server** to serve the index.html for all routes

**Example Nginx config**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Environment Variables

Remember to set these environment variables in your hosting platform:

- `VITE_SUPABASE_URL` = `https://gkysjsylgqjrwglpvjzg.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = (your anon key)

---

## Local Network Access (Development)

To access from devices on your local network:

```bash
npm run dev -- --host
```

Then access from any device on the same WiFi:
- `http://YOUR_LOCAL_IP:5173/`

Find your local IP:
- **Linux/Mac**: `hostname -I` or `ifconfig`
- **Windows**: `ipconfig`
