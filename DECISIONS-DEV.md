# DECISIONS-DEV.md
# Development Decisions & Spec Change Requests

> **Owner**: Agent B (Dev) | **Started**: 2026-10-29
> **Purpose**: Log dev decisions harian + spec change requests ke Agent A

---

## 📢 NOTIFIKASI PENTING UNTUK AGENT A

> **Tanggal**: 2026-10-29 22:41 (Asia/Jakarta)
> **From**: Agent B | **To**: Agent A
> **Priority**: HIGH — mohon dibaca & di-acknowledge di `specs/SPECS-UPDATE-NOTIFICATION.md`

### ⚠️ Workspace Moring Suksok saat ini menggunakan SQLite (sementara)

**Konteks**: Sandbox Z.ai tempat Agent B beroperasi **tidak memiliki MySQL server** (verifikasi Step 3-4, 2026-10-29). Tidak ada `mysql`/`mysqld` command, port 3306 tidak listen, Docker tidak tersedia untuk `docker-compose up db`.

**Keputusan User (USER-APPROVED 2026-10-29 22:35)**: Untuk saat ini, workspace menggunakan **SQLite** sebagai DB sementara di sandbox, agar demo & development bisa berjalan.

**Yang perlu Agent A ketahui**:
1. **Spec `specs/05-data-model.md` TIDAK berubah** — tetap MySQL 8.4.3 dengan charset `utf8mb4_unicode_ci` sebagai target production.
2. **`specs/decisions/ADR-001-tech-stack.md` TIDAK berubah** — MySQL via Laragon tetap pilihan untuk mesin dev user & production.
3. **Code `backend/` DB-agnostic** — SQLAlchemy models ditulis sekali, works untuk MySQL & SQLite. Hanya beda 1 line `DATABASE_URL` di `.env`.
4. **`backend/.env` sandbox**: `DATABASE_URL=sqlite:///./moring_suksok_sandbox.db` (aktif sekarang)
5. **`backend/.env` production (mesin lokal user)**: `DATABASE_URL=mysql+pymysql://root:@localhost:3306/moring_suksok` (commented, tinggal uncomment saat di mesin user)
6. **Alembic migration** akan dibuat untuk MySQL (production target). Untuk sandbox demo, bisa pakai `Base.metadata.create_all()` atau migration terpisah jika ada SQLite-specific DDL.

**Mohon Agent A**:
- Catat ini di `specs/SPECS-UPDATE-NOTIFICATION.md` sebagai NOTIF-003 (atau nomor berikutnya)
- Confirm di mailbox bahwa strategi dual-mode ini OK, atau propose alternatif
- Tidak perlu update `specs/05-data-model.md` atau ADR-001 — strategi ini tidak mengubah spec, hanya strategi implementasi di sandbox

**Detail lengkap**: Lihat [SPEC-CHANGE-REQUEST-002](#spec-change-request-002--2026-10-29--database-mysql-tidak-tersedia-di-sandbox-zai-updated-sqlite-fallback-via-sqlalchemy) di bawah.

---

### ⚠️ SPEC CONFLICT: Mailbox Acknowledge Protocol vs OWNERSHIP.md Rules

> **Tanggal**: 2026-10-30 01:05 (Asia/Jakarta)
> **From**: Agent B | **To**: Agent A
> **Priority**: MEDIUM — mohon di-resolve agar workflow mailbox jelas
> **Status**: Pending Agent A resolution

**Konflik yang ditemukan**:

Saat saya (Agent B) ingin acknowledge NOTIF-003 (Agent A review Minggu 1), saya menemukan **spec conflict** antara 2 aturan:

| Aturan | Isi | Implikasi |
|--------|-----|-----------|
| **OWNERSHIP.md Rule 2** | `specs/**` = Agent A ONLY, DILARANG diedit Agent B | Agent B tidak boleh edit `specs/SPECS-UPDATE-NOTIFICATION.md` |
| **Mailbox Protocol step 9** (di `specs/SPECS-UPDATE-NOTIFICATION.md`) | "Agent B pindahkan notif dari Pending → Acknowledged dengan timestamp" | Agent B DIMINTA edit `specs/SPECS-UPDATE-NOTIFICATION.md` |

**Dampak**: Agent B tidak bisa comply dengan mailbox protocol step 9 karena blocked by OWNERSHIP Rule 2. Ini membuat tracking acknowledge jadi tidak clean — acknowledge tercatat di `DECISIONS-DEV.md` (Agent B zone) bukan di mailbox resmi.

**Yang sudah saya lakukan (workaround)**:
- ✅ NOTIF-001 & NOTIF-002: Acknowledged di `DECISIONS-DEV.md` → Communication History section (DEV-DECISION-001)
- ✅ NOTIF-003: Acknowledged di `DECISIONS-DEV.md` → DEV-DECISION-008 (Minggu 2 Auth Module)
- ❌ TIDAK moved ke "Acknowledged" section di `specs/SPECS-UPDATE-NOTIFICATION.md` (blocked by OWNERSHIP)

**Mohon Agent A resolve** (pilih salah satu):

1. **Opsi A** (rekomendasi): Agent A update `specs/OWNERSHIP.md` untuk allow Agent B edit HANYA section "✅ Acknowledged Notifications" di `specs/SPECS-UPDATE-NOTIFICATION.md` (tidak boleh edit section lain). Ini enable self-service acknowledge by Agent B.

2. **Opsi B**: Agent A manually move NOTIF-003 (dan NOTIF-001, NOTIF-002) dari "Pending" → "Acknowledged" section atas nama Agent B. Agent B cukup catat acknowledge di `DECISIONS-DEV.md` sebagai signal.

3. **Opsi C**: Ubah mailbox protocol — Agent B tidak perlu move notif, cukup catat acknowledge di `DECISIONS-DEV.md`. Agent A periodically cek `DECISIONS-DEV.md` untuk track acknowledges.

**Detail lengkap**: Lihat [DEV-DECISION-008](#dev-decision-008--2026-10-30--minggu-2-auth-module-e1-s1-sd-e1-s8--issue-002-fix--issue-003-fix) → section "NOTIF-003 Acknowledge".

---

## 📝 Format Spec Change Request

Jika Agent B menemukan spec yang ambigu, tidak feasible, atau konflik, gunakan format berikut:

```markdown
## [SPEC-CHANGE-REQUEST-XXX] — YYYY-MM-DD

**Spec file**: specs/XX-filename.md
**Section**: X.X Judul Section
**Issue**: [deskripsi singkat issue]
**Suggested Change**: [solusi yang diusulkan]
**Reasoning**: [kenapa perubahan ini diperlukan]
**Impact**: [estimasi dampak ke stories lain, dependency, dll]

**Agent A Response** (diisi Agent A):
- Status: [Approved / Rejected / Needs Discussion]
- Decision: [penjelasan]
- Action taken: [file spec yang diupdate, version bump, dll]
```

---

## 📋 Spec Change Requests Log

### [SPEC-CHANGE-REQUEST-001] — 2026-10-29 — ✅ RESOLVED: Python FastAPI BISA di-run di sandbox Z.ai

> **KOREKSI 2026-10-29 23:25**: SCR ini awalnya dibuat dengan asumsi Python tidak tersedia di sandbox. **Asumsi itu SALAH**. Setelah verifikasi pada Step 3, Python 3.12.16 tersedia, venv berhasil dibuat, dan semua 22+ dependencies terinstall. Backend FastAPI **BISA dijalankan** di sandbox. Hanya MySQL server yang tidak tersedia (lihat SCR-002).

**Spec file**: specs/decisions/ADR-001-tech-stack.md, specs/02-architecture.md
**Section**: Tech Stack Selection (Option B) + Arsitektur Decoupled
**Initial Issue (salah)**: Asumsi sandbox tidak punya Python → backend tidak bisa di-run.
**Actual finding (Step 3)**: Python 3.12.16 + pip 26.2.2 + uv 0.13.6 tersedia. `backend/venv/` berhasil dibuat. `pip install -r requirements.txt` sukses (20 detik, semua wheel pre-built). Backend FastAPI **dapat dijalankan** via `uvicorn app.main:app --reload --port 8000`.

**Resolution**: Tidak perlu strategi dual-mode frontend seperti awalnya diusulkan. Backend Python FastAPI akan dikembangkan & dijalankan langsung di sandbox. Frontend Next.js akan call `http://localhost:8000/api/v1/*` (sesuai specs/02-architecture.md) — via gateway Caddy dengan `XTransformPort=8000`.

**Status**: ✅ RESOLVED (tidak perlu spec change)

---

### [SPEC-CHANGE-REQUEST-002] — 2026-10-29 — ✅ USER-APPROVED: SQLite fallback untuk sandbox demo

**Spec file**: specs/05-data-model.md, specs/decisions/ADR-001-tech-stack.md
**Section**: Database (MySQL 8.4.3 via Laragon)
**Issue**: Sandbox Z.ai tidak memiliki MySQL server running (tidak ada `mysql`/`mysqld` command, port 3306 tidak listen, Docker tidak tersedia untuk `docker-compose up` MySQL). Namun, MySQL/MariaDB **client libraries** terinstall via apt (`default-libmysqlclient-dev`, `libmariadb-dev`, `libmariadb3`), dan PyMySQL (pure-Python driver) sudah terinstall di venv.

**Suggested Change**: Gunakan **SQLite sebagai fallback DB untuk sandbox demo** via SQLAlchemy's DB-agnostic design:
1. `backend/.env` di sandbox: `DATABASE_URL=sqlite:///./moring_suksok_sandbox.db` (untuk demo)
2. `backend/.env` di mesin lokal user: `DATABASE_URL=mysql+pymysql://root:@localhost:3306/moring_suksok` (production, sesuai spec)
3. SQLAlchemy models ditulis sekali (DB-agnostic), works untuk both MySQL & SQLite
4. Alembic migration dibuat untuk MySQL (production target); untuk sandbox, pakai `Base.metadata.create_all()` atau migration terpisah jika ada SQLite-specific DDL

**Reasoning**:
- SQLAlchemy 2.0 mendukung multiple DB backends dengan code yang sama (cuma beda connection string)
- `specs/05-data-model.md` mendefinisikan 9 tabel dengan tipe data yang kompatibel di kedua DB (VARCHAR, INT, DECIMAL, DATETIME, TEXT, ENUM)
- Satu-satunya yang perlu diperhatikan: `ENUM` type (MySQL native, SQLite pakai VARCHAR + CHECK constraint) dan `AUTO_INCREMENT` (MySQL) vs `AUTOINCREMENT` (SQLite) — SQLAlchemy handle ini otomatis
- Demo sandbox cukup untuk verifikasi UI/UX flow & API contract; production tetap MySQL sesuai ADR-001
- Tidak mengubah spec: `specs/05-data-model.md` tetap MySQL, `backend/` code tetap target MySQL

**Impact**:
- `specs/05-data-model.md` tetap MySQL (tidak berubah)
- SQLAlchemy models di `backend/app/models/` DB-agnostic (works untuk MySQL & SQLite)
- `backend/.env` sandbox pakai SQLite, production pakai MySQL (cuma beda 1 line)
- Alembic migration: buat untuk MySQL, test di SQLite untuk sandbox demo

**User Decision** (2026-10-29 22:35 Asia/Jakarta):
- **Status**: ✅ **USER-APPROVED** — "Untuk saat ini gunakan SQLite terlebih dahulu, tetapi jangan lupa beritahu Agent A bahwa saat ini Workspace masih menggunakan SQLite untuk sementara"
- User menginstruksikan Agent B untuk dokumentasikan ini ke Agent A via mailbox (lihat blok notifikasi di atas)

**Agent A Response** (diisi Agent A):
- Status: Pending Agent A acknowledge di `specs/SPECS-UPDATE-NOTIFICATION.md`
- Decision: (TBD — mohon confirm strategi dual-mode OK atau propose alternatif)
- Action taken: (TBD)

**Eksekusi Agent B** (2026-10-29 22:41 Asia/Jakarta):
- ✅ `backend/.env` sudah di-switch ke `DATABASE_URL=sqlite:///./moring_suksok_sandbox.db`
- ✅ MySQL connection string tetap ada sebagai commented fallback (tinggal uncomment di mesin user)
- ✅ Smoke test SQLAlchemy + SQLite PASSED (SQLite 3.53.1, DB file 0-byte created)
- ✅ `*.db` ter-gitignore (tidak akan masuk GitHub repo)
- ✅ Blok notifikasi prominent untuk Agent A ditambahkan di atas file ini

---

## 🛠️ Dev Decisions Log

> Keputusan teknis harian yang tidak butuh spec change, tapi perlu didokumentasikan

### [DEV-DECISION-001] — 2026-10-29 — Workspace Z.ai dijadikan repo GitHub (Step 1 & 2 assignment)

**Konteks**: Workspace Z.ai (`/home/z/my-project/`) awalnya adalah default Z.ai Full-Stack (Next.js + Prisma + SQLite + NextAuth). User menginstruksikan: "Gunakan seluruh repo yang ada di github, jangan menggunakan repo bawaan z.ai" + screenshot konfirmasi tidak ada folder `backend/`.

**Aksi yang dilakukan**:
1. **Backup Z.ai essentials** ke `/tmp/zai-keep/`: `.zscripts/`, `Caddyfile`, `bun.lock`, `package.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `eslint.config.mjs`, `components.json`, `src/` (48 shadcn/ui components + app + hooks + lib), `public/`, `upload/`, `examples/`.
2. **Replace `.git`**: Hapus `.git` lama (Z.ai default history: "Initial commit" + UUID), copy `.git` dari clone GitHub repo `rdjeee/moring-suksok`. Sekarang workspace git history = 8 commits GitHub repo, remote `origin` = `https://github.com/rdjeee/moring-suksok.git`.
3. **Copy file GitHub repo** ke working tree: `specs/`, `backend/`, `docs/`, `README.md`, `OWNERSHIP.md`, `PROGRESS.md`, `DECISIONS-DEV.md`, `MIGRATION-NOTES.md`, `KNOWN-ISSUES.md`, `Makefile`, `docker-compose.yml`, `.env.example`, `.env.local.example`, `.gitignore`, `.gitattributes`.
4. **Step 2 — Hapus default Z.ai yang tidak sesuai specs** (per NOTIF-002 & assignment Agent A):
   - `rm -rf prisma/` (schema.prisma) ✅
   - `rm -rf db/` (custom.db SQLite) ✅
   - `rm -f src/lib/db.ts` (Prisma client) ✅
   - `src/lib/auth*` — tidak ada, skip ✅
   - `src/app/api/auth/` — tidak ada, skip ✅
   - `schema.prisma` at root — tidak ada, skip ✅
5. **Bersihkan `package.json`**:
   - Rename `"name"`: `nextjs_tailwind_shadcn_ts` → `moring-suksok`
   - Bump `"version"`: `0.2.1` → `1.0.0`
   - Hapus 4 prisma scripts (`db:push`, `db:generate`, `db:migrate`, `db:reset`)
   - Tambah script `type-check` (`tsc --noEmit`)
   - Hapus deps: `@prisma/client`, `prisma`, `next-auth` (specs pakai JWT dari FastAPI, bukan NextAuth)
6. **Update `.gitignore`**: Tambah section "Z.ai Sandbox Infrastructure" untuk exclude file-file sandbox yang tidak boleh masuk GitHub repo: `.zscripts/`, `.z-ai-config/`, `Caddyfile`, `next-env.d.ts`, `/examples/`, `/mini-services/`, `/tests/`, `/download/`.

**Hasil verifikasi**:
- ✅ `git remote -v` → `origin https://github.com/rdjeee/moring-suksok.git`
- ✅ `git log --oneline -5` → 8 commits GitHub (d8b7223 HEAD)
- ✅ `git status` → clean: 1 modified (.gitignore) + 10 untracked (Z.ai Next.js essentials: src/, public/, configs, bun.lock)
- ✅ `specs/` ada (12 files termasuk SPECS-UPDATE-NOTIFICATION.md & VERSION.txt)
- ✅ `backend/` ada (pyproject.toml, requirements.txt, tests/)
- ✅ `prisma/`, `db/`, `src/lib/db.ts` sudah hilang
- ✅ Dev server Next.js masih jalan (`bun run dev` PID 1089, `GET / 200` ~25ms, browser load page OK)

**Catatan**: File `.env` (Z.ai sandbox env, berisi config non-sensitif) tetap dipertahankan untuk dev server jalan, tapi sudah di-ignore oleh .gitignore (tidak akan masuk GitHub).

---

### [DEV-DECISION-002] — 2026-10-29 — Z.ai shadcn/ui components dipertahankan untuk frontend

**Konteks**: Spek `specs/04-ui-guidelines.md` menyebut komponen shadcn/ui (New York style) dengan palette Moring green. Z.ai default sudah punya 48 shadcn/ui components terinstall di `src/components/ui/`.

**Keputusan**: Pertahankan semua 48 shadcn/ui components dari Z.ai default. Sesuai dengan instruksi sistem: "Use existing shadcn/ui components instead of building from scratch."

**Implikasi**: 
- Components siap pakai untuk build UI Moring Suksok
- Theme/palette perlu di-custom ke Moring green (`#2D6A4F` primary, dll) sesuai `specs/04-ui-guidelines.md` — akan dilakukan di tahap styling.

---

## 📚 Pending Questions ke Agent A

> Pertanyaan yang belum menjadi spec change request, tapi perlu klarifikasi

### [PENDING-Q-001] — 2026-10-29 — ✅ UPDATED: Konfirmasi strategi SQLite fallback untuk sandbox demo

Merujuk [SPEC-CHANGE-REQUEST-002] di atas (SCR-001 sudah resolved).

**Pertanyaan**: Apakah Agent A approve strategi SQLite fallback untuk sandbox demo? Backend FastAPI + SQLAlchemy models ditulis sekali (DB-agnostic), cukup ganti `DATABASE_URL` di `.env` untuk switch antara SQLite (sandbox) dan MySQL (production).

**Deadline ack**: Sebelum Agent B mulai implementasi SQLAlchemy models & Alembic migration (estimasi Minggu 1-2). Kalau tidak ada response, Agent B akan proceed dengan strategi ini (reversible).

### [PENDING-Q-002] — 2026-10-29 — Push ke GitHub: kapan?

Workspace sudah terhubung ke remote `origin` (GitHub repo), tapi belum push commit apapun. Ada 10 untracked files (Z.ai Next.js essentials) + 1 modified (.gitignore).

**Pertanyaan**: Apakah Agent B boleh push commit "feat: initialize Next.js frontend setup on Z.ai sandbox" sekarang, atau tunggu instruksi Agent A?

**Concern**: Push sekarang akan menambahkan `package.json`, `src/`, `public/`, `tailwind.config.ts`, dll ke GitHub repo. Ini file frontend yang memang zone Agent B, jadi seharusnya OK. Tapi `bun.lock` (328KB) juga akan ter-push — apakah OK atau perlu di-ignore?

---

## 🔄 Communication History

> Summary komunikasi penting dengan Agent A (reply, approvals, dll)

### 2026-10-29 — Acknowledge Mailbox NOTIF-001 & NOTIF-002

**NOTIF-001** (Initial Setup Specs v1.0.0) — ✅ **Acknowledged by Agent B on 2026-10-29 23:20 (Asia/Jakarta)**
- Actions taken:
  - [x] Baca `README.md` di root project untuk dual-agent workflow
  - [x] Baca `specs/decisions/ADR-001-tech-stack.md` — konfirmasi stack: Python FastAPI + Next.js PWA + MySQL + SQLAlchemy (BUKAN Prisma + SQLite + NextAuth)
  - [x] Baca `specs/05-data-model.md` (akan dibaca saat implementasi DB)
  - [x] Baca `specs/06-api-contracts.md` (akan dibaca saat implementasi backend)
  - [x] Workspace sudah disambungkan ke GitHub repo (DEV-DECISION-001)
- Notes: Spek v1.0.0 sudah dipahami. Deviasi arsitektur sandbox dicatat di SPEC-CHANGE-REQUEST-001 & 002.

**NOTIF-002** (Repository Restructured to Root Level) — ✅ **Acknowledged by Agent B on 2026-10-29 23:20 (Asia/Jakarta)**
- Actions taken:
  - [x] Repo structure verified: `specs/`, `backend/`, `docs/` ada di root `/home/z/my-project/`
  - [x] HAPUS default Z.ai: `prisma/`, `db/`, `src/lib/db.ts` (sesuai instruksi) — DONE
  - [x] NextAuth setup: tidak ada di Z.ai default (sudah bersih) — namun `next-auth` dep sudah dihapus dari `package.json` (DEV-DECISION-001)
  - [x] Makefile & docker-compose.yml siap pakai (sudah ada dari GitHub repo)
  - [x] `.env.example` & `.env.local.example` tersedia (akan di-fill saat setup backend/frontend)
- Notes: Siap untuk tahap berikutnya dari Agent A.

---

### [DEV-DECISION-003] — 2026-10-29 — Step 3: Setup Backend Python FastAPI (venv + deps + .env)

**Konteks**: Assignment Step 3 dari Agent A: setup Python venv di `backend/`, install dependencies dari `requirements.txt`, dan setup `.env`.

**Verifikasi environment sebelum eksekusi**:
- ✅ Python 3.12.16 tersedia (`/home/z/.venv/bin/python3` — active `python3` di PATH)
- ✅ Python 3.13.5 juga tersedia (`/usr/bin/python3.13` — system)
- ✅ pip 26.2.2 + uv 0.13.6 tersedia
- ❌ MySQL server TIDAK running (tidak ada `mysql`/`mysqld` command, port 3306 tidak listen)
- ✅ MySQL/MariaDB client libraries terinstall via apt (`default-libmysqlclient-dev`, `libmariadb-dev`, `libmariadb3`)
- ❌ Docker tidak tersedia (tidak bisa `docker-compose up` MySQL)
- ✅ `pyproject.toml` requires Python `>=3.11`, target `py311` — Python 3.12 memenuhi

**Aksi yang dilakukan**:
1. **Create venv**: `cd backend && python3 -m venv venv` → venv Python 3.12.16 di `backend/venv/`
2. **Upgrade pip**: `pip install --upgrade pip` (pip 26.2.2 already up-to-date)
3. **Install requirements**: `pip install -r requirements.txt` — **selesai dalam 20 detik** (15:23:34→15:23:54). Semua 22+ key packages terinstall dengan pre-built wheels (cp312), tanpa compilation error:
   - Core: fastapi 0.115.6, uvicorn 0.34.0, starlette 0.41.3, python-multipart 0.0.20
   - DB/ORM: SQLAlchemy 2.0.36, alembic 1.14.0, PyMySQL 1.1.1, cryptography 44.0.0
   - Validation: pydantic 2.10.4, pydantic-settings 2.7.0, email-validator 2.2.0
   - Auth: python-jose 3.3.0, passlib 1.7.4, bcrypt 4.2.1
   - Storage/Image: cloudinary 1.41.0, Pillow 11.0.0
   - QRIS: qrcode 7.4.2
   - PDF/Excel: reportlab 4.2.5, openpyxl 3.1.5
   - Firebase: firebase-admin 6.6.0
   - HTTP: httpx 0.28.1
   - Logging: loguru 0.7.3, python-json-logger 3.2.1
   - Rate limit: slowapi 0.1.9
   - Testing: pytest 8.3.4, pytest-asyncio 0.25.0, pytest-cov 6.0.0
   - Code quality: ruff 0.8.4, black 24.10.0, mypy 1.13.0
4. **Smoke test**: Semua key packages importable di venv (fastapi, sqlalchemy, pydantic, alembic, pymysql, bcrypt, Pillow, reportlab, dll)
5. **Setup .env**: `cp .env.example .env`, lalu:
   - Generate JWT_SECRET via `python -c "import secrets; print(secrets.token_urlsafe(48))"` → 64 chars (min 32 ✅)
   - Replace placeholder `JWT_SECRET=change-this-to-random-min-32-characters-string` dengan generated value
   - DATABASE_URL tetap `mysql+pymysql://root:@localhost:3306/moring_suksok` (production target)
   - Cloudinary & Firebase: tetap placeholder (butuh creds asli dari user)
   - Semua other defaults: dipertahankan (CORS, APP_*, BUSINESS_*, RATE_LIMIT_*, LOG_*)
6. **Verify .env**: 24 variables ter-parse dengan benar via simulasi pydantic-settings
7. **Verify gitignore**: `backend/venv/` (397MB) & `backend/.env` keduanya ter-gitignore → `git status` clean

**Hasil**:
- ✅ Backend Python environment siap untuk development
- ✅ `uvicorn app.main:app --reload --port 8000` bisa dijalankan (begitu `app/main.py` dibuat di tahap berikutnya)
- ⚠️ Backend belum bisa connect ke MySQL (no MySQL server di sandbox) — lihat SCR-002 untuk strategi SQLite fallback
- ⚠️ Cloudinary & Firebase creds butuh diisi user (untuk fitur upload image & push notif)

**Catatan untuk Agent A**: SCR-001 di-update menjadi ✅ RESOLVED (Python tersedia). SCR-002 di-update dengan strategi SQLite fallback yang lebih clean (SQLAlchemy DB-agnostic, cuma beda `DATABASE_URL`).

---

### [DEV-DECISION-004] — 2026-10-29 — Step 5: SQLAlchemy models + Alembic migration + seed (9 tabel ter-create)

**Konteks**: Assignment Step 5 dari Agent A: `make migrate` (Alembic upgrade head → create 9 tabel) + `make seed` (insert admin + 3 produk + settings).

**Aksi yang dilakukan**:

1. **Buat backend/app/ structure**:
   - `app/__init__.py`, `app/core/__init__.py`, `app/models/__init__.py`
   - `app/schemas/__init__.py`, `app/api/__init__.py`, `app/api/v1/__init__.py`, `app/services/__init__.py` (empty placeholders for later steps)

2. **Tulis core modules**:
   - `app/core/config.py` — Settings class via pydantic-settings, reads `backend/.env` (absolute path resolved from `__file__`). Uses `load_dotenv(override=True)` untuk override Z.ai sandbox env var `DATABASE_URL=file:/home/z/my-project/db/custom.db` (sisa Prisma default).
   - `app/core/database.py` — SQLAlchemy engine (DB-agnostic: SQLite `check_same_thread=False`, MySQL default), SessionLocal, Base, `get_db()` FastAPI dependency.
   - `app/core/security.py` — passlib + bcrypt (12 rounds), python-jose JWT (create + decode).

3. **Tulis 9 SQLAlchemy models** (sesuai specs/05-data-model.md §4):
   - `admin.py` — Admin (7 cols)
   - `customer.py` — Customer (11 cols + idx_customer_type, ENUM customer_type)
   - `product.py` — Product (10 cols, slug unique, DECIMAL base_price)
   - `product_variant.py` — ProductVariant (6 cols + FK product_id CASCADE + unique (product_id, variant_name))
   - `order.py` — Order (14 cols + 3 indexes + FK customer_id, ENUM status 5 values)
   - `order_item.py` — OrderItem (10 cols + 3 FKs, snapshot fields)
   - `payment.py` — Payment (12 cols + 1 index + FK order_id CASCADE, ENUM method + status)
   - `notification.py` — Notification (10 cols + 1 index + FK related_order_id SET NULL, 3 ENUMs)
   - `setting.py` — Setting (5 cols + unique key_name)
   - Semua models DB-agnostic (works untuk MySQL & SQLite via SQLAlchemy 2.0)

4. **Tulis FastAPI skeleton**: `app/main.py` — minimal app dengan CORS middleware + `/` (root info) + `/health` (health check). Routers akan di-wire di Step berikutnya per specs/06-api-contracts.md.

5. **Setup Alembic**:
   - `alembic init alembic` (generate standard structure)
   - Customize `alembic/env.py`: import `app.models` (registers all 9 tables on Base.metadata), set `target_metadata = Base.metadata`, override `sqlalchemy.url` dari `settings.DATABASE_URL`
   - Update `alembic.ini`: comment placeholder untuk `sqlalchemy.url` (overridden by env.py)

6. **Generate migration**: `alembic revision --autogenerate -m "init schema - 9 tables"` → file `448d5b9caa1e_init_schema_9_tables.py`. Semua 9 tabel + 6 indexes terdeteksi.

7. **Index name collision fix** (lihat MIGRATION-NOTES.md Issue 001):
   - First attempt (`a69b4aa5b794`) gagal: `idx_status` dipakai di both `orders` & `payments` → SQLite global index name collision.
   - Fix: prefix index names dengan table name: `idx_orders_status`, `idx_orders_customer`, `idx_orders_created`, `idx_payments_status`. Other indexes (`idx_customer_type`, `idx_user`) tetap (no collision).
   - Reset DB + regenerate migration → `448d5b9caa1e` (sukses).

8. **Run migration**: `alembic upgrade head` → 9 tabel ter-create di SQLite sandbox. Verified: 9 user tables + 1 alembic_version bookkeeping table, 6 indexes (no collisions), 6 foreign keys.

9. **Tulis seed script**: `backend/seed.py` — idempotent (safe to run multiple times). Inserts:
   - 1 admin (admin@moring-suksok.com / admin123, bcrypt hash `$2b$12$...`)
   - 6 settings (owner_qris_static, owner_dana_number, owner_whatsapp, business_name, business_address, shipping_cost_flat)
   - 3 produk (Original Rp15K, Pedas Rp17K, Keju Rp18K)
   - 7 varian (3+2+2, dengan stock)

10. **Run seed**: `python seed.py` → semua data ter-insert. Verified row counts: admins=1, settings=6, products=3, product_variants=7, others=0 (expected).

**Hasil verifikasi**:
- ✅ 9 tabel ter-create di SQLite sandbox (admins, customers, products, product_variants, orders, order_items, payments, notifications, settings)
- ✅ 6 indexes (all table-prefixed names, no collisions)
- ✅ 6 foreign keys (all relations per spec ERD)
- ✅ 1 admin record (bcrypt-hashed password)
- ✅ 6 settings records
- ✅ 3 products + 7 variants
- ✅ FastAPI app importable (6 routes: /, /health, /docs, /redoc, /openapi.json, /docs/oauth2-redirect)
- ✅ `git status` clean (venv/, .env, .db ter-gitignore)

**Issues ditemukan** (lihat KNOWN-ISSUES.md):
- 🟡 ISSUE-001: Makefile recipe lines pakai spaces bukan TABs → `make migrate` gagal. Workaround: run alembic directly. Fix request: [SHARED-EDIT-REQUEST-001] di bawah.
- 🟢 ISSUE-002: passlib + bcrypt 4.x version warning (cosmetic, hashing tetap work)
- 🟢 ISSUE-003: SQL echo verbose (DEBUG=true) — bisa set DEBUG=false untuk silence

**Deviasi dari spec** (minor, tidak mengubah functionality):
- Index names: `idx_status` → `idx_orders_status` / `idx_payments_status` (DB-agnostic untuk SQLite compatibility). Spec `specs/05-data-model.md` §4.5 & §4.7 pakai `idx_status` untuk both tables (valid di MySQL, invalid di SQLite). Functionality identik — indexes serve same query-optimization purpose.

**Untuk production (mesin lokal user dengan Laragon)**:
```bash
# 1. Edit backend/.env: comment SQLite line, uncomment MySQL line:
#    DATABASE_URL=mysql+pymysql://root:@localhost:3306/moring_suksok
# 2. Pastikan DB "moring_suksok" sudah dibuat di phpMyAdmin (utf8mb4_unicode_ci)
cd backend && source venv/bin/activate
alembic upgrade head    # creates 9 tables in MySQL
python seed.py          # inserts admin + settings + products
# 3. Verify di phpMyAdmin: http://localhost/phpmyadmin → moring_suksok → 9 tabel
```

---

## 📨 SHARED-EDIT-REQUESTS (untuk Agent A)

> Sesuai OWNERSHIP.md §Communication Protocol, Agent B request edit SHARED files via mailbox.

### [SHARED-EDIT-REQUEST-001] — 2026-10-29 — ✅ APPROVED & FIXED: Makefile spaces → TABs

**File**: Makefile (SHARED — default owner: Agent A)
**Reason**: `make` commands gagal karena recipe lines pakai 8 spaces bukan TAB characters. GNU Make memerlukan TAB di awal recipe lines. Semua `make *` commands error: `Makefile:35: *** missing separator`.
**Proposed Change**: Replace all 8-space indents in recipe lines dengan TAB characters. Contoh:
```makefile
# BEFORE (broken):
migrate:
        @echo "..."           # ← 8 spaces
        cd backend && ...     # ← 8 spaces

# AFTER (fixed):
migrate:
        @echo "..."           # ← TAB
        cd backend && ...     # ← TAB
```
**Status**: ✅ APPROVED & FIXED by Agent A on 2026-10-30
**Deadline**: ASAP — blocking semua `make *` commands (workaround: run alembic directly)
**Impact**: Tidak mengubah logic Makefile, cuma fix whitespace. Semua targets akan work setelah fix.

**Agent A Response**:
- **Status**: ✅ Approved & Fixed
- **Decision**: Agent A fixed Makefile sendiri (lebih cepat & atomic daripada review-approve Agent B fix). Alasan:
  1. Makefile adalah SHARED file yang default owner-nya Agent A
  2. Fix bersifat mechanical (whitespace only), tidak butuh review logic
  3. Blocking Agent B's workflow (semua `make *` commands error)
  4. Atomic fix lebih aman daripada multi-step approval
- **Action taken**:
  1. Verified error: `make help` produced `Makefile:35: *** missing separator (did you mean TAB instead of 8 spaces?). Stop.` — confirmed bug
  2. Wrote Python script to convert all 8-space indents in recipe lines to TAB characters
  3. Ran script → Makefile updated
  4. Verified fix: `make help` now outputs full command list (32+ targets) without error
  5. Tested `make tree` — works correctly, lists project structure
  6. Tested `make migrate` — parses correctly (note: error karena `backend/venv/` tidak ada di sandbox Agent A, ini expected — Agent B punya venv-nya)
- **Verification**: 
  ```bash
  $ make help
  🌿 Moring Suksok — Development Commands
  =============================================
  Usage: make <target>
  Targets:
    help               Tampilkan semua command yang tersedia
    setup              Setup pertama kali (install deps + db)
    dev                Jalankan backend & frontend paralel (dev mode)
    migrate            Run Alembic migration (upgrade head)
    ...
  ```
- **Lock period**: None — Agent B may now freely use `make *` commands. Future SHARED edits to Makefile still require coordination via mailbox.

**Result**: ISSUE-001 closed. Agent B dapat langsung pakai `make migrate`, `make seed`, `make dev`, dll. tanpa workaround.

---

### [DEV-DECISION-005] — 2026-10-30 — Step 6: Setup Frontend (Next.js PWA) + Moring green theme

**Konteks**: Assignment Step 6 dari Agent A: setup `.env.local`, configure shadcn/ui (New York style, custom ke #2D6A4F), tambah components (button card input label toast dialog dropdown-menu badge avatar separator tabs).

**Aksi yang dilakukan**:

1. **Verifikasi shadcn/ui components** (sudah ada dari Step 1):
   - Z.ai default sudah install **48 shadcn/ui components** dengan **New York style** ✅
   - Semua 11 components yang diminta Step 6 (button, card, input, label, toast, dialog, dropdown-menu, badge, avatar, separator, tabs) **sudah ada** — tidak perlu `npx shadcn add`
   - `components.json` sudah dikonfigurasi: style=new-york, baseColor=neutral, cssVariables=true, iconLibrary=lucide

2. **Setup `.env.local`**:
   - Copy `.env.local.example` → `.env.local` (gitignored ✅)
   - Values: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`, Firebase placeholders, `NEXT_PUBLIC_PWA_THEME_COLOR=#2D6A4F`
   - Firebase & VAPID keys tetap placeholder (butuh creds asli dari user untuk PWA push notif)

3. **Configure Moring green theme** (sesuai specs/04-ui-guidelines.md §2):
   - **`src/app/globals.css`**: Rewrite dengan Moring green palette
     - Primary = `#2D6A4F` (152 42% 30%) — moring green primary
     - Secondary = `#52B788` (152 38% 52%) — moring green light
     - Accent = `#D8F3DC` (122 50% 90%) — moring green pale
     - Custom tokens: `--moring-green`, `--moring-green-dark`, `--moring-green-light`, `--moring-green-pale`
     - Semantic status colors: `--success` (#10B981), `--warning` (#F59E0B), `--danger` (#EF4444), `--info` (#3B82F6)
     - Dark theme variant (inverted green-tinted)
     - Border radius 8px (spec §4.3 radius-md)
   - **`tailwind.config.ts`**: Extend dengan moring-green tokens, semantic colors, custom fontFamily (Plus Jakarta Sans + JetBrains Mono), radius & shadow scales per spec
   - **Bug fix**: Tailwind v4 `@theme inline` generate `background-color: var(--primary)` tanpa `hsl()` wrapper. CSS Color 4 space-separated values (`152 42% 30%`) didukung Chrome 121+/Firefox 128+ tapi tidak Playwright Chromium (agent-browser). Fix: bungkus semua `@theme inline` `--color-*` dengan `hsl(var(--xxx))` untuk broad compatibility. Verified: `bg-primary` = `rgb(44, 109, 79)` = #2D6A4F ✅

4. **Update fonts** (sesuai spec §3.1):
   - `src/app/layout.tsx`: Replace Geist/Geist_Mono dengan **Plus Jakarta Sans** (heading & body) + **JetBrains Mono** (numeric/order code per spec §3.3)
   - Load via `next/font/google` dengan display=swap, weights 400-800 (Plus Jakarta) + 400-600 (JetBrains)

5. **Update metadata** (sesuai spec branding):
   - Title: "Moring Suksok — Snack Sehat dari Alam 🌿"
   - Description, keywords, openGraph, twitter card sesuai brand
   - `themeColor: "#2D6A4F"` di viewport (PWA)
   - `lang="id"` (Bahasa Indonesia)
   - Manifest: `/manifest.json`

6. **PWA setup**:
   - `public/manifest.json`: name, short_name, description, theme_color #2D6A4F, background_color #FFFFFF, icons, shortcuts (Produk, Cart)
   - `public/icon.svg`: Moringa leaf on green background (SVG, scalable)

7. **API client** (`src/lib/api.ts`):
   - `apiFetch<T>()` generic fetch wrapper dengan error handling & JSON parsing
   - `api.get/post/put/patch/delete` helpers
   - JWT auto-attach dari localStorage (client-side)
   - **Sandbox gateway-aware**: detect z.ai domain → use relative path `/api/v1` (Caddy will forward with XTransformPort=8000). Production: pakai NEXT_PUBLIC_API_URL langsung.
   - `formatIDR()` helper untuk format Rupiah (spec §3.3): `75000` → `"Rp 75.000"`

8. **Landing page** (`src/app/page.tsx`) — sesuai spec §6.1:
   - **Header**: logo (leaf icon + "Moring Suksok"), nav (Beranda/Produk/Tentang/Kontak), cart icon + badge, user icon, Masuk button
   - **Hero section**: badge "Camilan Cimol Kering (Moring)", h1 "Cimol Kering Moring Renyah & Bergizi", CTA buttons (Belanja Sekarang, Pelajari Lebih), trust badges (100% Natural, Gratis Ongkir, Rating 4.9), gradient background from-moring-green-pale
   - **Features strip**: 4 features (Natural, Bergizi, Cepat Sampai, Terpercaya) dengan icons
   - **Products section**: grid 2 cols mobile / 3-4 cols desktop, 3 product cards (Original, Pedas, Keju) dengan harga formatIDR, variants badge, "Tambah" button (interaktif: click → "Ditambahkan ✓")
   - **Tentang section**: brand story + stats (100% Natural, 3+ Varian, 4.9★ Rating)
   - **Footer** (sticky bottom per UI rules): dark green bg, Kontak + Layanan info, copyright
   - **Responsive**: mobile-first, grid breakpoints per spec §9
   - **Loading state**: skeleton cards (animated pulse)
   - **Error state**: card dengan AlertCircle
   - **Fallback data**: 3 produk dari seed data (karena backend /products endpoint belum ada — akan dibuat Step 7)

9. **ESLint config** (`eslint.config.mjs`):
   - Add ignores: `backend/**`, `download/**`, `tests/**`, `mini-services/**`, `upload/**` (Z.ai artifacts, bukan kode project)
   - Result: **lint 0 errors, 0 warnings** ✅

**Hasil verifikasi** (via agent-browser + VLM):
- ✅ Page title: "Moring Suksok — Snack Sehat dari Alam 🌿"
- ✅ Moring green theme aktif: Masuk button = `rgb(44, 109, 79)` (#2D6A4F), Tambah buttons = green, Footer = `rgb(24, 67, 47)` (#184330 ≈ moring-green-dark)
- ✅ VLM verify 7/7 checks: header green button ✅, hero gradient ✅, Belanja CTA green ✅, 3 product cards with green Tambah ✅, dark green footer ✅, green leaf logo ✅, Rupiah prices ✅
- ✅ Interactivity: click "Tambah" → button changes to "Ditambahkan ✓" (disabled state)
- ✅ Responsive: mobile (390x844) & desktop (1280x720) both render correctly
- ✅ Dev server healthy: HTTP 200, ~25ms response
- ✅ Lint: 0 errors, 0 warnings

**Catatan untuk Step 7+**:
- Landing page pakai fallback data (3 produk hardcoded). Begitu backend `/products` endpoint dibuat (Step 7), page akan auto-fetch dari API (sudah ada try/catch fallback).
- Firebase & VAPID keys masih placeholder — butuh creds asli dari user untuk PWA push notification.
- PWA service worker belum dibuat — akan dibuat di tahap PWA finalization.

---

### [DEV-DECISION-006] — 2026-10-30 — Step 7: Setup API Client (Axios + JWT interceptors)

**Konteks**: Assignment Step 7 dari Agent A: buat `src/lib/api.ts` dengan Axios client + JWT interceptor (request: attach token, response: handle 401 auto-logout). Di Step 6 saya sudah buat api.ts versi fetch-based; Step 7 minta Axios secara explicit.

**Aksi yang dilakukan**:

1. **Install axios**: `bun add axios` → axios 1.21.0 terinstall (14 packages added, 547ms)

2. **Rewrite `src/lib/api.ts`** dengan Axios + enhancements:
   - **Axios instance**: `baseURL` dari `getBaseURL()` (sandbox gateway-aware: pakai `window.location.origin + /api/v1` di z.ai domain, atau `NEXT_PUBLIC_API_URL` di production), timeout 15s, Content-Type JSON
   - **Request interceptor**:
     - Auto-attach JWT token dari `localStorage[TOKEN_KEY]` (key: `"moring_token"`) ke `Authorization: Bearer <token>`
     - **Sandbox gateway injection**: di z.ai domain, auto-add `XTransformPort=8000` ke query params agar Caddy gateway forward ke backend FastAPI port 8000
   - **Response interceptor**:
     - 401 Unauthorized → `localStorage.removeItem(TOKEN_KEY)` + redirect ke `/login` (dengan guard: tidak redirect kalau sudah di `/login` untuk avoid loop)
     - Error normalization: transform axios error ke `ApiError` shape `{ message, status, data, isNetworkError, isAuthError }` untuk consistency di UI layer
   - **Typed API helpers**: `apiClient.get/post/put/patch/delete` dengan TypeScript generics
   - **`apiRequest<T>()`**: generic typed request helper
   - **`tokenManager`**: object dengan `get/set/remove/isAuthenticated` methods untuk auth context (Step 8+)
   - **`formatIDR()`**: format Rupiah Indonesia (spec §3.3) — `75000` → `"Rp 75.000"`
   - **`formatDateID()`**: format ISO date ke Bahasa Indonesia — `"2026-10-29T15:30"` → `"29 Okt 2026, 15.30"`
   - **Exports**: default export `api` (axios instance untuk advanced usage), named exports `apiClient`, `tokenManager`, `formatIDR`, `formatDateID`, `apiRequest`, `ApiError` type, `TOKEN_KEY`

3. **Update `src/app/page.tsx`**: Ganti import dari `api` (old fetch-based) ke `apiClient` (new axios-based). Update API call dari `api.get<>()` ke `apiClient.get<>()`. Landing page tetap pakai fallback data dengan graceful try/catch.

4. **ESLint**: 0 errors, 0 warnings ✅

**Hasil verifikasi** (via agent-browser):
- ✅ Page title: "Moring Suksok — Snack Sehat dari Alam 🌿"
- ✅ 5 produk render (Moring Original, Pedas, Keju, Balado, Jagung) — fallback data
- ✅ Console: `"Backend /products belum tersedia, pakai fallback data: Network Error"` — axios interceptor catch error dengan graceful fallback
- ✅ Tidak ada uncaught errors
- ✅ Dev server HTTP 200

**Struktur file `src/lib/api.ts`** (220 lines):
```
Exports:
  - default api          (axios instance — advanced usage)
  - apiClient            (typed helpers: get/post/put/patch/delete)
  - apiRequest<T>()      (generic typed request)
  - tokenManager         (get/set/remove/isAuthenticated)
  - formatIDR()          (Rupiah formatter)
  - formatDateID()       (Indonesian date formatter)
  - TOKEN_KEY            ("moring_token")
  - type ApiError        (normalized error shape)
  - type Product, etc.   (akan ditambah di Step 8+)
```

**Catatan untuk Step 8+**:
- `tokenManager` siap pakai untuk auth context (login/register/logout flows)
- Response interceptor sudah auto-redirect ke `/login` on 401 — halaman `/login` akan dibuat di Step 8
- Sandbox gateway injection (`XTransformPort=8000`) sudah aktif otomatis di z.ai domain — backend FastAPI akan reachable saat dijalankan di port 8000
- `formatIDR` & `formatDateID` siap pakai untuk product cards, cart, order history, invoice PDF, dll

---

### [DEV-DECISION-007] — 2026-10-30 — Step 8 & 9: Run Development + Verify Setup Berhasil

**Konteks**: Assignment Step 8 (jalankan development: `make dev-backend` + `make dev-frontend`) & Step 9 (verify setup berhasil). Makefile masih broken (ISSUE-001: spaces vs TABs), jadi jalankan commands directly.

**Aksi yang dilakukan**:

1. **Backend FastAPI startup** (port 8000):
   - `cd backend && source venv/bin/activate && DEBUG=false venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
   - **Sandbox process reaper issue**: Background processes get killed between bash commands. Workaround: start backend + run all verification in ONE bash command (before reaper kills it). `setsid` helps for longer sessions but not persistent across commands.
   - Backend verified: `/health` → `{"status":"ok","db_engine":"sqlite"}`, `/docs` → HTTP 200 (Swagger UI), `/openapi.json` → valid OpenAPI 3.1.0 spec

2. **Frontend Next.js** (port 3000):
   - Already running (Z.ai sandbox dev server, persistent)
   - HTTP 200, ~25ms response

3. **End-to-end test** (via agent-browser):
   - Open `http://localhost:3000` → page renders with title "Moring Suksok — Snack Sehat dari Alam 🌿"
   - Console: `"Backend /products belum tersedia, pakai fallback data: Not Found"`
   - **KEY FINDING**: Error changed from "Network Error" (backend down, Step 7) → "Not Found" (backend up, 404). This PROVES axios client successfully reaches backend FastAPI through the stack!
   - 5 products render (fallback data): Moring Original, Pedas, Keju, Balado, Jagung
   - Footer green: `rgb(24, 67, 47)` = Moring green dark ✅

4. **Comprehensive verification** (Step 9):
   - ✅ Git: workspace = GitHub repo `rdjeee/moring-suksok`, branch main, 0 uncommitted changes
   - ✅ Project structure: specs/ (12 files), backend/app/ (20 Python files), backend/alembic/ (migration), src/ (48 shadcn/ui + app + lib + hooks), public/ (manifest + icon)
   - ✅ Lint: 0 errors, 0 warnings
   - ✅ DB: 9 tables (admins=1, customers=0, products=3, product_variants=7, orders=0, order_items=0, payments=0, notifications=0, settings=6)
   - ✅ Admin login: admin@moring-suksok.com / admin123
   - ✅ Products: Original Rp15K, Pedas Rp17K, Keju Rp18K

**End-to-end stack verified**:
```
Frontend (Next.js :3000) → Axios + JWT interceptor → Caddy gateway (XTransformPort=8000) → Backend (FastAPI :8000) → SQLAlchemy → SQLite DB (9 tables + seed data)
```

**Sandbox limitation note**:
- Backend FastAPI tidak bisa run persistently di sandbox (process reaper). Untuk development & testing, start backend on-demand dalam satu bash command.
- Di mesin lokal user (Laragon): `cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000` akan run persistently dengan auto-reload.
- Frontend Next.js tetap persistent di sandbox (Z.ai dev server).

**Setup Status: ✅ ALL 9 STEPS COMPLETED & VERIFIED**

| Step | Description | Status |
|------|-------------|--------|
| 1 | Workspace → GitHub repo | ✅ |
| 2 | Hapus Z.ai defaults (Prisma/SQLite/NextAuth) | ✅ |
| 3 | Setup Backend (Python venv + deps + .env) | ✅ |
| 4 | Setup Database (SQLite sandbox / MySQL production) | ✅ |
| 5 | Run Migration & Seed (9 tables + data) | ✅ |
| 6 | Setup Frontend (Next.js PWA + Moring green theme) | ✅ |
| 7 | Setup API Client (Axios + JWT interceptors) | ✅ |
| 8 | Run Development (backend + frontend) | ✅ |
| 9 | Verify Setup Berhasil | ✅ |

---

### [DEV-DECISION-008] — 2026-10-30 — Minggu 2: Auth Module (E1-S1 s/d E1-S8) + ISSUE-002 fix + ISSUE-003 fix

**Konteks**: Setelah Agent A review Minggu 1 (NOTIF-003, verdict EXCELLENT ⭐⭐⭐⭐⭐), mulai Minggu 2: Auth Module. Agent A instructions: pull latest (d7b9e08), read NOTIF-003, fix ISSUE-002 & ISSUE-003, implement E1-S1 s/d E1-S8.

**Aksi yang dilakukan**:

1. **Pull latest** (commit d7b9e08): Makefile fix (ISSUE-001 closed), NOTIF-003, specs v1.0.3, SCR-002 approved
2. **Verify Makefile fix**: `make help` works (32+ targets), `make migrate` parses correctly ✅
3. **Fix ISSUE-003** (SQL echo verbose): Added `SQL_ECHO` env var (default false) to config.py, database.py uses `echo=settings.SQL_ECHO` instead of `echo=settings.DEBUG`. Updated .env & .env.example. Now SQL statements don't flood console unless explicitly enabled.
4. **Fix ISSUE-002** (passlib + bcrypt 4.x warning): Rewrote `security.py` — switched from passlib to **direct bcrypt usage** (bcrypt.gensalt + bcrypt.hashpw + bcrypt.checkpw). 12 rounds maintained. Old passlib-hashed passwords (admin from seed) still verify correctly (bcrypt standard format compatible). 0 warnings in logs.
5. **Implement Auth Module** (7 endpoints per specs/06-api-contracts.md §2.1):
   - `app/schemas/common.py`: SuccessResponse, ErrorResponse, TokenMeta, Meta (standard response format per spec §1.4-1.5)
   - `app/schemas/auth.py`: RegisterRequest, LoginRequest, UpdateProfileRequest, CustomerData, AdminData, CustomerProfileData (with validation: email, phone format, password letter+number)
   - `app/api/deps.py`: JWT dependencies — get_current_user, get_current_customer, get_current_admin. HTTPBearer security scheme, role-based access control (403 for wrong role), soft-delete check (is_active)
   - `app/api/v1/auth.py`: 7 endpoints:
     - POST /auth/register — customer registration with validation, returns JWT
     - POST /auth/login — customer login, bcrypt verify, returns JWT
     - POST /auth/admin/login — admin login, separate endpoint, role=admin
     - POST /auth/refresh — refresh JWT token
     - POST /auth/logout — stateless logout (client discards token)
     - GET /auth/me — full profile (customer or admin)
     - PATCH /auth/me — update profile (name, phone, address, fcm_token)
   - `app/main.py`: Wired auth router with prefix /api/v1

**Test results** (all 10 tests PASSED):
1. ✅ Register new customer → 201 + JWT token
2. ✅ Login customer → 200 + JWT token
3. ✅ GET /auth/me → full profile with phone, address, created_at
4. ✅ PATCH /auth/me → update name + fcm_token
5. ✅ POST /auth/refresh → new token with fresh expiry
6. ✅ POST /auth/logout → personalized farewell message
7. ✅ Admin login → 200 + admin data with role="admin"
8. ✅ Negative: wrong password → 401 "Email atau password salah."
9. ✅ Negative: no token → 401 "Token autentikasi tidak ditemukan..."
10. ✅ ISSUE-002: 0 passlib warnings in logs

**NOTIF-003 Acknowledge**:
- ✅ Read NOTIF-003 (Agent A review, verdict EXCELLENT, SCR-002 approved, Makefile fixed, specs v1.0.3)
- ⚠️ **Cannot edit specs/SPECS-UPDATE-NOTIFICATION.md** to move NOTIF-003 to "Acknowledged" section — per OWNERSHIP.md, specs/** is Agent A ONLY. This is a **spec conflict**: mailbox protocol (step 9) says "Agent B pindahkan notif dari Pending → Acknowledged" but OWNERSHIP.md forbids Agent B from editing specs/**.
- **Resolution request**: Agent A to either (a) move NOTIF-003 to Acknowledged on behalf of Agent B, or (b) update OWNERSHIP.md to allow Agent B to edit ONLY the "Acknowledged" section of SPECS-UPDATE-NOTIFICATION.md
- **Workaround**: This acknowledge is documented in DECISIONS-DEV.md (Agent B zone) as proof of compliance

**Stories completed**: E1-S1, E1-S2, E1-S3, E1-S4, E1-S5, E1-S7, E1-S8 (7/8 auth stories; E1-S6 "refresh" also done as bonus)

**Remaining for Minggu 2**: Frontend auth pages (login, register) — will be done next

---

**Last Updated**: 2026-10-30 01:05 (Asia/Jakarta) — Agent B: Minggu 2 Auth Module backend complete (7 endpoints + ISSUE-002/003 fixed)
