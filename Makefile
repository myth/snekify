BIN = node_modules/.bin

all: install

install: build
	@if ! [ -e ./config.json ]; then \
		echo "[i] No previous config file, using example-config..."; \
		cp ./example-config.json config.json; \
	else \
		echo "[!] Existing configuration file detected, keeping it"; \
		cp ./example-config.json config.json.new; \
		echo "[i] New version of config file saved as 'config.json.new'"; \
	fi
	@echo "[i] Install complete"

test: build
	@echo "[i] Running tests..."
	@npm run test
	@echo "[i] Tests complete"

clean:
	@echo "[i] Clearing generated files..."
	rm -rf ./logs
	rm -rf ./public/js/snekify.min.js
	rm -rf ./public/css/snekify.min.css

prod:
	@echo "Setting up for production..."
	@echo "Fetching remote git tree and resetting..."
	@git fetch && git reset --hard origin/master
	@make clean
	@make install
	@echo "Snekify!"

dev: build
	@echo "[i] Starting development server..."
	@npm run watch

build: node_modules
	@echo "[i] Triggering build..."
	@npm run build
	@echo "[i] Build complete"

node_modules:
	@echo "[i] Fetching dependencies..."
	@npm install
	@echo "[i] Completed fetching dependencies"

.PHONY: test clean prod dev node_modules
