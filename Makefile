# =============================================================================
# Moring Suksok — Makefile
# Shortcut commands untuk development workflow
# =============================================================================
#
# Usage:
#   make help              # Tampilkan semua command tersedia
#   make setup             # Setup pertama kali (install deps + db)
#   make dev               # Jalankan 3 services paralel (frontend + backend + db)
#   make dev-docker        # Jalankan semua via docker-compose
#   make migrate           # Run Alembic migration
#   make seed              # Seed database dengan data awal
#   make test              # Run semua tests (backend + frontend)
#   make lint              # Linting code
#   make build             # Build production
#   make clean             # Hapus artifacts (node_modules, venv, .next, dll)
#
# =============================================================================

# Variables
PYTHON := python3
VENV := backend/venv
VENV_PY := $(VENV)/bin/python
VENV_PIP := $(VENV)/bin/pip
NODE_VERSION := node
NPM := npm

.DEFAULT_GOAL := help

# =============================================================================
# Help
# =============================================================================
.PHONY: help
help: ## Tampilkan semua command yang tersedia
	@echo ""
	@echo "🌿 Moring Suksok — Development Commands"
	@echo "============================================="
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} \
	  /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "Workflow Quick Start:"
	@echo "  1. make setup       # First time setup"
	@echo "  2. make dev         # Start development (3 services)"
	@echo "  3. make test        # Run all tests"
	@echo ""

# =============================================================================
# Setup & Installation
# =============================================================================
.PHONY: setup setup-backend setup-frontend setup-db
setup: setup-backend setup-frontend setup-db ## Setup pertama kali (install deps + db)

setup-backend: ## Setup Python venv + install deps
	@echo "🐍 Setting up Python backend..."
	cd backend && \
		$(PYTHON) -m venv venv && \
		$(VENV_PIP) install --upgrade pip && \
		$(VENV_PIP) install -r requirements.txt
	@echo "✅ Backend setup done"

setup-frontend: ## Install Node.js dependencies (frontend at root via Z.ai Full-Stack)
	@echo "📦 Setting up Next.js frontend (root level)..."
	$(NPM) install
	@echo "✅ Frontend setup done"

setup-db: ## Setup MySQL database via Laragon (dev) atau docker-compose
	@echo "🗄️  Setting up MySQL database..."
	@echo "   Pastikan MySQL running (Laragon atau docker-compose up -d db)"
	@echo "   Buka phpMyAdmin: http://localhost/phpmyadmin"
	@echo "   Buat database: moring_suksok (collation: utf8mb4_unicode_ci)"
	@echo ""
	@echo "   Lalu run: make migrate && make seed"
	@echo "✅ Database setup instructions shown"

# =============================================================================
# Development
# =============================================================================
.PHONY: dev dev-frontend dev-backend dev-docker
dev: dev-backend dev-frontend ## Jalankan backend & frontend paralel (dev mode)

dev-backend: ## Jalankan FastAPI backend di port 8000
	@echo "🚀 Starting backend (FastAPI) on http://localhost:8000 ..."
	cd backend && \
		$(VENV_PY) -m uvicorn app.main:app --reload --port 8000

dev-frontend: ## Jalankan Next.js frontend di port 3000 (frontend at root)
	@echo "🚀 Starting frontend (Next.js) on http://localhost:3000 ..."
	$(NPM) run dev

dev-docker: ## Jalankan semua services via docker-compose
	@echo "🐳 Starting all services via docker-compose..."
	docker-compose up -d
	@echo ""
	@echo "📊 Services running:"
	@echo "   Frontend:  http://localhost:3000"
	@echo "   Backend:   http://localhost:8000"
	@echo "   Swagger:   http://localhost:8000/docs"
	@echo "   phpMyAdmin: http://localhost:8081"
	@echo "   MySQL:     localhost:3306"
	@echo ""
	@echo "📋 Logs: docker-compose logs -f"
	@echo "🛑 Stop: docker-compose down"

# =============================================================================
# Database Operations
# =============================================================================
.PHONY: migrate migrate-create migrate-rollback db-reset seed db-shell
migrate: ## Run Alembic migration (upgrade head)
	@echo "🗄️  Running database migration..."
	cd backend && $(VENV_PY) -m alembic upgrade head
	@echo "✅ Migration done"

migrate-create: ## Create new migration. Usage: make migrate-create m="add table X"
	@test -n "$(m)" || (echo "Usage: make migrate-create m=\"description here\"" && exit 1)
	@echo "📝 Creating migration: $(m)..."
	cd backend && $(VENV_PY) -m alembic revision --autogenerate -m "$(m)"
	@echo "✅ Migration created. Review di backend/alembic/versions/"

migrate-rollback: ## Rollback 1 migration step
	@echo "⏮️  Rolling back 1 migration..."
	cd backend && $(VENV_PY) -m alembic downgrade -1
	@echo "✅ Rollback done"

db-reset: ## Reset database (downgrade base, then upgrade head)
	@echo "⚠️  RESETTING DATABASE — all data will be lost!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	cd backend && \
		$(VENV_PY) -m alembic downgrade base && \
		$(VENV_PY) -m alembic upgrade head
	@echo "✅ Database reset done. Run 'make seed' to insert seed data."

seed: ## Seed database dengan data awal (admin + produk contoh + settings)
	@echo "🌱 Seeding database..."
	cd backend && $(VENV_PY) seed.py
	@echo "✅ Seed done. Login admin:"
	@echo "   Email:    admin@moring-suksok.com"
	@echo "   Password: admin123"
	@echo "   ⚠️  CHANGE PASSWORD SEGERA di production!"

db-shell: ## Buka MySQL shell (interaktif)
	@echo "🖥️  Opening MySQL shell..."
	mysql -u root -p moring_suksok

# =============================================================================
# Testing
# =============================================================================
.PHONY: test test-backend test-frontend test-coverage
test: test-backend test-frontend ## Run semua tests

test-backend: ## Run backend tests (pytest)
	@echo "🧪 Running backend tests..."
	cd backend && $(VENV_PY) -m pytest tests/ -v --cov=app --cov-report=term-missing

test-frontend: ## Run frontend tests (jest/vitest)
	@echo "🧪 Running frontend tests..."
	$(NPM) test

test-coverage: ## Generate coverage report (backend + frontend)
	@echo "📊 Generating coverage reports..."
	cd backend && $(VENV_PY) -m pytest tests/ --cov=app --cov-report=html
	$(NPM) run test:coverage
	@echo "✅ Coverage reports:"
	@echo "   Backend:  backend/htmlcov/index.html"
	@echo "   Frontend: coverage/index.html"

# =============================================================================
# Code Quality
# =============================================================================
.PHONY: lint lint-backend lint-frontend format format-check
lint: lint-backend lint-frontend ## Run linters (backend + frontend)

lint-backend: ## Lint backend Python code (ruff + black)
	@echo "🔍 Linting backend..."
	cd backend && \
		$(VENV_PY) -m ruff check app/ && \
		$(VENV_PY) -m black --check app/

lint-frontend: ## Lint frontend TypeScript code (eslint)
	@echo "🔍 Linting frontend..."
	$(NPM) run lint

format: ## Auto-format code (black + eslint --fix)
	@echo "✨ Formatting backend..."
	cd backend && $(VENV_PY) -m black app/ && $(VENV_PY) -m ruff check app/ --fix
	@echo "✨ Formatting frontend..."
	$(NPM) run lint:fix

format-check: ## Check format tanpa modify
	cd backend && $(VENV_PY) -m black --check app/
	$(NPM) run lint

# =============================================================================
# Build & Production
# =============================================================================
.PHONY: build build-frontend build-backend
build: build-backend build-frontend ## Build untuk production

build-frontend: ## Build Next.js untuk production (frontend at root)
	@echo "🏗️  Building frontend..."
	$(NPM) run build

build-backend: ## Build backend Docker image
	@echo "🏗️  Building backend Docker image..."
	cd backend && docker build -t moringsuksok-backend:latest .

# =============================================================================
# PWA & Deployment
# =============================================================================
.PHONY: openapi export-openapi
openapi: export-openapi ## Export OpenAPI schema dari FastAPI ke docs/

export-openapi: ## Generate docs/api-openapi.json dari FastAPI
	@echo "📄 Exporting OpenAPI schema..."
	cd backend && $(VENV_PY) -c "import json; from app.main import app; print(json.dumps(app.openapi(), indent=2))" > ../docs/api-openapi.json
	@echo "✅ OpenAPI schema: docs/api-openapi.json"
	@echo "   Import ke Postman: Import → File → docs/api-openapi.json"

# =============================================================================
# Cleanup
# =============================================================================
.PHONY: clean clean-all clean-docker
clean: ## Hapus build artifacts (.next, __pycache__, dll)
	@echo "🧹 Cleaning build artifacts..."
	find backend -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find backend -type f -name "*.pyc" -delete 2>/dev/null || true
	rm -rf .next 2>/dev/null || true
	rm -rf coverage 2>/dev/null || true
	rm -rf backend/htmlcov 2>/dev/null || true
	rm -rf backend/.pytest_cache 2>/dev/null || true
	@echo "✅ Clean done"

clean-all: clean ## Bersih-bersih total (termasuk node_modules & venv)
	@echo "⚠️  CLEANING EVERYTHING (will need to re-install deps)..."
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	rm -rf node_modules 2>/dev/null || true
	rm -rf backend/venv 2>/dev/null || true
	@echo "✅ All cleaned. Run 'make setup' to re-install dependencies."

clean-docker: ## Stop & hapus semua Docker containers/volumes
	@echo "🐳 Cleaning Docker resources..."
	docker-compose down -v --remove-orphans
	docker system prune -f
	@echo "✅ Docker cleaned"

# =============================================================================
# Documentation
# =============================================================================
.PHONY: docs docs-serve
docs: export-openapi ## Generate documentation artifacts
	@echo "📚 Documentation generated:"
	@echo "   - docs/api-openapi.json (auto-generated)"
	@echo "   - specs/SPECS-UPDATE-NOTIFICATION.md (mailbox)"
	@echo "   - Open Swagger UI: http://localhost:8000/docs (setelah backend jalan)"

docs-serve: ## Buka Swagger UI di browser (backend harus jalan)
	@echo "🌐 Opening Swagger UI..."
	@if command -v xdg-open > /dev/null; then xdg-open http://localhost:8000/docs; \
	 elif command -v open > /dev/null; then open http://localhost:8000/docs; \
	 else echo "   Buka manual: http://localhost:8000/docs"; fi

# =============================================================================
# Utilities
# =============================================================================
.PHONY: git-status git-log tree
git-status: ## Tampilkan git status + log 5 commit terbaru
	@git status -sb
	@echo ""
	@echo "Last 5 commits:"
	@git log --oneline -5

git-log: ## Tampilkan git log dengan graph
	@git log --graph --oneline --decorate --all -20

tree: ## Tampilkan struktur folder (exclude node_modules, venv, dll)
	@find . -type f -o -type d | grep -vE 'node_modules|__pycache__|\.git|venv|\.next|htmlcov|\.pytest_cache' | sort | head -50

# =============================================================================
# Quick Aliases (untuk yang sering dipakai)
# =============================================================================
.PHONY: up down restart logs ps
up: dev-docker ## Alias: jalankan via docker-compose
down: ## Alias: stop docker-compose
	docker-compose down
restart: ## Restart semua services
	docker-compose restart
logs: ## Tail logs dari semua services
	docker-compose logs -f
ps: ## List running docker services
	docker-compose ps
