const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const events = {
  connection: "connection",
  disconnect: "disconnect",
  userDisconnected: "user disconnect",
  beganTyping: "began typing",
  stoppedTyping: "stopped typing",
  messageSent: "message sent",
  listUsers: "list users",
}

function logEvent(type, socketID, content) {
  console.log(`Event: ${type} from ${socketID}${content ? ": " + content : ""}`);
}

const onlineUsers = {};
let userCount = 0;

io.on(events.connection, function(socket){
  logEvent(events.connection, socket.id);

  // Send list of online users to new user
  const userArray = Object.keys(onlineUsers).map(u => onlineUsers[u]);
  socket.emit(events.listUsers, userArray);

  // Create new user and broadcast to everyone else
  const user = {username: `User ${++userCount}`, id: socket.id};
  onlineUsers[socket.id] = user;
  socket.broadcast.emit(events.connection, user);

  socket.on(events.disconnect, () => {
    logEvent(events.disconnect, socket.id);
    delete onlineUsers[socket.id];
    socket.broadcast.emit(events.userDisconnected, socket.id);
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
    if (!recipientSocket) return;
    recipientSocket.emit(events.messageSent, socket.id, recipient, message, Date.now());
  });
});

app.use(express.static(__dirname + '/../build'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/users', function(req, res) {
  res.json(onlineUsers);
});

http.listen(3000, function(){
  console.log('Chat server up and running at localhost:3000');
});
