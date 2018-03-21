var mysql = require("mysql")

var connectionString = {
    host: 'localhost',
    user: 'root',
    password: 'anhquoc1996@@',
    database: "camera_vp9",
    multipleStatements: true,
    charset: 'utf8_general_ci',
    dateStrings: "date"
}

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