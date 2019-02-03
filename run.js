var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var port = 7845

var io = require('socket.io')(server);

app.use(express.static('scrolling_map'));
app.use(express.static('mcsnacks19/public'));

server.listen(process.env.PORT || port, function() {
	console.log(`Example app listening on port ${port}!`);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/mcsnacks19/index.html')));
app.get('/hi', (req, res) => res.send('Hello World!'));
app.get('/map', (req, res) => res.sendFile(path.join(__dirname+'/scrolling_map/map.html')));
app.get('/bowdoin', (req, res) => res.sendFile(path.join(__dirname+'/mcsnacks19/public/bowdoin.html')));
app.get('/govcenter', (req, res) => res.sendFile(path.join(__dirname+'/mcsnacks19/public/govcenter.html')));
app.get('/parkstreet', (req, res) => res.sendFile(path.join(__dirname+'/mcsnacks19/public/parkstreet.html')));

app.get('*', (req, res) => res.redirect('/map'));

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('bowdoin', function(msg){
		console.log('bowdoin: ' + msg);
	});
});
