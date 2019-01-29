import $ from 'jquery';
import './css/style.css';

var socket = io();
//----------------------------------------------------DOM_variables-----------------------------------------------------
var $input = $('#input');
var $window = $('.window');
var $msgsField = $('.messages_ul');
var $popupWrapper = $('.popupWrapper');
var $settings = $('.a_settings');
var $settingsInputName = $('.settings__name');
//======================================================================================================================
//----------------------------------------------------Variables---------------------------------------------------------
var writeTimer;
var tagName;
var userId = 0;
var userName = getCookie('name') || 'User';
var userColor = getCookie('color') || 'Default';
//----------------------------------------------------Socket_funcs------------------------------------------------------
socket.on('setId', function (id) {
    userId = id;
});

socket.on('chat write', function (idOtherUser, nameOtherUser) {
    $window.children('.writeInfo').text(nameOtherUser + ' набирает сообщение...');
    clearTimeout(writeTimer);
    writeTimer = setTimeout(function () {
        $window.children('.writeInfo').text('');
    }, 2000);
});

socket.on('chat message', function (msg, idOtherUser, nameOtherUser, colorOtherUser, sendTime) {

    if (userId == idOtherUser) {
        tagName = '<li class="selfMessage" title="Отправлено: ' + sendTime + '">';
    } else {
        tagName = '<li title="Отправлено: ' + sendTime + '">';
    }

    $msgsField.prepend($(tagName).html('<span style="color: ' + colorOtherUser + '" class="userName">[' + nameOtherUser + ']:</span> ' + msg));
});

function messageSend(msg) {
    socket.emit('chat message', msg, userId, userName, userColor);
    $input.val('');
}

//======================================================================================================================
//----------------------------------------------------DOM_handles-------------------------------------------------------
$settings.click(function () {
    $popupWrapper.css({"display": "block"});
    return false;
});

$popupWrapper.click(function (event) {
    if (event.target == this) {
        $popupWrapper.css({"display": "none"})
    }
});

$input.on('input change', function () {
    socket.emit('server write', userId, userName);
});

$('.settingsForm').submit(function (e) {
    e.preventDefault();
    if (!$settingsInputName.val()) {
        alert("Введите имя");
    } else {
        userName = $settingsInputName.val();
        document.cookie = "name=" + userName;
        document.cookie = "color=" + userColor;
        $popupWrapper.css({"display": "none"});
    }
});

$('.messageForm').submit(function (e) {
    e.preventDefault();
    messageSend($input.val());
    return false;
});

$('.a_Clear').click(function () {
    $('.messages_ul').html('');
    return false;
});

$('.radio-wrapper label').click(function () {
    userColor = $(this).attr('data-colorID');
});
//======================================================================================================================
//----------------------------------------------------Other_funcs-------------------------------------------------------
// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}