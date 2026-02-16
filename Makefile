# ABOUTME: Project task runner for local development.
# ABOUTME: Provides shortcuts for dev server, build, test, and preview.

.PHONY: install dev build preview test test-watch clean

install: ## Install dependencies
	npm install

dev: ## Start dev server with hot reload
	npm run dev

build: ## Type-check and build for production
	npm run build

preview: build ## Build and preview the production site locally
	npm run preview

test: ## Run tests once
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

clean: ## Remove build artifacts
	rm -rf dist node_modules/.tmp

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
