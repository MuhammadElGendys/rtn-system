const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "plc_data.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

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