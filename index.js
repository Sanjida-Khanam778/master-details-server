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
  const {
    department_name,
    department_code,
    head_of_department,
    description,
    created_at,
  } = req.body;
  const result = await pool.query(
    "INSERT INTO department(department_name, department_code, head_of_department, description, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      department_name,
      department_code,
      head_of_department,
      description,
      created_at,
    ]
  );
  res.status(201).json(result.rows[0]);
});

app.delete("/departments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
          "DELETE FROM department WHERE id = $1 RETURNING *",
          [id]
        );
        if (result.rowCount === 0) {
          return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json({ message: "Department deleted", department: result.rows[0] });
      } catch (error) {
        res.status(500).json({ error: error.detail });
      }
});

app.put("/departments/:id", async (req, res) => {
  const { id } = req.params;
  const {department_name, department_code, head_of_department, description} = req.body
  const result = await pool.query(
    "UPDATE department SET department_name=$1, department_code=$2, head_of_department=$3, description=$4 WHERE id = $5 RETURNING *",
    [department_name, department_code, head_of_department, description, id]
  );
  res.json(result.rows[0]);
});

// students

app.put("/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { student_name, email, enrollment_date, gender, department_id } = req.body;
  
      const result = await pool.query(
        "UPDATE student SET student_name=$1, email=$2, enrollment_date=$3, gender=$4, department_id=$5 WHERE id=$6 RETURNING *",
        [student_name, email, enrollment_date, gender, department_id, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.json({ message: "Student updated successfully", student: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.detail || "Error updating student" });
    }
  });
// DELETE a student by ID
app.delete("/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        "DELETE FROM student WHERE id = $1 RETURNING *",
        [id]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.status(200).json({ message: "Student deleted", student: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.detail || "Error deleting student" });
    }
  });
  
  


app.get("/", async (req, res) => {
  res.send("Server is running...");
});

app.listen(5000, async (req, res) => {
  console.log("running on port: 5000");
});
