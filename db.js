var mysql = require("mysql")
require('dotenv').config()

//Define connection string for connect to MySQL Server database
var connectionString = {
    host: process.env.MYSQL_SERVER || 'localhost',
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'anhquoc1996@@',
    database: process.env.MYSQL_DATABASE || "camera_vp9",
    port: process.env.MYSQL_PORT || 3306,
    multipleStatements: true,
    charset: 'utf8_general_ci',
    dateStrings: "date"
}


//Function class for handling database connection
function Config() {

    this.connect = mysql.createConnection(connectionString)

    console.log("Connecting to database... ")

    this.connect.connect(function (error) {
        if (error) {
            console.error("Error when connecting to MySQL Database: " + error.stack);
            return;
        }
        console.log("Database connection has been established successfully!")
    })

    
}

module.exports = new Config();