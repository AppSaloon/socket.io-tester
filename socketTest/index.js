var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('a', (msg) => {
		console.log(msg)
		console.log(Object.prototype.toString.apply(msg).slice(8, -1))
	})
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
});

http.listen(3150, function(){
	console.log('listening on *:3150');
	startIntervals();
});

var x = 0,
	y = 0,
	z = 0;
function startIntervals () {
	setInterval(function () {
		x++;
		io.emit('test', {message: x});
		// io.emit('test', 'A - message'+x);
	}, 500);

	setInterval(function () {
		x++;
		io.emit('test2', true);
	}, 2000);

	setInterval(function () {
		y++;
		nsp.emit('test', 'nsp - message'+x);
	}, 3000);

	setInterval(function () {
		z++;
		io.emit('testfast', z);
	}, 80);
}

var nsp = io.of('/asd');
nsp.on('connection', function(socket){
	console.log('someone connected');
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		nsp.emit('chat message', msg);
	});
});
