# Network Setup Guide

This guide explains how to configure Wallflower for network access, allowing mobile devices on the same WiFi network to connect to your development server.

## Why Network Setup?

By default, development servers bind to `localhost` (127.0.0.1), which is only accessible from the same machine. For the art installation to work, you need:

1. **Display screen** - Can run on the same machine or on the network
2. **Mobile devices** - Need to scan QR code and connect over WiFi

## Quick Setup

### 1. Find Your Local IP Address

**On macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
```

Look for your local network IP (usually starts with `192.168.x.x` or `10.0.x.x`).

Example: `192.168.1.83`

### 2. Update Backend Configuration

The backend is now configured to listen on all network interfaces (`0.0.0.0`).

Edit `packages/backend/.env`:

```bash
# Server listens on all interfaces
HOST=0.0.0.0

# CORS - Allow your network IP
CORS_ORIGIN="http://localhost:5173,http://localhost:5174,http://192.168.1.83:5173,http://192.168.1.83:5174"
```

### 3. Update Display Configuration

Edit `packages/display/.env`:

```bash
# Use your local IP instead of localhost
VITE_BACKEND_URL=ws://192.168.1.83:3001
VITE_MOBILE_URL=http://192.168.1.83:5174
```

### 4. Update Mobile Configuration

Edit `packages/mobile/.env`:

```bash
# Use your local IP instead of localhost
VITE_BACKEND_URL=ws://192.168.1.83:3001
```

### 5. Start Servers with Host Flag

The frontend servers now include `--host` flag to expose on network:

```bash
# Already configured in package.json
pnpm display:dev  # Accessible at http://192.168.1.83:5173
pnpm mobile:dev   # Accessible at http://192.168.1.83:5174
pnpm backend:dev  # Accessible at http://192.168.1.83:3001
```

## Testing Network Access

### From Your Computer

1. Backend health check:
   ```bash
   curl http://192.168.1.83:3001/health
   ```

2. Display in browser:
   ```
   http://192.168.1.83:5173
   ```

3. Mobile in browser:
   ```
   http://192.168.1.83:5174
   ```

### From Mobile Device

1. **Connect to same WiFi** as your development machine

2. **Open mobile browser** and navigate to:
   ```
   http://192.168.1.83:5174
   ```

3. **Or scan QR code** displayed on the screen (if display is running)

## Troubleshooting

### Mobile Can't Connect

**Check WiFi:**
- Mobile device must be on the same network
- Some public/guest networks block device-to-device communication

**Check Firewall:**
```bash
# macOS - Allow incoming connections
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp node

# Linux - Allow ports
sudo ufw allow 3001
sudo ufw allow 5173
sudo ufw allow 5174

# Windows - Add firewall rules via Windows Defender
```

**Verify Server is Listening:**
```bash
# Check what's listening on your ports
netstat -an | grep LISTEN | grep -E '3001|5173|5174'

# Or using lsof
lsof -iTCP -sTCP:LISTEN -P | grep -E '3001|5173|5174'
```

### CORS Errors

If you see CORS errors in browser console:

1. Check `CORS_ORIGIN` in `packages/backend/.env` includes your IP
2. Make sure there are no extra spaces in the CORS_ORIGIN list
3. Restart backend server after changing .env

### WebSocket Connection Failed

**Error:** "WebSocket connection to 'ws://192.168.1.83:3001' failed"

**Solutions:**
1. Verify backend is running: `curl http://192.168.1.83:3001/health`
2. Check backend console for connection logs
3. Verify CORS includes your frontend URLs
4. Try disabling firewall temporarily to test

### Wrong IP Address

If your IP address changes (common with DHCP):

1. Get new IP: `ifconfig | grep "inet "`
2. Update all three `.env` files
3. Restart all servers

## Static IP (Recommended)

For reliable art installation setup, configure a static IP:

### macOS
1. System Settings → Network → WiFi → Details
2. Click "TCP/IP" tab
3. Configure IPv4: "Manually"
4. Set static IP (e.g., 192.168.1.100)

### Linux
Edit `/etc/network/interfaces` or use NetworkManager.

### Windows
Control Panel → Network → Adapter Settings → Properties → IPv4

## Production Considerations

For a real art show installation:

1. **Use a router with static IPs** or DHCP reservations
2. **Create a dedicated WiFi network** for the installation
3. **Set up a local DNS** name (e.g., `garden.local`) using mDNS/Bonjour
4. **Test thoroughly** before the event with multiple devices

## Using mDNS (Advanced)

Instead of IP addresses, use `.local` names:

```bash
# Install Avahi (Linux) or Bonjour (built-in on macOS)

# Access with:
# http://your-computer-name.local:5173
```

Update `.env` files:
```bash
VITE_BACKEND_URL=ws://macbook.local:3001
VITE_MOBILE_URL=http://macbook.local:5174
```

## Environment Variables Reference

### Backend (`packages/backend/.env`)
```bash
HOST=0.0.0.0                    # Listen on all interfaces
PORT=3001                       # Backend port
CORS_ORIGIN="..."              # Comma-separated allowed origins
```

### Display (`packages/display/.env`)
```bash
VITE_BACKEND_URL=ws://IP:3001   # Backend WebSocket URL
VITE_MOBILE_URL=http://IP:5174  # Mobile URL for QR code
```

### Mobile (`packages/mobile/.env`)
```bash
VITE_BACKEND_URL=ws://IP:3001   # Backend WebSocket URL
```

## Verification Checklist

- [ ] Backend shows network IP in startup message
- [ ] Display accessible from network IP in browser
- [ ] Mobile accessible from phone on same WiFi
- [ ] QR code on display points to correct mobile URL
- [ ] Mobile can plant flowers successfully
- [ ] Flowers appear on display in real-time
- [ ] No CORS errors in browser console
- [ ] WebSocket shows "Connected" on display

## Getting Help

If you're still having issues:

1. Check browser console for errors (F12)
2. Check backend console for connection logs
3. Verify all three services are running
4. Test with `curl` commands from another device
5. Temporarily disable firewall to isolate the issue

---

**Pro Tip:** For art show installations, arrive early to test network setup with actual WiFi. Venue networks can have unexpected restrictions!
