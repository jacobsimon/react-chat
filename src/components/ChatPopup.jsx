import React from "react";

export default class ChatPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const messageIsEmpty = (this.props.message == "");

    let messageHistory = this.props.history.map((msg, i) =>
      <li key={i}>{msg.content}</li>
    );

    return (
      <div className="chat-popup">
        <header>
          <span>{this.props.name}</span>
        </header>
        <div>
          <ul>{messageHistory}</ul>
        </div>
        <form>
          <input
            type="text"
            value={this.props.message}
            onChange={this.props.onType}
          />
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
  history: []
};
