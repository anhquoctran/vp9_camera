var Sequelize = require('sequelize')
var config = require('./config.json')
var winston = require('winston')
const Op = Sequelize.Op;
const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
}

require('mysql')
require('mysql2')
require('dotenv').config()

var sequelize = new Sequelize(process.env.MYSQL_DATABASE || "camera_vp9", process.env.MYSQL_USERNAME || "root", process.env.MYSQL_PASSWORD || 'anhquoc1996@@', {
    host: process.env.MYSQL_SERVER || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    operatorsAliases: operatorsAliases,
    logging: winston.verbose
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