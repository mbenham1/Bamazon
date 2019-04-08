var mysql = require("mysql");
var chalk = require("chalk")
var Table = require("cli-table");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 8889,

  user: "root",

  password: "root",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  showItems();
});


function showItems() {

  var query = connection.query('SELECT * FROM products', function (err, response) {

    var table = new Table({
      head: ['ID', 'Product Name', 'Department', 'Price ($)']
    });

    for (var i = 0; i < response.length; i++) {
      table.push([response[i].id, response[i].product_name, response[i].department_name, response[i].price]);
    }

    console.log(table.toString());
    whatDoYouWantToDo();

  })

}

function whatDoYouWantToDo() {

  inquirer
    .prompt([{
      type: "input",
      message: chalk.blue("Please enter the item ID of the item you would like to purchase:"),
      name: "id",
      validate: function (value) {
        if (value.trim().length < 2) {
          console.log(chalk.red("  Error" + "\r\n"));
          return false;
        } return true;
      }
    },
    {
      type: "input",
      message: chalk.blue("Please enter the amount of units you would like to purchase:"),
      name: "quantity",
      validate: function (value) {
        if (isNaN(value) == false) {
          return true;
        } else {
          console.log(chalk.red("  Error" + "\r\n"));
          return false;
        }
      }
    }
    ]).then(function (answer) {
      connection.query(
        "SELECT product_name, price, stock_quantity FROM products WHERE ?", {

          id: answer.id

        },
        function (err, response) {

          if (err) throw err;

          var chosenId = answer.id;
          var chosenQuantity = answer.quantity;
          var product = response[0].product_name;
          var price = response[0].price;
          var quantity = response[0].stock_quantity;
          var updatedQuantity = quantity - parseInt(chosenQuantity);
          var sale = answer.quantity * price;

          if (quantity < answer.quantity) {
            console.log(chalk.red("Insufficient Stock"))
            whatDoYouWantToDo();
          } else {
            connection.query("UPDATE products SET ? WHERE ?",
              [{
                stock_quantity: updatedQuantity,
              },
              {
                id: chosenId
              }

              ],
              function (err) {
                if (err) {
                  console.log(err);
                } else {

                  var table = new Table({
                    head: ['Item', 'Price', 'Quantity', 'Total']
                  });
              
                  for (var i = 0; i < response.length; i++) {
                    table.push([product, "$" + price, chosenQuantity, "$" + sale]);
                  }
              
                  console.log(table.toString());
                  // console.log(chalk.green("--------RECEIPT---------- " + "\r\n" +
                  //   "Item: " + product + "\r\n" +
                  //   "Price: $" + price + "\r\n" +
                  //   "Quantity: " + chosenQuantity + "\r\n" +
                  //   "-------------------------" + "\r\n" +
                  //   "Total Sale: $" + sale));
                    anotherPurchase();
                }
              }
            )
          }
        
        })
    })
}

function anotherPurchase(){
  inquirer
  .prompt([{
      type: "list",
      name: "checkout",
      message: "Would you like to purchase anything else?",
      choices: ["Yes", "No"]
  }]).then(function(answer) {
      if (answer.checkout === "Yes") {
          showItems();
      } else {
          console.clear();
          connection.end();
      }
  })

}
