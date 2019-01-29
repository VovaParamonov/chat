import $ from 'jquery';
import './css/style.css';


var socket = io();
//==========================DOM_variables=================================
var $input = $('#input');
var $msgsField = $('.messages_ul');
var $popupWrapper = $('.popupWrapper');

//==========================variables======================================
var tagName;
var userId = 0;
var userName = 'User';
var userColor = 'Default';



//-------------------------socket_funcs------------------------------------
socket.on('setId', function (id) {
    userId = id;
});

socket.on('chat message', function (msg, idOtherUser, nameOtherUser) {

    if (userId == idOtherUser) {
        tagName = '<li class="selfMessage">';
    } else {
        tagName = '<li>';
    }

    $msgsField.append($(tagName).html('<span class="userName">[' + nameOtherUser + ']:</span> ' + msg));
});
//========================================================================
//--------------------------------------DOM_handles-----------------------
$('.a_settings').click(function () {
    $popupWrapper.css({"display": "block"});
    return false;
});

$popupWrapper.click(function (event) {
    if (event.target == this) {
        $popupWrapper.css({"display": "none"})
    }
});


$('.settingsForm').submit(function (e) {
    e.preventDefault();
    userName = $('.settings__name').val();
    $popupWrapper.css({"display": "none"})
});

$('.messageForm').submit(function (e) {
    e.preventDefault();
    socket.emit('chat message', $input.val(), userId, userName);
    $input.val('');
    return false;
});

$('.a_Clear').click(function () {
    $('.messages_ul').html('');
    return false;
});

$('.radio-wrapper label').click(function () {
    alert("Работает");
});
//==============================================================================