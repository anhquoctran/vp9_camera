var express = require('express')
var bodyparser = require('body-parser')
var passport = require('passport')
var morgan = require('morgan')

require('dotenv').config()

const PORT = process.env.PORT || 1899
var app = express()

var server = require('http').createServer(app)
//config express middleware
app.use(bodyparser.json({
	limit: '5mb'
}))
app.use(bodyparser.urlencoded({ extended: true, limit: '5mb' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req, res, next) {
	res.removeHeader('X-Powered-By')
	next()
})
//app.use(express.bodyParser({limit: '500mb'}))

app.use(morgan('dev'))

require('./controllers/routes')(app, server)

server.listen(PORT, function () {
	console.log('Application is running at port: ' + PORT)
})
