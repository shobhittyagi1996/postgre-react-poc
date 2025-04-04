const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000; 

app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

// Test DB connection
pool.connect()
    .then(() => console.log("Connected to PostgreSQL database "))
    .catch((err) => console.error("Database connection error ", err));

// Get all roadmaps
app.get("/roadmap", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM roadmaptemplate");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/* ---------------------------------------
 CRUD Operations for TemplateArea
   --------------------------------------- */

app.get("/area", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM templatearea");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching Area:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/* ---------------------------------------
   CRUD Operations for TemplatePhase
   --------------------------------------- */


app.get("/phase", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM templatephase");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching Phase:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/task", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM TemplateTask");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching Task:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/task/:id", async (req, res) => {
    const { id } = req.params;
    const { name, parent_key, description, area, phase } = req.body;

    try {
        const result = await pool.query(
            `UPDATE TemplateTask 
             SET name = $1, parent_key = $2, description = $3, area = $4, phase = $5, modifiedAt = NOW() 
             WHERE id = $6 
             RETURNING *`,
            [name, parent_key, description, area, phase, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating Task:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
