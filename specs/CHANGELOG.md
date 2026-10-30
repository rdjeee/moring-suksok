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

## [1.0.5] — 2026-10-30

### Auth Module Review + SPEC CONFLICT Resolution

#### Auth Module (E1-S1 to E1-S8) — Agent A Review: ⭐⭐⭐⭐⭐ EXCELLENT

Agent A telah mereview implementasi Auth Module yang dilakukan Agent B (commit `a5a4fd3`). Verdict: **EXCELLENT WORK!** Semua 8 stories terimplementasi dengan quality production-ready:

| Story | Status | Notes |
|---|---|---|
| E1-S1 Registrasi customer | ✅ Done | Pydantic validation ketat |
| E1-S2 Pilih segmen | ✅ Done | Pattern `^(retail\|public)$` |
| E1-S3 Login customer | ✅ Done | JWT + user data |
| E1-S4 Login admin terpisah | ✅ Done | Query dari `admins` table |
| E1-S5 Logout | ✅ Done | Stateless JWT |
| E1-S6 Update profil | ✅ Done | Support name, phone, address, fcm_token |
| E1-S7 JWT middleware | ✅ Done | 3 dependencies: get_current_user/customer/admin |
| E1-S8 Password bcrypt | ✅ Done | Direct bcrypt (12 rounds), ISSUE-002 fixed |

**Bonus yang Agent B lakukan**:
- Fixed ISSUE-002 (passlib → direct bcrypt, sesuai saran Agent A)
- Fixed ISSUE-003 (SQL echo verbose, set DEBUG=false)
- Soft delete check (`is_active=false`)
- Token expiry berbeda per role (customer 7 hari, admin 1 hari)
- HTTPBearer dengan auto_error=False untuk custom error dalam Bahasa Indonesia

#### SPEC CONFLICT Resolved — Opsi A Approved

Agent B reported SPEC CONFLICT antara:
- `OWNERSHIP.md` Rule 2: `specs/**` = Agent A ONLY, DILARANG diedit Agent B
- Mailbox Protocol step 9: "Agent B pindahkan notif dari Pending → Acknowledged"

**Agent A Decision**: ✅ **Opsi A APPROVED** (sesuai rekomendasi Agent B)

#### Files Updated by Agent A

- `OWNERSHIP.md` — Added **Rule 7: Mailbox Exception (Acknowledged Section Only)**
  - Agent B DIPERBOLEHKAN edit HANYA section `## ✅ Acknowledged Notifications` di mailbox
  - Section lain (Pending, Statistics, Workflow, Template) tetap Agent A ONLY
  - Format acknowledge template disediakan
- `specs/SPECS-UPDATE-NOTIFICATION.md` — Populated Acknowledged section:
  - Pindahkan NOTIF-001 dari Pending → Acknowledged (atas nama Agent B, one-time exception)
  - Pindahkan NOTIF-002 dari Pending → Acknowledged (atas nama Agent B)
  - Pindahkan NOTIF-003 dari Pending → Acknowledged (atas nama Agent B)
  - Added NOTIF-005 dengan response SPEC CONFLICT + Auth Module review
  - Update statistics (5 total, 2 pending, 3 acknowledged)

#### Minor Issue Reported to Agent B

`backend/app/main.py` line 26 masih berisi deskripsi lama:
```python
"Tugas Akhir mini e-commerce UMKM snack kripik daun kelor."
```
**Penyebab**: Agent B push Auth Module sebelum Agent A push v1.0.4 (koreksi produk). Bukan kesalahan Agent B.

**Fix request**: Update ke `"Tugas Akhir mini e-commerce UMKM camilan khas cimol kering (moring)."` saat acknowledge NOTIF-004.

#### Migration Guide dari v1.0.4 → v1.0.5

Agent B (after pulling this update):

1. **Baca NOTIF-004 dan NOTIF-005** di `specs/SPECS-UPDATE-NOTIFICATION.md`
2. **Apply perubahan dari NOTIF-004** (koreksi deskripsi produk — lihat v1.0.5 di atas)
3. **Apply perubahan dari NOTIF-005**:
   - Fix `backend/app/main.py` line 26 (description string)
4. **Acknowledge NOTIF-004 dan NOTIF-005** dengan format baru (Rule 7):
   - Edit `specs/SPECS-UPDATE-NOTIFICATION.md` section "Acknowledged"
   - Pindahkan dari "Pending" → "Acknowledged"
   - Update timestamp
   - Commit: `docs(mailbox): acknowledge NOTIF-004 and NOTIF-005 by Agent B`
5. **Lanjut Minggu 3**: Product Module (E2-S1 to E2-S9)

#### Impact

- **Breaking changes**: NONE
- **Spec content changes**: NONE (hanya documentation: OWNERSHIP.md Rule 7 + mailbox)
- **Code change needed by Agent B**: 1 line (`main.py` description) + semua perubahan dari NOTIF-004

---

## [1.0.4] — 2026-10-30

### CRITICAL: Koreksi Deskripsi Produk Moring Suksok

#### Background

Setelah verifikasi lebih mendalam dengan mitra (owner Moring Suksok), ditemukan bahwa deskripsi produk yang dipakai di seluruh spec adalah **SALAH**. Awalnya kita mengira Moring Suksok adalah "produk olahan daun kelor (moringa)" dengan "snack/kripik moring". Faktanya:

- **Moring Suksok BUKAN produk olahan daun kelor**
- **Moring Suksok adalah produk camilan khas berupa cimol kering (moring)** — yaitu cimol yang digoreng dengan tekstur kering, renyah, dan tahan lama

#### Changes Applied (39 replacements across 8 files)

| File | Replacements | Description |
|---|---|---|
| `specs/00-vision.md` | 4 | Profil mitra: "Jenis Usaha" → "UMKM Camilan Khas (Cimol Kering / Moring)"; "Produk Utama" → "Cimol Kering (Moring) dengan beberapa varian rasa" |
| `specs/01-requirements.md` | 2 | Latar belakang masalah |
| `specs/04-ui-guidelines.md` | 3 | Palette description: "hijau daun kelor" → "hijau natural" (warna tetap sama, hanya terminologi) |
| `specs/05-data-model.md` | 11 | Seed data: 3 produk → 5 produk (Original, Pedas, Keju, Balado, Jagung); deskripsi produk diperbaiki |
| `specs/06-api-contracts.md` | 7 | Contoh response API dengan nama produk baru |
| `specs/08-acceptance-criteria.md` | 5 | Test scenarios dengan nama produk baru |
| `specs/decisions/ADR-002-qris-self-generated.md` | 1 | Context mitra |
| `README.md` | 7 | Overview proyek |

#### New Product Examples (5 produk dengan 11 varian)

```
Produk 1: Moring Original    — varian: 100gr, 250gr, 500gr (3 varian)
Produk 2: Moring Pedas       — varian: 100gr, 250gr (2 varian)
Produk 3: Moring Keju        — varian: 100gr, 250gr (2 varian)
Produk 4: Moring Balado      — varian: 100gr, 250gr (2 varian)  ← BARU
Produk 5: Moring Jagung      — varian: 100gr, 250gr (2 varian)  ← BARU
```

#### Logo Resmi Moring Suksok

- File: `docs/branding/logo_moring.jpg` (BARU)
- Deskripsi: Background pure green, center white leaf shape dengan text "Suksok" + "Snack"
- Catatan: Ikon daun pada logo adalah elemen desain, BUKAN referensi produk daun kelor
- Tema warna: Tetap pakai palette hijau `#2D6A4F` (tidak berubah)

#### Files NOT Updated by Agent A (Agent B's Zone)

File-file berikut masih mengandung terminologi lama dan HARUS diupdate oleh Agent B (inform via NOTIF-004):

- `DECISIONS-DEV.md` (2 occurrences "daun kelor" / "kripik moring")
- `MIGRATION-NOTES.md` (1 occurrence)
- `public/manifest.json` (1 occurrence)
- `backend/seed.py` (kode seed data 3 produk lama → 5 produk baru)
- `public/logo.svg` (placeholder → ganti dengan `docs/branding/logo_moring.jpg`)
- `src/app/...` (cek hardcoded "Kripik Moring" atau "daun kelor")

#### Other Updates

- `Pengajuan_Judul_TA_Moring_Suksok.docx` — di-regenerate dengan info yang benar (file lama di-overwrite)
- `specs/SPECS-UPDATE-NOTIFICATION.md` — Added NOTIF-004 dengan priority 🔴 HIGH untuk Agent B
- `scripts/fix_product_description.py` — Python script bulk replacement (saved for reference)

#### Impact

- **Breaking changes**: Tidak ada perubahan schema DB, hanya konten seed data
- **Database migration needed**: Tidak perlu migration baru, hanya re-seed (3 → 5 produk)
- **Code change effort (Agent B)**: 1-2 jam untuk update semua file + re-seed + verify

#### Migration Guide dari v1.0.3 → v1.0.4

Agent B (after pulling this update):

1. **Baca NOTIF-004** di `specs/SPECS-UPDATE-NOTIFICATION.md` — priority 🔴 HIGH
2. **Update file-file di zone Anda** yang masih pakai terminologi lama:
   - `DECISIONS-DEV.md` (2 occurrences)
   - `MIGRATION-NOTES.md` (1 occurrence)
   - `public/manifest.json` (1 occurrence)
   - `backend/seed.py` (ganti 3 produk → 5 produk, lihat `specs/05-data-model.md` § 6.3)
   - `public/logo.svg` → ganti dengan `docs/branding/logo_moring.jpg`
   - `src/app/...` — cek hardcoded "Kripik Moring" atau "daun kelor"
3. **Re-seed database**:
   ```bash
   make db-reset
   make migrate
   make seed
   ```
4. **Verify 5 produk** muncul di `GET /api/v1/products`
5. **Acknowledge NOTIF-004** di mailbox dengan timestamp

---

## [1.0.3] — 2026-10-30

### Agent A Review of Agent B's Minggu 1 Setup

#### Agent A Response to Agent B's Spec Change Requests

##### SCR-001 (Python Tidak Tersedia) — ✅ RESOLVED
- Agent B initially assumed Python was unavailable in Z.ai sandbox
- Verified by Agent B (Step 3): Python 3.12.16 IS available
- venv created, 22+ deps installed, FastAPI runs successfully
- No spec change needed — original spec holds

##### SCR-002 (MySQL Tidak Tersedia di Sandbox) — ✅ APPROVED dengan Catatan
- Agent B proposed dual-mode DB strategy:
  - Sandbox: SQLite (`sqlite:///./moring_suksok_sandbox.db`) untuk demo
  - Production: MySQL (`mysql+pymysql://root:@localhost:3306/moring_suksok`) di Laragon
- SQLAlchemy models DB-agnostic — only difference is `DATABASE_URL` in `.env`
- **Agent A approved** with conditions:
  1. Sandbox mode (SQLite) untuk demo sidang: OK
  2. Production mode (MySQL) untuk handover owner: WAJIB tested before Minggu 8 deployment
  3. Verify no SQLite-specific SQL that breaks in MySQL (e.g., AUTOINCREMENT vs AUTO_INCREMENT, ENUM support)
  4. Index names: `idx_orders_status`, `idx_payments_status` (DB-agnostic naming) — OK

##### SHARED-EDIT-REQUEST-001 (Makefile spaces → TABs) — ✅ APPROVED & FIXED
- Agent B reported: `make *` commands failed with `Makefile:35: *** missing separator`
- Root cause: Recipe lines used 8 spaces instead of TAB characters (GNU Make requirement)
- **Agent A fixed directly** (atomic fix, faster than review-approve workflow):
  - Wrote Python script to convert all 8-space indents → TAB characters
  - Verified: `make help` now outputs 32+ targets without error
  - Tested: `make tree`, `make migrate` (parses correctly)
- ISSUE-001 closed

#### Agent B's Minggu 1 Setup — Comprehensive Review

##### ✅ Setup Completed (Verified by Agent A via git pull commit `07be8c5`)

| Component | Status | Notes |
|---|---|---|
| Backend Python FastAPI | ✅ Excellent | 9 SQLAlchemy models, Alembic migration applied, seed data, FastAPI skeleton with /health + /docs |
| Frontend Next.js PWA | ✅ Excellent | Moring green theme, Plus Jakarta Sans font, Axios + JWT interceptor, 48 shadcn/ui components, landing page |
| Database | ✅ Sandbox SQLite | 9 tables created, 1 admin + 6 settings + 3 products + 7 variants seeded |
| Documentation | ✅ Excellent | PROGRESS.md, DECISIONS-DEV.md (578 lines), KNOWN-ISSUES.md, MIGRATION-NOTES.md |
| Ownership compliance | ✅ Perfect | No direct edits to `specs/**`, all deviasi via SCR protocol |

##### ⚠️ Remaining Issues (Low Priority, Non-Blocking)

- **ISSUE-002**: passlib + bcrypt 4.x trapped warning (cosmetic, fix when implementing E1-S8)
- **ISSUE-003**: SQL echo verbose when DEBUG=true (cosmetic, quick fix in `database.py`)

#### Files Updated by Agent A

- `Makefile` — Fixed: 8-space indents → TAB characters (resolves ISSUE-001)
- `KNOWN-ISSUES.md` — Updated: ISSUE-001 marked as ✅ Resolved by Agent A
- `DECISIONS-DEV.md` — Updated: SHARED-EDIT-REQUEST-001 marked as ✅ Approved & Fixed
- `specs/SPECS-UPDATE-NOTIFICATION.md` — Added NOTIF-003 with full Agent A response
- `specs/VERSION.txt` — v1.0.2 → v1.0.3
- `specs/CHANGELOG.md` — Added v1.0.3 entry (this one)

#### Migration Guide dari v1.0.2 → v1.0.3

Agent B (after pulling this update):

1. Read `specs/SPECS-UPDATE-NOTIFICATION.md` → NOTIF-003 for full review
2. Acknowledge NOTIF-003 in the "Acknowledged" section with timestamp
3. **Use `make *` commands** now (Makefile fixed) — `make migrate`, `make seed`, `make dev`, dll.
4. **Start Minggu 2** (Auth Module) — implement stories E1-S1 to E1-S8
5. **Fix ISSUE-002** as bonus when implementing E1-S8 (bcrypt hashing)
6. **Fix ISSUE-003** quick fix in `database.py` (5 minutes work)
7. For production deployment (Minggu 8): test dengan MySQL via Laragon sebelum handover

---

## [1.0.2] — 2026-10-29

### Repository Restructured to Root Level

#### Changed
- Repository dipindahkan dari `/home/z/my-project/MoringSuksok/` ke root `/home/z/my-project/`
- Frontend folder (`MoringSuksok/frontend/`) dihapus — sekarang dikelola Z.ai Full-Stack feature di root
- `frontend/.env.example` dipindahkan & direname menjadi `.env.local.example` di root (Next.js convention)
- `Makefile` paths diupdate: semua command frontend sekarang jalan di root (tidak `cd frontend`)
- `docker-compose.yml` paths diupdate: frontend service pakai `context: .` (root)
- `.gitignore` di-merge: combine Z.ai defaults (skills/, node_modules/) + MoringSuksok rules
- `README.md` update struktur repository + ownership rules table

#### Added
- `.env.local.example` di root (frontend env vars, Next.js convention)
- Backup files `.env.backup-zai` & `.gitignore.backup-zai` (untuk revert jika perlu)
- Section "Aturan Kepemilikan Anti-Konflik" di README.md
- `[NOTIF-002]` di SPECS-UPDATE-NOTIFICATION.md (inform restructure ke Agent B)

#### Removed
- Folder `MoringSuksok/` (semua isinya sudah dipindahkan ke root)
- Folder `frontend/` (sekarang Z.ai Full-Stack yang handle di root)

#### Migration Guide dari v1.0.1 → v1.0.2

Agent B yang sudah baca v1.0.1:
1. Pathspecs files berubah: dari `/MoringSuksok/specs/` → `/specs/`
2. Path backend berubah: dari `/MoringSuksok/backend/` → `/backend/`
3. Folder `frontend/` TIDAK ADA LAGI — Agent B pakai Z.ai Full-Stack feature yang akan create frontend di root
4. **WAJIB HAPUS** default Z.ai Full-Stack: `prisma/`, `db/`, NextAuth setup (tidak sesuai specs)
5. **WAJIB BUAT** `/backend/` Python FastAPI secara manual
6. Makefile commands tetap sama, tapi sekarang jalan di root (no `cd frontend`)
7. Docker-compose tetap pakai `docker-compose up -d` (sudah diupdate path-nya)

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
