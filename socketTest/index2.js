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
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
	});
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
});

io.emit('some event', { for: 'everyone' });

io.on('connection', function(socket){
	setInterval(function () {
		var date = new Date()
		socket.emit('test','test' + date.valueOf());
	},20000)
});

http.listen(3151, function(){
	console.log('listening on *:3150');
	startInterval();
});

var x = 0;
function startInterval () {
	setInterval(function () {
		x++;
		io.emit('test', 'B - message'+x);
	}, 3000);
}
