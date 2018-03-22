var http = require('http');
var async = require('async')
var options = {
    host: 'localhost',
    path: '/add_image',
    port: 3000,
    method: 'POST',
    headers: headers
};

var bodyString = JSON.stringify({
    vehicle_plate: "30A-12345",
	camera_id: 145,
	frametime: new Date(),
	encoded_plate_image: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
	encoded_vehicle_image: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
	location: "HueIC"
});

var headers = {
    'Content-Type': 'application/json',
    'Content-Length': bodyString.length
};

function handleRequestWrapper(n, done) {
    console.log("Calling request", n);
    handleRequest(function(err) {
        done(err)
    })
}

function handleRequest(callback) {
    var req = http.request(options, function (response) {
        var str = ''

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk
        })

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            console.log(str)
            callback(str)
        });
    });
    req.write(bodyString)
    req.end()
}

async.timesSeries(10, handleRequestWrapper)