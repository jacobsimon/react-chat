import React from "react";
import ReactDOM from "react-dom";

import ChatClient from "./components/ChatClient.jsx";

export default ChatClient;

export function initialize(selector="#chat-container") {
  ReactDOM.render(
    React.createElement(ChatClient),
    document.querySelector(selector)
  );
}

initialize();
