import React from "react";
import {findDOMNode} from "react-dom";

export default class ChatSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="chat-sidebar">
        <ul>
          {this.props.users.map((user, i) =>
            <li key={i}>
              <button onClick={() => this.props.onClickUser(user.id)}>
                <span className="chat-sidebar--username">{user.username}</span>
                <span className={`chat-status ${user.online ? "online" : "offline"}`}></span>
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

ChatSidebar.defaultProps = {
  users: [],
};

ChatSidebar.propTypes = {
  users: React.PropTypes.array,
  onClickUser: React.PropTypes.func,
}
