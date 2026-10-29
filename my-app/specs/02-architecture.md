# 02 — Architecture
# Arsitektur Sistem & Pola Keamanan

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Source**: Dokumen Perencanaan Bab 6

---

## 1. Gambaran Umum Arsitektur

Sistem dibangun dengan **arsitektur decoupled (terpisah)** antara Frontend dan Backend, yang berkomunikasi melalui REST API menggunakan format JSON. Arsitektur ini dipilih untuk memisahkan concerns (presentation layer vs business logic layer), memudahkan maintenance, dan memungkinkan skalabilitas independen antara frontend dan backend.

### 1.1 Prinsip Desain Arsitektur

1. **Separation of Concerns**: Frontend fokus ke presentation & UX, Backend fokus ke business logic & data
2. **Stateless Backend**: Setiap request berisi semua info yang dibutuhkan (JWT token di header), tidak ada session server-side
3. **API-First Design**: API contracts didefinisikan terlebih dahulu (lihat `06-api-contracts.md`), baru frontend & backend implementasi
4. **Convention over Configuration**: Ikuti convention populer (REST, JSON, JWT) untuk mengurangi cognitive load
5. **Fail Fast & Loud**: Validasi input di awal (Pydantic), error dikembalikan dengan pesan jelas
6. **Defensive Security**: Validate input, hash password, sanitize output, principle of least privilege

---

## 2. Diagram Arsitektur Sistem (High-Level)

```
┌──────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                          │
│                                                                      │
│  ┌─────────────────────┐         ┌─────────────────────────────┐    │
│  │  Customer PWA App   │         │  Owner Admin Dashboard      │    │
│  │  (Next.js PWA)      │         │  (Next.js Web)               │    │
│  │                     │         │                              │    │
│  │  - Katalog produk   │         │  - Kelola produk            │    │
│  │  - Cart & checkout  │         │  - Verifikasi pembayaran    │    │
│  │  - Upload bukti     │         │  - Update status pesanan    │    │
│  │  - Tracking pesanan │         │  - Laporan transaksi        │    │
│  │  - Riwayat pesanan  │         │  - Analitik & dashboard     │    │
│  └──────────┬──────────┘         └──────────────┬──────────────┘    │
│             │                                    │                    │
│             │   Installable via PWA              │                    │
│             │   (Add to Home Screen)             │                    │
└─────────────┼────────────────────────────────────┼────────────────────┘
              │                                    │
              │  REST API (HTTPS / JSON)           │
              │  + JWT Bearer Token               │
              ▼                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          BUSINESS LOGIC LAYER                        │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Python FastAPI Backend                            │   │
│  │              (uvicorn ASGI server)                             │   │
│  │                                                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │ Auth Module  │  │Product Module│  │ Order Module │        │   │
│  │  │ (JWT+bcrypt) │  │  (CRUD)      │  │ (Checkout)  │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │Payment Module│  │ Notif Module │  │ Report Module│        │   │
│  │  │ (QRIS+Upload)│  │ (FCM+wa.me)  │  │ (PDF+Excel) │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  │                                                                │   │
│  │  Middleware: CORS, JWT Auth, Error Handler, Logging           │   │
│  │  Docs: Swagger UI (/docs), ReDoc (/redoc)                     │   │
│  └────────────────────────────────────┬───────────────────────────┘   │
│                                       │                               │
└───────────────────────────────────────┼───────────────────────────────┘
                                        │
                                        │  SQLAlchemy 2.0 ORM
                                        │  + Alembic Migration
                                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                  │
│                                                                      │
│  ┌──────────────────────┐        ┌──────────────────────────────┐   │
│  │  MySQL 8.4.3         │        │  phpMyAdmin 6.2.3            │   │
│  │  (via Laragon)       │◄──────►│  (Web GUI untuk manajemen)   │   │
│  │                      │        │                              │   │
│  │  - admins            │        │  - Browse tabel              │   │
│  │  - customers         │        │  - Edit data manual          │   │
│  │  - products          │        │  - Run SQL query             │   │
│  │  - product_variants  │        │  - Export/Import             │   │
│  │  - orders            │        │                              │   │
│  │  - order_items        │        └──────────────────────────────┘   │
│  │  - payments          │                                          │
│  │  - notifications     │                                          │
│  │  - settings          │                                          │
│  └──────────────────────┘                                          │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES (Third-party)                   │
│                                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────────┐  │
│  │  Firebase      │  │  Cloudinary   │  │  WhatsApp Deep Link    │  │
│  │  Cloud         │  │  (Image CDN) │  │  (wa.me URL scheme)     │  │
│  │  Messaging     │  │              │  │                         │  │
│  │  (Push Notif)  │  │  - Upload    │  │  - Backup notification  │  │
│  │                │  │    bukti     │  │    (semi-otomatis)      │  │
│  │  - Push to     │  │    bayar     │  │                         │  │
│  │    Android     │  │  - URL       │  │                         │  │
│  │  - Free tier   │  │    stored    │  │                         │  │
│  │                │  │    in DB     │  │                         │  │
│  └───────────────┘  └───────────────┘  └─────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Komponen Arsitektur Detail

### 3.1 Frontend Layer (Next.js PWA)

Frontend dibangun menggunakan **Next.js 14+** dengan **App Router**, mendukung **Progressive Web App** sehingga dapat diinstall di Android. Frontend terdiri dari 2 area utama:

#### 3.1.1 Customer Area (`/` dan `/customer/*`)
- Halaman publik: landing, katalog produk, detail produk
- Halaman auth: login, register
- Halaman customer (butuh login): cart, checkout, payment, upload bukti, riwayat pesanan, tracking status, profil

#### 3.1.2 Owner/Admin Area (`/admin/*`)
- Halaman login admin
- Dashboard utama (statistik ringkas)
- Kelola produk (list, create, edit, delete)
- Daftar pesanan (dengan filter status)
- Detail & verifikasi pembayaran
- Update status pesanan
- Laporan transaksi (filter periode, export PDF/Excel)
- Daftar customer & analitik
- Settings (QRIS statis owner, info bisnis)

#### 3.1.3 Service Worker (PWA)
- **Pre-caching**: halaman utama, aset statis (CSS, JS, gambar)
- **Runtime caching**: gambar produk dari Cloudinary
- **Push notification handler** (FCM)
- **Background sync** (jika offline, antrikan request saat online)

### 3.2 Backend Layer (Python FastAPI)

Backend dibangun menggunakan **Python FastAPI** yang berjalan di atas **ASGI server (uvicorn)**. Struktur backend mengikuti pola modular berdasarkan domain:

```
backend/
├── app/
│   ├── main.py                 # Entry point + FastAPI instance
│   ├── core/
│   │   ├── config.py           # Settings (env variables)
│   │   ├── database.py         # SQLAlchemy engine & session
│   │   ├── security.py         # JWT, password hashing
│   │   └── dependencies.py     # Auth dependencies
│   ├── models/                 # SQLAlchemy models
│   │   ├── customer.py
│   │   ├── admin.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   └── notification.py
│   ├── schemas/                # Pydantic schemas (request/response)
│   ├── api/v1/
│   │   ├── auth.py             # Login, register, refresh token
│   │   ├── products.py         # CRUD produk
│   │   ├── cart.py             # Cart operations
│   │   ├── orders.py           # Checkout, list, detail
│   │   ├── payments.py         # Generate QRIS, upload bukti
│   │   ├── notifications.py    # Push notif + WA link
│   │   └── reports.py          # Laporan & export
│   ├── services/               # Business logic
│   │   ├── qris_service.py     # QRIS generation
│   │   ├── fcm_service.py      # Push notification
│   │   ├── cloudinary_service.py
│   │   ├── pdf_service.py      # ReportLab nota
│   │   └── wa_service.py       # WhatsApp deep link
│   └── utils/
│       ├── logger.py
│       └── exceptions.py
├── alembic/                    # Database migrations
├── alembic.ini
├── requirements.txt
└── .env
```

### 3.3 Data Layer (MySQL + phpMyAdmin)

Database menggunakan **MySQL 8.4.3** yang sudah terinstall via Laragon. Akses ke database dilakukan melalui **SQLAlchemy 2.0 ORM** di sisi backend, sementara **phpMyAdmin** digunakan sebagai GUI untuk inspeksi, debugging, dan administrasi manual (edit data, run SQL query, export/import).

#### Konfigurasi Koneksi Database

| Property | Value |
|---|---|
| Host | localhost (dev) / Railway MySQL host (prod) |
| Port | 3306 |
| User | root (dev, no password) / production user |
| Database | moring_suksok |
| Charset | utf8mb4_unicode_ci |
| Connection URL | `mysql+pymysql://root:@localhost:3306/moring_suksok` |

---

## 4. Matriks Akses (Access Control Matrix)

| Modul / Aksi | Admin | Customer Ritel | Customer Masyarakat |
|---|---|---|---|
| Login sistem | ✅ | ✅ | ✅ |
| Lihat katalog produk | ✅ (read-only) | ✅ | ✅ |
| Tambah/Edit/Hapus produk | ✅ | ❌ | ❌ |
| Tambah ke keranjang | ❌ | ✅ | ✅ |
| Checkout & upload bukti | ❌ | ✅ | ✅ |
| Lihat pesanan sendiri | ❌ | ✅ | ✅ |
| Lihat semua pesanan | ✅ | ❌ | ❌ |
| Verifikasi pembayaran | ✅ | ❌ | ❌ |
| Update status pesanan | ✅ | ❌ | ❌ |
| Generate nota PDF | ✅ | ✅ (own order) | ✅ (own order) |
| Lihat laporan transaksi | ✅ | ❌ | ❌ |
| Ekspor laporan Excel/PDF | ✅ | ❌ | ❌ |
| Lihat daftar customer | ✅ | ❌ | ❌ |
| Lihat analitik & dashboard | ✅ | ❌ | ❌ |
| Update profil pribadi | ✅ | ✅ | ✅ |
| Update info bisnis | ✅ | ❌ | ❌ |
| Terima push notification | ✅ (saat order masuk) | ✅ (saat status berubah) | ✅ (saat status berubah) |

---

## 5. Alur Komunikasi (Request Flow)

### 5.1 Skenario: Customer Checkout + Upload Bukti + Verifikasi Owner

```
1. Customer buka aplikasi → Next.js PWA render halaman katalog
   └─ Frontend fetch GET /api/v1/products
      └─ FastAPI terima request → query MySQL via SQLAlchemy
         └─ Return JSON list produk → Frontend render

2. Customer tambah ke cart → state di Frontend (localStorage + sync API)
   └─ POST /api/v1/cart/items (jika login)

3. Customer checkout → POST /api/v1/orders
   ├─ FastAPI validasi via Pydantic
   ├─ Buat record `orders` + `order_items` di MySQL
   ├─ Generate order_id (ORD-YYYYMMDD-XXX)
   └─ Return order detail + total

4. Frontend minta QRIS → POST /api/v1/payments/{order_id}/qris
   ├─ FastAPI ambil QRIS statis owner dari `settings` table
   ├─ Inject nominal ke QRIS payload (qris-utils)
   ├─ Recalculate CRC16 checksum
   ├─ Generate QR code PNG (qrcode library)
   └─ Return QR image base64 + download URL

5. Customer scan QRIS → bayar via DANA/e-wallet
   └─ Di luar sistem (antara customer ↔ e-wallet ↔ DANA owner)

6. Customer upload bukti → POST /api/v1/payments/{order_id}/upload
   ├─ FastAPI terima file (multipart/form-data)
   ├─ Upload ke Cloudinary → dapat URL
   ├─ Simpan URL di `payments` table + status 'pending'
   ├─ Trigger push notification ke owner via FCM
   └─ Return success

7. Owner terima push notif → buka dashboard → klik pesanan
   └─ Frontend fetch GET /api/v1/admin/orders/{id}

8. Owner verifikasi → PATCH /api/v1/admin/orders/{id}/verify
   ├─ Update `payments.status = 'verified'`
   ├─ Update `orders.status = 'processed'`
   ├─ Trigger push notif ke customer (status berubah)
   └─ Return success

9. Owner update dikirim → PATCH /api/v1/admin/orders/{id}/ship
   ├─ Update status + no_resi
   ├─ Trigger push notif ke customer
   └─ (Opsional) Owner klik "Kirim WA" → wa.me deep link
```

---

## 6. Pola Keamanan (Security Pattern)

### 6.1 Authentication

**JWT Authentication** digunakan untuk semua endpoint terproteksi:

- **Format**: `Authorization: Bearer <token>` di header
- **Algorithm**: HS256
- **Secret**: disimpan di env var `JWT_SECRET` (min 32 chars, random)
- **Token expiry**: Customer 7 hari, Admin 1 hari
- **Payload**: `{ "sub": user_id, "role": "customer"|"admin", "exp": timestamp, "iat": timestamp }`
- **Refresh token**: Opsional, via endpoint `/auth/refresh` (valid 30 hari)

### 6.2 Password Hashing

- **Algorithm**: bcrypt
- **Salt rounds**: 12 (balance antara security & performance)
- **Storage**: di kolom `password_hash`, tidak pernah plain text
- **Verification**: gunakan `passlib.verify(plain, hashed)`

### 6.3 Role-based Authorization

Middleware FastAPI memvalidasi role (admin vs customer) berdasarkan claim di JWT:

```python
# Dependency untuk endpoint admin-only
async def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_jwt(token)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(Admin).filter(Admin.id == payload["sub"]).first()
```

### 6.4 CORS Configuration

Hanya origin frontend yang diizinkan:
- Dev: `http://localhost:3000`
- Prod: `https://moringsuksok.vercel.app` dan `https://*.vercel.app`

### 6.5 Input Validation

Semua input di-validasi via **Pydantic schema** (SQL injection prevention via SQLAlchemy ORM):
- Type checking
- Required fields
- String length limits
- Email format
- Phone number format (Indonesia: 08xxx atau +62xxx)
- File MIME type & size

### 6.6 File Upload Validation

Untuk upload bukti pembayaran:
- **MIME type allowed**: `image/jpeg`, `image/png`, `application/pdf`
- **Max size**: 5MB
- **Storage**: upload ke Cloudinary (isolated, tidak di server lokal)
- **Virus scanning**: opsional via Cloudinary add-on (future improvement)

### 6.7 Environment Variables

Secret keys disimpan di `.env` dan tidak di-commit ke repository:

```bash
# .env.example
DATABASE_URL=mysql+pymysql://root:@localhost:3306/moring_suksok
JWT_SECRET=your-super-secret-key-min-32-chars-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES_CUSTOMER=10080   # 7 days
ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN=1440         # 1 day

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Firebase Admin (server-side FCM)
FIREBASE_PROJECT_ID=xxx
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_CLIENT_EMAIL=xxx

# Frontend (NEXT_PUBLIC_*)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxx

# CORS
CORS_ORIGINS=http://localhost:3000,https://moringsuksok.vercel.app
```

### 6.8 Logging & Monitoring

- **Application logs**: Python `logging` module + loguru
- **API access logs**: uvicorn access logs
- **Error logs**: structured (JSON format) untuk production
- **Log rotation**: daily, keep 30 days
- **Monitor**: opsional via Vercel/Railway dashboard built-in

---

## 7. Skema Deployment

### 7.1 Local Development (default selama TA)

| Komponen | URL |
|---|---|
| Frontend Next.js | `http://localhost:3000` |
| Backend FastAPI | `http://localhost:8000` |
| Swagger UI | `http://localhost:8000/docs` |
| phpMyAdmin | `http://localhost/phpmyadmin` |
| MySQL | `localhost:3306` |

### 7.2 Staging (opsional - untuk demo ke dosen pembimbing)

| Komponen | URL |
|---|---|
| Frontend | `https://moring-suksok-staging.vercel.app` |
| Backend | `https://moring-suksok-staging.railway.app` |
| Database | Railway MySQL (free tier 5GB) |

### 7.3 Production (Minggu 8)

| Komponen | URL |
|---|---|
| Frontend | `https://moringsuksok.vercel.app` (atau custom domain `moringsuksok.id`) |
| Backend | `https://api.moringsuksok.railway.app` (atau `api.moringsuksok.id`) |
| Database | PlanetScale atau Railway MySQL |

---

## 8. Trade-off Arsitektur

### 8.1 Decoupled (Frontend-Backend Terpisah) vs Monolith (Next.js API Routes)

| Aspek | Decoupled (Dipilih) | Monolith (Tidak Dipilih) |
|---|---|---|
| Tech stack | Next.js + Python FastAPI | Next.js saja (API routes) |
| Deployment | 2 services (Vercel + Railway) | 1 service (Vercel) |
| Development complexity | Medium (2 codebase) | Low (1 codebase) |
| Scalability | Independent per layer | Bersama |
| Skill showcase | Python + JavaScript | JavaScript only |
| Decision rationale | Showcase Python skill, better separation | - |

### 8.2 QRIS Self-Generated vs Payment Gateway (Midtrans)

| Aspek | Self-Generated (Dipilih) | Midtrans (Tidak Dipilih) |
|---|---|---|
| Biaya | Rp 0 | 0.7% per transaksi |
| Auto-update status | ❌ Manual verification | ✅ Webhook otomatis |
| Customer upload bukti | ✅ Wajib | ❌ Tidak perlu |
| Setup | Hanya paste QRIS statis | Daftar akun + verifikasi KTP/NPWP |
| Cash flow | Real-time (DANA owner) | H+1 settlement |
| Decision rationale | Sesuai kebutuhan UMKM kecil tanpa biaya | - |

### 8.3 Push Notification PWA vs WhatsApp Business API

| Aspek | PWA + FCM (Dipilih) | WA Business API (Tidak Dipilih) |
|---|---|---|
| Biaya | Rp 0 (FCM free) | Rp 50-100/pesan via Fonnte/Wablas |
| Otomatis? | ✅ 100% otomatis | ✅ 100% otomatis |
| Butuh install PWA? | ✅ Ya | ❌ Tidak |
| Limitasi iOS | < 16.4 tidak support | Semua OS support |
| Decision rationale | Free, modern, sufficient untuk UMKM | Biaya tidak sebanding untuk skala kecil |

---

## 9. Decision Records (Reference)

Untuk detail ADR (Architecture Decision Records), lihat folder `specs/decisions/`:

- `ADR-001-tech-stack.md` — Pemilihan Python FastAPI + Next.js PWA + MySQL
- `ADR-002-qris-self-generated.md` — Pemilihan QRIS self-generated vs payment gateway
- `ADR-003-decoupled-architecture.md` — Pemilihan arsitektur decoupled vs monolith

---

**End of 02-architecture.md**
