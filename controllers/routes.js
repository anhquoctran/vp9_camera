//var sequelize = require('../db')
//var Sequelize = require('sequelize')
var BasicStrategy = require('passport-http').BasicStrategy
var moment = require('moment')
var fs = require('fs')
var loki = require('lokijs')
var path = require('path')
var buffer = require('buffer')

const TABLE_NAME = 'detect_data'

var db = new loki(path.join(__dirname, "..", "data.json"))
db.autosave = true
var images = db.addCollection("images")

const {
	check,
	validationResult
} = require('express-validator/check')

// var Item = sequelize.define('detect_data', {
// 	id : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
// 	vehicle_plate : { type: Sequelize.STRING(10), allowNull: false }, 
// 	camera_id: {type: Sequelize.INTEGER, allowNull: false},
// 	frametime: { type: Sequelize.DATE, allowNull: false },
// 	encoded_plate_image: {type: Sequelize.TEXT("16777216"), allowNull: false },
// 	encoded_vehicle_image: {type: Sequelize.TEXT("16777216"), allowNull: false },
// 	location: { type: Sequelize.STRING(10), allowNull: true }
// })

// sequelize.sync().then(function(err) {
// 	if(err) {
// 		console.log(err)
// 	} else {
// 		console.log("Migration database successfully...")
// 	}
// })

function routes(app, server) {

	var io = require('socket.io')(server)
	var appDir = path.dirname(require.main.filename)

	//Handling index route
	app.get('/', function (req, res) {
		return res.json({
			message: "Success"
		})
	})

	app.post('/add_image', [
		check('camera_id')
			.exists()
			.isNumeric()
			.withMessage('cannot be null and must be numeric type'),

		check('frametime')
			.exists()
			.withMessage('cannot be null and must be date time type')
		,

		check('location')
			.exists()
			.withMessage('cannot be null'),

		check('vehicle_plate')
			.exists()
			.withMessage('cannot be null'),

		check('encoded_plate_image')
			.exists()
			.trim()
			.isBase64(),

		check('encoded_vehicle_image')
			.exists()
			.trim()
			.isBase64()
	], function (req, res) {

		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			return res.status(400).json({
				message: "ERROR_VALIDATION",
				details: errors.mapped(),
				success: false,
				status: 400
			})
		}

		var body = req.body
		
		var camera_id = body.camera_id
		var frametime = body.frametime
		var encoded_plate_image = body.encoded_plate_image
		var encoded_vehicle_image = body.encoded_vehicle_image
		var location = body.location
		var vehicle_plate = body.vehicle_plate

		//sequelize.query(`delete from ${TABLE_NAME} where ( createAt < GETDATE() - 3 )`, { type: sequelize.QueryTypes.DELETE})

		var name = `cam_${body.camera_id}_${getDateTimeString(body.frametime)}_${body.vehicle_plate}`

		var item = {
			camera_id: body.camera_id,
			name: name,
			frametime: body.frametime,
			encoded_plate_image: body.encoded_plate_image,
			encoded_vehicle_image: body.encoded_vehicle_image,
			location: body.location,
			vehicle_plate: body.vehicle_plate,
		}

		images.insert(item)
		io.sockets.emit('plate', item)

		decode_base64(body.encoded_plate_image, name + '_plate.jpg')
		decode_base64(body.encoded_vehicle_image, name + '_vehicle.jpg')

		db.save(function(err) {
			if(err) {
				return res.status(500).send({
					message: "SAVE_FAILED",
					success: false,
					status: 500
				})
			} else {
				return res.json({
					message: "SAVE_OK",
					success: true,
					status: 200
				})
			}
		})


		// Item.create({
		// 	camera_id: body.camera_id,
		// 	frametime: body.frametime,
		// 	encoded_plate_image: body.encoded_plate_image,
		// 	encoded_vehicle_image: body.encoded_vehicle_image,
		// 	location: body.location,
		// 	vehicle_plate: body.vehicle_plate,
		// }).then(function(data) {
			
		// 	return res.json({
		// 		message: "SAVE_OK",
		// 		success: true,
		// 		status: 200
		// 	})
		// }).catch(function(err) {
		// 	return res.status(500).send({
		// 		message: "SAVE_FAILED",
		// 		success: false,
		// 		status: 500
		// 	})
		// })
	})

	app.all('/get_image', [
		// check('camera_id')
		// .withMessage('cannot be null or empty')
		// .exists()
		// .isNumeric(),

		// check('from')
		// .withMessage('cannot be null and must be valid date time format')
		// .exists()
	], function (req, res) {
		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			return res.status(422).json({
				message: "Error: " + errors.mapped(),
				success: false,
				status: 422
			})
		} else {
			//db.loadCollection("images")
			db.loadDatabase({}, function () {
				var info = db.getCollection('images')
				if(info) {
					return res.json({
						message: "QUERY_OK",
						success: true,
						status: 200,
						data: info.find({ created: { $gte: new Date() } })
					})
				} else {
					return res.status(404).send({
						message: "NOT_FOUND",
						success: false,
						status: 500,
						data: null
					})
				}
				
			})
			
			// sequelize.query("SELECT * FROM detect_data", { type: sequelize.QueryTypes.SELECT })
			// 	.then(data => {
			// 		return res.json({
			// 			message: "QUERY_OK",
			// 			success: true,
			// 			status: 200,
			// 			data: data
			// 		})
			// 	})
			// 	.catch(error => {
			// 		return res.json(500).send({
			// 			message: "QUERY_FAILED",
			// 			success: false,
			// 			status: 500,
			// 			data: null
			// 		})
			// 	})
		}
	})

	function getDateTimeString(date) {
		var d = new Date(date)
		return d.getFullYear() + d.getMonth() + d.getDay() + "_" + d.getHours() + d.getMinutes() + d.getSeconds()
	}

	function decode_base64(base64str , filename){

		var buf = Buffer.from(base64str,'base64')
		
		fs.writeFile(path.join(appDir, '/images_data', makeid() + '_' + filename), base64str, 'base64' , function(error){
			if(error){
				throw error
			}else{
				console.log('File created from base64 string!')
				return true
			}
		})
	}

	function makeid() {
		var text = ""
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		
		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		
		return text
	}

	function deleteFolderAfterWeek() {

		console.log("Starting cleanup images directory...")
		fs.readdir("./images_data", (errors, files) => {

			files.forEach(file => {
				var fullFilePath = path.join(appDir, '/images_data', file)
				fs.stat(fullFilePath, (err, stat) => {

					if(err) console.error(err)
					else {

						var fileCreationTime = new Date(stat.birthtime)
						var currentTime = new Date()
						var diffDays = parseInt((currentTime - fileCreationTime) / (1000 * 60 * 60 * 24))
						if(diffDays >= 3) {
							fs.unlink(fullFilePath, function(ers) {
								if(ers) console.error(ers)
								else {
									console.log("Image file named " + file + " has been deleted after 3 days")
								}
							})
						}
					}
					
				})
			})
		})
	}

	setInterval(deleteFolderAfterWeek, 60000)
}

module.exports = routes