install:
	npm ci

develop:
	npx vite

build:
	NODE_ENV=production npx vite build

test:
	npm test

lint:
	npx eslint . --fix

.PHONY: install develop build test lint