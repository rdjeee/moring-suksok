# CHANGELOG
# Tracking Perubahan Specs Files

> **Spec Owner**: Agent A (Planning) | **Last Updated**: 2026-10-29

---

Semua perubahan signifikan pada files di `specs/` akan didokumentasikan di sini. Format mengikuti [Keep a Changelog](https://keepachangelog.com/), dan versioning mengikuti [Semantic Versioning](https://semver.org/).

- **MAJOR** (X.0.0): Breaking change — spec tidak backward compatible
- **MINOR** (1.X.0): New feature — spec ditambah tanpa breaking
- **PATCH** (1.0.X): Bug fix / typo / clarifikasi

---

## [Unreleased]

### Added
- (Reserved untuk perubahan yang akan datang)

---

## [1.0.1] — 2026-10-29

### Infrastructure Update — Dev Experience Improvements

#### Added
- `specs/SPECS-UPDATE-NOTIFICATION.md` — Mailbox antar agent A ↔ B (krusial karena sandbox terpisah)
- `docker-compose.yml` — Orchestration frontend + backend + MySQL + phpMyAdmin (1 command up)
- `Makefile` — Shortcut commands (`make dev`, `make migrate`, `make seed`, `make test`, `make lint`, dll)
- `.env.example` (root) — Template environment variables shared
- `frontend/.env.example` — Frontend-specific env vars (Firebase, API URL, dll)
- `backend/.env.example` — Backend-specific env vars (DB, JWT, Cloudinary, FCM, dll)
- `backend/requirements.txt` — Complete Python dependencies (FastAPI, SQLAlchemy, Alembic, ReportLab, dll)
- `backend/pyproject.toml` — Tooling config (ruff, black, mypy, pytest)
- `backend/tests/` folder structure — Separated unit/integration/e2e tests
- `backend/tests/README.md` — Test strategy & coverage targets
- `docs/api-openapi.json` — Placeholder (akan di-auto-generate dari FastAPI via `make openapi`)

#### Repository Structure (Updated)
```
MoringSuksok/
├── specs/                              ← 🤖 ZONE AGENT A
│   ├── ... (9 spec files + 3 ADR + CHANGELOG + VERSION)
│   └── SPECS-UPDATE-NOTIFICATION.md   ← NEW: mailbox antar agent
├── frontend/
│   ├── .env.example                    ← NEW: frontend env template
│   ├── src/, public/, tests/
├── backend/
│   ├── .env.example                    ← NEW: backend env template
│   ├── requirements.txt                ← NEW: Python dependencies
│   ├── pyproject.toml                  ← NEW: tooling config
│   ├── tests/                          ← NEW: separated tests folder
│   │   ├── README.md                   ← NEW: test strategy
│   │   ├── unit/, integration/, e2e/
│   └── alembic/, app/
├── docs/
│   ├── api-openapi.json                ← NEW: placeholder (auto-gen)
│   └── screenshots/
├── docker-compose.yml                  ← NEW: orchestration
├── Makefile                            ← NEW: shortcut commands
├── .env.example                        ← NEW: root env template
├── .gitignore
├── README.md
├── PROGRESS.md, DECISIONS-DEV.md, MIGRATION-NOTES.md, KNOWN-ISSUES.md
```

#### Developer Experience Improvements
- **1-command setup**: `make setup` (install deps frontend + backend + setup DB instructions)
- **1-command dev**: `make dev` (frontend + backend paralel) atau `make dev-docker` (all via Docker)
- **1-command migrate**: `make migrate` (run Alembic upgrade head)
- **1-command seed**: `make seed` (insert admin + produk contoh + settings)
- **1-command test**: `make test` (run pytest + jest)
- **1-command lint**: `make lint` (ruff + eslint)

### Migration Guide dari v1.0.0 → v1.0.1

Agent B yang sudah baca v1.0.0:
1. Tidak ada breaking change di specs (semua spec content tetap sama)
2. Hanya tambah infrastructure files (`.env.example`, `Makefile`, `docker-compose.yml`, dll)
3. WAJIB baca `Makefile` untuk lihat semua shortcut commands yang tersedia
4. WAJIB copy `.env.example` → `.env` di root, frontend, dan backend, lalu isi credentials
5. WAJIB install backend Python deps: `cd backend && pip install -r requirements.txt`
6. Disarankan pakai `docker-compose up -d` untuk menjalankan semua services (frontend + backend + MySQL + phpMyAdmin)

---

## [1.0.0] — 2026-10-29

### Initial Release — Baseline Specs untuk Development

**Specs files created**:

#### Added
- `specs/00-vision.md` — Executive summary, profil mitra, tujuan & manfaat sistem
- `specs/01-requirements.md` — Latar belakang, rumusan masalah, functional requirements, scope & batasan, user roles
- `specs/02-architecture.md` — Diagram arsitektur decoupled, komponen detail, alur komunikasi, pola keamanan, deployment scheme
- `specs/03-features.json` — 7 Epic, 50 user stories (39 must, 11 should), dengan dependency graph & estimates
- `specs/04-ui-guidelines.md` — Color palette, typography, components, layout patterns, accessibility
- `specs/05-data-model.md` — ERD, 9 tabel SQL DDL, index strategy, seed data, SQLAlchemy models reference
- `specs/06-api-contracts.md` — 8 modul endpoint (auth, products, cart, orders, payments, notifications, settings, reports) dengan request/response examples
- `specs/07-user-flows.md` — Customer flow (5), owner flow (5), state machine status pesanan, notifikasi trigger mapping
- `specs/08-acceptance-criteria.md` — AC per story (Given-When-Then format), cross-epic AC (performance, security, compatibility, accessibility)

#### Architecture Decision Records (ADRs)
- `specs/decisions/ADR-001-tech-stack.md` — Pemilihan Python FastAPI + Next.js PWA + MySQL + SQLAlchemy
- `specs/decisions/ADR-002-qris-self-generated.md` — Pemilihan QRIS self-generated (tanpa payment gateway)
- `specs/decisions/ADR-003-decoupled-architecture.md` — Pemilihan arsitektur decoupled (frontend-backend terpisah)

#### Meta Files
- `specs/VERSION.txt` — v1.0.0
- `specs/CHANGELOG.md` (this file)

### Context
- Dokumen perencanaan asli (`Dokumen_Perencanaan_Moring_Suksok.md`, 2.668 baris) telah di-split menjadi 9 spec files terstruktur untuk memudahkan handover ke Agent B (Dev).
- Spec files ini menjadi **single source of truth** untuk development.
- Setiap spec file memiliki ownership jelas (Agent A) dan tidak boleh diedit oleh Agent B langsung (lihat `README.md` workflow).

### Key Decisions Locked In
1. **Tech Stack**: Next.js 14+ PWA + Python FastAPI + MySQL + SQLAlchemy + Alembic
2. **Payment**: QRIS self-generated (no Midtrans/gateway), upload bukti + owner verifikasi manual
3. **Notification**: Hybrid — PWA Push (FCM) primary + WhatsApp deep link (wa.me) backup
4. **Customer Auth**: Wajib registrasi (no guest checkout)
5. **Customer Segmen**: Label Ritel/Masyarakat untuk analisis (no price difference)
6. **Architecture**: Decoupled (frontend-backend terpisah)
7. **Timeline**: 8 minggu development + 1 minggu buffer

### Out-of-Scope Explicitly Documented
- Native Android/iOS app (cukup PWA)
- Midtrans/payment gateway integration
- WhatsApp Business API otomatis (cukup wa.me)
- Loyalty program, wishlist, review produk, multi-vendor
- Auto-calculate ongkir (RajaOngkir/Binderbyte)
- Inventory management advanced
- Multi-admin, multi-currency, multi-language
- Live chat, coupon system

### Statistics
- Total spec files: 9 + 3 ADR + 2 meta = 14 files
- Total user stories: 50 (39 Must, 11 Should)
- Total estimated development hours: 285 hours
- Estimated weeks at 20hr/week: ~14 weeks (akan dilakukan dengan paralel + buffer)
- Acceptance criteria: 60+ scenarios in Given-When-Then format

---

## Template untuk Future Changelog Entries

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- New feature/file yang ditambahkan

### Changed
- Perubahan pada existing spec (jelaskan what & why)

### Deprecated
- Feature yang akan dihapus di versi mendatang

### Removed
- Feature yang sudah dihapus

### Fixed
- Bug fix / typo / clarifikasi

### Breaking Changes
- Perubahan yang tidak backward compatible (wajib MAJOR version bump)

### Context
- Latar belakang kenapa perubahan ini dibuat (referensi issue, ADR baru, dll)
```

---

## Workflow untuk Agent B (Dev) Requesting Spec Change

Jika Agent B menemukan spec yang ambigu, tidak feasible, atau konflik:

1. **JANGAN** edit spec file langsung (Agent B tidak punya write access ke `specs/`)
2. Tulis issue di `DECISIONS-DEV.md` (di root project, milik Agent B) dengan format:

```markdown
## [SPEC-CHANGE-REQUEST-001] — YYYY-MM-DD

**Spec file**: specs/06-api-contracts.md
**Section**: 2.4.1 POST /orders
**Issue**: Validasi stok di endpoint checkout tidak clear apakah atomic transaction atau tidak

**Suggested Change**:
Tambahkan note: "Stock validation & order creation harus dalam database transaction yang sama untuk prevent race condition"

**Reasoning**:
 kalau tidak atomic, bisa terjadi 2 customer checkout varian yang sama dengan stock 1, kedua-duanya sukses di validasi tapi gagal di insert

**Agent A Response** (diisi Agent A):
[TBD]
```

3. Agent A akan review request, update spec file, dan update CHANGELOG ini.
4. Version bump di VERSION.txt mengikuti semantic versioning.

---

**End of CHANGELOG.md**
