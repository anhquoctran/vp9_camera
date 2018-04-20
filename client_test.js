var socket =  require('socket.io-client')

socket.on('connect', function() {
    console.log("Connected to server")
})

socket.on('plate', function(plate) {
    console.log(JSON.stringify(plate))
})

socket.on('disconnect', function() {
    console.log("Connection disconnected")
})