# Network Configuration Guide

## Overview

This document explains how to configure IP addresses for your TRN System across different machines.

---

## Finding Your Machine IP Address

### Windows

1. Open **Command Prompt** (Win + R, type `cmd`, press Enter)
2. Type: `ipconfig`
3. Look for **IPv4 Address** under your network adapter
   - Example: `192.168.1.100`

### Mac/Linux

1. Open **Terminal**
2. Type: `ifconfig`
3. Look for **inet** address (not inet6)
   - Example: `192.168.1.100`

### Quick Test

To verify the IP works, open a browser and visit:

```
http://<YOUR_IP>:PORT
```

(Replace with actual IP and port number)

---

## Configuration Locations

### Frontend Configuration

**File:** `frontend/js/config.js`

```javascript
const CONFIG = {
  BACKEND_URL: "http://192.168.178.187:3000",
  // Update IP to match your backend machine
};
```

**What to change:**

- Replace `192.168.178.187` with your backend machine's IP
- Keep port `3000` (unless you changed it in server.js)
- Format: `http://<BACKEND_IP>:3000`

---

### Backend Configuration

**File:** `backend/server.js` (around line 143)

```javascript
const NODE_RED_URL = "http://192.168.178.187:1880/api/control";
// Update IP to match your Node-RED machine
```

**What to change:**

- Replace `192.168.178.187` with your Node-RED machine's IP
- Keep port `1880` (Node-RED default)
- Format: `http://<NODERED_IP>:1880/api/control`

---

## Common Scenarios

### Scenario 1: Everything on Same PC

- **Frontend URL in browser:** `http://localhost/frontend/` or `http://127.0.0.1/frontend/`
- **Backend URL (config.js):** `http://localhost:3000` or `http://127.0.0.1:3000`
- **Node-RED URL (server.js):** `http://localhost:1880/api/control` or `http://127.0.0.1:1880/api/control`

### Scenario 2: Backend on Different PC

- **Frontend URL in browser:** `http://FRONTEND_IP/frontend/`
- **Backend URL (config.js):** `http://BACKEND_IP:3000`
- **Node-RED URL (server.js):** `http://NODERED_IP:1880/api/control`

### Scenario 3: Multiple Robots on Different PCs

- Each robot's backend has its own IP
- Frontend connects to each backend's IP independently
- Update config.js for each robot

---

## Troubleshooting

### "Failed to connect to backend"

1. Check if backend server is running: `node server.js`
2. Verify the IP in `config.js` is correct
3. Ensure firewall allows connections on port 3000
4. Check browser console for detailed error messages

### "Control command failed"

1. Verify Node-RED is running
2. Check IP in `server.js` matches your Node-RED machine
3. Ensure Node-RED has the proper flows deployed
4. Check firewall allows port 1880

### "Cannot reach server from another PC"

1. Use actual IP address (not `localhost`)
2. Ensure both PCs are on same network
3. Disable firewall temporarily to test connectivity
4. Check if you need to add URL to firewall exceptions

---

## Testing Connectivity

### Test Backend Connection

Open browser console (F12) and run:

```javascript
fetch("http://YOUR_BACKEND_IP:3000/api/test")
  .then((r) => r.json())
  .then((d) => console.log("Connected!", d))
  .catch((e) => console.error("Failed:", e));
```

Expected output: `{status: "ok", message: "API working"}`

### Test Node-RED Connection

From backend machine, run:

```bash
curl http://YOUR_NODERED_IP:1880
```

Should return Node-RED welcome page HTML (or connection response)

---

## Summary Checklist

- [ ] Found your backend machine IP: ******\_\_\_******
- [ ] Found your Node-RED machine IP: ******\_\_\_******
- [ ] Updated `frontend/js/config.js` with backend IP
- [ ] Updated `backend/server.js` with Node-RED IP
- [ ] Backend server is running (`node server.js`)
- [ ] Node-RED is running and flows are deployed
- [ ] Tested connection from browser console

Once all checks pass, your system should be ready to use!
