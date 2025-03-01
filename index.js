const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
app.use(express.json());
app.use(cors());

// Get all departments
app.get('/departments', async (req, res) => {
    const result = await pool.query('SELECT * FROM department');
    res.json(result.rows);
});

// Get students by department ID
app.get('/students/:departmentId', async (req, res) => {
    const departmentId = parseInt(req.params.departmentId, 10);
    const result = await pool.query('SELECT * FROM student WHERE department_id = $1', [departmentId]);
    res.json(result.rows);
});


app.listen(5000, async (req, res) => {
    console.log("running on port: 5000");
  });