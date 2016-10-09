// import {events} from "../constants";

export class ChatAPI {
  connect() {
    this.socket = io();
    this.socket.on('message sent', (message) => {
      console.log("Message received: ", message);
    });
  }

  sendMessage(message) {
    console.log("Message sent: ", message);
    this.socket.emit("message sent", message);
  }
}
