WEBPACK := node_modules/webpack/bin/webpack.js
SASS := node_modules/node-sass/bin/node-sass
NODE := node_modules/node-dev/bin/node-dev

dev:
	$(WEBPACK) & $(NODE) server.js & $(SASS) --watch src/styles/index.scss > build/react-chat-client.css
