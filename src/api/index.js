export class ChatAPI {
  constructor(chatDelegate) {
    if (chatDelegate) {
      this.onReceiveMessage = chatDelegate.onReceiveMessage;
      this.onNewConnection = chatDelegate.onNewConnection;
      this.onDisconnect = chatDelegate.onDisconnect;
    }
  }

  connect() {
    this.socket = io();
    this.socket.on('message sent', this.onReceiveMessage);
    this.socket.on('connection', this.onNewConnection);
    this.socket.on('disconnect', this.onDisconnect);
    return this.socket.id; // May not be defined yet
  }

  sendMessage(recipient, message) {
    console.log("Message sent: ", recipient, message);
    this.socket.emit("message sent", recipient, message);
  }
}
