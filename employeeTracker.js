var mysql = require("mysql");
var inquirer = require("inquirer");

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
      .then(function(answer) {
        // based on their answer, either call the add or the view functions
        if (answer.addOrView === "ADD") {
          addDepartment();
        }
        else if(answer.addOrView === "VIEW") {
          viewDepartment();
        } else{
          connection.end();
        }
      });
  }

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
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.name,
          },
          function(err) {
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
            .then(function(answer) {
                // based on their answer, either call the add or the view functions
                if (answer.addOrViewRole=== "ADD") {
                  addRole();
                }
                else if(answer.addOrViewRole === "VIEW") {
                  viewRole();
                } else{
                  connection.end();
                }
              });
            
          }
        );
      });
  }
  function viewDepartment() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM department", function(err, results) {
      if (err) throw err;
      console.log(results)
      // Select which department to view
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].name);
              }
              return choiceArray;
            },
            message: "Which department would you like to view?"
          }
        ])
        .then (function(answer){
            connection.query("SELECT * FROM ?", function(err, results) {
                if (err) throw err;
                console.log(results)
        })
    })})
  }
    
  
    
 function addRole(){
    connection.query("SELECT * FROM department", function(err, results) {
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
          .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
              "INSERT INTO role SET ?",
              {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id
              },
              function(err) {
                if (err) throw err;
                console.log("The role was added successfully!");

                // Ask user if they would like to add role to this department
                inquirer
                .prompt({
                  name: "addOrViewRole",
                  type: "list",
                  message: "Would you like to [ADD] or [VIEW] another role ?",
                  choices: ["ADD", "VIEW", "EXIT"]
                })
                .then(function(answer) {
                    // based on their answer, either call the add or the view functions
                    if (answer.addOrViewRole=== "ADD") {
                      addRole();
                    }
                    else if(answer.addOrViewRole === "VIEW") {
                      viewRole();
                    } else{
                      connection.end();
                    }
                  });
                
              }
            );
          });
      
      })
 }          
     