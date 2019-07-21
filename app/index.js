var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 3000;

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/index.html');
//});
app.use('/', express.static(path.join(__dirname, 'public')));


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log(`listening on *:  ${http.address().address}:${port}`);
});