import React from "react";

import ChatPopup from "./ChatPopup.jsx";
import {ChatAPI} from "../api";

export default class ChatClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: ""};

    this.API = new ChatAPI();
    this.API.connect();

    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
  }

  updateMessage(e) {
    this.setState({message: e.target.value});
  }

  sendMessage(e) {
    e.preventDefault();
    if (!this.state.message) return;
    this.API.sendMessage(this.state.message);
    this.setState({message: ""});
  }

  render() {
    return (
      <div>
        <ChatPopup name="Test"
          onType={this.updateMessage}
          onSend={this.sendMessage}
          message={this.state.message}
        />
      </div>
    );
  }
}
