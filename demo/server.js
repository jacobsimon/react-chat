const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const events = {
  connection: "connection",
  disconnect: "disconnect",
  beganTyping: "began typing",
  stoppedTyping: "stopped typing",
  messageSent: "message sent",
}

function logEvent(type, socketID, content) {
  console.log(`Event: ${type} from ${socketID}${content ? ": " + content : ""}`);
}

io.on(events.connection, function(socket){
  logEvent(events.connection, socket.id);
  socket.broadcast.emit(events.connection, socket.id);

  socket.on(events.disconnect, () => {
    logEvent(events.disconnect, socket.id);
  });

  socket.on(events.beganTyping, () => {
    logEvent(events.beganTyping, socket.id);
  });

  socket.on(events.stoppedTyping, () => {
    logEvent(events.stoppedTyping, socket.id);
  });

  socket.on(events.messageSent, (recipient, message) => {
    logEvent(events.messageSent, socket.id, message);

    recipientSocket = io.sockets.sockets[recipient];
    recipientSocket.emit(events.messageSent, socket.id, recipient, message, Date.now());
  });
});

app.use(express.static(__dirname + '/../build'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('Chat server up and running at localhost:3000');
});
