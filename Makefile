WEBPACK := node_modules/webpack/bin/webpack.js
SASS := node_modules/node-sass/bin/node-sass
NODE := node_modules/node-dev/bin/node-dev

.PHONY: dev build

dev:
	$(WEBPACK) --watch & \
	$(NODE) server.js & \
	$(SASS) --watch src/styles/index.scss > build/react-chat-client.css; kill %1

build:
	@echo -n Building JS
	@$(WEBPACK) > /dev/null && echo " ✓"
	@echo -n Building CSS
	@$(SASS) src/styles/index.scss > build/react-chat-client.css && echo " ✓"
