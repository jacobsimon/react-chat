// import {events} from "../constants";

export class ChatAPI {
  constructor(chatDelegate) {
    if (chatDelegate) {
      this.onReceiveMessage = chatDelegate.onReceiveMessage;
    }
  }

  connect() {
    this.socket = io();
    this.socket.on('message sent', this.onReceiveMessage);
    return this.socket.id; // May not be defined yet
  }

  sendMessage(recipient, message) {
    console.log("Message sent: ", recipient, message);
    this.socket.emit("message sent", recipient, message);
  }
}
