CREATE DATABASE institute;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    department_id INT REFERENCES department(id)
);

