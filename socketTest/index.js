var app = require('express')();
var http = require('http').Server(app);
var options = {
	path: '/socket.io', // this is the default path but can be changed to anything
}
var io = require('socket.io')(http, options);
const path = require('path')

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
});

function getTypeOf (value) {
	return Object.prototype.toString.call(value).slice(8, -1)
}

io.on('connection', function(socket){
	console.log('a user connected');
	// socket.join('testRoom')
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('a', function () {
		console.log('all message arguments:', ...[].slice.call(arguments))
		console.log('types', [].map.call(arguments, arg => getTypeOf(arg)))
	})
	socket.on('chat message', function(){
		console.log('message:', ...[].slice.call(arguments));
		io.emit('chat message', ...[].slice.call(arguments));
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
		// io.to('testRoom').emit('test', x);
		// io.emit('test', 'A - message'+x);
	}, 500);

	setInterval(function () {
		x++;
		io.emit('test2', true);
	}, 2000);

	setInterval(function () {
		x++;
		io.emit('test5', true);
	}, 5000);

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
	console.log('someone connected on /asd');
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		nsp.emit('chat message', msg);
	});
});
