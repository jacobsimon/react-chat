const express = require('express');
const app = express();
const server = require('http').Server(app);

const ChatServer = require("../server");

const chat = new ChatServer(server);

app.use(express.static(__dirname + '/../client/build'));

app.use(chat.expressMiddleware());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Chat server up and running at localhost:3000');
});
