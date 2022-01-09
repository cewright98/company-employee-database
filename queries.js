const db = require('./db/connection');
const cTable = require('console.table');

class Company {
    constructor(){}

    getDepartmentChoices() {
        return new Promise((resolve, reject) => {
            const departments = [];
            const sql = `SELECT name FROM departments`;
            db.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                for (let i = 0; i < result.length; i++) {
                    departments.push(result[i].name);
                }
                resolve(departments);
            });
        });
    };

    getRoleChoices() {
        return new Promise((resolve, reject) => {
            const roles = [];
            const sql = `SELECT title FROM roles`;
            db.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                for (let i = 0; i < result.length; i++) {
                    roles.push(result[i].title);
                }
                resolve(roles);
            });
        });
    };

    getEmployeeChoices() {
        return new Promise((resolve, reject) => {
            const employees = [];
            const sql = `SELECT * FROM employees`;
            db.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                for (let i = 0; i < result.length; i++) {
                    var employeeName = result[i].first_name + " " + result[i].last_name;
                    employees.push(employeeName);
                }
                resolve(employees);
            });
        });
    };

    getDepartments() {
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
            console.table(rows);
        });
    };

    getRoles() {
        const sql = `SELECT * FROM roles`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
            console.table(rows);
        });
    };

    getEmployees() {
        const sql = `SELECT * FROM employees`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
            console.table(rows);
        });
    };

    getDepartmentId(name) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id FROM departments WHERE name = ?`;
            const params = name;
            db.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result[0].id);
            });
        });
    };

    getRoleId(title) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id FROM roles WHERE title = ?`;
            const params = title;
            db.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result[0].id);
            });
        });
    };

    getManagerId(name) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`
            const params = name.split(' ');
            db.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result[0].id);
            });
        });
    };

    addDepartment(name) {
        const sql = `INSERT INTO departments (name) 
            VALUES (?)`;
        const params = name;
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.message);
                return;
            }
            console.log('Department added to database');
        });
    };

    addRole(title, salary, departmentId) {
        const sql = `INSERT INTO roles (title, salary, department_id)
            VALUES (?,?,?)`;
        const params = [title, salary, departmentId];
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.message);
                return;
            }
            console.log('Role added to database');
        });
    };

    addEmployee(firstName, lastName, roleId, managerId) {
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES (?,?,?,?)`;
        const params = [firstName, lastName, roleId, managerId];
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.message);
                return;
            }
            console.log('Employee added to database');
        });
    };
}


module.exports = { Company };