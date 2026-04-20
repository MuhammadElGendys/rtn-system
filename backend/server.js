// added after changing code by bash npm install axios
const axios = require("axios");

const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let latestData = null;

app.get("/", (req, res) => {
    res.send("PLC Backend Server Running");
});

app.get("/api/test", (req, res) => {
    res.json({
        status: "ok",
        message: "API working"
    });
});

app.post("/api/data", (req, res) => {
    latestData = req.body;

    const {
        ts,
        pressure,
        motorRun,
        temperature,
        speedRPM,
        alarmActive
    } = latestData;

    db.run(
        `
        INSERT INTO plc_history
        (ts, pressure, motorRun, temperature, speedRPM, alarmActive)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
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
                console.error("Insert error:", err.message);
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

app.get("/api/latest", (req, res) => {
    res.json(latestData || {});
});

app.get("/api/history", (req, res) => {
    const limit = parseInt(req.query.limit) || 20;

    db.all(
        `
        SELECT * FROM plc_history
        ORDER BY id DESC
        LIMIT ?
        `,
        [limit],
        (err, rows) => {
            if (err) {
                console.error("Read error:", err.message);
                return res.status(500).json({
                    status: "error",
                    message: "Database read failed"
                });
            }

            res.json(rows);
        }
    );
});

// Control endpoint to send commands to Node-RED
// Receives control commands from frontend with format: { variable: "motorRun", value: true }
// Forwards to Node-RED for S7 PLC communication
app.post("/api/control", async (req, res) => {
    try {
        // Change this URL to match your Node-RED server address and port
        // Format: http://NODE_RED_HOST:NODE_RED_PORT/api/control
        const response = await axios.post(
            "http://192.168.178.187:1880/api/control",
            req.body
        );

        res.json(response.data);

    } catch (err) {
        console.error("Control error:", err.message);

        res.status(500).json({
            status: "error",
            message: "Control request failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});