# Objective
This website is designed to monitor and control the machine through Node-RED, which interfaces with the PLC to manage the robot’s functionality.

# Running sequence
1. Start S7-PLCSIM Advanced V7.0
    - Create a virtual PLC.
    - Select “TCP/IP Single Adapter” to enable external communication.
2. Launch TIA Portal V20
    - Open your project and start the PLC program.
3. Start Node-RED
    - Open Command Prompt.
    - Run the command: node-red.
4. Access the Node-RED interface
    - Open your browser.
    - Enter the IP address shown in the Command Prompt to access the Node-RED dashboard.
5. Import and deploy the flow
    - Import the provided JSON flow file.
    - Install any required libraries or add-ons.
    - Deploy the flow.
6. Configure IP settings
    - Update the IP address in HTTP request nodes to match the PC hosting the website (primarily server-side, and frontend if needed).


# How to run the site

### N.B.
This website was developed using simulation software and has not been implemented in a real-world application. It has not undergone sufficient testing for use in an industrial plant.
