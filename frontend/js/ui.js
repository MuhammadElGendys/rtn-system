/**
 * UI Manager Module
 * Handles tab switching and dynamic DOM updates
 */
class UIManager {
  constructor(chartManager) {
    this.chartManager = chartManager;
  }

  /**
   * Initialize tab switching functionality
   * Handles switching between different pages: Dashboard, Live Data, Control, Alarms, Settings
   * Initializes charts only when Live Data tab is opened (performance optimization)
   */
  initTabs() {
    // Get all tab buttons and their corresponding content sections from DOM
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Attach click event listener to each tab button
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Get the tab name from the button's data-tab attribute
        const tabName = btn.dataset.tab;

        // Remove active class from all buttons and contents to deselect everything
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        // Add active class to clicked button and its corresponding content section
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Special case: only initialize charts when Live Data tab is opened
        // This optimizes performance by not creating charts until they're needed
        if (tabName === 'live-data') {
          this.chartManager.initCharts();
        }
      });
    });
  }

  /**
   * Update all display elements with latest data from API
   * Called every time new data is fetched from backend
   * 
   * Data Mapping (Backend to Frontend):
   * - pressure → voltage (sensor display)
   * - temperature → Loading robot temperature display
   * - speedRPM → Belt velocity / Loading robot velocity display
   * - motorRun → Loading robot status (Working/Idle)
   * - alarmActive → Alarm status display (ACTIVE/NORMAL)
   * 
   * @param {Object} data - Latest data from API
   */
  updateDisplay(data) {
    if (!data) return;

    // Update ROBOT 1: Loading display with received data
    // motorRun boolean is converted to readable status text (Working or Idle)
    const motor1Status = document.getElementById('motor1-status');
    if (motor1Status) {
      motor1Status.textContent = data.motorRun ? 'Working' : 'Idle';
    }

    // temperature value from backend is displayed directly
    // Use ?? operator to show "--" if temperature is null/undefined
    const motor1Temp = document.getElementById('motor1-temp');
    if (motor1Temp) {
      motor1Temp.textContent = data.temperature ?? '--';
    }

    // speedRPM value is displayed as belt velocity
    const motor1RPM = document.getElementById('motor1-rpm');
    if (motor1RPM) {
      motor1RPM.textContent = data.speedRPM ?? '--';
    }

    // Update SENSORS section with received data
    // pressure is renamed to voltage in Node-RED but still comes as 'pressure' field
    const voltage = document.getElementById('voltage');
    if (voltage) {
      voltage.textContent = (data.pressure || '--') + ' V';
    }

    // TODO: Ampere - currently not transmitted from backend/Node-RED
    const ampere = document.getElementById('ampere');
    if (ampere) {
      ampere.textContent = '-- A';
    }

    // Belt velocity = speedRPM (same value as robot velocity)
    const beltVelocity = document.getElementById('belt-velocity');
    if (beltVelocity) {
      beltVelocity.textContent = (data.speedRPM || '--') + ' RPM';
    }

    // TODO: Carton presence - currently not transmitted from backend/Node-RED
    const carton = document.getElementById('carton');
    if (carton) {
      carton.textContent = '--';
    }

    // TODO: Alarm status - placeholder for TIA-Portal alarms integration
    const alarmStatus = document.getElementById('alarmStatus');
    if (alarmStatus) {
      alarmStatus.textContent = data.alarmActive ? 'ACTIVE' : 'NORMAL';
    }
  }

  /**
   * Show a notification or alert to the user
   * Can be extended to show toast notifications, modals, etc.
   * 
   * @param {string} message - Message to display
   * @param {string} type - Type of notification ('success', 'error', 'warning', 'info')
   */
  notify(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // TODO: Implement toast notifications or better UX feedback
  }
}
