var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (client) {
    console.log('Client connected...');

    var interval = setInterval(() => {
        var temperature = updateTemperature(50, 30);
        var humidity = updateHumidity(100, 0);
        console.log("*-------------------*");
        console.log("Temperature:   " + temperature + "°C");
        console.log('Humidity:      ' + humidity + '%');
        console.log("*-------------------*\n");
        io.emit('temperature', temperature);
        io.emit('humidity', humidity);
    }, 2000);

    function updateTemperature(min, max) {
        return (Math.random() * (max - min) + min).toFixed(1);
    }

    function updateHumidity(min, max) {
        return (Math.random() * (max - min) + min).toFixed(0);
    }

    client.on('disconnect', function(data) {
        clearInterval(interval);
    }); 
});

server.listen(4200);