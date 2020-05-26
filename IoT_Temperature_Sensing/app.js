var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {
    console.log('Client connected...');
    client.on('join', function (data) {
        console.log(data);
    });
    
    var interval = setInterval(() => {
        var temperature = updateTemperature();
        var humidity = updateHumidity(humidity);
        console.log("Temperature: " + temperature + " degrés");
        console.log('Humidity: ' + humidity + '%');
        io.emit('temperature', temperature);
        io.emit('humidity', humidity);
    }, 2000);

    function updateTemperature() {
        return (Math.random() * (50 - 30) + 30).toFixed(1);
    }

    function updateHumidity() {
        return (Math.random() * (100 - 0) + 0).toFixed(0);
    }

    client.on('disconnect', function(data) {
        clearInterval(interval);
    }); 
});

io.on('disconnect', function () {
    console.log("JE APSSE LA")
    io.sockets.emit('user disconnected');
});
server.listen(4200);