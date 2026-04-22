/**
 * Control Panel Module
 * Manages user interaction with control toggles and sends commands
 */
class ControlPanel {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Initialize event listeners for all control toggles
   * Attaches 'change' event handlers to send commands when user toggles controls
   * Only sends command if the toggle is enabled (not disabled="true")
   */
  initToggles() {
    // Get all elements with class 'control-toggle' (checkboxes with control data)
    const toggles = document.querySelectorAll('.control-toggle');

    // Attach change listener to each toggle control
    toggles.forEach(toggle => {
      // Listen for 'change' event (fired when checkbox is checked/unchecked)
      toggle.addEventListener('change', () => {
        // Get the variable name from data-variable attribute
        const variable = toggle.dataset.variable;
        // Get current checkbox state (true if checked, false if unchecked)
        const value = toggle.checked;

        // Only send control command if the toggle is not disabled
        // Disabled toggles show skeleton features not yet implemented
        if (!toggle.disabled) {
          this.handleToggle(variable, value);
        }
      });
    });
  }

  /**
   * Handle toggle change and send command to backend
   * 
   * @param {string} variable - PLC variable name to control
   * @param {boolean} value - Desired state (true=ON, false=OFF)
   */
  async handleToggle(variable, value) {
    console.log(`Toggle changed: ${variable} = ${value}`);
    await this.apiClient.sendControl(variable, value);
  }

  /**
   * Manually send a control command
   * Useful for buttons or other UI interactions beyond toggles
   * 
   * @param {string} variable - PLC variable name
   * @param {boolean} value - Desired state
   */
  async sendCommand(variable, value) {
    return await this.apiClient.sendControl(variable, value);
  }

  /**
   * Enable a control toggle
   * Used to unlock features that were previously disabled
   * 
   * @param {string} dataVariable - The data-variable attribute value
   */
  enableControl(dataVariable) {
    const control = document.querySelector(`[data-variable="${dataVariable}"]`);
    if (control) {
      control.disabled = false;
    }
  }

  /**
   * Disable a control toggle
   * Used to lock/disable certain controls
   * 
   * @param {string} dataVariable - The data-variable attribute value
   */
  disableControl(dataVariable) {
    const control = document.querySelector(`[data-variable="${dataVariable}"]`);
    if (control) {
      control.disabled = true;
    }
  }
}
