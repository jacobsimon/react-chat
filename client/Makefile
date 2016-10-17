WEBPACK := node_modules/webpack/bin/webpack.js
SASS := node_modules/node-sass/bin/node-sass
NODE := node_modules/node-dev/bin/node-dev
MOCHA := node_modules/mocha/bin/mocha
MOCHA_OPTIONS := --compilers jsx:babel-register --recursive
TESTS := $(shell find test -name "*_test*")

.PHONY: clean dev test build $(TESTS)

clean:
	@rm -rf build/*

dev: clean
	@$(WEBPACK) --watch; kill %1

test:
	@NODE_ENV=test $(MOCHA) $(MOCHA_OPTIONS)

$(TESTS):
	@echo "Running tests for $@"
	@NODE_ENV=test $(MOCHA) $(MOCHA_OPTIONS) $@

build: clean
	@echo -n Building JS
	@$(WEBPACK) > /dev/null && echo " ✓"
	@echo -n Building CSS
	@$(SASS) src/styles/index.scss > build/react-chat-client.css && echo " ✓"
