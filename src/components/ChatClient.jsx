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
    this.setUserOffline = this.setUserOffline.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.openChat = this.openChat.bind(this);

    this.API = new ChatAPI({
      onReceiveMessage: this.addMessage,
      onNewConnection: this.addUser,
      onDisconnect: this.setUserOffline,
    });
    this.API.connect();
  }

  addUser(user) {
    const users = this.state.users.slice();
    users.push(user);
    this.setState({users});
  }

  setUserOffline(userID) {
    console.log("user disconnect", userID)
    const user = Object.assign({}, this.getUser(userID), {offline: true});
    const users = this.state.users.filter(u => u.id !== userID);
    users.push(user);
    this.setState({users});
    console.log(this.state.users)
  }

  getUser(userID) {
    console.log("user id ", userID)
    const users = this.state.users.filter((u) => u.id === userID);
    return users.length ? users[0] : null;
  }

  addMessage(sender, recipient, content, timestamp) {
    const history = this.state.messageHistory;
    const newHistory = {};
    const chatID = (!sender) ? recipient : sender;
    const chat = history[chatID] ? history[chatID].slice() : [];
    chat.push({sender, recipient, content, timestamp});
    newHistory[chatID] = chat;

    const users = this.state.users.slice();
    const openChats = this.state.openChats.slice();

    if (sender) {
      if (!this.getUser(sender)) {
        users.push(sender);
      }
      if (this.state.openChats.indexOf(sender) == -1) {
        openChats.push(sender);
      }
    }

    this.setState({
      messageHistory: Object.assign({}, history, newHistory),
      openChats,
      users,
    });
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
      <li key={user.id} onClick={() => this.openChat(user.id)}>{user.username}</li>
    );

    const chatPopups = this.state.openChats.map((userID, i) => {
      const user = this.getUser(userID);
      return (
        <ChatPopup key={i} name={user.username}
          onType={(e) => this.updateMessage(userID, e.target.value)}
          onSend={(e) => this.sendMessage(e, userID)}
          message={this.state.messagesTyped[userID]}
          history={this.state.messageHistory[userID]}
          online={!user.offline}
        />);
    });

    return (
      <div>
        <ul>{usersList}</ul>
        {chatPopups}
      </div>
    );
  }
}
