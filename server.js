var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 

var userCount = 0;
var firstMessage = false;
var chatData;

app.use(express.static(__dirname + '/public')); 
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client) {
	
	client.on('userJoined', function(username) {
		userCount++;
        if (firstMessage == false) {
            io.emit('message', "", username + " has joined the chat!" + "<br />" + "There are now " + userCount + " users in the chat.");
            chatData = username + " has joined the chat!" + "<br />" + "There are now " + userCount + " users in the chat.";
        }
        else {
            io.emit('message', chatData, username + " has joined the chat!" + "<br />" + "There are now " + userCount + " users in the chat.");
            chatData = chatData + "<br />" + username + " has left the chat..." + "<br />" + "There are now " + userCount + " users in the chat.";
        }
        firstMessage = true;
    });
	
	client.on('userLeft', function(username) {
		userCount--;
		io.emit('message', chatData, username + " has left the chat..." + "<br />" + "There are now " + userCount + " users in the chat.");
        chatData = chatData + "<br />" + username + " has left the chat..." + "<br />" + "There are now " + userCount + " users in the chat.";
    });
    
    /*client.on('messageSent', function(newData) {
        io.emit('message', chatData, newData);
        chatData = chatData + "<br />" + newData;
    });*/
    
    client.on('messageSent', function(newData) {
        io.emit('message', chatData, newData);
        chatData = chatData + "<br />" + newData;
    });
    
    client.on('userTyping', function(username) {
		io.emit('message', chatData, username + " is typing a message...");
    });
});

server.listen(3000, function(){
  console.log('listening on *:3000');
}); 