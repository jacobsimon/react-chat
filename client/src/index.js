import React from "react";
import ReactDOM from "react-dom";

import ChatClient from "./components/ChatClient.jsx";

export default ChatClient;

/**
 * Creates and renders a new ChatClient
 * @param {string} selector - A DOM selector to mount the component
 */
export function initialize(selector="#chat-container") {
  ReactDOM.render(
    React.createElement(ChatClient),
    document.querySelector(selector)
  );
}

// Attach exports to window for standalone use
window.ChatClient = ChatClient;
window.ChatClient.initialize = initialize;
