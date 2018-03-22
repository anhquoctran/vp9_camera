var Sequelize = require('sequelize')
require('mysql')
require('mysql2')
var config = require('./config.json');
require('dotenv').config()

var sequelize = new Sequelize(process.env.MYSQL_DATABASE || "camera_vp9", process.env.MYSQL_USERNAME || "root", process.env.MYSQL_PASSWORD || 'anhquoc1996@@', {
    host: process.env.MYSQL_SERVER || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
})

sequelize.authenticate().then(function (err) {
    if (err) {
        console.error('Database connection error! ' + err);
    } else {
        console.log('Connection has been established successfully');
    }
});

//Function class for handling database connection
module.exports = sequelize