# PROGRESS.md
# Log Progress Development Mingguan

> **Owner**: Agent B (Dev) | **Started**: TBD
> **Purpose**: Tracking development progress per minggu, sesuai milestone di `specs/03-features.json`

---

## 📊 Status Overview

- **Specs Version**: v1.0.0 (read from `specs/VERSION.txt`)
- **Total Stories**: 50 (39 Must, 11 Should)
- **Completed**: 0 / 50
- **In Progress**: 0
- **Blocked**: 0

---

## 🗓️ Progress Log

### Minggu 1 — Project Setup & Database Design
> Target: Setup environment + 9 tabel MySQL ter-create via Alembic + seed data

| Story ID | Title | Status | Notes |
|---|---|---|---|
| - | Setup folder structure | ⏳ Pending | |
| - | Setup Python venv + FastAPI stack | ⏳ Pending | |
| - | Setup Next.js + Tailwind + shadcn/ui | ⏳ Pending | |
| - | Setup MySQL database via phpMyAdmin | ⏳ Pending | |
| - | Setup SQLAlchemy models (9 tabel) | ⏳ Pending | |
| - | Setup Alembic + initial migration | ⏳ Pending | |
| - | Buat seed script | ⏳ Pending | |
| - | Setup FastAPI app skeleton + CORS | ⏳ Pending | |
| - | Setup Next.js app skeleton | ⏳ Pending | |
| - | Setup .env files | ⏳ Pending | |

**Milestone Check (akhir minggu)**:
- [ ] Backend FastAPI jalan dengan Swagger UI di /docs
- [ ] Frontend Next.js jalan dengan Tailwind
- [ ] 9 tabel MySQL ter-create (lihat di phpMyAdmin)
- [ ] Seed data admin + produk contoh

---

### Minggu 2 — Auth Module & Basic UI
> Target: Customer & admin bisa registrasi/login

| Story ID | Title | Status | Notes |
|---|---|---|---|
| E1-S8 | Password hashing bcrypt | ⏳ Pending | |
| E1-S7 | JWT verification middleware | ⏳ Pending | |
| E1-S1 | Registrasi customer baru | ⏳ Pending | |
| E1-S2 | Pilih segmen customer | ⏳ Pending | |
| E1-S3 | Login customer | ⏳ Pending | |
| E1-S4 | Login admin terpisah | ⏳ Pending | |
| E1-S5 | Logout | ⏳ Pending | |
| - | Frontend: halaman Register | ⏳ Pending | |
| - | Frontend: halaman Login | ⏳ Pending | |
| - | Frontend: layout dasar | ⏳ Pending | |
| - | Frontend: API client + JWT interceptor | ⏳ Pending | |

**Milestone Check (akhir minggu)**:
- [ ] Customer bisa registrasi & login
- [ ] Admin bisa login (separate endpoint)
- [ ] JWT terverifikasi di setiap request

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
