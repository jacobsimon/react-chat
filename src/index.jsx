import React from "react";
import ReactDOM from "react-dom";

import {ChatAPI} from "./api";

export class ChatClient extends React.Component {
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

  sendMessage() {
    if (!this.state.message) return;
    this.API.sendMessage(this.state.message);
    this.setState({message: ""});
  }

  render() {
    const messageIsEmpty = this.state.message == "";
    return (
      <div>
        <form>
          <input type="text" value={this.state.message} onChange={this.updateMessage} />
          <button type="submit" onClick={this.sendMessage} disabled={messageIsEmpty}>Send</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<ChatClient />, document.querySelector("#chat-container"));
