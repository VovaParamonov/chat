const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

let users = [];

app.use(express.static(__dirname + '/dist'));

let globalDate = new Date;
let logFileName = `messages_log_[${globalDate.getTime()}].txt`;
fs.writeFile(logFileName, `История сообщений от [${globalDate.getFullYear()}.${globalDate.getMonth()}.${globalDate.getDate()}  ${globalDate.getHours()}:${globalDate.getMinutes()}]`, function (err, data) {
});



io.on('connection', function (socket) {
    socket.emit('login', users.length+1);
    //console.log('a user connected, id=' + userIdCounter);
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
    socket.on('userLogin', function(type ,userName,userPassword, userColor){
        let err = false;
        users.forEach(function(elem){
            if (elem["name"] === userName) {
                err = true;
            }
        });
        if (err) {
            type = "login";
        } else {
            type = "Register";
        }

        if (type === "Register"){
            let err = false;
            users.forEach(function(elem){
               if (elem["name"] === userName) {
                   console.log("Попытка регистрации с занятым именем");
                   //socket.emit("login", users.length);
                   if (elem["password"] == userPassword){
                       console.log('Удачно');
                   } else {
                       console.log("Неудачно");
                       err = true;
                   }
               }
            });
            if (err) return false;
            let userId = users.length;
            users.push({"id":userId, "name": userName,"password":userPassword, "color":userColor});
            socket.emit('set settings', userName, userPassword, userColor);
            console.log("Регистрация нового пользователя: "+userId + " " + userName + " " +userPassword);
        } else {
            let err = false;
            users.forEach(function(elem){
                if (elem["name"] === userName) {
                    console.log("Попытка регистрации с занятым именем");
                    //socket.emit("login", users.length);
                    if (elem["password"] == userPassword){
                        console.log('Удачно');
                    } else {
                        console.log("Неудачно");
                        err = true;
                    }
                }
            });
            if (!err) {
                console.log('Авторизация пользователя пользователя: ' + userName);
                socket.emit("set settings", userName, userPassword, userColor);
            }
        }
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});