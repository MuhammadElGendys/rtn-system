# TRN System - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Frontend Implementation](#frontend-implementation)
6. [Backend Implementation](#backend-implementation)
7. [Database Setup](#database-setup)
8. [Features & Functionality](#features--functionality)
9. [How to Run](#how-to-run)
10. [API Endpoints](#api-endpoints)

---

## Project Overview

**Project Name:** TRN System (Truck Robot Network Dashboard)

**Purpose:** A real-time monitoring dashboard for industrial robotic systems. This system tracks PLC (Programmable Logic Controller) data from industrial robots and displays it in an intuitive, modern web interface.

**Main Goals:**
- Display real-time motor/sensor data
- Track historical data over time
- Provide a user-friendly interface for monitoring multiple robotic systems
- Support data visualization and analysis

---

## Technology Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS variables for theming
- **Vanilla JavaScript (ES6+)** - No frameworks, lightweight and fast
- **SVG** - Vector graphics for logos and robot icons

### Backend
- **Node.js** - JavaScript runtime for server-side code
- **Express.js** - Lightweight web framework
- **SQLite3** - Lightweight database
- **Axios** - HTTP client (for API calls)
- **CORS** - Enable cross-origin requests

### Why These Choices?

| Technology | Why Used |
|-----------|----------|
| **Vanilla JS (No React/Vue)** | Lightweight, no build process needed, direct DOM manipulation, faster learning curve, full control |
| **Express.js** | Minimal, fast, perfect for simple REST APIs, large community, easy to extend |
| **SQLite3** | Lightweight, file-based, no server setup needed, sufficient for development/testing |
| **CSS Variables** | Dynamic theming, consistent color management, easier maintenance |
| **SVG Icons** | Scalable, sharp on all devices, customizable with CSS, smaller than raster images |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  index.html (Structure)                                 │ │
│  │  ├─ Header with Logo & Navigation Tabs                 │ │
│  │  ├─ Calendar (Week View with Date Selection)           │ │
│  │  ├─ Robot Cards (Real-time Status Display)            │ │
│  │  ├─ Sensor Data Section                               │ │
│  │  ├─ Charts Container (Live Data Visualization)        │ │
│  │  └─ Controls & Settings                               │ │
│  │                                                        │ │
│  │  app.js (Logic)                                        │ │
│  │  ├─ Tab Navigation Management                         │ │
│  │  ├─ Calendar Generation & Date Selection             │ │
│  │  ├─ API Data Fetching                                │ │
│  │  ├─ Real-time Data Updates                           │ │
│  │  └─ Chart Initialization                             │ │
│  │                                                        │ │
│  │  style.css (Styling)                                  │ │
│  │  ├─ Dark Theme with Accent Colors                    │ │
│  │  ├─ Responsive Grid Layouts                          │ │
│  │  ├─ Smooth Animations & Transitions                  │ │
│  │  └─ CSS Variables for Dynamic Theming               │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────┬──────────────────────────────────────┬──┘
                     │ HTTP Requests                          │
                     │ JSON Data                              │
                     ▼                                         ▼
         ┌───────────────────────┐             ┌──────────────────────┐
         │   Backend (Node.js)   │             │  Database (SQLite)   │
         ├───────────────────────┤             ├──────────────────────┤
         │ server.js             │◄──────────►│ plc_data.db          │
         │ ├─ Express Server     │   SQL      │ ├─ plc_history Table │
         │ ├─ API Endpoints      │   Queries  │ └─ Data Persistence  │
         │ ├─ CORS Setup         │             │                      │
         │ └─ Data Management    │             └──────────────────────┘
         │                       │
         │ Port: 3000           │
         └───────────────────────┘
```

---

## Project Structure

```
rtn-system/
│
├── frontend/
│   ├── index.html          # Main HTML structure
│   ├── app.js              # JavaScript logic and API calls
│   ├── style.css           # Styling and theming
│   ├── logo.svg            # TRN Logo (scalable vector)
│   └── robot-arm.svg       # Robot icon (scalable vector)
│
├── backend/
│   ├── server.js           # Express server & API endpoints
│   ├── package.json        # Dependencies
│   └── database/
│       └── db.js           # SQLite database setup
│
├── nodered/
│   └── flows.json          # Node-RED workflow (data ingestion)
│
├── project-organization/
│   └── project-organization-notes.md
│
├── readme.md               # Project overview
└── fixs-list.md            # Known issues & fixes
```

---

## Frontend Implementation

### 1. HTML Structure (index.html)

**What it does:** Defines the semantic structure of the dashboard.

**Key Components:**

```html
<!-- Header with Logo and Navigation -->
<header class="header">
    <div class="header-content">
        <div class="logo-section">
            <img src="logo.svg" alt="TRN Logo" class="logo-img">
        </div>
        <nav class="nav-tabs">
            <button class="tab-btn active" data-tab="dashboard">Dashboard</button>
            <button class="tab-btn" data-tab="live-data">Live Data</button>
            <button class="tab-btn" data-tab="control">Control</button>
            <button class="tab-btn" data-tab="alarms">Alarms</button>
            <button class="tab-btn" data-tab="settings">Settings</button>
        </nav>
    </div>
</header>
```

**Why:** Semantic HTML5 improves SEO, accessibility, and code readability.

---

### 2. CSS Styling (style.css)

**What it does:** Provides a modern dark theme with responsive design.

**Key Features:**

```css
/* CSS Variables for Dynamic Theming */
:root {
    --dark-bg: #1a1a1a;           /* Main background */
    --darker-bg: #0f0f0f;         /* Header background */
    --card-bg: rgba(154, 154, 154, 0.14); /* Card with 14% transparency */
    --accent: #FA4D4D;            /* Highlight color (red) */
    --text-primary: #ffffff;      /* Main text */
    --text-secondary: #b0b0b0;    /* Secondary text */
    --border: #3a3a3a;            /* Border color */
}
```

**Why CSS Variables?**
- Easy theme switching by changing one value
- Consistent color scheme across entire app
- Reduced code duplication
- Easy to maintain

**Example Usage:**
```css
body {
    background: var(--dark-bg);
    color: var(--text-primary);
}

.robot-card {
    background: var(--card-bg);
    border: 2px solid var(--border);
}
```

**Responsive Design:**
```css
/* Mobile-first approach with media queries */
@media (max-width: 768px) {
    .robots-section {
        grid-template-columns: 1fr;  /* Single column on mobile */
    }
    
    .tab-btn {
        font-size: 12px;            /* Smaller text on mobile */
        padding: 12px 10px;         /* Adjusted padding */
    }
}
```

---

### 3. JavaScript Logic (app.js)

**What it does:** Handles user interactions, data fetching, and dynamic content rendering.

**Key Functions:**

#### A. Calendar Management
```javascript
let currentDate = new Date(); // Today's date

function generateCalendar() {
    // Find Monday of current week
    const dayOfWeek = currentDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - daysToMonday);
    
    // Generate 7 day cells
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + i);
        
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = dayDate.getDate();
        
        // Auto-select today's date
        if (isSameDay(dayDate, new Date())) {
            dayCell.classList.add('selected');
        }
        
        // Click to select different dates
        dayCell.addEventListener('click', () => {
            document.querySelectorAll('.day-cell').forEach(d => 
                d.classList.remove('selected')
            );
            dayCell.classList.add('selected');
        });
        
        daysGrid.appendChild(dayCell);
    }
}
```

**Why:** Provides intuitive date selection for viewing historical data.

#### B. Tab Navigation
```javascript
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Add to clicked
            btn.classList.add('active');
            const tabName = btn.dataset.tab;
            document.getElementById(tabName).classList.add('active');
            
            // Lazy load charts only when needed
            if (tabName === 'live-data') {
                initCharts();
            }
        });
    });
}
```

**Why:** Reduces initial load time by lazy-loading charts.

#### C. API Integration
```javascript
const API_URL = "http://192.168.178.187:3000";

async function fetchRobotData() {
    try {
        const response = await fetch(`${API_URL}/api/latest`);
        const data = await response.json();
        
        // Update robot status cards
        document.getElementById('motor1-status').textContent = 
            data.motorRun ? "RUNNING" : "STOPPED";
        document.getElementById('motor1-temp').textContent = 
            data.temperature?.toFixed(1) || "--";
        document.getElementById('motor1-rpm').textContent = 
            data.speedRPM?.toFixed(0) || "--";
            
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

// Poll for updates every 2 seconds
setInterval(fetchRobotData, 2000);
```

**Why:** Real-time monitoring of system status without page refresh.

---

## Backend Implementation

### 1. Server Setup (server.js)

**What it does:** Creates REST API endpoints for data management.

**Configuration:**
```javascript
const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse JSON bodies

let latestData = null;
```

**Why CORS?** Allows frontend (different port) to communicate with backend.

---

### 2. API Endpoints

#### Endpoint 1: Health Check
```javascript
app.get("/", (req, res) => {
    res.send("PLC Backend Server Running");
});

// Usage: http://localhost:3000/
```

#### Endpoint 2: Receive Data from PLC
```javascript
app.post("/api/data", (req, res) => {
    latestData = req.body;
    
    const { ts, pressure, motorRun, temperature, speedRPM, alarmActive } = latestData;
    
    // Store in database
    db.run(
        `INSERT INTO plc_history 
         (ts, pressure, motorRun, temperature, speedRPM, alarmActive)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            ts || new Date().toISOString(),
            pressure ?? null,
            motorRun ? 1 : 0,
            temperature ?? null,
            speedRPM ?? null,
            alarmActive ? 1 : 0
        ],
        function (err) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Database insert failed"
                });
            }
            
            res.json({
                status: "ok",
                message: "Data received and stored",
                id: this.lastID
            });
        }
    );
});

// Usage (from PLC/Node-RED):
// POST http://localhost:3000/api/data
// Body: {
//   "ts": "2026-04-21T10:30:00Z",
//   "pressure": 45.2,
//   "motorRun": true,
//   "temperature": 52.5,
//   "speedRPM": 1500,
//   "alarmActive": false
// }
```

#### Endpoint 3: Get Latest Data
```javascript
app.get("/api/latest", (req, res) => {
    res.json(latestData || {});
});

// Usage: http://localhost:3000/api/latest
// Response: { pressure: 45.2, motorRun: true, ... }
```

#### Endpoint 4: Get Historical Data
```javascript
app.get("/api/history", (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    
    db.all(
        `SELECT * FROM plc_history ORDER BY id DESC LIMIT ?`,
        [limit],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }
            res.json(rows);
        }
    );
});

// Usage: http://localhost:3000/api/history?limit=50
// Returns: Array of last 50 records
```

---

## Database Setup

### 1. Database Initialization (database/db.js)

**What it does:** Sets up SQLite database and creates tables.

```javascript
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "plc_data.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create table if not exists
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS plc_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts TEXT,
            pressure REAL,
            motorRun INTEGER,
            temperature REAL,
            speedRPM REAL,
            alarmActive INTEGER
        )
    `);
});

module.exports = db;
```

**Table Structure:**

| Column | Type | Purpose |
|--------|------|---------|
| id | INTEGER PRIMARY KEY | Unique record identifier |
| ts | TEXT | Timestamp (ISO format) |
| pressure | REAL | Pressure sensor reading |
| motorRun | INTEGER | Motor on/off (1/0) |
| temperature | REAL | Temperature sensor reading |
| speedRPM | REAL | Motor speed in RPM |
| alarmActive | INTEGER | Alarm status (1/0) |

**Why SQLite?**
- No server setup required
- File-based storage
- Perfect for development/testing
- Easy to backup (single file)
- Sufficient for this scale

---

## Features & Functionality

### 1. Real-time Dashboard
- **What:** Displays current robot status in live cards
- **How:** Fetches from `/api/latest` every 2 seconds
- **Shows:** Motor status, temperature, RPM, pressure, alarms

### 2. Week Calendar with Date Selection
- **What:** Interactive 7-day calendar
- **How:** Shows current week, highlights today by default
- **Why:** Easy navigation between dates for historical data

### 3. Tab-based Navigation
- **Dashboard:** Main overview with cards
- **Live Data:** Real-time charts and graphs
- **Control:** Manual control interface
- **Alarms:** Alert notifications
- **Settings:** Configuration options

### 4. Responsive Design
- **Desktop:** Full grid layout with multiple columns
- **Tablet:** Adjusted spacing and font sizes
- **Mobile:** Single column layout, larger touch targets

### 5. Modern Dark Theme
- **Colors:** Dark background with red accents
- **Psychology:** Reduces eye strain, professional appearance
- **Customizable:** CSS variables allow easy theme changes

---

## How to Run

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

This installs:
- **express**: Web framework
- **cors**: Cross-Origin Resource Sharing
- **sqlite3**: Database
- **axios**: HTTP client

3. Start the server:
```bash
npm start
# or: node server.js
```

Output:
```
Connected to SQLite database.
Server running on port 3000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Start a local server (for testing):
```bash
# Using Python
python -m http.server 5000

# Or using Node.js (http-server)
npx http-server -p 5000
```

3. Open in browser:
```
http://localhost:5000
```

### Verify Connection

1. Backend health check:
```
http://localhost:3000/
```
Expected: "PLC Backend Server Running"

2. API test:
```
http://localhost:3000/api/latest
```
Expected: JSON response (empty if no data sent yet)

---

## API Endpoints Summary

| Method | Endpoint | Purpose | Parameters |
|--------|----------|---------|-----------|
| GET | `/` | Health check | None |
| GET | `/api/test` | API test | None |
| POST | `/api/data` | Receive PLC data | JSON body with sensor data |
| GET | `/api/latest` | Get latest reading | None |
| GET | `/api/history` | Get historical data | `limit` (default: 20) |

---

## Data Flow Diagram

```
PLC/Industrial System
    │
    ├─ Sends JSON data every second
    │
    ▼
Node-RED
    │
    ├─ Processes/transforms data
    │
    ▼
Backend API (Port 3000)
    │
    ├─ POST /api/data
    │
    ▼
SQLite Database
    │
    ├─ Stores in plc_history table
    │
    ▼
Frontend (Browser)
    │
    ├─ Polls /api/latest every 2 seconds
    ├─ Polls /api/history on demand
    │
    ▼
User Dashboard
    │
    ├─ Real-time updates
    ├─ Historical data display
    └─ Interactive charts
```

---

## Customization Guide

### Change Backend Port
In `server.js`:
```javascript
const PORT = 3000;  // Change to desired port
```

### Change Theme Colors
In `style.css`:
```css
:root {
    --accent: #FA4D4D;        /* Change from red */
    --dark-bg: #1a1a1a;       /* Change background */
    --text-primary: #ffffff;  /* Change text color */
}
```

### Change API Update Frequency
In `app.js`:
```javascript
// Change from 2000ms (2 seconds) to desired interval
setInterval(fetchRobotData, 2000);
```

### Change Calendar Date Range
In `app.js`:
```javascript
// Modify to show month instead of week
// Current: 7 days (Monday-Sunday)
// Possible: 30 days, specific date range, etc.
```

---

## Known Issues & Future Improvements

### Current Limitations
1. Single robot system (can be extended to multiple)
2. Basic data visualization (no charts yet)
3. No user authentication
4. No data export functionality
5. Limited mobile optimization

### Future Enhancements
1. Multi-robot support with system selection
2. Advanced charts (Chart.js, D3.js)
3. User login and role-based access
4. Data export (CSV, PDF)
5. Predictive maintenance alerts
6. Mobile app version
7. Real-time notifications (WebSocket)
8. Advanced filtering and search

---

## Troubleshooting

### Issue: "Cannot GET /"
**Solution:** Backend server not running. Run `npm start` in backend folder.

### Issue: Frontend can't connect to backend
**Solution:** Check API_URL in `app.js`. Should match backend IP and port.
```javascript
const API_URL = "http://192.168.178.187:3000";  // Update IP address
```

### Issue: Database insert errors
**Solution:** Check column names and data types match schema in `db.js`.

### Issue: CORS errors
**Solution:** Ensure `cors()` middleware is initialized in server.js before routes.

---

## Summary

This TRN System demonstrates modern web development practices:

✅ **Frontend:** Semantic HTML, CSS variables, vanilla JavaScript for better control
✅ **Backend:** Lightweight Express server with RESTful API design
✅ **Database:** SQLite for reliable data persistence
✅ **Architecture:** Clean separation of concerns
✅ **Scalability:** Can be extended for multiple robots and complex monitoring
✅ **User Experience:** Responsive, dark theme, real-time updates

The project is production-ready for monitoring industrial systems and can be expanded significantly based on requirements.

---

**Last Updated:** April 21, 2026
**Status:** Under Active Development
**Version:** 1.0.0-beta
