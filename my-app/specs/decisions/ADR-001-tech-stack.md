# ADR-001: Tech Stack Selection
# Python FastAPI + Next.js PWA + MySQL + SQLAlchemy

> **Status**: Accepted | **Date**: 2026-10-29 | **Decision Maker**: Mahasiswa (with Agent A consultation)

---

## Context

Untuk Tugas Akhir "Sistem Distribusi & Pencatatan Transaksi Produk Moring Suksok", saya perlu memilih tech stack yang:

1. **Cross-platform output**: Aplikasi harus jalan di Android (installable) dan Web
2. **Modern & profesional**: Untuk demo sidang TA
3. **Akademik impresive**: Menunjukkan skill yang relevan
4. **Real-world applicable**: Owner Moring Suksok bisa pakai setelah lulus
5. **Timeline 8 minggu**: Harus achievable dengan effort reasonable
6. **Free / low-cost**: Budget mahasiswa terbatas

## Options Considered

### Option A: Next.js Monolith (Frontend + API Routes + Prisma + PostgreSQL)

**Stack**:
- Frontend + Backend: Next.js (App Router + API Routes)
- ORM: Prisma
- Database: PostgreSQL (Supabase/Neon)
- PWA: next-pwa

**Pros**:
- ✅ 1 codebase, simpler maintenance
- ✅ Prisma DX (developer experience) terbaik di JavaScript ecosystem
- ✅ Auto type-safe dengan TypeScript + Prisma Client
- ✅ Vercel deploy 1-click untuk full-stack

**Cons**:
- ❌ Tidak showcase Python skill (saya punya background Python)
- ❌ Next.js API Routes = serverless functions (kurang ideal untuk long-running process)
- ❌ Kurang "akademik" untuk sidang (monolith terlalu biasa)

### Option B: Python FastAPI + Next.js PWA + MySQL + SQLAlchemy (CHOSEN)

**Stack**:
- Frontend: Next.js 14+ PWA
- Backend: Python FastAPI
- ORM: SQLAlchemy 2.0 + Alembic migration
- Database: MySQL 8.4.3 (via Laragon)
- DB GUI: phpMyAdmin

**Pros**:
- ✅ Arsitektur decoupled (separation of concerns jelas)
- ✅ Python populer di akademik (penguji familiar)
- ✅ FastAPI auto-generate Swagger UI (/docs) — bonus untuk demo
- ✅ MySQL + phpMyAdmin sudah terinstall di mesin development (via Laragon)
- ✅ Showcase multi-language skill (Python + TypeScript)
- ✅ Lebih scalable untuk future expansion

**Cons**:
- ⚠️ 2 codebase (frontend + backend), maintenance lebih kompleks
- ⚠️ CORS configuration required (antara frontend & backend)
- ⚠️ Tidak bisa pakai Prisma (Python ada unofficial client, tidak stabil)
- ⚠️ 2 deployment targets (Vercel + Railway)

### Option C: Django + Next.js + MySQL

**Pros**:
- ✅ Django "batteries-included" (ORM, admin panel, auth bawaan)
- ✅ Cocok untuk Content Management

**Cons**:
- ❌ Django lebih heavyweight dari FastAPI
- ❌ Tidak ada auto-Swagger docs (butuh DRF + drf-spectacular)
- ❌ Sync framework (tidak async-friendly)
- ❌ Overkill untuk mini e-commerce

### Option D: Flask + Next.js + MySQL

**Pros**:
- ✅ Flask simpel, learning curve rendah
- ✅ Banyak tutorial & ekosistem matang

**Cons**:
- ❌ Tidak ada auto-docs (butuh flask-restx atau flasgger)
- ❌ Tidak async-native (butuh extension)
- ❌ Tidak ada type validation bawaan (butuh marshmallow)
- ❌ Lebih kuno dibanding FastAPI

### Option E: Next.js + Express.js + MySQL

**Pros**:
- ✅ 1 bahasa (JavaScript/TypeScript) untuk frontend & backend
- ✅ Bisa pakai Prisma

**Cons**:
- ❌ Tidak showcase Python skill
- ❌ Express.js sudah agak kuno dibanding FastAPI & Next.js API Routes

## Decision

Pilih **Option B: Python FastAPI + Next.js PWA + MySQL + SQLAlchemy**.

## Rationale

1. **Multi-language showcase**: Sebagai Tugas Akhir, menampilkan kemampuan di 2 bahasa (Python + TypeScript) lebih impresif dibanding monolingual. Dosen penguji akan melihat pemahaman luas tentang ekosistem.

2. **Akademik & industri**: Python FastAPI sangat populer di industri (Netflix, Uber, Microsoft pakai), dan akademik (data science, AI/ML). Skill ini transferable ke karir nyata.

3. **Auto-documentation**: FastAPI auto-generate Swagger UI di `/docs` dan ReDoc di `/redoc`. Ini bonus besar untuk demo sidang — penguji bisa lihat & coba API interaktif tanpa setup tambahan.

4. **Infrastructure sudah ada**: Laragon (MySQL 8.4.3 + phpMyAdmin 6.2.3) sudah terinstall. Tidak perlu setup tambahan, bisa langsung coding.

5. **Decoupled architecture**: Pemisahan frontend-backend sesuai best practice modern. Memudahkan maintenance, scaling, dan future modification (misal: ganti frontend ke React Native tanpa sentuh backend).

6. **Maturity**: SQLAlchemy 2.0 sudah sangat matang (20+ tahun), Alembic solid untuk migration. Ekosistem Python untuk web sangat kaya.

## Consequences

### Positive
- Showcase multi-language skill di TA
- Swagger UI otomatis untuk demo
- Database & GUI (phpMyAdmin) sudah siap pakai
- Architecture clean & scalable
- Skill Python akan relevan untuk karir data/AI

### Negative
- 2 codebase untuk maintain (frontend + backend)
- CORS perlu configuration
- Tidak bisa pakai Prisma (gunakan SQLAlchemy sebagai pengganti)
- 2 deployment targets (Vercel + Railway)

### Neutral
- Learning curve SQLAlchemy (saya sudah familiar dengan Prisma di Next.js, perlu adaptasi ke SQLAlchemy)
- Ekosistem Python berbeda dengan Node.js (pip vs npm, venv vs nvm)

## Mitigation

| Risk | Mitigation |
|---|---|
| CORS error | Setup `fastapi-cors` middleware sejak awal, allow origin `localhost:3000` (dev) dan Vercel domain (prod) |
| Migration conflict | Selalu commit Alembic migration files, review sebelum merge, dokumentasi changelog |
| 2 deployment targets | Setup CI/CD untuk auto-deploy dari GitHub (Vercel untuk frontend, Railway untuk backend) |
| Auth approach | Gunakan JWT-based auth (bukan session-based) untuk kompatibilitas cross-domain |
| SQLAlchemy learning curve | Mulai dengan simple models, incrementally add complexity. Pair programming dengan AI assistant |

## References

- FastAPI documentation: https://fastapi.tiangolo.com/
- SQLAlchemy 2.0 documentation: https://docs.sqlalchemy.org/en/20/
- Alembic documentation: https://alembic.sqlalchemy.org/
- Next.js PWA: https://github.com/shadowwalker/next-pwa
- Laragon: https://laragon.org/

---

**End of ADR-001**
