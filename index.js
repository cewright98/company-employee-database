const inquirer = require('inquirer');
const db = require('./db/connection');
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

const start = [
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
    }
]

const departmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the department name?'
    }
]

const roleQuestions = [
    {
        type: 'input',
        name: 'roleTitle',
        message: 'What is the role title?'
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary for this role?'
    },
    {
        type: 'list',
        name: 'roleDepartment',
        message: 'What department is this role in?',
        choices: departmentChoices
    }
]

const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'employeeFirstName',
        message: "What is the employee's first name?"
    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: "What is the employee's last name?"
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: "What is the employee's role?",
        choices: roleChoices
    },
    {
        type: 'confirm',
        name: 'addManager',
        message: 'Would you like to add a manager for this employee?'
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: "Select the employee's manager",
        choices: employeeChoices,
        when(answers) {
            return answers.addManager === true;
        }
    }
]

const updateEmployeeQuestions = [
    {
        type: 'list',
        name: 'employeeToUpdate',
        message: 'Select an employee to update',
        choices: employeeChoices
    },
    {
        type: 'list',
        name: 'employeeRoleUpdate',
        message: "What is the employee's new role?",
        choices: roleChoices
    }
]

inquirer
    .prompt(start)
    .then(answers => {
        if (answers.options === 'View all departments') {
            company.getDepartments();
        } else if (answers.options === 'View all roles') {
            company.getRoles();
        } else if (answers.options === 'View all employees') {
            company.getEmployees();
        } else if (answers.options === 'Add a department') {
            inquirer.prompt(departmentQuestions)
            .then(answers => {
                company.addDepartment(answers.departmentName);
            });
        } else if (answers.options === 'Add a role') {
            inquirer.prompt(roleQuestions)
            .then(answers => {
                company.getDepartmentId(answers.roleDepartment)
                    .then(results => {
                        company.addRole(answers.roleTitle, answers.roleSalary, results);
                    });
            });
        } else if (answers.options === 'Add an employee') {
            inquirer.prompt(addEmployeeQuestions)
            .then(answers => {
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
            });
        } else if (answers.options === 'Update an employee role') {
            inquirer.prompt(updateEmployeeQuestions)
            .then(answers => {

            });
        }
    });