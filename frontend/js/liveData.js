/**
 * Live Data Module
 * Manages real-time charts and historical data visualization
 */
class ChartManager {
  constructor() {
    this.dataHistory = [];
    this.charts = {};
    this.maxDataPoints = 50; // Keep last 50 data points to avoid memory bloat
  }

  /**
   * Add new data point to history
   * Maintains sliding window of most recent data
   * 
   * @param {Object} data - Data object from API
   * @param {number} data.temperature - Temperature value
   * @param {number} data.speedRPM - Speed/velocity in RPM
   * @param {boolean} data.motorRun - Motor status
   * @param {string} data.ts - ISO timestamp
   */
  addDataPoint(data) {
    if (!data.ts) return; // Skip if no timestamp

    this.dataHistory.push({
      timestamp: new Date(data.ts).toLocaleTimeString(),
      temperature: data.temperature || 0,
      speedRPM: data.speedRPM || 0,
      motorRun: data.motorRun || false
    });

    // Maintain sliding window
    if (this.dataHistory.length > this.maxDataPoints) {
      this.dataHistory.shift();
    }
  }

  /**
   * Initialize Chart.js line charts for Live Data visualization
   * Creates three charts: Temperature (Loading), Velocity (Loading), Temperature (Unloading R)
   * Only initializes if charts don't already exist
   */
  initCharts() {
    // Return early if charts already exist (avoid re-initialization on tab re-opens)
    if (Object.keys(this.charts).length > 0) {
      this.updateCharts();
      return;
    }

    // Define shared Chart.js configuration for all charts
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

    // Create Temperature Chart for Robot 1 (Loading)
    const tempCtx1 = document.getElementById('tempChart1');
    if (tempCtx1) {
      this.charts.temp1 = new Chart(tempCtx1, {
        ...chartConfig,
        data: {
          labels: this.dataHistory.map(d => d.timestamp),
          datasets: [{
            label: 'Temperature (°C)',
            data: this.dataHistory.map(d => d.temperature),
            borderColor: '#ff6b5b',
            backgroundColor: 'rgba(255, 107, 91, 0.1)',
            tension: 0.4
          }]
        }
      });
    }

    // Create Velocity Chart for Robot 1 (Loading)
    const velCtx1 = document.getElementById('velocityChart1');
    if (velCtx1) {
      this.charts.vel1 = new Chart(velCtx1, {
        ...chartConfig,
        data: {
          labels: this.dataHistory.map(d => d.timestamp),
          datasets: [{
            label: 'Velocity (RPM)',
            data: this.dataHistory.map(d => d.speedRPM),
            borderColor: '#ff6b5b',
            backgroundColor: 'rgba(255, 107, 91, 0.1)',
            tension: 0.4
          }]
        }
      });
    }

    // Create Temperature Chart for Robot 2 (Unloading Right - Placeholder)
    const tempCtx2 = document.getElementById('tempChart2');
    if (tempCtx2) {
      this.charts.temp2 = new Chart(tempCtx2, {
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
   * Called when new data is fetched from API
   * Refreshes chart without recreating instances
   */
  updateCharts() {
    // Update Temperature Chart 1 if it exists
    if (this.charts.temp1) {
      this.charts.temp1.data.labels = this.dataHistory.map(d => d.timestamp);
      this.charts.temp1.data.datasets[0].data = this.dataHistory.map(d => d.temperature);
      this.charts.temp1.update();
    }

    // Update Velocity Chart 1 if it exists
    if (this.charts.vel1) {
      this.charts.vel1.data.labels = this.dataHistory.map(d => d.timestamp);
      this.charts.vel1.data.datasets[0].data = this.dataHistory.map(d => d.speedRPM);
      this.charts.vel1.update();
    }
  }

  /**
   * Get current data history
   * Useful for exporting or analyzing historical data
   * 
   * @returns {Array} Array of data points
   */
  getHistory() {
    return this.dataHistory;
  }

  /**
   * Clear all historical data and reset charts
   */
  clearHistory() {
    this.dataHistory = [];
    if (Object.keys(this.charts).length > 0) {
      this.updateCharts();
    }
  }
}
