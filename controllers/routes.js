var sequelize = require('../db')
var Sequelize = require('sequelize')
var BasicStrategy = require('passport-http').BasicStrategy
var moment = require('moment')
var fs = require('fs')

const TABLE_NAME = ''

const {
	check,
	validationResult
} = require('express-validator/check')

var Item = sequelize.define('detect_data', {
	id : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	vehicle_plate : { type: Sequelize.STRING(10), allowNull: false }, 
	camera_id: {type: Sequelize.INTEGER, allowNull: false},
	frametime: { type: Sequelize.DATE, allowNull: false },
	encoded_plate_image: {type: Sequelize.TEXT("16777216"), allowNull: false },
	encoded_vehicle_image: {type: Sequelize.TEXT("16777216"), allowNull: false },
	location: { type: Sequelize.STRING(10), allowNull: true }
})

sequelize.sync().then(function(err) {
	if(err) {
		console.log(err)
	} else {
		console.log("Migration database successfully...")
	}
})

function routes(app, passport) {

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
				message: "Validation Error" + errors.mapped(),
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

		sequelize.query(`delete from ${TABLE_NAME} where ( createAt < GETDATE() - 3 )`, { type: sequelize.QueryTypes.DELETE})

		Item.create({
			camera_id: body.camera_id,
			frametime: body.frametime,
			encoded_plate_image: body.encoded_plate_image,
			encoded_vehicle_image: body.encoded_vehicle_image,
			location: body.location,
			vehicle_plate: body.vehicle_plate,
		}).then(function(data) {
			
			return res.json({
				message: "SAVE_OK",
				success: true,
				status: 200
			})
		}).catch(function(err) {
			return res.status(500).send({
				message: "SAVE_FAILED",
				success: false,
				status: 500
			})
		})
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

			sequelize.query("SELECT * FROM detect_data", { type: sequelize.QueryTypes.SELECT })
				.then(data => {
					return res.json({
						message: "QUERY_OK",
						success: true,
						status: 200,
						data: data
					})
				})
				.catch(error => {
					return res.json(500).send({
						message: "QUERY_FAILED",
						success: false,
						status: 500,
						data: null
					})
				})
		}
	})
}

module.exports = routes