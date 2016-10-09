import React from "react";

import ChatPopup from "./ChatPopup.jsx";
import {ChatAPI} from "../api";

export default class ChatClient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageHistory: {},
      messagesTyped: {},
    };

    this.addMessage = this.addMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);

    this.API = new ChatAPI({onReceiveMessage: this.addMessage});
    this.API.connect();
  }

  addMessage(sender, recipient, content, timestamp) {
    const history = this.state.messageHistory;
    const newHistory = {};
    const conversationID = (!sender) ? recipient : sender;
    const conversation = history[conversationID] ? history[conversationID].slice() : [];
    conversation.push({sender, recipient, content, timestamp});
    newHistory[conversationID] = conversation;
    this.setState({messageHistory: Object.assign({}, history, newHistory)});
  }

  updateMessage(conversationID, message) {
    const messagesTyped = this.state.messagesTyped;
    const newMessages = {};
    newMessages[conversationID] = message;
    this.setState({messagesTyped: Object.assign({}, messagesTyped, newMessages)});
  }

  sendMessage(e, conversationID) {
    e.preventDefault();
    const message = this.state.messagesTyped[conversationID];
    if (!message) return;
    this.API.sendMessage(conversationID, message);
    this.addMessage(null, conversationID, message, Date.now());
    this.updateMessage(conversationID, "");
  }

  render() {
    const conversationID = "test";
    return (
      <div>
        <ChatPopup name="Test"
          onType={(e) => this.updateMessage(conversationID, e.target.value)}
          onSend={(e) => this.sendMessage(e, conversationID)}
          message={this.state.messagesTyped[conversationID]}
          history={this.state.messageHistory[conversationID]}
        />
      </div>
    );
  }
}
