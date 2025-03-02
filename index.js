const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
app.use(express.json());
app.use(cors());

// Get all departments
app.get("/departments", async (req, res) => {
  const result = await pool.query("SELECT * FROM department");
  res.json(result.rows);
});

// Get students by department ID
app.get("/students/:departmentId", async (req, res) => {
  const departmentId = parseInt(req.params.departmentId, 10);
  const result = await pool.query(
    "SELECT * FROM student WHERE department_id = $1",
    [departmentId]
  );
  res.json(result.rows);
});

app.post("/departments", async (req, res) => {
  const {department_name, department_code, head_of_department, description, created_at} = req.body;
  const result = await pool.query("INSERT INTO department(department_name, department_code, head_of_department, description, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *", [department_name, department_code, head_of_department, description, created_at])
  res.status(201).json(result.rows[0])
});

app.delete('/departments/:id', async(req,res)=>{
    const {id} = req.params
    const result = await pool.query("DELETE FROM department WHERE id = $1 RETURNING *", [id])
    res.json(result.rows[0])
})

app.put('/departments/:id', async(req,res)=>{
    const {id} = req.params
    const result = await pool.query("UPDATE department SET department_name=$1, department_code=$2, head_of_department=$3, description=$4 WHERE id = $5 RETURNING *", [department_name, department_code, head_of_department, description, id])
    res.json(result.rows)
})

app.get("/", async (req, res) => {
  res.send("Server is running...");
});

app.listen(5000, async (req, res) => {
  console.log("running on port: 5000");
});
