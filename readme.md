# Objective
This web application is designed to monitor and control a robotic system through Node-RED.  
Data is exchanged with TIA Portal using the S7 PUT/GET protocol, allowing the PLC to manage and simulate the robot's behavior.

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

7. Code changes
   - You have to check the comments of the app.js code 'cause you should change always the URL to match your backend API endpoint
      - To do so, just open your cmd, write configip, get your PC IP that runs the server/backend, and you're good to go.

---

# How to Run the Web Application

Start the backend server:

```bash
node server.js
```

# Fix:
- Should fix the toggle button for enable/disable the motor
    - most probably, it's a connection issue with backend and node-red