# How to Access Your CRM from Mobile/Other Devices

Since you're running on WSL2, there are a few ways to access the app from your phone or other devices.

---

## Option 1: Use Cloudflare Tunnel (Easiest & Secure)

This creates a secure public URL instantly.

### Steps:

1. **Install cloudflared** (one-time setup):
   ```bash
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. **Start the tunnel**:
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```

3. **You'll get a URL** like: `https://random-name.trycloudflare.com`

4. **Open that URL on your phone** - it works from anywhere!

**Note**: The URL changes each time you restart. For a permanent URL, sign up at cloudflare.com.

---

## Option 2: Windows Port Forwarding (Permanent Solution)

This makes the app accessible on your local network.

### Steps:

1. **Find your Windows PC's WiFi IP address**:
   - Open **Command Prompt** on Windows (not WSL)
   - Run: `ipconfig`
   - Look for "Wireless LAN adapter Wi-Fi"
   - Note the **IPv4 Address** (e.g., `192.168.1.100`)

2. **Set up port forwarding** (run in Windows PowerShell as Administrator):
   ```powershell
   netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=172.18.210.45
   ```

3. **Allow through Windows Firewall**:
   ```powershell
   New-NetFirewallRule -DisplayName "WSL2 CRM" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
   ```

4. **Access from phone**:
   - Use your Windows IP: `http://192.168.1.100:5173`
   - (Replace `192.168.1.100` with your actual Windows IP)

### To Remove Port Forwarding Later:
```powershell
netsh interface portproxy delete v4tov4 listenport=5173 listenaddress=0.0.0.0
```

---

## Option 3: Use ngrok (Popular Alternative)

1. **Sign up** at https://ngrok.com (free account)

2. **Install ngrok**:
   ```bash
   curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
   echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
   sudo apt update && sudo apt install ngrok
   ```

3. **Add your authtoken** (from ngrok dashboard):
   ```bash
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

4. **Start tunnel**:
   ```bash
   ngrok http 5173
   ```

5. **You'll get a URL** like: `https://abc123.ngrok.io`

---

## Option 4: Deploy to Cloud (Best for Production)

Deploy to Vercel/Netlify for permanent, always-on access from anywhere.

See `DEPLOYMENT.md` for full instructions.

Quick Vercel deployment:
```bash
npm install -g vercel
vercel login
vercel
```

---

## Recommended Approach

- **Quick test**: Use Cloudflare Tunnel or ngrok
- **Local network**: Set up Windows port forwarding
- **Production**: Deploy to Vercel

---

## Troubleshooting

### Can't access from phone?
- Make sure phone is on **same WiFi** (if using port forwarding)
- Check Windows Firewall isn't blocking the port
- Verify dev server is still running: `npm run dev:network`

### Tunnel not working?
- Make sure dev server is running on port 5173
- Try restarting the tunnel

### Still having issues?
- Deploy to Vercel for guaranteed access from anywhere
- Or use your Windows PC's browser at `http://localhost:5173`
