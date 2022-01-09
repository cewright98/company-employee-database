const inquirer = require('inquirer');
const { Company } = require('./queries');
const company = new Company;

var departmentChoices = [];
company.getDepartmentChoices()
    .then(results => {
        for (let i = 0; i < results.length; i++) {
            departmentChoices.push(results[i]);                
        }
    });

var roleChoices = [];
company.getRoleChoices()
    .then(results => {
        for (let i = 0; i < results.length; i++) {
            roleChoices.push(results[i]);
        }
    });

var employeeChoices = [];
company.getEmployeeChoices()
    .then(results => {
        for (let i = 0; i < results.length; i++) {
            employeeChoices.push(results[i]);
        }
    });

const questions = [
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    },
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the department name?',
        when(answers) {
            return answers.options === 'Add a department';
        }
    },
    {
        type: 'input',
        name: 'roleTitle',
        message: 'What is the role title?',
        when(answers) {
            return answers.options === 'Add a role'
        }
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary for this role?',
        when(answers) {
            return answers.options === 'Add a role'
        }
    },
    {
        type: 'list',
        name: 'roleDepartment',
        message: 'What department is this role in?',
        choices: departmentChoices,
        when(answers) {
            return answers.options === 'Add a role'
        }
    },
    {
        type: 'input',
        name: 'employeeFirstName',
        message: "What is the employee's first name?",
        when(answers) {
            return answers.options === 'Add an employee'
        }
    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: "What is the employee's last name?",
        when(answers) {
            return answers.options === 'Add an employee'
        }
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: "What is the employee's role?",
        choices: roleChoices,
        when(answers) {
            return answers.options === 'Add an employee'
        }
    },
    {
        type: 'confirm',
        name: 'addManager',
        message: 'Would you like to add a manager for this employee?',
        when(answers) {
            return answers.options === 'Add an employee'
        }
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: "Select the employee's manager",
        choices: employeeChoices,
        when(answers) {
            return answers.addManager === true;
        }
    },
    {
        type: 'list',
        name: 'employeeToUpdate',
        message: 'Select an employee to update',
        choices: employeeChoices,
        when(answers) {
            return answers.options === 'Update an employee role'
        }
    },
    {
        type: 'list',
        name: 'employeeRoleUpdate',
        message: "What is the employee's new role?",
        choices: roleChoices,
        when(answers) {
            return answers.options === 'Update an employee role'
        }
    }
]

inquirer
    .prompt(questions)
    .then(answers => {
        switch(answers.options) {
            case 'View all departments':
                company.getDepartments();
                break;
            case 'View all roles':
                company.getRoles();
                break;
            case 'View all employees':
                company.getEmployees();
                break;
            case 'Add a department':
                company.addDepartment(answers.departmentName);
                break;
            case 'Add a role':
                company.getDepartmentId(answers.roleDepartment)
                    .then(results => {
                        company.addRole(answers.roleTitle, answers.roleSalary, results);
                    });
                break;
            case 'Add an employee':
                company.getRoleId(answers.employeeRole)
                    .then(results => {
                        const roleId = results;

                        if (!answers.addManager) {
                            company.addEmployee(answers.employeeFirstName, answers.employeeLastName, roleId, null);
                        } else {
                            company.getManagerId(answers.employeeManager)
                            .then(results => {
                                company.addEmployee(answers.employeeFirstName, answers.employeeLastName, roleId, results);
                            });
                        }
                    });
                break;
            case 'Update an employee role':
                company.getRoleId(answers.employeeRoleUpdate)
                    .then(results => {
                        const roleId = results;
                        company.getManagerId(answers.employeeToUpdate)
                            .then(results => {
                                company.updateEmployee(results, roleId);
                            });
                    });
                break;
        }
    });