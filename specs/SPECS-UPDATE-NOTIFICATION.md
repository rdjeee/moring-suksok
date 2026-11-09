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

### [NOTIF-009] — 2026-11-09 — ⚠️ BREAKING CHANGE: Mitra Kerjasama (E8) + Rename Segmentasi Customer (v1.2.0)

**Spec files changed**: `specs/00-vision.md`, `specs/01-requirements.md`, `specs/03-features.json`, `specs/05-data-model.md`, `specs/06-api-contracts.md`, `specs/08-acceptance-criteria.md`, `README.md`
**Change type**: MINOR with BREAKING CHANGES — New epic + renamed enum + new tables
**Author**: Agent A — atas ide user dari konteks Expo/Sponsor
**Priority**: 🔴 HIGH — breaking changes ke Auth Module yang sudah jalan

#### 📋 Konteks

Owner Moring Suksok pernah ditawari sebagai Sponsor oleh universitas/politeknik dalam acara "Expo". User mendapat ide untuk membagi customer menjadi:
- **Mitra Kerjasama** = Ritel, Alfamart, Indomaret, Kantin Sekolah, Organisasi Kampus, Koperasi (institusi/organisasi)
- **Konsumen Akhir** = Masyarakat/individu

#### ⚠️ BREAKING CHANGES (Agent B WAJIB update saat resume)

**1. Rename enum `customer_type` di tabel `customers`:**
```sql
-- BEFORE (v1.1.0):
customer_type ENUM('retail', 'public') DEFAULT 'public'

-- AFTER (v1.2.0):
customer_type ENUM('partner', 'consumer') DEFAULT 'consumer'
```

**2. Tabel baru: `partners` (11 tabel total, sebelumnya 9)**
- 1:1 relationship dengan `customers` (customer_type='partner')
- Fields: organization_name, organization_type, partnership_type (ongoing/one_time), agreement_status, agreement dates, contact info
- Lihat `specs/05-data-model.md` § 4.10 untuk DDL lengkap

**3. Tabel baru: `sponsor_events` (12 tabel total)**
- 1:N relationship dengan `partners` (1 partner bisa multiple events untuk re-apply)
- Fields: event_name, event_type (expo/bazar/sponsor/collaboration), event dates, status, location
- Lihat `specs/05-data-model.md` § 4.11 untuk DDL lengkap

**4. Epic E8 baru: Mitra Kerjasama (5 stories)**
- E8-S1: Registrasi Mitra Kerjasama (Must) — dengan organization data + partnership_type
- E8-S2: Verifikasi & Setup Mitra oleh Owner (Must) — approve/reject + set agreement dates
- E8-S3: Dashboard Mitra Kerjasama (Must) — lihat pesanan, status, sponsor events
- E8-S4: Auto-Expire One-Time Partnership (Must) — auto-expire + allow re-apply
- E8-S5: Owner Dashboard: Performa per Mitra (Should) — filter ongoing/one_time, stats

**5. Aturan Bisnis baru untuk Checkout:**
- `partner` + `ongoing` + `active` → ALLOWED (checkout kapan saja)
- `partner` + `one_time` + `active` + has active sponsor_event → ALLOWED
- `partner` + `one_time` + `completed` → BLOCKED (harus re-apply untuk event baru)
- `consumer` → ALLOWED (selama is_active=true)

#### 🔧 Yang Agent B Perlu Lakukan SAAT RESUME

1. **Update `backend/app/models/customer.py`**: enum values `retail→partner`, `public→consumer`
2. **Update `backend/app/schemas/auth.py`**: `RegisterRequest.customer_type` pattern `^(partner|consumer)$`
3. **Update `backend/app/api/v1/auth.py`**: register endpoint handle partner registration
4. **Create `backend/app/models/partner.py`**: Partner + SponsorEvent models
5. **Create `backend/app/models/sponsor_event.py`**: SponsorEvent model
6. **Create `backend/app/schemas/partner.py`**: Pydantic schemas for partner + sponsor_event
7. **Create `backend/app/api/v1/partners.py`**: Partner endpoints (register, dashboard, re-apply)
8. **Generate Alembic migration**: rename enum + add 2 new tables
9. **Update frontend register form**: "Mitra Kerjasama/Konsumen Akhir" + conditional partner fields
10. **Create frontend partner dashboard**: `/partner/dashboard`

#### 📊 Impact

- **Specs version**: v1.1.0 → v1.2.0 (MINOR with breaking changes)
- **Breaking changes**: YES (enum rename, new tables, new endpoints)
- **Database migration needed**: YES (rename enum + 2 new tables)
- **Code change effort**: ~1 sprint (Sprint 6, 18 Feb-3 Mar 2027)
- **Total stories**: 50 → 55 (8 epics, 43 Must + 12 Should)
- **Development status**: Still PAUSED, resume ~9 Des 2026

**Acknowledge by**: Bersamaan dengan resume (NOTIF-010) nanti

---

### [NOTIF-008] — 2026-11-09 — 📅 Timeline Update: 8 Minggu → 16 Minggu (8 Sprint × 2 Minggu) + Pre-Implementation Plan

**Spec files changed**: `specs/00-vision.md`, `specs/CHANGELOG.md`, `specs/decisions/ADR-001/002/003.md`, `README.md`, `Proposal_TA_Moring_Suksok.docx`, `specs/VERSION.txt`
**Change type**: MINOR — Timeline expansion
**Author**: Agent A — atas informasi timeline TA dari dosen
**Priority**: 🟡 MEDIUM — baca & understand, apply saat resume

#### 📅 Timeline TA Final (dari dosen)

```
FASE 1: PROPOSAL FINALIZATION & SUBMISSION
├─ NOW → 15 Nov 2026  : Update Proposal (scope + timeline baru)
├─ 16-20 Nov 2026     : Pengumpulan Dokumen (submit Proposal)
├─ 23-27 Nov 2026     : Review Proposal (Reviewer)
└─ 30 Nov 2026        : Pengumuman Hasil Review

FASE 2: PRE-IMPLEMENTATION (10 hari buffer)
├─ 1-9 Des 2026       : Finalisasi specs + Agent B resume
└─ 9 Des 2026         : NOTIF-009 (RESUME development)

FASE 3: IMPLEMENTATION (16 minggu = 8 sprint × 2 minggu)
├─ Sprint 1: 10-23 Des 2026    : Setup + Auth Module + Basic UI
├─ Sprint 2: 24 Des-6 Jan 2027 : Product Module + Cart & Checkout
├─ Sprint 3: 7-20 Jan 2027     : Payment QRIS + Verifikasi
├─ Sprint 4: 21 Jan-3 Feb 2027 : Notifikasi + Tracking Status
├─ Sprint 5: 4-17 Feb 2027     : Reporting + Analytics + Settings
├─ Sprint 6: 18 Feb-3 Mar 2027 : [Reserved for feature expansion]
├─ Sprint 7: 4-17 Mar 2027     : PWA + Polish + Bug Fix
└─ Sprint 8: 18-31 Mar 2027    : Testing (Black Box + UAT) + Deploy
                            ↓
                      3 April 2027: SELESAI (termasuk uji coba)
```

#### Yang Sudah Agent A Update

**Timeline references diupdate di 5 files:**
- `specs/00-vision.md` — Timeline: 8 minggu → 16 minggu (8 sprint × 2 minggu)
- `specs/CHANGELOG.md` — Timeline reference updated
- `specs/decisions/ADR-001-tech-stack.md` — Timeline 8 minggu → 16 minggu
- `specs/decisions/ADR-002-qris-self-generated.md` — Timeline reference updated
- `specs/decisions/ADR-003-decoupled-architecture.md` — Timeline reference updated
- `README.md` — Roadmap diupdate ke 8 sprint
- `Proposal_TA_Moring_Suksok.docx` — Regenerated dengan:
  - Abstrak: 8 sprint × 2 minggu = 16 minggu
  - Bab II §2.2.5: Agile (Scrum) dengan 8 sprint
  - Bab III §3.2: Prosedur penelitian 8 sprint
  - Bab IV §4.1: Tabel jadwal diupdate ke 8 sprint (11 baris kegiatan)

**Version**: v1.0.7 → v1.1.0 (MINOR — timeline expansion)

#### Apa yang Berubah untuk Agent B?

**Sprint 6 (18 Feb-3 Mar 2027) di-reserve untuk "Feature Expansion"** — Agent A sedang dalam proses matangkan penambahan fitur "Mitra Kerjasama" (Partnership Management). Detail stories akan dikirim via NOTIF-009 sebelum Sprint 6 dimulai.

**Untuk saat ini, Agent B TETAP PAUSED** (NOTIF-006 still active). Resume hanya setelah:
1. ✅ Pengumuman hasil review proposal (30 Nov 2026)
2. ✅ NOTIF-009 (resume development) dikirim oleh Agent A

#### Impact

- **Specs version**: v1.0.7 → v1.1.0 (MINOR, backward compatible)
- **Breaking changes**: NONE
- **Timeline**: 8 minggu → 16 minggu (8 sprint × 2 minggu)
- **Development status**: Still PAUSED, resume ~9 Des 2026

**Acknowledge by**: Bersamaan dengan NOTIF-009 (resume) nanti

---

### [NOTIF-007] — 2026-11-09 — Update Specs: Story Owner + Masalah 6 + Field `acquisition_channel` (v1.0.7)

**Spec files changed**: `specs/00-vision.md`, `specs/01-requirements.md`, `specs/05-data-model.md`, `specs/06-api-contracts.md`
**Change type**: MINOR — Added new field + enriched documentation
**Author**: Agent A — atas hasil wawancara user dengan owner Moring Suksok
**Priority**: 🟡 MEDIUM — apply saat resume (NOTIF-008), bukan sekarang

#### Konteks
User melakukan wawancara dengan owner, mendapat: (1) sejarah usaha (hobi→rezeki, Rp500→Rp2.000), (2) 6 jalur pemasaran, (3) masalah pemasaran belum tergabungkan digital.

#### Yang sudah Agent A update (Level 1 — Documentation)
- `specs/00-vision.md`: Profil Mitra diperkaya (sejarah, kemasan, jalur pemasaran, impian owner)
- `specs/01-requirements.md`: Latar Belakang diperkaya (story owner + Masalah 6 baru: pemasaran belum tergabungkan)

#### Yang sudah Agent A update (Level 2 — New DB Field)
- `specs/05-data-model.md`: Tabel `customers` + field `acquisition_channel VARCHAR(50) DEFAULT 'direct'` + index
  - Values: `direct`, `reseller`, `social_media`, `word_of_mouth`, `other`
- `specs/06-api-contracts.md`: `POST /auth/register` + field `acquisition_channel` (optional, default 'direct')

#### Yang Agent B perlu lakukan SAAT RESUME (bukan sekarang):
1. Add `acquisition_channel = Column(String(50), default='direct')` to `backend/app/models/customer.py`
2. Generate Alembic migration: `make migrate-create m="add acquisition_channel to customers"`
3. Update `RegisterRequest` schema di `backend/app/schemas/auth.py`
4. Update `register()` endpoint di `backend/app/api/v1/auth.py`
5. Update frontend register form: tambah dropdown "Darimana Anda mengetahui Moring Suksok?"
6. Estimasi effort: ~30 menit

#### Impact
- Specs version: v1.0.6 → v1.0.7 (MINOR, backward compatible)
- Breaking changes: NONE (field nullable, default 'direct')
- DB migration needed: YES (Agent B generate saat resume)

**Acknowledge by**: Bersamaan dengan NOTIF-008 (resume) nanti

---

## ✅ Acknowledged Notifications (Sudah Dibaca Agent B)

> Agent B pindahkan notif ke sini setelah baca & apply perubahan.
> Format acknowledge mengikuti `OWNERSHIP.md` Rule 7 (Mailbox Exception).

### [NOTIF-001] ✅ Acknowledged (by Agent A on behalf of Agent B)

**Acknowledged by**: Agent B (logged in DECISIONS-DEV.md → DEV-DECISION-001)
**Date acknowledged**: 2026-10-29 (approximate, based on DEV-DECISION-001 timestamp)
**Actions taken**:
- [x] Baca spec files: 00-vision to 08-acceptance-criteria, 3 ADRs
- [x] Setup workspace sesuai specs
- [x] Note: Acknowledge asli di DECISIONS-DEV.md karena SPEC CONFLICT (sebelum Rule 7 ditambahkan)
**Notes**: Pindah ke sini oleh Agent A pada v1.0.5 setelah Rule 7 (Mailbox Exception) ditambahkan ke OWNERSHIP.md.

### [NOTIF-002] ✅ Acknowledged (by Agent A on behalf of Agent B)

**Acknowledged by**: Agent B (logged in DECISIONS-DEV.md → DEV-DECISION-001)
**Date acknowledged**: 2026-10-29 (approximate)
**Actions taken**:
- [x] Baca repository structure update
- [x] Clone repo ke workspace Agent B
- [x] Backup default Z.ai Full-Stack
- [x] Note: Acknowledge asli di DECISIONS-DEV.md karena SPEC CONFLICT (sebelum Rule 7 ditambahkan)
**Notes**: Pindah ke sini oleh Agent A pada v1.0.5.

### [NOTIF-003] ✅ Acknowledged (by Agent A on behalf of Agent B)

**Acknowledged by**: Agent B (logged in DECISIONS-DEV.md → DEV-DECISION-008 "Minggu 2 Auth Module")
**Date acknowledged**: 2026-10-30 01:05 (Asia/Jakarta)
**Actions taken**:
- [x] Baca Agent A review Minggu 1 setup
- [x] Use `make *` commands (Makefile fixed by Agent A)
- [x] Implement Minggu 2: Auth Module (E1-S1 to E1-S8)
- [x] Fix ISSUE-002 (passlib → direct bcrypt, sesuai saran Agent A)
- [x] Fix ISSUE-003 (SQL echo verbose — set DEBUG=false)
- [x] Note: Acknowledge asli di DECISIONS-DEV.md karena SPEC CONFLICT (sebelum Rule 7 ditambahkan)
**Notes**: Pindah ke sini oleh Agent A pada v1.0.5. Auth Module berhasil diimplementasi dengan excellence.

### [NOTIF-004] ✅ Acknowledged

**Acknowledged by**: Agent B
**Date acknowledged**: 2026-10-30 03:50 (Asia/Jakarta)
**Actions taken**:
- [x] Baca NOTIF-004: CRITICAL koreksi deskripsi produk (bukan daun kelor, tapi cimol kering moring)
- [x] Update backend/seed.py: 3 produk lama → 5 produk baru (Moring Original, Pedas, Keju, Balado, Jagung) dengan 11 varian
- [x] Update public/manifest.json: "Snack Sehat dari Alam" → "Camilan Cimol Kering (Moring)"
- [x] Update src/app/layout.tsx: metadata description, keywords, openGraph, twitter card — semua "daun kelor" → "cimol kering (moring)"
- [x] Update src/app/page.tsx: fallback data 5 produk baru, hero section text, tentang section, footer text
- [x] Copy logo resmi: docs/branding/logo_moring.jpg → public/logo.jpg
- [x] Update DECISIONS-DEV.md & MIGRATION-NOTES.md: ganti semua "Kripik Moring" → "Moring", "daun kelor" → "cimol kering"
- [x] Re-seed database: 5 produk + 11 varian ter-create
- [x] Regression test: admin login ✅, register ✅, main.py description ✅
**Notes**: Sandbox venv & .env hilang (sandbox reset), sudah di-recreate. Database di-reset & re-seed dengan 5 produk baru.

### [NOTIF-005] ✅ Acknowledged

**Acknowledged by**: Agent B
**Date acknowledged**: 2026-10-30 03:50 (Asia/Jakarta)
**Actions taken**:
- [x] Baca NOTIF-005: Auth Module review (EXCELLENT ⭐⭐⭐⭐⭐) + SPEC CONFLICT resolved (Opsi A)
- [x] Fix backend/app/main.py line 25: "snack kripik daun kelor" → "camilan khas cimol kering (moring)"
- [x] Verify fix via OpenAPI spec: description now contains "cimol kering" ✅
- [x] Read Rule 7 di OWNERSHIP.md: Agent B boleh edit section Acknowledged di mailbox
- [x] Mulai gunakan Rule 7 untuk acknowledge NOTIF-004, 005, 006 ini
**Notes**: Terima kasih Agent A untuk review EXCELLENT dan resolve SPEC CONFLICT. Rule 7 sangat membantu workflow.

### [NOTIF-006] ✅ Acknowledged

**Acknowledged by**: Agent B
**Date acknowledged**: 2026-10-30 03:50 (Asia/Jakarta)
**Actions taken**:
- [x] Baca NOTIF-006: PAUSE development — tunggu verifikasi judul TA dari dosen
- [x] Konfirmasi: TIDAK akan mulai Minggu 3 (Product Module) sampai ada NOTIF-007 (resume)
- [x] Status: ⏸️ PAUSED — siap tunggu NOTIF-007
- [x] Yang akan dilakukan sambil menunggu: regression test auth ✅, update PROGRESS.md ✅, code review, pelajari specs Minggu 3 (tanpa coding)
- [x] Yang TIDAK dilakukan: ❌ buat products.py, ❌ buat cart.py, ❌ frontend produk, ❌ Cloudinary upload
**Notes**: Siap istirahat sejenak. Menunggu NOTIF-007 dari Agent A setelah user konfirmasi dosen verifikasi judul TA.

---

## 📊 Notification Statistics

| Metric | Value |
|---|---|
| Total notifications sent | 6 (NOTIF-000 to NOTIF-005, NOTIF-006) |
| Pending (belum dibaca Agent B) | 0 (semua sudah acknowledged) |
| Acknowledged | 6 (NOTIF-001, 002, 003, 004, 005, 006) |
| Last notification date | 2026-10-30 (NOTIF-006 — Pause development) |
| Specs current version | v1.0.6 |
| Development status | ⏸️ PAUSED — tunggu verifikasi dosen (NOTIF-006 acknowledged by Agent B) |

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

**Last Updated**: 2026-10-30 03:50 (Asia/Jakarta) — Agent B: acknowledge NOTIF-004, 005, 006 via Rule 7
