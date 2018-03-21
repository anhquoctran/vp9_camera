var express = require("express")
var bodyparser = require("body-parser");

const port = 1899
var app = express()

app.listen(port, function () {
    console.log("Application is running at port: " + port)
})

// app.set("view engine", "ejs")
// app.use('/public', express.static(__dirname + '/public'))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.removeHeader("X-Powered-By")
})

require('./controllers/IndexController')(app)