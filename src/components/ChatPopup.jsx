import React from "react";
import {findDOMNode} from "react-dom";

export default class ChatPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidMount() {
    const node = findDOMNode(this.refs.messageInput);
    if (node) {
      node.focus();
    }
  }

  handleFocus() {
    this.setState({focus: true});
  }

  handleBlur() {
    this.setState({focus: false});
  }

  handleClose(e) {
    e.stopPropagation();
    this.props.onClose();
  }

  handleSend(e) {
    e.preventDefault();
    this.props.onSend();
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
      <div className={`chat-popup ${this.props.minimized ? "minimized" : ""}`} style={this.props.style}
        onClick={this.handleFocus}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        <header className={this.state.focus ? "active" : ""} onClick={this.props.onMinimize}>
          <span className={`chat-status ${this.props.online ? "online" : "offline"}`}></span>
          <span>{this.props.name}</span>
          <span className="chat-popup--close" onClick={this.handleClose}>X</span>
        </header>
        {!this.props.minimized &&
          <div>
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
        }
      </div>
    );
  }
}

ChatPopup.defaultProps = {
  history: [],
  message: "",
  online: true,
};
