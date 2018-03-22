var sequelize = require('../db');
var Sequelize = require('sequelize')
var BasicStrategy = require('passport-http').BasicStrategy
var moment = require('moment')
var fs = require('fs')

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

function IndexController(app, passport) {

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
        .withMessage('cannot be null and must be date time type'),

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
        var body = req.body;

        console.log(body)
        var camera_id = body.camera_id
        var frametime = body.frametime
        var encoded_plate_image = body.encoded_plate_image
        var encoded_vehicle_image = body.encoded_vehicle_image
        var location = body.location
        var vehicle_plate = body.vehicle_plate

        Item.create({
            camera_id: body.camera_id,
            frametime: body.frametime,
            encoded_plate_image: body.encoded_plate_image,
            encoded_vehicle_image: body.encoded_vehicle_image,
            location: body.location,
            vehicle_plate: body.vehicle_plate,
        }).then(function(data) {
            
            return res.json({
                message: "Inserted"
            })
        })
    })

    app.get('/get_image', [
        check('camera_id')
        .withMessage('cannot be null or empty')
        .exists()
        .isNumeric(),

        check('from')
        .withMessage('cannot be null and must be valid date time format')
        .exists()
    ], function (req, res) {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.mapped()
            })
        } else {
            Item.findAll({
                where: {
                    camera_id: res.body.camera_id,
                    frametime: moment(res.body.from).toDate()
                }
            })
        }
        
    })

    function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }
}

module.exports = IndexController;