import React from "react";
import {findDOMNode} from "react-dom";

export default class ChatPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    findDOMNode(this.refs.messageInput).focus();
  }

  render() {
    const messageIsEmpty = (this.props.message == "");

    let messageHistory = this.props.history.map((msg, i) =>
      <li key={i} className={`${msg.sender ? "received" : "sent"}`}>
        <span className="chat-popup--message">
          {msg.content}
        </span>
      </li>
    );

    return (
      <div className="chat-popup">
        <header>
          <span className={`chat-popup--status ${this.props.online ? "online" : "offline"}`}></span>
          <span>{this.props.name}</span>
        </header>
        <div className="chat-popup--messages">
          <ul>{messageHistory}</ul>
        </div>
        <form>
          <input
            type="text"
            value={this.props.message}
            onChange={this.props.onType}
            ref="messageInput"
          />
          {messageIsEmpty && <span className="chat-popup--placeholder">Type your message</span>}
          <button
            type="submit"
            onClick={this.props.onSend}
            disabled={messageIsEmpty}>
              Send
          </button>
        </form>
      </div>
    );
  }
}

ChatPopup.defaultProps = {
  history: [],
  message: "",
  online: true,
};
