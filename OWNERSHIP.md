# 🛡️ OWNERSHIP.md
# Aturan Kepemilikan File — Anti-Konflik Agent A ↔ Agent B

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Purpose**: Mencegah konflik edit antara Agent A (Planning) dan Agent B (Dev) saat berkolaborasi via GitHub

---

## 📋 Tujuan Dokumen Ini

Karena proyek Moring Suksok dikembangkan oleh **2 agent terpisah** (Agent A dan Agent B) yang bekerja di sandbox Z.ai berbeda, kita butuh aturan kepemilikan file yang jelas untuk mencegah konflik saat `git push`/`git pull`.

**Aturan emas**: **Tidak boleh ada file yang diedit oleh dua agent**. Kalau perlu share info, lewat file yang sudah ada kontrak kepemilikan jelas.

---

## 🗂️ Peta Kepemilikan File Lengkap

### 🤖 ZONE AGENT A (Planning) — Hanya boleh di-edit oleh Agent A

| Path | Purpose | Status |
|---|---|---|
| `specs/00-vision.md` | Executive summary, tujuan | ✅ Final v1.0.2 |
| `specs/01-requirements.md` | Latar belakang, scope, batasan | ✅ Final v1.0.2 |
| `specs/02-architecture.md` | Arsitektur sistem, security | ✅ Final v1.0.2 |
| `specs/03-features.json` | Epic → Stories (machine-readable) | ✅ Final v1.0.2 |
| `specs/04-ui-guidelines.md` | UI/UX direction, palette, components | ✅ Final v1.0.2 |
| `specs/05-data-model.md` | ERD, 9 tabel SQL DDL | ✅ Final v1.0.2 |
| `specs/06-api-contracts.md` | FastAPI endpoint specs | ✅ Final v1.0.2 |
| `specs/07-user-flows.md` | Flow customer & owner | ✅ Final v1.0.2 |
| `specs/08-acceptance-criteria.md` | AC per story (Given-When-Then) | ✅ Final v1.0.2 |
| `specs/SPECS-UPDATE-NOTIFICATION.md` | 📬 Mailbox antar agent | Living doc |
| `specs/CHANGELOG.md` | Tracking perubahan specs | Living doc |
| `specs/VERSION.txt` | Semantic versioning | v1.0.2 |
| `specs/decisions/ADR-001-tech-stack.md` | Decision record: tech stack | ✅ Accepted |
| `specs/decisions/ADR-002-qris-self-generated.md` | Decision record: payment | ✅ Accepted |
| `specs/decisions/ADR-003-decoupled-architecture.md` | Decision record: architecture | ✅ Accepted |
| `specs/research/*` | Riset teknis (QRIS, FCM, dll) | Empty (siap diisi) |
| **OWNERSHIP.md** (this file) | Aturan kepemilikan | Living doc |

### 🤖 ZONE AGENT B (Dev) — Hanya boleh di-edit oleh Agent B

#### Frontend (Next.js PWA — root level, via Z.ai Full-Stack feature)
| Path | Purpose | Status |
|---|---|---|
| `package.json` | Frontend dependencies | Akan dibuat Agent B |
| `package-lock.json` | Lock file | Auto-generated |
| `next.config.js` | Next.js configuration | Akan dibuat Agent B |
| `next.config.ts` | (alt TS config) | Akan dibuat Agent B |
| `tailwind.config.ts` | Tailwind CSS config | Akan dibuat Agent B |
| `tsconfig.json` | TypeScript config | Akan dibuat Agent B |
| `postcss.config.js` | PostCSS config | Akan dibuat Agent B |
| `src/` | Next.js app router (UI components, pages) | Akan dibuat Agent B |
| `public/` | Static assets (icons, images, manifest.json, sw.js) | Akan dibuat Agent B |
| `components.json` | shadcn/ui config | Akan dibuat Agent B |

#### Backend (Python FastAPI — `/backend/` folder)
| Path | Purpose | Status |
|---|---|---|
| `backend/app/main.py` | FastAPI entry point | Akan dibuat Agent B |
| `backend/app/core/*` | Config, database, security | Akan dibuat Agent B |
| `backend/app/models/*` | SQLAlchemy models (9 tabel) | Akan dibuat Agent B |
| `backend/app/schemas/*` | Pydantic schemas | Akan dibuat Agent B |
| `backend/app/api/v1/*` | REST API endpoints | Akan dibuat Agent B |
| `backend/app/services/*` | Business logic (QRIS, FCM, dll) | Akan dibuat Agent B |
| `backend/app/utils/*` | Utility functions | Akan dibuat Agent B |
| `backend/alembic/*` | Database migrations | Akan dibuat Agent B |
| `backend/tests/*` | Unit/integration/e2e tests | Akan dibuat Agent B |
| `backend/requirements.txt` | Python dependencies | ✅ Ready (initial) |
| `backend/pyproject.toml` | Tooling config (ruff, black, mypy) | ✅ Ready (initial) |
| `backend/.env.example` | Backend env template | ✅ Ready |
| `backend/Dockerfile` | Backend Docker image | Akan dibuat Agent B |
| `backend/seed.py` | Seed script | Akan dibuat Agent B |

#### Dev Tracking Docs (root level)
| Path | Purpose | Status |
|---|---|---|
| `PROGRESS.md` | Log progress mingguan | Template ready |
| `DECISIONS-DEV.md` | Dev decisions + spec change requests | Template ready |
| `MIGRATION-NOTES.md` | Alembic migration log | Template ready |
| `KNOWN-ISSUES.md` | Bug tracker | Template ready |

### 🤝 SHARED — Bisa diedit dua-duanya (dengan koordinasi)

| Path | Default Owner | Conflict Risk | Notes |
|---|---|---|---|
| `README.md` | Agent A (overview) | 🟡 Medium | Hanya edit kalau struktur berubah. Agent B boleh tambah section "Development Setup" |
| `Makefile` | Agent A (initial) | 🟡 Medium | Edit kalau ada command baru. Koordinasi via mailbox dulu |
| `docker-compose.yml` | Agent A (initial) | 🟡 Medium | Edit kalau ada service baru. Koordinasi via mailbox |
| `.env.example` | Agent A (initial) | 🟢 Low | Edit kalau ada env var baru (jarang) |
| `.env.local.example` | Agent A (initial) | 🟢 Low | Edit kalau ada frontend env var baru |
| `.gitignore` | Agent A (initial) | 🟢 Low | Edit kalau ada pattern baru |
| `.gitattributes` | Agent A (initial) | 🟢 Low | Jarang diubah setelah initial setup |
| `docs/api-openapi.json` | Agent B (auto-gen) | 🟢 Low | Auto-generate via `make openapi`, jangan edit manual |
| `docs/screenshots/*` | Agent B | 🟢 Low | Tambah screenshot untuk demo |

---

## 🚨 File yang HARUS Dihapus Agent B (Default Z.ai Full-Stack)

Karena Agent B pakai Z.ai Full-Stack feature, dia akan punya default file yang **TIDAK SESUAI** specs kita. WAJIB HAPUS setelah clone:

| Path | Reason |
|---|---|
| ❌ `prisma/` | Kita pakai MySQL + SQLAlchemy, BUKAN Prisma |
| ❌ `prisma/schema.prisma` | Prisma schema (tidak dipakai) |
| ❌ `db/` | SQLite database (kita pakai MySQL via Laragon) |
| ❌ `lib/auth.ts` (jika ada) | NextAuth.js (kita pakai JWT dari FastAPI) |
| ❌ `lib/db.ts` (jika ada) | Prisma client (tidak dipakai) |
| ❌ `src/lib/prisma.ts` (jika ada) | Prisma client alternative location |
| ❌ `src/app/api/auth/[...nextauth]/route.ts` (jika ada) | NextAuth route handler |

**Setelah hapus**, Agent B WAJIB setup alternatif:
- `src/lib/api.ts` — Axios client untuk call FastAPI backend (`http://localhost:8000/api/v1`)
- `src/lib/auth-context.tsx` — Auth context menggunakan JWT dari FastAPI

---

## 📨 Communication Protocol untuk Edit SHARED Files

Karena SHARED files bisa di-edit dua-duanya, kita butuh koordinasi via mailbox:

### Scenario: Agent B Mau Edit SHARED File (e.g., `Makefile`)

**Step 1**: Agent B tulis request di `DECISIONS-DEV.md`:

```markdown
## [SHARED-EDIT-REQUEST-001] — 2026-10-30 14:00

**File**: Makefile
**Reason**: Add command `make deploy-vercel` untuk auto-deploy frontend
**Proposed Change**: 
```makefile
deploy-vercel:
    cd frontend && vercel --prod
```
**Status**: Pending Agent A approval
**Deadline**: 2026-10-31 (24 jam)
```

**Step 2**: Agent A review, balas di `specs/SPECS-UPDATE-NOTIFICATION.md`:

```markdown
### [SHARED-EDIT-APPROVAL-001] — 2026-10-30 15:00

**Approving**: SHARED-EDIT-REQUEST-001 from Agent B
**File**: Makefile
**Decision**: ✅ Approved with modification
**Note**: Use `vercel --prod --yes` (skip confirmation prompt). Frontend sekarang di root, jadi command-nya:
```makefile
deploy-vercel:
    vercel --prod --yes
```
**Lock period**: Until 2026-10-31 15:00, Agent A tidak akan edit Makefile
```

**Step 3**: Agent B edit Makefile, commit & push

```bash
git add Makefile
git commit -m "chore(makefile): add deploy-vercel command (approved by Agent A)"
git push origin main
```

**Step 4**: Agent B update `DECISIONS-DEV.md`:

```markdown
## [SHARED-EDIT-REQUEST-001] — ✅ Resolved
**Resolution**: Approved by Agent A, implemented in commit [hash]
```

---

## 🔒 Anti-Konflik Rules (Wajib Ditaati)

### Rule 1: Git Pull Sebelum Mulai Sesi (Wajib)

```bash
# Setiap mulai sesi development:
cd /home/z/my-project
git pull origin main
```

### Rule 2: Jangan Edit File di Zone Agent Lain

| ❌ Agent A DILARANG edit | ❌ Agent B DILARANG edit |
|---|---|
| `src/`, `public/`, `package.json`, dll (frontend) | `specs/**` (semua) |
| `backend/**` | `OWNERSHIP.md` (this file) |
| `PROGRESS.md`, `DECISIONS-DEV.md`, dll (dev tracking) | |

### Rule 3: SHARED File Edit = Koordinasi Dulu

Kalau mau edit SHARED file, pakai protocol di atas (mailbox request + approval).

### Rule 4: Commit Message Convention

Pakai [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Agent A (specs):
specs: add 04-ui-guidelines.md
specs: update 05-data-model.md - add index strategy
specs: NOTIF-004 - clarify auth flow
docs: update OWNERSHIP.md

# Agent B (code):
feat(auth): implement JWT middleware
feat(products): add CRUD endpoints
fix(cart): resolve qty validation bug
chore(deps): update FastAPI to 0.115.6
docs(api): generate OpenAPI schema
refactor(backend): reorganize service layer
test(payments): add QRIS generation tests
```

### Rule 5: Small, Frequent Commits

```bash
# ❌ BAD: commit besar sekali sehari
git add -A && git commit -m "done today"

# ✅ GOOD: commit kecil per feature
git add backend/app/api/v1/auth.py
git commit -m "feat(auth): implement login endpoint"
git push origin main

git add backend/app/api/v1/products.py
git commit -m "feat(products): implement CRUD endpoints"
git push origin main
```

### Rule 6: Conflict Resolution Priority

Kalau terjadi konflik saat `git pull`:

| File konflik | Resolver | Strategy |
|---|---|---|
| `specs/**` | Agent A | Agent A punya final say (dia owner) |
| `src/**`, `backend/**` | Agent B | Agent B punya final say (dia owner) |
| `PROGRESS.md`, `DECISIONS-DEV.md`, dll | Agent B | Agent B resolve |
| `README.md`, `Makefile`, dll (SHARED) | Yang menambah commit terakhir | Komunikasi via mailbox |

### Rule 7: Mailbox Exception (Acknowledged Section Only)

> **Added**: v1.0.5 (2026-10-30) — resolve SPEC CONFLICT reported by Agent B

**Exception to Rule 2**: Untuk file `specs/SPECS-UPDATE-NOTIFICATION.md`, Agent B **DIPERBOLEHKAN** edit HANYA section `## ✅ Acknowledged Notifications (Sudah Dibaca Agent B)`.

**Aturan detail**:

| Section di mailbox | Boleh edit siapa? |
|---|---|
| Section "📋 Cara Pakai Mailbox Ini" | ❌ Agent A ONLY |
| Section "🔔 Pending Notifications" (termasuk semua NOTIF-XXX entries) | ❌ Agent A ONLY |
| Section `## ✅ Acknowledged Notifications` | ✅ Agent B (untuk pindahkan notif dari Pending → Acknowledged) |
| Section "📊 Notification Statistics" | ❌ Agent A ONLY |
| Section "🔄 Workflow Update Specs" | ❌ Agent A ONLY |
| Section "📝 Template Acknowledge oleh Agent B" | ❌ Agent A ONLY |
| Section "Last Updated" timestamp | ✅ Agent B (update timestamp saat acknowledge) |

**Format yang HARUS dipakai Agent B saat acknowledge**:

```markdown
### [NOTIF-XXX] ✅ Acknowledged

**Acknowledged by**: Agent B
**Date acknowledged**: YYYY-MM-DD HH:MM (Asia/Jakarta)
**Actions taken**:
- [x] Baca spec file yang diupdate
- [x] Apply perubahan ke code:
  - Modified: `frontend/src/components/X.tsx`
  - Added: `backend/app/api/v1/Y.py`
- [x] Run tests: ✅ all pass
- [x] Update PROGRESS.md dengan note perubahan
**Notes**: [catatan tambahan jika ada]
```

**Saat acknowledge, Agent B WAJIB**:
1. Hapus entry NOTIF-XXX dari section "Pending Notifications"
2. Tambahkan entry NOTIF-XXX (dengan format di atas) ke section "Acknowledged"
3. Update "Last Updated" timestamp di akhir file
4. Commit dengan message: `docs(mailbox): acknowledge NOTIF-XXX by Agent B`

**Agent A TIDAK BOLEH** mengganggu section "Acknowledged" kecuali kalau ada kesalahan format yang jelas (misal: Agent B salah format, Agent A boleh fix typo).

---

## ✅ Pre-Push Checklist

Sebelum `git push`, pastikan:

- [ ] Saya cek `git pull origin main` terbaru (tidak ada commit baru dari agent lain)
- [ ] Saya cuma edit file di zone saya (cek tabel di atas)
- [ ] Kalau edit SHARED file, sudah dapat approval via mailbox
- [ ] Commit message pakai Conventional Commits format
- [ ] Tidak ada `.env`, credentials, atau file sensitif di staging
- [ ] `git status` clean (tidak ada unintended changes)

---

## 📊 Summary Statistics

| Metric | Value |
|---|---|
| Total files in repo | 39 (excluding .git/) |
| Agent A files (specs + ownership + meta) | 18 |
| Agent B files (frontend + backend + dev docs) | 12 (akan berkembang) |
| SHARED files | 9 |
| Files NOT in git (excluded by .gitignore) | `.env`, `download/`, `scripts/`, `skills/`, `upload/`, `node_modules/`, `__pycache__/`, dll |

---

## 🔄 Update History

| Date | Version | Author | Changes |
|---|---|---|---|
| 2026-10-29 | 1.0.0 | Agent A | Initial creation of OWNERSHIP.md with full file mapping |

---

**End of OWNERSHIP.md**
