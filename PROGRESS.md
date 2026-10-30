# PROGRESS.md
# Log Progress Development Mingguan

> **Owner**: Agent B (Dev) | **Started**: 2026-10-29
> **Purpose**: Tracking development progress per minggu, sesuai milestone di `specs/03-features.json`

---

## 📊 Status Overview

- **Specs Version**: v1.0.2 (read from `specs/VERSION.txt`)
- **Total Stories**: 50 (39 Must, 11 Should)
- **Completed**: 0 / 50
- **In Progress**: 0
- **Blocked**: 0 (SCR-001 RESOLVED: Python tersedia. SCR-002 USER-APPROVED: SQLite fallback untuk sandbox, MySQL tetap production target — tunggu Agent A acknowledge di mailbox)

---

## 🗓️ Progress Log

### Minggu 1 — Project Setup & Database Design
> Target: Setup environment + 9 tabel MySQL ter-create via Alembic + seed data

| Story ID | Title | Status | Notes |
|---|---|---|---|
| - | Setup folder structure | ✅ Done | Workspace disambungkan ke GitHub repo (DEV-DECISION-001) |
| - | Setup Python venv + FastAPI stack | ✅ Done | Python 3.12.16 venv created di backend/venv/, 22+ deps terinstall (20 detik), semua importable (DEV-DECISION-003) |
| - | Setup Next.js + Tailwind + shadcn/ui | ✅ Done | Z.ai default dipertahankan: 48 shadcn/ui components + Next.js 16 + Tailwind 4 (DEV-DECISION-002) |
| - | Setup database (sandbox: SQLite, prod: MySQL) | ✅ Done | USER-APPROVED SQLite fallback (SCR-002). backend/.env switched to sqlite:///./moring_suksok_sandbox.db. MySQL string commented untuk production. User punya DB 'moring_suksok' di Laragon lokal. Smoke test PASSED (SQLite 3.53.1) |
| - | Setup SQLAlchemy models (9 tabel) | ✅ Done | 9 models sesuai specs/05-data-model.md §4. DB-agnostic (MySQL+SQLite). DEV-DECISION-004 |
| - | Setup Alembic + initial migration | ✅ Done | alembic init + custom env.py. Migration 448d5b9caa1e applied → 9 tabel + 6 indexes + 6 FKs ter-create di SQLite. DEV-DECISION-004 |
| - | Buat seed script | ✅ Done | backend/seed.py (idempotent). Run: python seed.py → 1 admin + 6 settings + 3 produk + 7 varian |
| - | Setup FastAPI app skeleton + CORS | ✅ Done | app/main.py: FastAPI + CORS + /health + /docs. 6 routes. DEV-DECISION-004 |
| - | Setup Next.js app skeleton | ✅ Done | Dev server jalan di port 3000, GET / 200 OK |
| - | Setup .env files | ✅ Done | backend/.env: 24 vars, JWT_SECRET 64 chars, DATABASE_URL=SQLite. Frontend .env.local belum (tunggu Step 4 frontend) |

**Milestone Check (akhir minggu)**:
- [x] Backend FastAPI jalan dengan Swagger UI di /docs ✅ (app/main.py ready, `uvicorn app.main:app --reload --port 8000`)
- [x] Frontend Next.js jalan dengan Tailwind ✅
- [x] 9 tabel ter-create di SQLite sandbox ✅ (admins, customers, products, product_variants, orders, order_items, payments, notifications, settings)
- [ ] 9 tabel ter-create di MySQL lokal user (user jalankan `alembic upgrade head` di mesinnya, DB 'moring_suksok' sudah dibuat di Laragon)
- [x] Seed data admin + produk contoh ✅ (1 admin + 6 settings + 3 produk + 7 varian)

**Catatan**: SCR-001 (Python) RESOLVED. SCR-002 (MySQL) USER-APPROVED dengan strategi dual-mode:
- Sandbox: SQLite (`sqlite:///./moring_suksok_sandbox.db`) untuk demo
- Production: MySQL (`mysql+pymysql://root:@localhost:3306/moring_suksok`) di Laragon user
- SQLAlchemy models DB-agnostic, cuma beda 1 line `DATABASE_URL` di `.env`
- Notifikasi prominent untuk Agent A sudah ditulis di DECISIONS-DEV.md (mohon acknowledge di mailbox specs/SPECS-UPDATE-NOTIFICATION.md)

Item tinggal: buat `app/main.py`, SQLAlchemy models (9 tabel), Alembic migration, seed script — semua akan dikerjakan di Step 5.

---

### Minggu 2 — Auth Module & Basic UI
> Target: Customer & admin bisa registrasi/login

| Story ID | Title | Status | Notes |
|---|---|---|---|
| E1-S8 | Password hashing bcrypt | ✅ Done | ISSUE-002 FIXED: switched passlib → direct bcrypt (12 rounds). verify_password compatible with old passlib hashes. 0 warnings |
| E1-S7 | JWT verification middleware | ✅ Done | app/api/deps.py: get_current_user, get_current_customer, get_current_admin. Bearer token via HTTPBearer. Role-based access control |
| E1-S1 | Registrasi customer baru | ✅ Done | POST /api/v1/auth/register — validation (email unique, password letter+number, phone 08/+62 format), returns JWT |
| E1-S2 | Pilih segmen customer | ✅ Done | customer_type field (retail/public) in register, validated via enum constraint |
| E1-S3 | Login customer | ✅ Done | POST /api/v1/auth/login — bcrypt verify, returns JWT + customer data |
| E1-S4 | Login admin terpisah | ✅ Done | POST /api/v1/auth/admin/login — separate endpoint, role=admin in JWT |
| E1-S5 | Logout | ✅ Done | POST /api/v1/auth/logout — stateless JWT (client discards token) |
| - | Auth: refresh token | ✅ Done | POST /api/v1/auth/refresh — generate new JWT with fresh expiry |
| - | Auth: get/update profile | ✅ Done | GET/PATCH /api/v1/auth/me — full profile CRUD |
| - | Frontend: halaman Register | ⏳ Pending | |
| - | Frontend: halaman Login | ⏳ Pending | |
| - | Frontend: layout dasar | ✅ Done | Landing page Moring Suksok (header+hero+produk+footer) sesuai specs/04-ui-guidelines.md §6.1. Theme Moring green aktif. DEV-DECISION-005 |
| - | Frontend: API client + JWT interceptor | ✅ Done | src/lib/api.ts: Axios 1.21.0 + request interceptor (JWT auto-attach) + response interceptor (401 auto-logout → /login) + sandbox gateway-aware (XTransformPort=8000) + apiClient typed helpers + tokenManager + formatIDR + formatDateID. DEV-DECISION-006 |
| - | Frontend: theme & PWA setup | ✅ Done | globals.css Moring green palette, tailwind.config.ts extended, Plus Jakarta Sans + JetBrains Mono fonts, manifest.json + icon.svg. Lint 0 errors |

**Milestone Check (akhir minggu)**:
- [x] Customer bisa registrasi & login ✅ (POST /auth/register, /auth/login tested)
- [x] Admin bisa login (separate endpoint) ✅ (POST /auth/admin/login tested)
- [x] JWT terverifikasi di setiap request ✅ (get_current_user dependency, 401 on missing/invalid token)

---

### Minggu 1 — SETUP COMPLETE ✅ (Step 1-9 selesai)

> **Status**: ALL 9 SETUP STEPS COMPLETED & VERIFIED (2026-10-30)
>
> Infrastructure siap untuk implementasi fitur (Minggu 2+: auth, products, cart, orders, payments).
>
> **Setup Verification Summary** (Step 9):
> - ✅ Git: workspace = GitHub repo rdjeee/moring-suksok, branch main, clean status
> - ✅ Backend: Python 3.12.16 venv + 22+ deps + FastAPI app skeleton + 9 SQLAlchemy models + Alembic migration applied + seed data
> - ✅ Frontend: Next.js 16 + 48 shadcn/ui + Moring green theme + Plus Jakarta Sans + Axios API client + landing page + PWA manifest
> - ✅ Database: SQLite sandbox (9 tables, 1 admin, 6 settings, 3 products, 7 variants) / MySQL production ready
> - ✅ Dev servers: Frontend HTTP 200 (port 3000) + Backend HTTP 200 (port 8000, start on-demand)
> - ✅ End-to-end: Frontend axios → backend FastAPI connection verified (404 on /products = endpoint not yet implemented, fallback data works)
> - ✅ Lint: 0 errors, 0 warnings
>
> **Deviasi dari spec** (documented in DECISIONS-DEV.md):
> - SCR-001: ✅ RESOLVED (Python tersedia, initial assumption salah)
> - SCR-002: ✅ USER-APPROVED (SQLite fallback sandbox, MySQL production)
> - Index names: idx_orders_status / idx_payments_status (DB-agnostic, SQLite compat)
> - Makefile: ISSUE-001 (spaces vs TABs) — SHARED-EDIT-REQUEST-001 ke Agent A
>
> **Next steps** (Minggu 2+):
> - Implement backend API endpoints per specs/06-api-contracts.md (auth, products, cart, orders, payments)
> - Build frontend pages (login, register, product detail, cart, checkout, payment, order tracking)
> - Admin dashboard (orders management, product CRUD, reports)
> - PWA service worker + push notification (Firebase)
> - QRIS dynamic generation
> - Deploy to production (Vercel + Railway)

---

### Minggu 3-8 — See `specs/00-vision.md` § 7 untuk detail

> Lanjutkan per minggu sesuai milestone di dokumen perencanaan Bab 12.

---

## 📈 Metrics (Update Mingguan)

| Metric | Value | Trend |
|---|---|---|
| Stories completed | 0 | - |
| Stories in progress | 0 | - |
| Stories blocked | 0 | - |
| Code coverage (backend) | 0% | - |
| Code coverage (frontend) | 0% | - |
| Open issues | 0 | - |
| Tests passed | 0 | - |

---

## 🚧 Blockers & Dependencies

> List hal-hal yang blocking progress, butuh input dari Agent A atau pihak lain

- (TBD — isi saat ada blocker)

---

## 📝 Notes untuk Agent A

> Pesan penting dari Agent B ke Agent A (clarifikasi, spec change requests, dll)

- (TBD)

---

**Last Updated**: 2026-10-29 (template initial)
