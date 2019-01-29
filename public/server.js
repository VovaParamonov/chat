const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static(__dirname + '/dist'));

var globalDate = new Date;
var logFileName = `messages_log_[${globalDate.getTime()}].txt`;
fs.writeFile(logFileName, `История сообщений от [${globalDate.getFullYear()}.${globalDate.getMonth()}.${globalDate.getDate()}  ${globalDate.getHours()}:${globalDate.getMinutes()}]`, function (err, data) {
});

var userIdCounter = 0;

app.get('/', function (req, res) {
    //res.sendfile(__dirname + '/dist/index.html');
    //res.send('<h1>Главная страница!</h1>');
});


io.on('connection', function (socket) {

    userIdCounter++;
    socket.emit('setId', userIdCounter);
    console.log('a user connected, id=' + userIdCounter);
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('server write', function (userId, userName) {
        io.emit('chat write', userId, userName);
    });
    socket.on('chat message', function (msg, userId, userName, userColor) {
        let date = new Date;
        console.log('[user | ' + userName + ']message: ' + msg);
        fs.appendFile(logFileName, '\n[user | ' + userName + ']: ' + msg, function (err, dat) {
        });

        io.emit('chat message', msg, userId, userName, userColor, '' + date.getHours() + ':' + date.getMinutes());
    });

    socket.broadcast.emit('hi');

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});