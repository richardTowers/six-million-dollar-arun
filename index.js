var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	ngrok = require('ngrok'),
	five = require("johnny-five"),
	board = new five.Board({repl: false});

function Pin (id) {
	this.instance = new five.Pin(id);
}
Pin.prototype.pulse = function() {
	var highTime = 150,
		lowTime = 500;
	function setHigh () {
		this.instance.high();
		this.timeout = setTimeout(setLow.bind(this), highTime);
	}
	function setLow () {
		this.instance.low();
		this.timeout = setTimeout(setHigh.bind(this), lowTime);
	}
	if (typeof this.timeout !== 'undefined') {
		clearTimeout(this.timeout);
	}
	setHigh.call(this);
};
Pin.prototype.off = function() {
	if (typeof this.timeout !== 'undefined') {
		clearTimeout(this.timeout);
	}
	this.instance.low();
};

board.on("ready", function () {

	var backward = new Pin(4),
		right    = new Pin(5),
		left     = new Pin(6),
		forward  = new Pin(7);

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});

	http.listen(3000, function () {
		ngrok.connect(3000, function (err, url) {
			console.log(url);
		});
	});

	io.on('connection', function (socket) {
		socket.on('left-on', function () { left.pulse(); });
		socket.on('left-off', function () { left.off(); });
		socket.on('forward-on', function () { forward.pulse(); });
		socket.on('forward-off', function () { forward.off(); });
		socket.on('right-on', function () { right.pulse(); });
		socket.on('right-off', function () { right.off(); });
		socket.on('backward-on', function () { backward.pulse(); });
		socket.on('backward-off', function () { backward.off(); });
	});
});
