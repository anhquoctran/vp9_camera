var sequelize = require('../db');
var Sequelize = require('sequelize')
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

sequelize.sync({force: true}).then(function(err) {
    if(err) {
        console.log(err)
    } else {
        //handling success
    }
})

function IndexController(app) {

    //Handling index route
    app.get('/', function (req, res) {
        return res.json({
            message: "hello"
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
        var sql = "SELECT * FROM data_detect WHERE camera_id = ? and last_update from ? to ?"

        db.connect.query(sql, [], function (err, result) {
            if (err) {
                throw err
                res.status(500).send({
                    message: "ERROR_GET"
                })
            } else {
                res.json({
                    result: result
                })
            }
        })
    })
}

module.exports = IndexController;