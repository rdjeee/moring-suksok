# 📬 SPECS-UPDATE-NOTIFICATION.md
# Mailbox Antar Agent A ↔ Agent B

> **Purpose**: Notifikasi perubahan spec dari Agent A ke Agent B
> **Owner**: Agent A (write) | Agent B (read & acknowledge)
> **Created**: 2026-10-29 | **Specs Version**: v1.0.0

---

## 📋 Cara Pakai Mailbox Ini

### Untuk Agent A (Saya):
Setiap kali specs di-update, tulis notifikasi baru di section "Pending Notifications" di bawah. Format:

```markdown
### [NOTIF-XXX] — YYYY-MM-DD HH:MM — [Title]

**Spec file changed**: `specs/XX-filename.md`
**Section**: X.X Judul
**Change type**: Added | Modified | Deprecated | Removed | Fixed
**Summary**: [deskripsi singkat perubahan]
**Impact to Agent B**: [apa yang harus Agent B lakukan: re-read spec, update code, dll]
**Version bump**: v1.0.0 → v1.0.1 (PATCH) | v1.1.0 (MINOR) | v2.0.0 (MAJOR)
**Acknowledge by**: [tanggal deadline untuk Agent B baca]
```

### Untuk Agent B (Senior Dev):
1. Cek mailbox ini setiap kali mulai sesi development
2. Setelah baca notifikasi & apply perubahan ke code, beri tanda di section "Acknowledged"
3. Format acknowledge: `[NOTIF-XXX] ✅ Acknowledged by Agent B on YYYY-MM-DD HH:MM`

---

## 🔔 Pending Notifications (Belum Dibaca Agent B)

> Urut dari TERBARU di atas ke TERLAMAU di bawah. Agent B harus baca dari atas.

### [NOTIF-001] — 2026-10-29 07:50 — Initial Setup Specs v1.0.0

**Spec files added (all new)**:
- `specs/00-vision.md` — Executive summary & tujuan proyek
- `specs/01-requirements.md` — Latar belakang, scope, batasan, functional requirements
- `specs/02-architecture.md` — Arsitektur decoupled, security pattern, deployment scheme
- `specs/03-features.json` — 7 Epic, 50 user stories (39 Must, 11 Should)
- `specs/04-ui-guidelines.md` — Color palette, typography, components, layout patterns
- `specs/05-data-model.md` — ERD, 9 tabel SQL DDL, index strategy, SQLAlchemy models reference
- `specs/06-api-contracts.md` — 8 modul endpoint REST API dengan request/response examples
- `specs/07-user-flows.md` — Customer & owner flow, state machine status pesanan
- `specs/08-acceptance-criteria.md` — AC per story dalam format Given-When-Then
- `specs/decisions/ADR-001-tech-stack.md` — Pemilihan Python FastAPI + Next.js PWA + MySQL
- `specs/decisions/ADR-002-qris-self-generated.md` — Pemilihan QRIS self-generated (no payment gateway)
- `specs/decisions/ADR-003-decoupled-architecture.md` — Pemilihan arsitektur decoupled

**Change type**: Initial release

**Summary**: Versi awal (v1.0.0) seluruh specs untuk proyek Moring Suksok. Berisi 50 user stories yang harus diimplementasi dalam 8 minggu development. Total estimasi effort ~285 hours.

**Impact to Agent B**: 
- WAJIB baca `README.md` di root project terlebih dahulu untuk memahami dual-agent workflow
- WAJIB baca `specs/decisions/ADR-001-tech-stack.md` SEBELUM setup environment (krusial: kita pakai Python FastAPI + MySQL + SQLAlchemy, BUKAN Prisma + SQLite + NextAuth.js default dari Z.ai template)
- WAJIB baca `specs/05-data-model.md` untuk struktur 9 tabel database
- WAJIB baca `specs/06-api-contracts.md` untuk implementasi endpoint
- Mulai dari Minggu 1: setup folder structure + database schema
- Strategi: **Frontend first** (Next.js prototype UI), backend Python FastAPI menyusul

**Version bump**: (initial) → v1.0.0

**Acknowledge by**: 2026-10-30 (1 hari setelah notif)

---

### [NOTIF-000] — 2026-10-29 07:55 — Repository Structure Update

**Spec file changed**: `README.md` (root project)
**Change type**: Modified + Added new files
**Summary**: Repository structure diupdate dengan tambahan:
1. `specs/SPECS-UPDATE-NOTIFICATION.md` (this file) — mailbox antar agent
2. `docker-compose.yml` — orchestration frontend + backend + db
3. `Makefile` — shortcut commands (`make dev`, `make migrate`, `make seed`, dll)
4. `.env.example` (root, frontend, backend) — env var templates
5. `backend/requirements.txt` — Python dependencies
6. Restructure: `tests/` folder per module (frontend/tests/ dan backend/tests/)
7. `docs/api-openapi.json` — placeholder (akan di-auto-generate dari FastAPI nanti)

**Impact to Agent B**:
- Baca `Makefile` untuk lihat semua command shortcuts yang tersedia
- Copy `.env.example` ke `.env` di root, frontend, dan backend, lalu isi credentials
- `backend/requirements.txt` sudah berisi semua Python deps yang dibutuhkan (install via `pip install -r requirements.txt`)
- Gunakan `docker-compose up` untuk jalankan semua services sekaligus (frontend + backend + MySQL)
- Atau gunakan `make dev` untuk development mode (3 services paralel)

**Version bump**: v1.0.0 → v1.0.1 (PATCH — clarification & infrastructure, no breaking changes)

**Acknowledge by**: 2026-10-30

---

## ✅ Acknowledged Notifications (Sudah Dibaca Agent B)

> Agent B pindahkan notif ke sini setelah baca & apply perubahan.

*(Belum ada yang acknowledged)*

---

## 📊 Notification Statistics

| Metric | Value |
|---|---|
| Total notifications sent | 2 |
| Pending (belum dibaca Agent B) | 2 |
| Acknowledged | 0 |
| Last notification date | 2026-10-29 07:55 |
| Specs current version | v1.0.1 |

---

## 🔄 Workflow Update Specs (Agent A → Agent B)

```
1. Agent A update spec file(s) di specs/
        │
        ▼
2. Agent A tulis NOTIF-XXX di mailbox ini (section "Pending Notifications")
        │
        ▼
3. Agent A update specs/CHANGELOG.md dengan entry detail
        │
        ▼
4. Agent A bump specs/VERSION.txt (semantic versioning)
        │
        ▼
5. Agent A commit & push (atau notify via chat)
        │
        ▼
6. Agent B lihat mailbox (saat mulai sesi dev)
        │
        ▼
7. Agent B baca spec yang diupdate
        │
        ▼
8. Agent B apply perubahan ke code (refactor, add feature, dll)
        │
        ▼
9. Agent B pindahkan notif dari "Pending" → "Acknowledged" dengan timestamp
        │
        ▼
10. Agent B commit code changes + update PROGRESS.md
```

---

## 📝 Template Acknowledge oleh Agent B

```markdown
### [NOTIF-XXX] ✅ Acknowledged

**Acknowledged by**: Agent B
**Date acknowledged**: YYYY-MM-DD HH:MM
**Actions taken**:
- [x] Baca spec file yang diupdate
- [x] Apply perubahan ke code:
  - Modified: `frontend/src/components/X.tsx`
  - Added: `backend/app/api/v1/Y.py`
- [x] Run tests: ✅ all pass
- [x] Update PROGRESS.md dengan note perubahan
**Notes**: [catatan tambahan jika ada]
```

---

**Last Updated**: 2026-10-29 07:55 (Agent A — initial setup + repo structure update)
