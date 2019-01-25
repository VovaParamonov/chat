var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userIdCounter = 0;

app.get('/', function(req, res){
    res.sendfile(__dirname + '/dist/index.html');
});

io.emit('some event', { for: 'everyone' });


io.on('connection', function (socket) {

    io.emit('chat message', "server");
    userIdCounter++;
    socket.emit('setId', userIdCounter);
    console.log('a user connected, id='+ userIdCounter);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg, userId, userName){
        console.log('[user | '+userName+']message: ' + msg);

        io.emit('chat message', msg, userId, userName);
    });

    socket.broadcast.emit('hi');

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});