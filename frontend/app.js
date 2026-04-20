// ===== API CONFIGURATION =====
// Change this URL to match your backend server IP and port
const API_URL = "http://192.168.178.187:3000";

// ===== GLOBAL STATE =====
let currentDate = new Date(2025, 0, 1); // January 2025 from screenshots
let dataHistory = []; // Store historical data for charts
let charts = {}; // Store chart instances

// ===== TAB MANAGEMENT =====
/**
 * Initialize tab switching functionality
 * Handles switching between different pages: Dashboard, Live Data, Control, Alarms, Settings
 */
function initTabs() {
    // Get all tab buttons and their corresponding content sections from DOM
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Attach click event listener to each tab button
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Get the tab name from the button's data-tab attribute (e.g., "dashboard", "live-data")
            const tabName = btn.dataset.tab;

            // Remove active class from all buttons and contents to deselect everything
            // This ensures only one tab is active at a time
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Add active class to clicked button and its corresponding content section
            // This shows the selected tab and highlights the button
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Special case: only initialize charts when Live Data tab is opened
            // This optimizes performance by not creating charts until they're needed
            if (tabName === 'live-data') {
                initCharts();
            }
        });
    });
}

// ===== CALENDAR MANAGEMENT =====
/**
 * Generate calendar for current month
 * Displays days in grid format, supporting month navigation
 */
/**
 * Generate calendar for current week (7 days: Monday-Sunday)
 * Displays compact week view with navigation to previous/next weeks
 */
function generateCalendar() {
    // Find the Monday of the current week
    // currentDate is the reference date, calculate which day of week it is
    const dayOfWeek = currentDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    // Calculate days to subtract from currentDate to get to Monday (0 for Mon, 1 for Tue, etc.)
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday start (0 if Monday, 6 if Sunday)

    // Create a new date for Monday of this week
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - daysToMonday);

    // Update the calendar header to display month and year of the week
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Use the month/year from the Monday of the week (could span two months)
    document.getElementById('monthName').textContent = monthNames[weekStart.getMonth()];
    document.getElementById('yearName').textContent = weekStart.getFullYear();

    // Clear the calendar grid and prepare to add 7 days for the week
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';

    // Get today's date for highlighting
    const today = new Date();

    // Generate exactly 7 cells for each day of the week (Monday through Sunday)
    for (let i = 0; i < 7; i++) {
        // Create a date for each day in the week starting from Monday
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + i);

        // Extract day number for display
        const dayNumber = dayDate.getDate();

        // Create day cell element for the calendar
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = dayNumber;

        // Highlight today's date with the 'today' class (red background in CSS)
        // Compares day, month, and year to determine if this is today
        if (dayNumber === today.getDate() &&
            dayDate.getMonth() === today.getMonth() &&
            dayDate.getFullYear() === today.getFullYear()) {
            dayCell.classList.add('today');
        }

        // Add click listener to log selected date (can be extended for date selection)
        dayCell.addEventListener('click', () => {
            console.log(`Selected: ${monthNames[dayDate.getMonth()]} ${dayNumber}, ${dayDate.getFullYear()}`);
        });

        // Append day cell to the calendar grid
        daysGrid.appendChild(dayCell);
    }
}

/**
 * Navigate to previous week
 * Moves the calendar back by 7 days and regenerates the week display
 */
function prevMonth() {
    // Move back one week (7 days)
    // This changes the reference date for the week calculation in generateCalendar()
    currentDate.setDate(currentDate.getDate() - 7);
    // Regenerate calendar grid with the new week
    generateCalendar();
}

/**
 * Navigate to next week
 * Moves the calendar forward by 7 days and regenerates the week display
 */
function nextMonth() {
    // Move forward one week (7 days)
    // This changes the reference date for the week calculation in generateCalendar()
    currentDate.setDate(currentDate.getDate() + 7);
    // Regenerate calendar grid with the new week
    generateCalendar();
}

// ===== DATA FETCHING =====
/**
 * Fetch latest data from backend API and update all UI elements
 * Called automatically every 1 second via setInterval in init()
 * Updates: Robot status displays, Sensor values, Chart data, Alarm status
 * 
 * Data Mapping (Backend to Frontend):
 * - pressure → voltage (sensor display)
 * - temperature → Loading robot temperature display
 * - speedRPM → Belt velocity / Loading robot velocity display
 * - motorRun → Loading robot status (Working/Idle)
 * - alarmActive → Alarm status display (ACTIVE/NORMAL)
 * 
 * Skeleton/TODO Fields (not yet in backend):
 * - motorRun_2, temperature_2, speedRPM_2 (Robot 2: Unloading Right)
 * - motorRun_3, temperature_3, speedRPM_3 (Robot 3: Unloading Left)
 * - Ampere sensor value
 * - Carton presence sensor value
 */
async function loadLatestData() {
    try {
        // Fetch latest data from backend endpoint
        // This endpoint returns the most recent PLC data received from Node-RED
        const response = await fetch(`${API_URL}/api/latest`);

        // Check if HTTP request was successful (status 200-299)
        if (!response.ok) {
            console.error('API error:', response.status);
            return;  // Exit early if fetch failed
        }

        // Parse JSON response into JavaScript object

        // Update ROBOT 1: Loading display with received data
        // motorRun boolean is converted to readable status text (Working or Idle)
        document.getElementById('motor1-status').textContent = data.motorRun ? 'Working' : 'Idle';

        // temperature value from backend is displayed directly
        // Use ?? operator to show "--" if temperature is null/undefined
        document.getElementById('motor1-temp').textContent = data.temperature ?? '--';

        // speedRPM value is displayed as belt velocity
        document.getElementById('motor1-rpm').textContent = data.speedRPM ?? '--';

        // Update SENSORS section with received data
        // pressure is renamed to voltage in Node-RED but still comes as 'pressure' field
        // Append " V" unit suffix to display format
        document.getElementById('voltage').textContent = (data.pressure || '--') + ' V';

        // TODO: Ampere - currently not transmitted from backend/Node-RED
        // Placeholder showing "-- A" until implemented
        document.getElementById('ampere').textContent = '-- A';

        // Belt velocity = speedRPM (same value as robot velocity)
        // Append " RPM" unit suffix to display format
        document.getElementById('belt-velocity').textContent = (data.speedRPM || '--') + ' RPM';

        // TODO: Carton presence - currently not transmitted from backend/Node-RED
        // Placeholder showing "--" until sensor is integrated
        document.getElementById('carton').textContent = '--';

        // TODO: Alarm status - placeholder for TIA-Portal alarms integration
        // Currently just shows ACTIVE/NORMAL based on alarmActive flag
        // Will be expanded to show specific alarm codes/messages in future
        document.getElementById('alarmStatus').textContent = data.alarmActive ? 'ACTIVE' : 'NORMAL';

        // Store incoming data point in history array for chart rendering
        // Only add to history if timestamp exists (indicates valid data)
        if (data.ts) {
            dataHistory.push({
                // Convert ISO timestamp to human-readable time format (HH:MM:SS)
                timestamp: new Date(data.ts).toLocaleTimeString(),
                // Store temperature value, use 0 as fallback if undefined
                temperature: data.temperature || 0,
                // Store speed/RPM value, use 0 as fallback if undefined
                speedRPM: data.speedRPM || 0,
                // Store motor status, use false as fallback if undefined
                motorRun: data.motorRun || false
            });

            // Maintain a sliding window of last 50 data points to avoid memory bloat
            // Remove oldest data point (index 0) when history exceeds 50 items
            if (dataHistory.length > 50) {
                dataHistory.shift();
            }
        }

    } catch (err) {
        console.error('Error loading latest data:', err);
    }
}

// ===== CONTROL FUNCTIONS =====
/**
 * Send control command to Node-RED via backend API
 * Uses generic control format (Option 3): { variable: name, value: boolean }
 * Flow: Frontend → Backend → Node-RED → S7 PLC output nodes
 * 
 * @param {string} variable - PLC variable name to control (motorRun, belt, sensor_1, etc.)
 * @param {boolean} value - Desired state (true=ON, false=OFF)
 */
async function sendControlCommand(variable, value) {
    try {
        // Build the control payload in Option 3 format
        const payload = {
            variable: variable,  // Target variable name in Node-RED
            value: value         // Target state (boolean)
        };

        // Log command for debugging purposes
        console.log('Sending control command:', payload);

        // Send POST request to backend /api/control endpoint
        // Backend will forward this to Node-RED for PLC communication
        const response = await fetch(`${API_URL}/api/control`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // Tell server we're sending JSON
            },
            body: JSON.stringify(payload)  // Convert JavaScript object to JSON string
        });

        // Check if HTTP request was successful (status 200-299)
        if (!response.ok) {
            console.error('Control command failed:', response.status);
            alert('Failed to send control command');
            return;  // Exit early on error
        }

        // Parse response from backend as JSON
        const result = await response.json();
        console.log('Control response:', result);

    } catch (err) {
        // Catch network errors or JSON parsing errors
        console.error('Error sending control command:', err);
        alert('Error: ' + err.message);
    }
}

/**
 * Initialize event listeners for all control toggles
 * Attaches 'change' event handlers to send commands when user toggles controls
 * Only sends command if the toggle is enabled (not disabled="true")
 */
function initControlToggles() {
    // Get all elements with class 'control-toggle' (checkboxes with control data)
    const toggles = document.querySelectorAll('.control-toggle');

    // Attach change listener to each toggle control
    toggles.forEach(toggle => {
        // Listen for 'change' event (fired when checkbox is checked/unchecked)
        toggle.addEventListener('change', () => {
            // Get the variable name from data-variable attribute
            // Example: data-variable="motorRun" → variable = "motorRun"
            const variable = toggle.dataset.variable;
            // Get current checkbox state (true if checked, false if unchecked)
            const value = toggle.checked;

            // Only send control command if the toggle is not disabled
            // Disabled toggles show skeleton features not yet implemented
            if (!toggle.disabled) {
                // Send the control command to backend
                sendControlCommand(variable, value);
            }
        });
    });
}

// ===== CHART INITIALIZATION =====
/**
 * Initialize Chart.js line charts for Live Data visualization
 * Creates three charts: Temperature (Loading), Velocity (Loading), Temperature (Unloading R)
 * Displays real-time sensor data with historical trends
 * 
 * Check if charts already exist to avoid re-initialization on tab re-opens
 */
function initCharts() {
    // Return early and update existing charts if they were already created
    // Prevents creating duplicate chart objects when Live Data tab is revisited
    if (Object.keys(charts).length > 0) {
        updateCharts();
        return;
    }

    // Define shared Chart.js configuration for all charts
    // This configuration is applied to all line charts for consistency
    const chartConfig = {
        type: 'line',
        options: {
            // Make charts responsive and scale with container size
            responsive: true,
            // Preserve aspect ratio when resizing (better for mobile devices)
            maintainAspectRatio: true,
            plugins: {
                // Display legend showing dataset labels
                legend: {
                    display: true,
                    // Set legend text color to white for dark theme
                    labels: { color: '#ffffff' }
                }
            },
            // Configure Y-axis (data values)
            scales: {
                y: {
                    // Start Y-axis from 0 instead of auto-scaling
                    beginAtZero: true,
                    // Dark grid lines for theme consistency
                    grid: { color: '#3a3a3a' },
                    // Light gray axis labels
                    ticks: { color: '#b0b0b0' }
                },
                // Configure X-axis (timestamps)
                x: {
                    grid: { color: '#3a3a3a' },
                    ticks: { color: '#b0b0b0' }
                }
            }
        }
    };

    // Create Temperature Chart for Robot 1 (Loading)
    const tempCtx1 = document.getElementById('tempChart1');
    if (tempCtx1) {
        // Spread the shared chartConfig and override data-specific properties
        charts.temp1 = new Chart(tempCtx1, {
            ...chartConfig,
            data: {
                // X-axis labels: extract and display timestamps from historical data
                labels: dataHistory.map(d => d.timestamp),
                // Dataset definition for the temperature line
                datasets: [{
                    label: 'Temperature (°C)',
                    // Extract temperature values from each data point
                    data: dataHistory.map(d => d.temperature),
                    // Coral/red accent line color matching the theme
                    borderColor: '#ff6b5b',
                    // Light semi-transparent coral fill under the line
                    backgroundColor: 'rgba(255, 107, 91, 0.1)',
                    // Smooth curve tension for better visualization
                    tension: 0.4
                }]
            }
        });
    }

    // Create Velocity Chart for Robot 1 (Loading)
    const velCtx1 = document.getElementById('velocityChart1');
    if (velCtx1) {
        // Create Chart.js instance for velocity data
        charts.vel1 = new Chart(velCtx1, {
            ...chartConfig,
            data: {
                // X-axis labels: extract and display timestamps from historical data
                labels: dataHistory.map(d => d.timestamp),
                // Dataset definition for the velocity line
                datasets: [{
                    label: 'Velocity (RPM)',
                    // Extract RPM values from each data point
                    data: dataHistory.map(d => d.speedRPM),
                    // Coral/red accent line color matching the theme
                    borderColor: '#ff6b5b',
                    // Light semi-transparent coral fill under the line
                    backgroundColor: 'rgba(255, 107, 91, 0.1)',
                    // Smooth curve tension for better visualization
                    tension: 0.4
                }]
            }
        });
    }

    // Create Temperature Chart for Robot 2 (Unloading Right - Skeleton/Placeholder)
    // This chart will display placeholder data until motorRun_2, temperature_2, speedRPM_2 are added to backend
    const tempCtx2 = document.getElementById('tempChart2');
    if (tempCtx2) {
        // Create Chart.js instance with placeholder/empty data
        charts.temp2 = new Chart(tempCtx2, {
            ...chartConfig,
            data: {
                // X-axis labels: show dashes as placeholder
                labels: ['--', '--', '--', '--', '--'],
                // Dataset definition with placeholder values
                datasets: [{
                    label: 'Temperature (°C)',
                    // Placeholder data: all zeros
                    data: [0, 0, 0, 0, 0],
                    // Coral/red accent line color matching the theme
                    borderColor: '#ff6b5b',
                    // Light semi-transparent coral fill under the line
                    backgroundColor: 'rgba(255, 107, 91, 0.1)',
                    // Smooth curve tension for better visualization
                    tension: 0.4
                }]
            }
        });
    }
}

/**
 * Update existing charts with new data
 * Called when data polling fetches new values
 * Refreshes chart labels (timestamps) and dataset values without recreating charts
 */
function updateCharts() {
    // Update Temperature Chart 1 if it exists
    if (charts.temp1) {
        // Update X-axis labels with new timestamps
        charts.temp1.data.labels = dataHistory.map(d => d.timestamp);
        // Update the first dataset with new temperature values
        charts.temp1.data.datasets[0].data = dataHistory.map(d => d.temperature);
        // Trigger chart re-render with new data
        charts.temp1.update();
    }

    // Update Velocity Chart 1 if it exists
    if (charts.vel1) {
        // Update X-axis labels with new timestamps
        charts.vel1.data.labels = dataHistory.map(d => d.timestamp);
        // Update the first dataset with new RPM values
        charts.vel1.data.datasets[0].data = dataHistory.map(d => d.speedRPM);
        // Trigger chart re-render with new data
        charts.vel1.update();
    }
}

// ===== INITIALIZATION =====
/**
 * Main initialization function
 * Called when DOM is fully loaded
 * Sets up all event listeners and starts data polling
 */
function init() {
    // Set up tab switching functionality between Dashboard, Live Data, Control, etc.
    initTabs();

    // Generate and display the calendar grid
    generateCalendar();
    // Attach event listeners to calendar navigation buttons
    document.getElementById('prevMonth').addEventListener('click', prevMonth);
    document.getElementById('nextMonth').addEventListener('click', nextMonth);

    // Set up event listeners for all control toggles (Robot Arm, Belt, Sensors)
    initControlToggles();

    // Fetch initial data from backend immediately
    loadLatestData();

    // Set up data polling: fetch new data every 1000ms (1 second) for real-time updates
    setInterval(loadLatestData, 1000);

    // Log successful initialization
    console.log('TRN Dashboard initialized successfully');
}

// Run initialization when DOM is ready
// Check if page is still loading or already loaded, then run init accordingly
if (document.readyState === 'loading') {
    // Page is still loading: wait for DOMContentLoaded event before initializing
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Page already loaded: initialize immediately
    init();
}