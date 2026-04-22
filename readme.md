# Objective

This web application is designed to monitor and control a robotic system through Node-RED.  
Data is exchanged with TIA Portal using the S7 PUT/GET protocol, allowing the PLC to manage and simulate the robot's behavior.

---

# Project Structure

```
frontend/
├── index.html                    # Main HTML page with dashboard layout
├── css/
│   └── style.css                # Centralized styling with CSS variables & responsive design
├── js/
│   ├── app.js                   # Main app orchestrator & initialization
│   ├── api.js                   # API client for backend communication
│   ├── liveData.js              # Chart management & historical data
│   ├── calendar.js              # Weekly calendar & date selection
│   ├── controls.js              # Control panel & toggle management
│   └── ui.js                    # Tab switching & display updates
├── img/
│   └── logo.svg                 # TRN logo and branding assets
└── app.js.old                   # Backup of original monolithic app.js

backend/
├── server.js                    # Node.js/Express server
├── package.json                 # Node.js dependencies
└── database/
    └── db.js                    # SQLite database configuration

nodered/
└── flows.json                   # Node-RED flow for PLC communication
```

**Frontend Architecture:**

- **Modular Design**: Each functional domain has its own module (API, Charts, Calendar, Controls, UI)
- **Clean Separation**: Logic, data, and presentation are clearly separated
- **Scalable**: Easy to add new features or modify existing ones
- **Reusable**: All modules can be extended or reused in other projects

---

# System Startup Sequence

1. Start S7-PLCSIM Advanced V7.0
   - Create a virtual PLC instance
   - Select **"TCP/IP Single Adapter"** to enable external communication

2. Launch TIA Portal V20
   - Open the project
   - Download and start the PLC program

3. Start Node-RED
   - Open Command Prompt
   - Run:
     ```bash
     node-red
     ```

4. Access Node-RED
   - Open a browser
   - Navigate to:
     ```
     http://<your-ip>:1880
     ```

5. Import and Deploy the Flow
   - Import the provided JSON flow
   - Install required nodes/packages if missing
   - Click **Deploy**

6. Configure Network Settings (if needed)
   - Skip this step if everything runs on the same PC
   - Otherwise, update all IP addresses (Node-RED, frontend, API endpoints) to match the host machine

7. Code Changes & Configuration
   - **API URL Configuration**: Update the API URL in `frontend/js/app.js` (line ~7) to match your backend server IP and port
     - The default is `http://192.168.178.187:3000` but should be changed to your backend IP
     - To find your PC IP: Open cmd and run `ipconfig`, then use the IPv4 address
     - Example: `const apiUrl = "http://YOUR_PC_IP:3000";`

   **Before Running:**
   - Ensure backend server is running on the correct port (default: 3000)
   - Ensure Node-RED is running and flows are deployed
   - Open the browser and navigate to `http://localhost/frontend/` (or your server IP)

---

# How to Run the Web Application

Start the backend server:

```bash
node server.js
```

# Fix:

- Should fix the toggle button for enable/disable the motor
  - most probably, it's a connection issue with backend and node-red
