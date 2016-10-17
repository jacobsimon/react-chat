/**
 * ChatClient.jsx
 *
 * Copyright (c) 2016 Jacob Simon.
 */

import React from "react";

// Import components
import ChatPopup from "./ChatPopup.jsx";
import ChatSidebar from "./ChatSidebar.jsx";
import ChatAPI from "../api";

// Import styles
import "../styles/index.scss";

/** Defines a ChatClient component */
export default class ChatClient extends React.Component {
  constructor(props) {
    super(props);

    // Initial state
    this.state = {
      users: [],
      openChats: [],
      messageHistory: {},
      messagesTyped: {},
    };
    this.chats = {};

    // Bind class functions
    this.addUser = this.addUser.bind(this);
    this.setUserOffline = this.setUserOffline.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.openChat = this.openChat.bind(this);
    this.closeChat = this.closeChat.bind(this);

    // Initialize API with event callbacks
    this.API = new ChatAPI({
      onReceiveMessage: this.addMessage,
      onNewConnection: this.addUser,
      onDisconnect: this.setUserOffline,
    });

    this.API.connect();
  }

  /**
   * Add a new user to the chat list.
   * @param {object} user - A user object containing `username` and `id`
   */
  addUser(user) {
    const users = this.state.users.slice();
    user.online = true;
    users.push(user);
    this.setState({users});
  }

  /**
   * Set a user's status to offline.
   * @param {string} userID
   */
  setUserOffline(userID) {
    const user = Object.assign({}, this.getUser(userID), {online: false});
    const users = this.state.users.filter(u => u.id !== userID);
    users.push(user);
    this.setState({users});
  }

  /**
   * Get a user from the list
   * @param {string} userID
   * @returns {object|null}
   */
  getUser(userID) {
    const users = this.state.users.filter((u) => u.id === userID);
    return users.length ? users[0] : null;
  }

  /**
   * Adds a message to the chat history
   * @param {string} sender - the userID of the message's sender
   * @param {string} recipient - the userID of the message's recipient
   * @param {string} content - the message itself
   * @param {number} timestamp - the unix time of the message
   */
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

  /**
   * Update the current message being typed for a given chat
   * @param {string} chatID
   * @param {string} message
   */
  updateMessage(chatID, message) {
    const messagesTyped = this.state.messagesTyped;
    const newMessages = {};
    newMessages[chatID] = message;
    this.setState({messagesTyped: Object.assign({}, messagesTyped, newMessages)});
  }

  /**
   * Sends the current message typed out in the given chat
   * @param {string} chatID
   */
  sendMessage(chatID) {
    const message = this.state.messagesTyped[chatID];
    if (!message) return;
    this.API.sendMessage(chatID, message);
    this.addMessage(null, chatID, message, Date.now());
    this.updateMessage(chatID, "");
  }

  /**
   * Opens a chat popup for a given user
   * @param {string} userID
   */
  openChat(userID) {
    const chatIdx = this.state.openChats.indexOf(userID);
    const openChats = this.state.openChats.slice();

    if (chatIdx === -1) {
      openChats.push(userID);
    }

    const users = this.state.users.slice();
    const user = this.getUser(userID);
    user.minimized = false;

    this.setState({openChats, users}, () => {
      this.chats[userID].handleFocus();
    });
  }

  /**
   * Closes the chat popup for a given user
   * @param {string} userID
   */
  closeChat(userID) {
    const chatIdx = this.state.openChats.indexOf(userID);
    if (chatIdx == -1) return;
    const openChats = this.state.openChats.slice();
    openChats.splice(chatIdx, 1);
    this.setState({openChats});
  }

  /**
   * Minimizes/maximizes the chat popup for a given user
   * @param {string} userID
   */
  toggleChat(userID) {
    const user = this.getUser(userID);
    const users = this.state.users.slice();
    user.minimized = !user.minimized;
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
          ref={(chat) => {this.chats[userID] = chat;}}
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
