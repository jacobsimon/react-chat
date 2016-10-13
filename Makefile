WEBPACK := node_modules/webpack/bin/webpack.js
SASS := node_modules/node-sass/bin/node-sass
NODE := node_modules/node-dev/bin/node-dev

.PHONY: clean dev build

clean:
	@rm -rf build/*

dev: clean
	@echo "Starting development server"
	@$(WEBPACK) --watch & \
	$(NODE) demo/server.js; kill %1

build: clean
	@echo -n Building JS
	@$(WEBPACK) > /dev/null && echo " ✓"
	@echo -n Building CSS
	@$(SASS) src/styles/index.scss > build/react-chat-client.css && echo " ✓"
