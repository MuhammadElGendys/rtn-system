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
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Initialize charts if Live Data tab is opened
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
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month and year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('monthName').textContent = monthNames[month];
    document.getElementById('yearName').textContent = year;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';

    // Add previous month's days (grayed out)
    const startDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
    for (let i = startDay - 1; i >= 0; i--) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell empty';
        dayCell.textContent = daysInPrevMonth - i;
        daysGrid.appendChild(dayCell);
    }

    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;

        // Highlight today's date
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add('today');
        }

        dayCell.addEventListener('click', () => {
            console.log(`Selected: ${monthNames[month]} ${day}, ${year}`);
        });

        daysGrid.appendChild(dayCell);
    }

    // Add next month's days (grayed out)
    const totalCells = daysGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 weeks × 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell empty';
        dayCell.textContent = day;
        daysGrid.appendChild(dayCell);
    }
}

/**
 * Navigate to previous month
 */
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

/**
 * Navigate to next month
 */
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

// ===== DATA FETCHING =====
/**
 * Fetch latest data from backend API
 * Updates all robot and sensor display values
 * Data mapping:
 * - pressure → voltage (sensor)
 * - temperature → Loading robot temperature
 * - speedRPM → Belt velocity / Loading robot velocity
 * - motorRun → Loading robot status
 * - alarmActive → Alarm status (placeholder)
 */
async function loadLatestData() {
    try {
        const response = await fetch(`${API_URL}/api/latest`);

        if (!response.ok) {
            console.error('API error:', response.status);
            return;
        }

        const data = await response.json();

        // Update ROBOT 1: Loading
        // motorRun maps to "Working/Idle" status
        document.getElementById('motor1-status').textContent = data.motorRun ? 'Working' : 'Idle';

        // temperature maps to Loading robot temperature
        document.getElementById('motor1-temp').textContent = data.temperature ?? '--';

        // speedRPM maps to Belt velocity
        document.getElementById('motor1-rpm').textContent = data.speedRPM ?? '--';

        // Update SENSORS section
        // pressure is now renamed to voltage in Node-RED
        document.getElementById('voltage').textContent = (data.pressure || '--') + ' V';

        // TODO: Ampere - skeleton (not yet in backend)
        document.getElementById('ampere').textContent = '-- A';

        // Belt velocity = speedRPM
        document.getElementById('belt-velocity').textContent = (data.speedRPM || '--') + ' RPM';

        // TODO: Carton presence - skeleton (not yet in backend)
        document.getElementById('carton').textContent = '--';

        // TODO: Alarm status - placeholder for TIA-Portal alarms
        document.getElementById('alarmStatus').textContent = data.alarmActive ? 'ACTIVE' : 'NORMAL';

        // Store data for chart updates
        if (data.ts) {
            dataHistory.push({
                timestamp: new Date(data.ts).toLocaleTimeString(),
                temperature: data.temperature || 0,
                speedRPM: data.speedRPM || 0,
                motorRun: data.motorRun || false
            });

            // Keep only last 50 data points
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
 * Send control command to Node-RED via backend
 * Uses Option 3 format: { variable: "name", value: true/false }
 * 
 * @param {string} variable - Variable name (motorRun, belt, sensor_1, etc.)
 * @param {boolean} value - Desired state (true/false)
 */
async function sendControlCommand(variable, value) {
    try {
        const payload = {
            variable: variable,
            value: value
        };

        console.log('Sending control command:', payload);

        const response = await fetch(`${API_URL}/api/control`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Control command failed:', response.status);
            alert('Failed to send control command');
            return;
        }

        const result = await response.json();
        console.log('Control response:', result);

    } catch (err) {
        console.error('Error sending control command:', err);
        alert('Error: ' + err.message);
    }
}

/**
 * Initialize control toggle listeners
 * Attaches click handlers to all control toggles
 */
function initControlToggles() {
    const toggles = document.querySelectorAll('.control-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const variable = toggle.dataset.variable;
            const value = toggle.checked;

            // Only send command for enabled controls
            if (!toggle.disabled) {
                sendControlCommand(variable, value);
            }
        });
    });
}

// ===== CHART INITIALIZATION =====
/**
 * Initialize Chart.js charts for Live Data tab
 * Creates temperature and velocity graphs for monitoring
 */
function initCharts() {
    // Return if charts already initialized
    if (Object.keys(charts).length > 0) {
        updateCharts();
        return;
    }

    const chartConfig = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#3a3a3a' },
                    ticks: { color: '#b0b0b0' }
                },
                x: {
                    grid: { color: '#3a3a3a' },
                    ticks: { color: '#b0b0b0' }
                }
            }
        }
    };

    // Temperature Chart 1 (Loading)
    const tempCtx1 = document.getElementById('tempChart1');
    if (tempCtx1) {
        charts.temp1 = new Chart(tempCtx1, {
            ...chartConfig,
            data: {
                labels: dataHistory.map(d => d.timestamp),
                datasets: [{
                    label: 'Temperature (°C)',
                    data: dataHistory.map(d => d.temperature),
                    borderColor: '#ff6b5b',
                    backgroundColor: 'rgba(255, 107, 91, 0.1)',
                    tension: 0.4
                }]
            }
        });
    }

    // Velocity Chart 1 (Loading)
    const velCtx1 = document.getElementById('velocityChart1');
    if (velCtx1) {
        charts.vel1 = new Chart(velCtx1, {
            ...chartConfig,
            data: {
                labels: dataHistory.map(d => d.timestamp),
                datasets: [{
                    label: 'Velocity (RPM)',
                    data: dataHistory.map(d => d.speedRPM),
                    borderColor: '#ff6b5b',
                    backgroundColor: 'rgba(255, 107, 91, 0.1)',
                    tension: 0.4
                }]
            }
        });
    }

    // Temperature Chart 2 (Unloading Right - Skeleton)
    const tempCtx2 = document.getElementById('tempChart2');
    if (tempCtx2) {
        charts.temp2 = new Chart(tempCtx2, {
            ...chartConfig,
            data: {
                labels: ['--', '--', '--', '--', '--'],
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [0, 0, 0, 0, 0],
                    borderColor: '#ff6b5b',
                    backgroundColor: 'rgba(255, 107, 91, 0.1)',
                    tension: 0.4
                }]
            }
        });
    }
}

/**
 * Update existing charts with new data
 */
function updateCharts() {
    if (charts.temp1) {
        charts.temp1.data.labels = dataHistory.map(d => d.timestamp);
        charts.temp1.data.datasets[0].data = dataHistory.map(d => d.temperature);
        charts.temp1.update();
    }

    if (charts.vel1) {
        charts.vel1.data.labels = dataHistory.map(d => d.timestamp);
        charts.vel1.data.datasets[0].data = dataHistory.map(d => d.speedRPM);
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
    // Initialize tab switching
    initTabs();

    // Initialize calendar
    generateCalendar();
    document.getElementById('prevMonth').addEventListener('click', prevMonth);
    document.getElementById('nextMonth').addEventListener('click', nextMonth);

    // Initialize control toggles
    initControlToggles();

    // Load initial data
    loadLatestData();

    // Poll for new data every 1 second
    setInterval(loadLatestData, 1000);

    console.log('TRN Dashboard initialized successfully');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}