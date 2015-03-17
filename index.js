var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	ngrok = require('ngrok'),
	five = require("johnny-five"),
	board = new five.Board({repl: false});

board.on("ready", function () {

	var backward = new five.Led(4),
		right    = new five.Led(5),
		left     = new five.Led(6),
		forward  = new five.Led(7);

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});

	http.listen(3000, function () {
		ngrok.connect(3000, function (err, url) {
			console.log(url);
		});
	});

	io.on('connection', function (socket) {
		socket.on('left-on', function () { left.on(); });
		socket.on('left-off', function () { left.off(); });
		socket.on('forward-on', function () { forward.on(); });
		socket.on('forward-off', function () { forward.off(); });
		socket.on('right-on', function () { right.on(); });
		socket.on('right-off', function () { right.off(); });
		socket.on('backward-on', function () { backward.on(); });
		socket.on('backward-off', function () { backward.off(); });
	});
});
