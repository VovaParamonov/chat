import $ from 'jquery';
import './css/style.css';

let socket = io();
// document.cookie = "name=; expires=-1";
// document.cookie = "color=; expires=-1";
//----------------------------------------------------DOM_letiables-----------------------------------------------------
let $input = $('#input');
let $window = $('.window');
let $msgsField = $('.messages_ul');
let $popupWrapper = $('.popupWrapper');
let $settings = $('.a_settings');
let $settingsInputName = $('.settings__name');
let $settingsInputPassword = $('.settings__password');
let $settingsInputColor = $('.settings__colors');
let $settingsSave = $('#formSend');
//======================================================================================================================
//----------------------------------------------------letiables---------------------------------------------------------
let writeTimer;
let tagName;
let userId = 0;
let userPassword = getCookie("password") || "none";
let userName = getCookie('name') || 'User';
let userColor = getCookie('color') || 'Default';
//----------------------------------------------------Socket_funcs------------------------------------------------------
socket.on('login', function (id) {
    let freeId = id;
    $popupWrapper.css({"display": "block"});
    if (getCookie('name')){
        socket.emit('userLogin', "login", userName, userPassword, userColor);
        alert(userName);
    } else {
        userId = freeId;
    }
});

socket.on('chat write', function (idOtherUser, nameOtherUser) {
    $window.children('.writeInfo').text(nameOtherUser + ' набирает сообщение...');
    clearTimeout(writeTimer);
    writeTimer = setTimeout(function () {
        $window.children('.writeInfo').text('');
    }, 1000);
});

socket.on('chat message', function (msg, idOtherUser, nameOtherUser, colorOtherUser, sendTime) {

    if (userId == idOtherUser) {
        tagName = '<li class="selfMessage" title="Отправлено: ' + sendTime + '">';
    } else {
        tagName = '<li title="Отправлено: ' + sendTime + '">';
    }

    $msgsField.prepend($(tagName).html('<span style="color: ' + colorOtherUser + '" class="userName">[' + nameOtherUser + ']:</span> ' + msg));
});

socket.on('set settings', function (name,password, color) {
    userName = name;
    userColor = color;
    userPassword = password;
    document.cookie = "password=" + password;
    document.cookie = "name=" + name;
    document.cookie = "color=" + color;
    $popupWrapper.css({"display": "none"});
});

function messageSend(msg) {
    socket.emit('chat message', msg, userId, userName, userColor);
    $input.val('');
}

//======================================================================================================================
//----------------------------------------------------DOM_handlers-------------------------------------------------------
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
    if (!$settingsInputName.val() || !$settingsInputPassword.val()) {
        alert("Введите имя");
    } else {
        socket.emit('userLogin',"Register", $settingsInputName.val(),$settingsInputPassword.val(), userColor);
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
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}