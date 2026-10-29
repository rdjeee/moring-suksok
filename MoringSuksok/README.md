# 🌿 Moring Suksok — Sistem Distribusi & Pencatatan Transaksi

> **Tugas Akhir** — Aplikasi mini e-commerce untuk UMKM Moring Suksok (snack kripik daun kelor)
> Menggantikan pemesanan via WhatsApp & nota manual dengan sistem terstruktur + pencatatan transaksi otomatis.

![Status](https://img.shields.io/badge/Status-Planning%20v1.0.0-success)
![Tech](https://img.shields.io/badge/Stack-Next.js%20PWA%20%2B%20FastAPI%20%2B%20MySQL-blue)
![License](https://img.shields.io/badge/License-Academic%20TA-orange)

---

## 📁 Lokasi Repository

```
Workspace Root:  /home/z/my-project/
Project Folder:  /home/z/my-project/MoringSuksok/
```

> ⚠️ **PENTING**: Folder project bernama `MoringSuksok` (camelCase, tidak ada spasi).
> Jangan dicari di `my-app/` — folder itu sudah direname.

---

## 📖 Tentang Proyek

Moring Suksok adalah UMKM pengolahan daun kelor (moringa) dengan produk utama snack/kripik moring. Saat ini penjualan masih dilakukan via WhatsApp dengan pencatatan manual menggunakan nota. Sistem ini dibangun untuk:

1. **Menggantikan pemesanan via WhatsApp** dengan mini e-commerce terstruktur
2. **Menggantikan nota manual** dengan nota digital otomatis (PDF)
3. **Memantau distribusi produk** via tracking status pesanan end-to-end
4. **Pencatatan transaksi otomatis** untuk pembukuan akuntan

### 🎯 Highlight Fitur

- ✅ Mini e-commerce dengan katalog produk + varian
- ✅ Cart & checkout dengan kalkulasi ongkir flat
- ✅ Pembayaran QRIS dinamis (nominal embedded, sesuai EMVCo standard)
- ✅ Upload bukti pembayaran + verifikasi manual owner
- ✅ Tracking status: Pending → Diproses → Dikirim → Selesai
- ✅ Notifikasi hybrid: Push Notification PWA + WhatsApp deep link
- ✅ PWA installable di Android (Add to Home Screen)
- ✅ Laporan transaksi dengan export PDF/Excel
- ✅ Segmentasi customer Ritel/Masyarakat (untuk analisis owner)
- ✅ Admin dashboard dengan analytics

---

## 🏗️ Tech Stack

| Layer | Teknologi | Detail |
|---|---|---|
| **Frontend** | Next.js 14+ PWA | React 18 + TypeScript + Tailwind CSS + shadcn/ui |
| **Backend** | Python FastAPI | Async REST API + Pydantic validation + auto Swagger docs |
| **Database** | MySQL 8.4.3 | Via Laragon (dev) / Railway MySQL (prod) |
| **DB GUI** | phpMyAdmin 6.2.3 | Sudah terinstall via Laragon |
| **ORM** | SQLAlchemy 2.0 + Alembic | Untuk Python ↔ MySQL |
| **Auth** | JWT (PyJWT + bcrypt) | Stateless, role-based (customer/admin) |
| **Push Notif** | Firebase Cloud Messaging | Free, via service worker PWA |
| **Image Storage** | Cloudinary | Free tier 25 credits/month |
| **WhatsApp** | wa.me deep link | Backup notifikasi (semi-otomatis) |
| **QRIS** | qris-utils + qrcode (Python) | Self-generated, sesuai EMVCo |
| **PDF** | ReportLab (Python) | Nota & laporan |
| **Deployment** | Vercel + Railway + PlanetScale | Free tiers untuk TA |

Lihat detail di `specs/decisions/ADR-001-tech-stack.md`.

---

## 📁 Struktur Repository

```
/home/z/my-project/MoringSuksok/      ← 📂 PROJECT ROOT
│
├── specs/                              ← 🤖 ZONE AGENT A (Planning)
│   ├── 00-vision.md                    ← Executive summary + tujuan
│   ├── 01-requirements.md              ← Latar belakang + scope + batasan
│   ├── 02-architecture.md              ← Arsitektur sistem + security
│   ├── 03-features.json                ← Epic → Stories (machine-readable)
│   ├── 04-ui-guidelines.md             ← UI/UX direction + palette + components
│   ├── 05-data-model.md                ← ERD + 9 tabel + SQL DDL
│   ├── 06-api-contracts.md             ← FastAPI endpoint specs
│   ├── 07-user-flows.md                ← Flow customer + owner + state machine
│   ├── 08-acceptance-criteria.md       ← AC per story (Given-When-Then)
│   ├── research/                       ← Riset teknis (QRIS, FCM, dll)
│   ├── decisions/                      ← ADR (Architecture Decision Records)
│   │   ├── ADR-001-tech-stack.md
│   │   ├── ADR-002-qris-self-generated.md
│   │   └── ADR-003-decoupled-architecture.md
│   ├── CHANGELOG.md                    ← Tracking perubahan specs
│   └── VERSION.txt                     ← 1.0.0 (semantic versioning)
│
├── frontend/                           ← 🤖 ZONE AGENT B (Next.js PWA)
│   ├── src/
│   ├── public/
│   ├── tests/
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.ts
│
├── backend/                            ← 🤖 ZONE AGENT B (Python FastAPI)
│   ├── app/
│   │   ├── main.py
│   │   ├── core/                       ← config, database, security
│   │   ├── models/                     ← SQLAlchemy models (9 tabel)
│   │   ├── schemas/                     ← Pydantic schemas
│   │   ├── api/v1/                     ← Endpoint modules
│   │   └── services/                   ← Business logic (QRIS, FCM, dll)
│   ├── alembic/                        ← Database migrations
│   ├── requirements.txt
│   └── .env.example
│
├── PROGRESS.md                         ← 🤖 ZONE AGENT B (log progress mingguan)
├── DECISIONS-DEV.md                    ← 🤖 ZONE AGENT B (dev decisions + spec change requests)
├── MIGRATION-NOTES.md                  ← 🤖 ZONE AGENT B (Alembic migration log)
├── KNOWN-ISSUES.md                     ← 🤖 ZONE AGENT B (bug tracker)
│
├── docs/                               ← SHARED (read-only untuk kedua agent)
│   ├── api-collection.json             ← Postman collection (Agent B generate)
│   └── screenshots/                    ← Demo screenshots
│
└── README.md                           ← SHARED (this file)
```

---

## 🤖 Dual-Agent Workflow

Proyek ini menggunakan **Spec-Driven Development** dengan **2 agent** yang berkolaborasi. Setiap agent punya **zone of ownership** yang jelas — tidak boleh ada file yang diedit oleh dua agent.

### 🎨 Agent A — Thinking & Planning (Saya)

**Tanggung jawab**:
- Menyusun spec files di `specs/`
- Mendefinisikan requirements, architecture, data model, API contracts, user flows, acceptance criteria
- Menulis ADR (Architecture Decision Records)
- Maintaining CHANGELOG & VERSION
- Review & approve spec change requests dari Agent B

**Zone**: Hanya boleh write ke `specs/*`. Bisa read semua file.

**Files owned**:
- `specs/00-vision.md` s/d `specs/08-acceptance-criteria.md`
- `specs/decisions/ADR-*.md`
- `specs/CHANGELOG.md`
- `specs/VERSION.txt`
- `specs/research/*`

### 🛠️ Agent B — Senior Full-Stack Dev

**Tanggung jawab**:
- Membaca spec files sebagai "single source of truth"
- Implementasi frontend (Next.js PWA) di `frontend/`
- Implementasi backend (Python FastAPI) di `backend/`
- Setup database MySQL + Alembic migration
- Setup PWA (manifest.json, service worker)
- Testing & debugging
- Deploy ke production (Vercel + Railway)
- Update progress & issue tracking di dev docs

**Zone**: Hanya boleh write ke `frontend/*`, `backend/*`, `docs/*`, dan dev docs di root.

**Files owned**:
- `frontend/**` (semua file Next.js)
- `backend/**` (semua file FastAPI + Alembic)
- `PROGRESS.md` — log progress mingguan
- `DECISIONS-DEV.md` — dev decisions + spec change requests
- `MIGRATION-NOTES.md` — Alembic migration log
- `KNOWN-ISSUES.md` — bug tracker
- `docs/api-collection.json` — Postman collection
- `docs/screenshots/*` — demo images

### 🔒 Ownership Rules

| Aturan | Detail |
|---|---|
| **Agent A** hanya write ke `specs/*` | Tidak boleh edit kode di `frontend/` atau `backend/` |
| **Agent B** hanya write ke `frontend/*`, `backend/*`, dev docs | Tidak boleh edit spec files di `specs/` |
| **SHARED** (`docs/*`, `README.md`) | Siapapun boleh read, Agent B yang write |
| **Jika Agent B butuh ubah spec** | TIDAK boleh edit langsung → buka issue di `DECISIONS-DEV.md` dengan tag `[SPEC-CHANGE-REQUEST]`, Agent A yang update spec |
| **Jika Agent A update spec** | Update `specs/CHANGELOG.md` + bump `specs/VERSION.txt` |

### 📡 Protokol Komunikasi A ↔ B

```
┌─────────────────────────────────────────────────────────────┐
│ Agent A (Planning)                                          │
│   └─ Write specs/* files                                    │
│   └─ Read PROGRESS.md untuk tracking implementasi           │
│   └─ Review DECISIONS-DEV.md jika ada [SPEC-CHANGE-REQUEST]│
└─────────────────────────────────────────────────────────────┘
                            ↕
              (Komunikasi via file markdown, BUKAN edit langsung)
                            ↕
┌─────────────────────────────────────────────────────────────┐
│ Agent B (Dev)                                               │
│   └─ Read specs/* untuk implementasi                        │
│   └─ Write frontend/*, backend/*, dev docs                  │
│   └─ Tulis [SPEC-CHANGE-REQUEST] di DECISIONS-DEV.md        │
│      jika spec ambigu/konflik/tidak feasible                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

Pastikan sudah terinstall di mesin development:

- **Node.js** 18+ dan npm/bun
- **Python** 3.11+
- **Laragon** (MySQL 8.4.3 + phpMyAdmin 6.2.3 + Apache 2.4.66)
- **Git** untuk version control
- **VS Code** (recommended) atau editor lain

### Local Development Setup

#### 1. Clone Repository

```bash
git clone <repository-url>
cd my-app
```

#### 2. Setup Database (MySQL via Laragon)

```bash
# Pastikan Laragon running (MySQL + Apache)
# Buka phpMyAdmin: http://localhost/phpmyadmin
# Buat database baru:
#   Name: moring_suksok
#   Collation: utf8mb4_unicode_ci
```

#### 3. Setup Backend (Python FastAPI)

```bash
cd backend

# Setup Python venv
python -m venv venv
source venv/bin/activate        # Linux/Mac
# atau: venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env dengan credentials Anda (DATABASE_URL, JWT_SECRET, Cloudinary, FCM, dll)

# Run database migration
alembic upgrade head

# Seed data awal (admin + contoh produk + settings)
python seed.py

# Run backend server
uvicorn app.main:app --reload --port 8000

# Backend tersedia di: http://localhost:8000
# Swagger UI: http://localhost:8000/docs
```

#### 4. Setup Frontend (Next.js PWA)

```bash
cd ../frontend

# Install dependencies
npm install
# atau: bun install (lebih cepat)

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan:
#   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
#   NEXT_PUBLIC_FIREBASE_* (untuk push notif)

# Run dev server
npm run dev

# Frontend tersedia di: http://localhost:3000
```

#### 5. Verify Setup

Buka browser dan verify:
- ✅ `http://localhost:3000` → Landing page Moring Suksok muncul
- ✅ `http://localhost:8000/docs` → Swagger UI dengan list endpoint
- ✅ `http://localhost/phpmyadmin` → Database `moring_suksok` dengan 9 tabel terlihat

---

## 📚 Spec Files Reference

Untuk Agent B atau siapapun yang ingin memahami sistem:

| File | Isi | Untuk Siapa |
|---|---|---|
| `specs/00-vision.md` | Big picture, tujuan, manfaat | Semua orang (overview) |
| `specs/01-requirements.md` | Latar belakang, scope, batasan | Semua orang |
| `specs/02-architecture.md` | Arsitektur decoupled, security | Agent B (Dev) — penting untuk implementasi |
| `specs/03-features.json` | Daftar 50 user stories | Agent B — gunakan untuk tracking development |
| `specs/04-ui-guidelines.md` | UI/UX direction, palette, components | Agent B — gunakan untuk build UI |
| `specs/05-data-model.md` | ERD, 9 tabel, SQL DDL | Agent B — gunakan untuk setup database |
| `specs/06-api-contracts.md` | Endpoint specs, request/response | Agent B — gunakan untuk implementasi API |
| `specs/07-user-flows.md` | Flow customer & owner, state machine | Agent B — gunakan untuk UX flow |
| `specs/08-acceptance-criteria.md` | AC per story (Given-When-Then) | Agent B — gunakan untuk testing |
| `specs/decisions/ADR-*.md` | Decision records | Semua orang (rationale) |

---

## 📋 Development Roadmap (8 Minggu)

Timeline detail lihat di `specs/00-vision.md` § 7 dan `Dokumen_Perencanaan_Moring_Suksok.md` Bab 12.

```
Minggu 1-2: FASE 1 — Setup & Foundation
  └─ Project structure, DB schema, auth module
Minggu 3-4: FASE 2 — Core Features
  └─ Catalog produk + cart + checkout
Minggu 5-6: FASE 3 — Payment & Notification
  └─ QRIS + verifikasi + push notif
Minggu 7-8: FASE 4 — Polish & Deploy
  └─ Laporan + PWA + deploy production
```

Agent B tracking progress di `PROGRESS.md` (update mingguan).

---

## 🎨 Color Palette (Quick Reference)

| Token | Hex | Usage |
|---|---|---|
| Primary Green | `#2D6A4F` | Brand color, primary buttons, header |
| Green Dark | `#1B4332` | Hover state, footer |
| Green Light | `#52B788` | Success state, secondary accent |
| Green Pale | `#D8F3DC` | Badge background |
| Neutral 900 | `#1A1A1A` | Body text primary |
| Neutral 100 | `#F3F4F6` | Surface background |

Detail lengkap di `specs/04-ui-guidelines.md`.

---

## 🔐 Default Credentials (Development Only)

Setelah `python seed.py` dijalankan:

| Role | Email | Password |
|---|---|---|
| Admin (Owner) | `admin@moring-suksok.com` | `admin123` |

> ⚠️ **UBAH PASSWORD INI SEGERA** setelah login pertama di production!

---

## 🌿 Branding

- **Nama Bisnis**: Moring Suksok
- **Tagline**: Snack Sehat dari Alam 🌿
- **Logo**: Leaf icon (moringa) + text "Moring Suksok"
- **Color**: Hijau daun kelor (moring-green #2D6A4F)

---

## 📝 License & Akademik

Proyek ini adalah **Tugas Akhir** untuk menyelesaikan studi. Source code boleh dipakai untuk referensi akademik dengan attribution yang sesuai.

© 2026 Moring Suksok TA Project. All rights reserved.

---

## 📞 Kontak

- **Mahasiswa (Developer)**: [Nama Anda]
- **Dosen Pembimbing**: [Nama Dosen]
- **Mitra (Owner Moring Suksok)**: Owner, 40 tahun

---

## 🙏 Acknowledgments

- Owner Moring Suksok sebagai mitra TA
- Dosen pembimbing atas guidance-nya
- Komunitas open source: FastAPI, Next.js, Tailwind, shadcn/ui
- Cloudinary, Firebase, Vercel, Railway untuk free tiers

---

**Spesifikasi Versi**: v1.0.0 (lihat `specs/VERSION.txt`)
**Last Updated**: 2026-10-29
**Status**: Ready for Development Phase (Agent B)

🌿 *Moring Suksok — Snack Sehat dari Alam untuk Indonesia*
