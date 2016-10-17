/**
 * index.js - react-chat-server
 * Copyright (c) 2016 Jacob Simon.
 */

/**
 * External dependencies
 */
const socketio = require("socket.io");
const debug = require("debug")("chat");

/**
 * Event types
 */
const events = {
  connection: "connection",
  disconnect: "disconnect",
  userDisconnect: "user disconnect",
  beganTyping: "began typing",
  stoppedTyping: "stopped typing",
  messageSent: "message sent",
  listUsers: "list users",
}

/**
 * Class representing a ChatServer
 */
class ChatServer {
  /**
   * Create a ChatServer.
   * @param {http.Server} server - A server instance to listen for chat requests
   */
  constructor(server) {
    this.server = server;
    this.io = socketio(server);
    this.userStore = {};
    this.userCount = 0;
    this.userFunc = this._defaultUserFunc;
  }

  /**
   * Initialize the ChatServer and begin handling events.
   */
  initialize() {
    debug("Initializing ChatServer");
    const io = this.io;
    io.use(this._userMiddleware());
    io.on(events.connection, (socket) => {
      this._handleNewUser(socket);
      socket.on(events.disconnect, this._handleDisconnect(socket));
      socket.on(events.messageSent, this._handleMessageSent(socket));
    });
  }

  /**
   * Initialize the ChatServer with an express-style middleware function.
   * @param {function} [userFunc] - An optional function that returns the details of a user
   * @returns {function} An express-style middleware function (Note: currently a no-op)
   */
  expressMiddleware(userFunc) {
    this.userFunc = userFunc || this._defaultUserFunc;
    this.initialize();
    return (req, res, next) => next();
  }

  /**
   * Handle a new user connecting to the server.
   * @param {socket} socket - The socket.io socket of the user
   */
  _handleNewUser(socket) {
    const userArray = Object.keys(this.userStore).map((u) => this.userStore[u]);
    const user = {username: socket.username, id: socket.userID};
    this.userStore[socket.id] = user;
    this.userCount++;

    debug(`New user connected: ${socket.username} (${socket.id})`);
    socket.broadcast.emit(events.connection, user);
    socket.emit(events.listUsers, userArray);
  }

  /**
   * Handle a user disconnecting from the server.
   * @param {socket} socket - The socket.io socket of the user
   * @returns {function} A function that handles disconnect events.
   */
  _handleDisconnect(socket) {
    return () => {
      debug(`User disconnected: ${socket.username} (${socket.id})`);
      delete this.userStore[socket.id];
      socket.broadcast.emit(events.userDisconnect, socket.id);
    };
  }

  /**
   * Handle a user who begins typing a message.
   * @param {socket} socket - The socket.io socket of the user
   * @returns {function} A function that handles beganTyping events.
   */
  _handleBeganTyping(socket) {
    throw Error("Not yet implemented");
  }

  /**
   * Handle a user who stops typing a message.
   * @param {socket} socket - The socket.io socket of the user
   * @returns {function} A function that handles stoppedTyping events.
   */
  _handleEndTyping(socket) {
    throw Error("Not yet implemented");
  }

  /**
   * Handle a user sending a message to another user.
   * @param {socket} socket - The socket.io socket of the user
   * @returns {function} A function that handles messageSent events.
   */
  _handleMessageSent(socket) {
    return (recipient, message) => {
      const sockets = this.io.sockets.sockets;
      const recSocket = sockets[recipient];
      if (!recSocket) return;

      debug(`Message sent: ${socket.username} (${socket.id}) to ${recSocket.username} (${recSocket.id})`);
      recSocket.emit(events.messageSent, socket.id, recipient, message, Date.now());
    };
  }

  /**
   * @returns {Object} A user object with default username, e.g. "User 42"
   */
  _defaultUserFunc() {
    return {username: `User ${this.userCount + 1}`};
  }

  /**
   * @returns {function} A function to be called with a socket before handling other events.
   */
  _userMiddleware() {
    return (socket, next) => {
      const user = this.userFunc(socket.request, socket.res);
      socket.username = user.username;
      socket.userID = user.id || socket.id;
      next();
    }
  }
};

module.exports = ChatServer;
