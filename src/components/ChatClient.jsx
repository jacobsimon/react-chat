import React from "react";

import ChatPopup from "./ChatPopup.jsx";
import ChatSidebar from "./ChatSidebar.jsx";
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
    this.closeChat = this.closeChat.bind(this);

    this.API = new ChatAPI({
      onReceiveMessage: this.addMessage,
      onNewConnection: this.addUser,
      onDisconnect: this.setUserOffline,
    });
    this.API.connect();
  }

  addUser(user) {
    const users = this.state.users.slice();
    user.online = true;
    users.push(user);
    this.setState({users});
  }

  setUserOffline(userID) {
    console.log("user disconnect", userID)
    const user = Object.assign({}, this.getUser(userID), {online: false});
    const users = this.state.users.filter(u => u.id !== userID);
    users.push(user);
    this.setState({users});
  }

  getUser(userID) {
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

  sendMessage(chatID) {
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

  closeChat(user) {
    const chatIdx = this.state.openChats.indexOf(user);
    if (chatIdx == -1) return;
    const openChats = this.state.openChats.slice();
    openChats.splice(chatIdx, 1);
    this.setState({openChats});
  }

  toggleChat(userID) {
    const user = this.getUser(userID);
    const newUser = Object.assign({}, user, {minimized: !user.minimized});
    const users = this.state.users.filter(u => u.id !== userID);
    users.push(newUser);
    this.setState({users});
  }

  render() {
    const chatPopups = this.state.openChats.map((userID, i) => {
      const user = this.getUser(userID);
      const styles = {right: 250 + (275 * i) + 'px'}
      return (
        <ChatPopup key={i} name={user.username}
          onType={(e) => this.updateMessage(userID, e.target.value)}
          onSend={() => this.sendMessage(userID)}
          onClose={() => this.closeChat(userID)}
          onMinimize={() => this.toggleChat(userID)}
          message={this.state.messagesTyped[userID]}
          history={this.state.messageHistory[userID]}
          online={user.online}
          minimized={user.minimized}
          style={styles}
        />);
    });

    return (
      <div className="chat-client">
        <ChatSidebar users={this.state.users} onClickUser={this.openChat} />
        {chatPopups}
      </div>
    );
  }
}
