import React from "react";

import ChatPopup from "./ChatPopup.jsx";
import {ChatAPI} from "../api";

export default class ChatClient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      openChats: [],
      messageHistory: {},
      messagesTyped: {},
    };

    this.addUser = this.addUser.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.openChat = this.openChat.bind(this);

    this.API = new ChatAPI({
      onReceiveMessage: this.addMessage,
      onNewConnection: this.addUser,
    });
    this.API.connect();
  }

  addUser(userID) {
    const users = this.state.users.slice();
    users.push(userID);
    this.setState({users});
  }

  addMessage(sender, recipient, content, timestamp) {
    const history = this.state.messageHistory;
    const newHistory = {};
    const chatID = (!sender) ? recipient : sender;
    const chat = history[chatID] ? history[chatID].slice() : [];
    chat.push({sender, recipient, content, timestamp});
    newHistory[chatID] = chat;

    if (sender && this.state.users.indexOf(sender) == -1) {
      const users = this.state.users.slice();
      users.push(sender);

      const openChats = this.state.openChats.slice();
      if (this.state.openChats.indexOf(sender) == -1) openChats.push(sender);

      this.setState({users, openChats});
    }

    this.setState({messageHistory: Object.assign({}, history, newHistory)});
  }

  updateMessage(chatID, message) {
    const messagesTyped = this.state.messagesTyped;
    const newMessages = {};
    newMessages[chatID] = message;
    this.setState({messagesTyped: Object.assign({}, messagesTyped, newMessages)});
  }

  sendMessage(e, chatID) {
    e.preventDefault();
    const message = this.state.messagesTyped[chatID];
    if (!message) return;
    this.API.sendMessage(chatID, message);
    this.addMessage(null, chatID, message, Date.now());
    this.updateMessage(chatID, "");
  }

  openChat(user) {
    if (this.state.openChats.indexOf(user) > -1) return;
    const openChats = this.state.openChats.slice();
    openChats.push(user);
    this.setState({openChats});
  }

  render() {
    const usersList = this.state.users.map((user) =>
      <li key={user} onClick={() => this.openChat(user)}>{user}</li>
    );
    return (
      <div>
        <ul>{usersList}</ul>
        {this.state.openChats.map((chatID, i) =>
          <ChatPopup key={i} name={chatID}
            onType={(e) => this.updateMessage(chatID, e.target.value)}
            onSend={(e) => this.sendMessage(e, chatID)}
            message={this.state.messagesTyped[chatID]}
            history={this.state.messageHistory[chatID]}
          />
        )}
      </div>
    );
  }
}
