var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	ngrok = require('ngrok'),
	five = require("johnny-five"),
	board = new five.Board({repl: false});

board.on("ready", function () {

	var led = new five.Led(13);

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});

	http.listen(3000, function () {
		ngrok.connect(3000, function (err, url) {
			console.log(url);
		})
	});

	io.on('connection', function (socket) {
		socket.on('on', function () { led.on(); });
		socket.on('off', function () { led.off(); });
	});
});
