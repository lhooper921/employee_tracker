var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

// Set up connection to the sql database
const connectionConfig = {
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "employee_tracker_db"
};

var connection = mysql.createConnection(connectionConfig);

connection.connect(function (err) {
    if (err) {
        console.error(`error connecting: ${err.stack}`);
        return;
    }
    console.log(`connected as id  ${connection.threadId}`);
    // run the start function after the connection is made to prompt the user
    start();
});
// =========================== START PROMPTS =====================================

// function which prompts the user for what action they should take
function start() {
    console.log("Employee Manager");
    // Please add a department to begin
    inquirer
        .prompt({
            name: "addOrView",
            type: "list",
            message: "Would you like to [ADD] or [VIEW] a department?",
            choices: ["ADD", "VIEW", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the add or the view functions
            if (answer.addOrView === "ADD") {
                addDepartment();
            }
            else if (answer.addOrView === "VIEW") {
                viewDepartment();
            } else {
                connection.end();
            }
        });
}


// ================================ ADD DEPARTMENT ===============================

function addDepartment() {
    // prompt for info about the department
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the department?"
            },

        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.name,
                },
                function (err) {
                    if (err) throw err;
                    console.log("The department was added successfully!");
                    // Ask user if they would like to add role to this department
                    inquirer
                        .prompt({
                            name: "addOrViewRole",
                            type: "list",
                            message: "Would you like to [ADD] or [VIEW] a role ?",
                            choices: ["ADD", "VIEW", "EXIT"]
                        })
                        .then(function (answer) {
                            // based on their answer, either call the add or the view functions
                            if (answer.addOrViewRole === "ADD") {
                                addRole();
                            }
                            else if (answer.addOrViewRole === "VIEW") {
                                viewRole();
                            } else {
                                connection.end();
                            }
                        });

                }
            );
        });
}

// ============================= VIEW DEPARTMENT =================================

function viewDepartment() {
    // query the database for all departments
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        console.table("Departments", results);
        // Select which department to view
        inquirer
            .prompt([
                {
                    name: "department_id",
                    type: "number",
                    message: "Please input the id of the department you would like to view"
                },
            ])
            .then(function (answer) {
                console.log("Finding roles within department ",answer.department_id)
                var query = "SELECT department.name, role.title, role.salary FROM role INNER JOIN department ON role.department_id = department.id WHERE role.department_id = ? "
                connection.query(query, (answer.department_id), function (err, results) {
                    if (err) throw err;
                    console.table("Roles", results)

                    inquirer
                    .prompt({
                        name: "addOrViewRole",
                        type: "list",
                        message: "Would you like to [ADD] or [VIEW] a specific role or another department ?",
                        choices: ["ADD ROLE", "VIEW ROLE", "ADD DEPARTMENT", "VIEW DEPARTMENT","BACK TO START"]
                    })
                    .then(function (answer) {
                        // based on their answer, either call the add or the view functions
                        if (answer.addOrViewRole === "ADD ROLE") {
                            addRole();
                        }
                        else if (answer.addOrViewRole === "VIEW ROLE") {
                            viewRole();
                        } else if (answer.addOrViewRole === "ADD DEPARTMENT") {
                            addDepartment();
                        } else if (answer.addOrViewRole === "VIEW DEPARTMENT") {
                            viewDepartment();
                        }
                         else {
                            start();
                        }
                    });
                })
            })
    }
    )
}

// ================================== ADD ROLE ===================================

function addRole() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        console.log(results)
        // Select which department to add role
        inquirer
            .prompt([


                {
                    name: "title",
                    type: "input",
                    message: "What is the title of this role?"
                },
                {
                    name: "salary",
                    type: "number",
                    message: "What is the salary of this role?"
                },
                {
                    name: "department_id",
                    type: "number",
                    message: "Which department id would you like to add role to?"
                },
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department_id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The role was added successfully!");

                        // Ask user if they would like to add role to this department
                        inquirer
                            .prompt({
                                name: "addOrViewRole",
                                type: "list",
                                message: "Would you like to [ADD] or [VIEW] another role or employee ?",
                                choices: ["ADD ROLE", "VIEW ROLE", "ADD EMPLOYEE", "VIEW EMPLOYEE", "BACK TO START"]
                            })
                            .then(function (answer) {
                                // based on their answer, either call the add or the view functions
                                if (answer.addOrViewRole === "ADD ROLE") {
                                    addRole();
                                }
                                else if (answer.addOrViewRole === "VIEW ROLE") {
                                    viewRole();
                                }
                                else if (answer.addOrViewRole === "ADD EMPLOYEE") {
                                    addEmployee();
                                }
                                else if (answer.addOrViewRole === "VIEW EMPLOYEE") {
                                    viewEmployee();
                                }
                                else {
                                    start();
                                }
                            });

                    }
                );
            });

    })
}


// ============================== ADD EMPLOYEE ===================================

function addEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        console.table(results)
        // Select which department to add role
        inquirer
            .prompt([


                {
                    name: "first_name",
                    type: "input",
                    message: "What is the first name of this employee?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the last name of this employee?"
                },
                {
                    name: "role_id",
                    type: "number",
                    message: "Which role id would you like to add this employee to?"
                },
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.role_id
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The employee was added successfully!");

                        // Ask user if they would like to add role to this department
                        inquirer
                            .prompt({
                                name: "addOrViewEmployee",
                                type: "list",
                                message: "Would you like to [ADD] or [VIEW] another employee ?",
                                choices: ["ADD", "VIEW", "EXIT"]
                            })
                            .then(function (answer) {
                                // based on their answer, either call the add or the view functions
                                if (answer.addOrViewRole === "ADD") {
                                    addEmployee();
                                }
                                else if (answer.addOrViewRole === "VIEW") {
                                    viewEmployee();
                                } else {
                                    connection.end();
                                }
                            });

                    }
                );
            });

    })
}   




// =============================VIEW ROLE ========================================

function viewRole() {
    // query the database for all departments
    connection.query("SELECT department.name, role.title, role.id FROM role  INNER JOIN department ON role.department_id = department.id ", function (err, results) {
        if (err) throw err;
        console.table("Departments", results);
        // Select which department to view
        inquirer
            .prompt([
                {
                    name: "role_id",
                    type: "number",
                    message: "Please input the id of the role you would like to view"
                },
            ])
            .then(function (answer) {
                console.log("Finding roles within department ",answer.role_id)
                var query = "SELECT role.title, employee.first_name, employee.last_name FROM employee INNER JOIN role ON employee.role_id = role.id WHERE employee.role_id = ? "
                connection.query(query, (answer.role_id), function (err, results) {
                    if (err) throw err;
                    console.table("Employees", results)
                })
                inquirer
                .prompt({
                    name: "addOrViewEmployee",
                    type: "list",
                    message: "Would you like to [ADD] or [VIEW] a specific employee, another role, or another department ?",
                    choices: ["ADD EMPLOYEE", "VIEW EMPLOYEE","ADD ROLE", "VIEW ROLE", "ADD DEPARTMENT", "VIEW DEPARTMENT","BACK TO START"]
                })
                .then(function (answer) {
                    // based on their answer, either call the add or the view functions
                    if (answer.addOrViewEmployee === "ADD EMPLOYEE") {
                        addEmployee();
                    }
                   
                    else if (answer.addOrViewEmployee === "VIEW EMPLOYEE") {
                        viewEmployee();
                        
                    }  else if (answer.addOrViewEmployee === "ADD ROLE") {
                        addRole();
                    } 
                    else if (answer.addOrViewEmployee === "VIEW ROLE") {
                        viewRole();
                    } else if (answer.addOrViewEmployee === "ADD DEPARTMENT") {
                        addDepartment();
                    } else if (answer.addOrViewEmployee === "VIEW DEPARTMENT") {
                        viewDepartment();
                    }
                     else {
                        start();
                    }
                });
            })
    }
    )
}