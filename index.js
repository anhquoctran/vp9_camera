var express = require("express")
var bodyparser = require("body-parser")
require('dotenv').config()
var morgan = require('morgan')

const PORT =  1899
var app = express()



// app.set("view engine", "ejs")
// app.use('/public', express.static(__dirname + '/public'))

//config express middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(morgan('dev'))
/*app.use(function(req, res, next) {
    res.removeHeader("X-Powered-By")
})*/

app.get('/', function(req, res) {
    return res.send("hello")
})

//require('./controllers/route')(app)

app.listen(PORT, function () {
    console.log("Application is running at port: " + PORT)
})