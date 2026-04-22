/**
 * API Client Module
 * Handles all backend API communication
 */
class ApiClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  /**
   * Fetch latest data from backend API
   * Returns the most recent PLC data received from Node-RED
   * 
   * Data includes:
   * - motorRun: Robot 1 status (boolean)
   * - temperature: Robot 1 temperature (°C)
   * - speedRPM: Robot 1 speed/velocity
   * - pressure: Voltage sensor reading
   * - alarmActive: Alarm status (boolean)
   * - ts: Timestamp (ISO format)
   * 
   * @returns {Promise<Object>} Latest data object or null on error
   */
  async fetchLatest() {
    try {
      const response = await fetch(`${this.apiUrl}/api/latest`);

      if (!response.ok) {
        console.error('API error:', response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching latest data:', err);
      return null;
    }
  }

  /**
   * Send control command to backend
   * Forwards control request to Node-RED for PLC output
   * 
   * Format: { variable: name, value: boolean }
   * Examples:
   * - { variable: "motorRun", value: true }
   * - { variable: "belt", value: false }
   * 
   * @param {string} variable - PLC variable name
   * @param {boolean} value - Desired state
   * @returns {Promise<Object>} Response object or null on error
   */
  async sendControl(variable, value) {
    try {
      const payload = {
        variable: variable,
        value: value
      };

      console.log('Sending control command:', payload);

      const response = await fetch(`${this.apiUrl}/api/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Control command failed:', response.status);
        alert('Failed to send control command');
        return null;
      }

      const result = await response.json();
      console.log('Control response:', result);
      return result;
    } catch (err) {
      console.error('Error sending control command:', err);
      alert('Error: ' + err.message);
      return null;
    }
  }
}
