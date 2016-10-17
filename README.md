# React Chat

A simple messaging app for your website, built with React and socket.io and inspired by Facebook Messenger.

### Installation

React Chat consists of two packages: `react-chat-client` and `react-chat-server`. You can install them with NPM:

```
npm install --save react-chat-client react-chat-server
```

### Getting started

To get started, use the client library in your front-end code. If you're writing a React application, you can import `ChatClient` and use it directly in your render function:

```js
import ChatClient from "react-chat-client";
...
render() {
  <ChatClient />
}
```

If you're not using React (or prefer not to modify your website), no problem! You can also use a standalone `<script>` at the end of your page. You'll need to host and serve the script, which is found in `build/react-chat-client.js`. You'll also need to create a `div` to which ChatClient can mount.

```html
<div id="chat-container"></div>
<script type="text/javascript" src="/path/to/react-chat-client.js" />
<script type="text/javascript">ChatClient.initialize()</script>
```

By default `ChatClient.initialize(selector)` will look for the `#chat-container` div unless given a custom selector.

#### Server

For convenience, the `react-chat-server` package provides a lightweight abstraction around a socket.io server and handles all of the chat events. You can also provide your own backend implementation if you need more flexibility.

It can be invoked in a middleware-style for easy integration with Express.js servers.

```js
const http = http.Server(app);
const ChatServer = require("react-chat-server");
const chat = new ChatServer(http);

app.use(chat.expressMiddleware());
```

You can customize the appearance of users by providing an optional user function `userFunc`, which is invoked with `req` and should return an object containing a `username` and/or `id`.

```js
app.use(chat.expressMiddleware(req => return {username: req.session.username}));
```

### Future improvements

* Customization options (colors, user images)
* Additional chat events (typing)
* Support swappable ChatAPI implementations
* General UI and usability improvements

If you'd like to use part of React Chat in your own project, feel free to fork this repository. Pull requests welcome!
