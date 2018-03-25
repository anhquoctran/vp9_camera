var express = require("express")
var bodyparser = require("body-parser")
var passport = require('passport')
var morgan = require('morgan')

require('dotenv').config()

const PORT = process.env.PORT || 1899

var app = express()

app.listen(PORT, function () {
    console.log("Application is running at port: " + PORT)
})

//config express middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.removeHeader("X-Powered-By")
    next();
})
app.use(morgan('dev'))

require('./controllers/routes')(app, passport)