var mysql = require("mysql")
var Sequelize = require('sequelize')

require('dotenv').config()

//Function class for handling database connection
module.exports = { 
    config: function () {
        var sequelize = new Sequelize(process.env.MYSQL_DATABASE || "camera_vp9", process.env.MYSQL_PASSWORD || 'anhquoc1996@@', process.env.MYSQL_DATABASE || "camera_vp9", {
            host: process.env.MYSQL_SERVER || 'localhost',
            port: process.env.MYSQL_PORT || 3306,
            dialect: 'mysql'
        })
    
        sequelize.authenticate().complete(function (err) {
            if (err) {
                console.log('There is connection in ERROR');
            } else {
                console.log('Connection has been established successfully');
            }
        });
        
        return sequelize;
    }
}

