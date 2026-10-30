# 05 — Data Model
# ERD, Daftar Tabel, & SQL DDL

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Source**: Dokumen Perencanaan Bab 7

---

## 1. Overview Database

Sistem menggunakan **MySQL 8.4.3** dengan charset `utf8mb4_unicode_ci` (support emoji & karakter Indonesia). Total ada **9 tabel utama**:

| # | Nama Tabel | Deskripsi |
|---|---|---|
| 1 | `admins` | Data admin/owner (login) |
| 2 | `customers` | Data customer Ritel & Masyarakat |
| 3 | `products` | Data produk (cimol kering (moring)) |
| 4 | `product_variants` | Varian produk (rasa/ukuran) |
| 5 | `orders` | Header pesanan (1 pesanan = 1 record) |
| 6 | `order_items` | Detail item per pesanan |
| 7 | `payments` | Data pembayaran + bukti upload |
| 8 | `notifications` | Log notifikasi yang dikirim |
| 9 | `settings` | Konfigurasi sistem (QRIS owner, info bisnis) |

---

## 2. ERD (Entity Relationship Diagram)

```
┌─────────────────┐         ┌─────────────────────┐         ┌─────────────────┐
│    admins       │         │     customers        │         │   products      │
├─────────────────┤         ├──────────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)               │         │ id (PK)         │
│ email (UQ)      │         │ email (UQ)            │         │ name            │
│ password_hash   │         │ password_hash         │         │ slug (UQ)       │
│ name            │         │ name                  │         │ description     │
│ phone           │         │ phone                 │         │ category        │
│ created_at      │         │ address               │         │ base_price      │
│ updated_at      │         │ customer_type         │         │ is_active       │
└─────────────────┘         │  (retail/public)      │         │ image_url       │
                            │ created_at            │         │ created_at      │
                            │ updated_at            │         │ updated_at      │
                            └──────────┬─────────────┘         └────────┬────────┘
                                       │                                │
                                       │ 1                              │ 1
                                       │                                │
                                       │ M                              │ M
                                       │                                │
                                       ▼                                ▼
                            ┌─────────────────────┐         ┌─────────────────────┐
                            │      orders         │         │  product_variants   │
                            ├──────────────────────┤         ├─────────────────────┤
                            │ id (PK)              │         │ id (PK)             │
                            │ order_code (UQ)      │         │ product_id (FK)     │
                            │ customer_id (FK)     │◄────────┤ variant_name        │
                            │ customer_type        │         │ stock               │
                            │ shipping_address     │         │ created_at          │
                            │ shipping_method      │         │ updated_at          │
                            │ shipping_cost        │         └─────────────────────┘
                            │ subtotal             │
                            │ total                │
                            │ status               │
                            │   (pending/processed │
                            │    /shipped/done/    │
                            │    cancelled)        │
                            │ notes                │
                            │ created_at           │
                            │ updated_at           │
                            └──────────┬───────────┘
                                       │ 1
                                       │
                                       │ M
                                       │
                            ┌──────────▼───────────┐         ┌─────────────────────┐
                            │   order_items        │         │     payments        │
                            ├──────────────────────┤         ├─────────────────────┤
                            │ id (PK)              │         │ id (PK)             │
                            │ order_id (FK)        │         │ order_id (FK, UQ)   │
                            │ product_id (FK)      │         │ method              │
                            │ variant_id (FK)      │         │   (qris/manual)    │
                            │ quantity             │         │ amount              │
                            │ price_per_unit       │         │ qris_payload        │
                            │ subtotal             │         │ proof_image_url     │
                            │ created_at           │         │ status              │
                            │ updated_at           │         │   (pending/verified │
                            └──────────────────────┘         │    /rejected)       │
                                                             │ verified_by (FK)    │
                                                             │ verified_at          │
                                                             │ rejection_reason    │
                                                             │ created_at           │
                                                             │ updated_at           │
                                                             └─────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│   notifications     │         │     settings        │
├─────────────────────┤         ├─────────────────────┤
│ id (PK)             │         │ id (PK)             │
│ user_type           │         │ key_name (UQ)       │
│   (customer/admin)  │         │ value (TEXT/JSON)   │
│ user_id (FK)        │         │ description         │
│ title               │         │ updated_at          │
│ message             │         └─────────────────────┘
│ type                │
│   (push/whatsapp)   │
│ status              │
│   (pending/sent/    │
│    failed)          │
│ related_order_id    │
│ wa_link             │
│ created_at          │
└─────────────────────┘
```

---

## 3. Relasi Antar Tabel (Summary)

| Dari | Ke | Jenis Relasi | Kardinalitas |
|---|---|---|---|
| `customers` | `orders` | One-to-Many | 1 customer punya banyak order |
| `products` | `product_variants` | One-to-Many | 1 produk punya banyak varian |
| `orders` | `order_items` | One-to-Many | 1 order punya banyak item |
| `orders` | `payments` | One-to-One | 1 order punya 1 payment |
| `products` | `order_items` | One-to-Many | 1 produk muncul di banyak order |
| `product_variants` | `order_items` | One-to-Many | 1 varian muncul di banyak order |
| `admins` | `payments` (via verified_by) | One-to-Many | 1 admin verifikasi banyak payment |
| `customers` | `notifications` | One-to-Many | 1 customer terima banyak notif |
| `orders` | `notifications` | One-to-Many | 1 order trigger banyak notif |

---

## 4. SQL DDL — Definisi Tabel Lengkap

### 4.1 Tabel: `admins`

```sql
CREATE TABLE admins (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Kolom kunci**:
- `email`: UNIQUE, untuk login admin
- `password_hash`: bcrypt hash (salt rounds = 12)

### 4.2 Tabel: `customers`

```sql
CREATE TABLE customers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    address         TEXT NOT NULL,
    customer_type   ENUM('retail', 'public') NOT NULL DEFAULT 'public',
    fcm_token       TEXT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_type (customer_type)
);
```

**Kolom kunci**:
- `email`: UNIQUE, untuk login customer
- `customer_type`: ENUM 'retail' atau 'public' (Masyarakat)
- `fcm_token`: token Firebase Cloud Messaging (untuk push notif), nullable jika customer belum install PWA
- `is_active`: soft delete flag

### 4.3 Tabel: `products`

```sql
CREATE TABLE products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    slug        VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    category    VARCHAR(50) DEFAULT 'snack',
    base_price  DECIMAL(12,2) NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    image_url   VARCHAR(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Kolom kunci**:
- `slug`: UNIQUE, untuk URL friendly (e.g. `kripik-moring-original`)
- `base_price`: DECIMAL(12,2) untuk akurasi (max 999,999,999.99)
- `is_active`: soft delete (false = tidak tampil di katalog, tapi tetap ada di order history)
- `image_url`: URL Cloudinary setelah upload

### 4.4 Tabel: `product_variants`

```sql
CREATE TABLE product_variants (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    product_id   INT NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    stock        INT DEFAULT 0,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_product_variant (product_id, variant_name)
);
```

**Contoh data**:
- Product "Moring Original" (id=1)
  - Variant 1: "Original 100gr" (stock=50)
  - Variant 2: "Original 250gr" (stock=20)
  - Variant 3: "Original 500gr" (stock=10)

### 4.5 Tabel: `orders`

```sql
CREATE TABLE orders (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    order_code       VARCHAR(30) NOT NULL UNIQUE,
    customer_id      INT NOT NULL,
    customer_type    ENUM('retail', 'public') NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_method  VARCHAR(50),
    shipping_cost    DECIMAL(12,2) DEFAULT 0,
    subtotal         DECIMAL(12,2) NOT NULL,
    total            DECIMAL(12,2) NOT NULL,
    status           ENUM('pending', 'processed', 'shipped', 'done', 'cancelled')
                     DEFAULT 'pending',
    tracking_number  VARCHAR(100),
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_status (status),
    INDEX idx_customer (customer_id),
    INDEX idx_created (created_at)
);
```

**Kolom kunci**:
- `order_code`: UNIQUE, format `ORD-YYYYMMDD-XXX` (e.g. `ORD-20261029-001`)
- `customer_type`: disnapshot dari customer untuk analisis (jika customer dihapus, type tetap tercatat di order)
- `shipping_method`: 'pickup' atau 'delivery'
- `shipping_cost`: diambil dari `settings.shipping_cost_flat` saat checkout
- `status`: ENUM 5 status (lihat state machine di `07-user-flows.md`)
- `tracking_number`: no resi kurir (diisi saat status jadi 'shipped')

### 4.6 Tabel: `order_items`

```sql
CREATE TABLE order_items (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT NOT NULL,
    product_id     INT NOT NULL,
    variant_id     INT,
    product_name   VARCHAR(150) NOT NULL,
    variant_name   VARCHAR(100),
    quantity       INT NOT NULL,
    price_per_unit DECIMAL(12,2) NOT NULL,
    subtotal       DECIMAL(12,2) NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);
```

**Kolom kunci**:
- `product_name`, `variant_name`, `price_per_unit`: **SNAPSHOT** dari produk saat checkout (jika produk dihapus/diubah harga, data order tetap akurat)
- `quantity`: jumlah unit dibeli
- `subtotal`: `quantity × price_per_unit`

### 4.7 Tabel: `payments`

```sql
CREATE TABLE payments (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    order_id         INT NOT NULL UNIQUE,
    method           ENUM('qris', 'manual_transfer') DEFAULT 'qris',
    amount           DECIMAL(12,2) NOT NULL,
    qris_payload     TEXT,
    proof_image_url  VARCHAR(500),
    status           ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by      INT,
    verified_at      TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_status (status)
);
```

**Kolom kunci**:
- `order_id`: UNIQUE (1 order = 1 payment, One-to-One)
- `method`: 'qris' (default, generate QRIS dinamis) atau 'manual_transfer' (transfer ke DANA)
- `qris_payload`: raw string QRIS (untuk regenerate QR jika perlu)
- `proof_image_url`: URL Cloudinary setelah customer upload bukti
- `status`: 'pending' (menunggu verifikasi), 'verified' (sudah dikonfirmasi owner), 'rejected' (ditolak dengan alasan)
- `verified_by`: FK ke `admins.id` (admin yang verifikasi)
- `verified_at`: timestamp saat verifikasi
- `rejection_reason`: alasan jika ditolak (wajib diisi jika status='rejected')

### 4.8 Tabel: `notifications`

```sql
CREATE TABLE notifications (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_type         ENUM('customer', 'admin') NOT NULL,
    user_id           INT NOT NULL,
    title             VARCHAR(200) NOT NULL,
    message           TEXT NOT NULL,
    type              ENUM('push', 'whatsapp') NOT NULL,
    status            ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    related_order_id  INT NULL,
    wa_link           TEXT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (related_order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user (user_type, user_id)
);
```

**Kolom kunci**:
- `user_type` + `user_id`: polymorphic relation (bisa ke customer atau admin)
- `type`: 'push' (FCM push notif) atau 'whatsapp' (wa.me deep link)
- `status`: 'pending' (antrian kirim), 'sent' (berhasil), 'failed' (gagal kirim)
- `related_order_id`: nullable, untuk kontek (notif terkait order mana)
- `wa_link`: URL wa.me yang ter-generate (untuk type='whatsapp')

### 4.9 Tabel: `settings`

```sql
CREATE TABLE settings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    key_name    VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT NOT NULL,
    description VARCHAR(255),
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Seed data awal**:

```sql
INSERT INTO settings (key_name, value, description) VALUES
('owner_qris_static', '', 'QRIS statis owner (raw string payload)'),
('owner_dana_number', '', 'Nomor DANA owner'),
('owner_whatsapp', '', 'Nomor WhatsApp owner untuk notifikasi'),
('business_name', 'Moring Suksok', 'Nama bisnis'),
('business_address', '', 'Alamat bisnis'),
('shipping_cost_flat', '10000', 'Ongkir default (flat) dalam Rupiah');
```

**Setting keys yang akan digunakan**:

| Key | Type | Description |
|---|---|---|
| `owner_qris_static` | string (raw QRIS payload) | QRIS statis owner untuk generate QRIS dinamis |
| `owner_dana_number` | string | Nomor DANA untuk transfer manual |
| `owner_whatsapp` | string (62xxx) | Nomor WA owner untuk notifikasi wa.me |
| `business_name` | string | Nama bisnis untuk header nota |
| `business_address` | string | Alamat bisnis untuk footer nota |
| `shipping_cost_flat` | int (Rupiah) | Ongkir default flat |

---

## 5. Index Strategy

Index ditambahkan pada kolom yang sering di-query untuk performance:

| Tabel | Kolom | Index Type | Alasan |
|---|---|---|---|
| `admins` | `email` | UNIQUE | Login lookup |
| `customers` | `email` | UNIQUE | Login lookup |
| `customers` | `customer_type` | INDEX | Filter laporan by segmen |
| `products` | `slug` | UNIQUE | Lookup by URL slug |
| `product_variants` | (product_id, variant_name) | UNIQUE COMPOSITE | Cek duplikasi varian |
| `orders` | `order_code` | UNIQUE | Lookup by code |
| `orders` | `status` | INDEX | Filter dashboard by status |
| `orders` | `customer_id` | INDEX | List pesanan per customer |
| `orders` | `created_at` | INDEX | Sorting & filter periode laporan |
| `payments` | `order_id` | UNIQUE | One-to-One ke orders |
| `payments` | `status` | INDEX | Filter verifikasi |
| `notifications` | (user_type, user_id) | INDEX COMPOSITE | List notif per user |
| `settings` | `key_name` | UNIQUE | Lookup setting by key |

---

## 6. Seed Data

Setelah schema ter-create via Alembic migration, jalankan seed script (`backend/seed.py`) untuk mengisi data awal:

### 6.1 Admin Default
```python
# Email: admin@moring-suksok.com
# Password: admin123 (CHANGE THIS IMMEDIATELY!)
# Name: Owner Moring Suksok
# Phone: 0812-xxxx-xxxx
```

### 6.2 Settings Default
```python
settings_data = {
    'owner_qris_static': '',  # Owner input via admin settings page
    'owner_dana_number': '',
    'owner_whatsapp': '62812xxxxxxx',
    'business_name': 'Moring Suksok',
    'business_address': 'Jl. [Alamat Owner], [Kota]',
    'shipping_cost_flat': '10000',
}
```

### 6.3 Contoh Produk & Varian
```python
products_data = [
    {
        'name': 'Moring Original',
        'slug': 'moring-original',
        'description': 'Cimol kering (moring) dengan rasa original, gurih, renyah, dan tahan lama.',
        'category': 'snack',
        'base_price': 15000,
        'variants': [
            {'variant_name': 'Original 100gr', 'stock': 50},
            {'variant_name': 'Original 250gr', 'stock': 20},
            {'variant_name': 'Original 500gr', 'stock': 10},
        ]
    },
    {
        'name': 'Moring Pedas',
        'slug': 'moring-pedas',
        'description': 'Cimol kering (moring) dengan bumbu pedas untuk pecinta pedas.',
        'category': 'snack',
        'base_price': 17000,
        'variants': [
            {'variant_name': 'Pedas 100gr', 'stock': 40},
            {'variant_name': 'Pedas 250gr', 'stock': 15},
        ]
    },
    {
        'name': 'Moring Keju',
        'slug': 'moring-keju',
        'description': 'Cimol kering (moring) dengan topping keju untuk rasa yang lebih creamy.',
        'category': 'snack',
        'base_price': 18000,
        'variants': [
            {'variant_name': 'Keju 100gr', 'stock': 30},
            {'variant_name': 'Keju 250gr', 'stock': 12},
        ]
    },
    {
        'name': 'Moring Balado',
        'slug': 'moring-balado',
        'description': 'Cimol kering (moring) dengan bumbu balado yang pedas manis khas Indonesia.',
        'category': 'snack',
        'base_price': 17000,
        'variants': [
            {'variant_name': 'Balado 100gr', 'stock': 35},
            {'variant_name': 'Balado 250gr', 'stock': 14},
        ]
    },
    {
        'name': 'Moring Jagung',
        'slug': 'moring-jagung',
        'description': 'Cimol kering (moring) dengan rasa jagung manis yang disukai anak-anak.',
        'category': 'snack',
        'base_price': 16000,
        'variants': [
            {'variant_name': 'Jagung 100gr', 'stock': 38},
            {'variant_name': 'Jagung 250gr', 'stock': 16},
        ]
    },
]
```

---

## 7. SQLAlchemy Models (Reference for Agent B)

Berikut adalah mapping tabel ke SQLAlchemy models yang harus dibuat oleh Agent B di `backend/app/models/`:

```python
# backend/app/models/customer.py
from sqlalchemy import Column, Integer, String, Text, Enum, Boolean, TIMESTAMP, Index
from sqlalchemy.sql import func
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(Text, nullable=False)
    customer_type = Column(Enum('retail', 'public'), nullable=False, default='public')
    fcm_token = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index('idx_customer_type', 'customer_type'),
    )
```

> **Untuk Agent B**: Generate semua 9 model classes sesuai dengan DDL di atas. Gunakan `alembic revision --autogenerate -m "init schema"` untuk generate migration file, lalu `alembic upgrade head` untuk create tabel di MySQL.

---

## 8. Data Privacy & Retention

### 8.1 Data yang Disimpan Permanen
- Admin data
- Customer data (selama akun aktif)
- Product data (termasuk yang soft-deleted)
- Orders + Order Items + Payments (audit trail, untuk pembukuan akuntan)
- Settings

### 8.2 Data yang Bisa Dihapus
- Bukti pembayaran image di Cloudinary: hapus setelah 1 tahun (setelah tidak relevan untuk audit)
- Notifications: hapus setelah 6 bulan (untuk hemat storage)
- Customer bisa request delete akun (GDPR-style): soft delete `is_active=false`, hard delete setelah 90 hari jika tidak ada order aktif

### 8.3 Backup Strategy
- **Local dev**: Manual export via phpMyAdmin
- **Production**: Railway/PlanetScale auto backup harian
- **Retention**: 30 hari rolling backup

---

## 9. Migration Notes

### 9.1 Alembic Setup

```bash
# Initialize Alembic
cd backend
alembic init alembic

# Edit alembic.ini:
# sqlalchemy.url = mysql+pymysql://root:@localhost:3306/moring_suksok

# Edit alembic/env.py: import all models to enable autogenerate

# Generate first migration
alembic revision --autogenerate -m "init schema - 9 tables"

# Apply migration
alembic upgrade head
```

### 9.2 Future Migrations

Setiap perubahan schema (add column, modify type, dll) **WAJIB** via Alembic migration file, BUKAN manual edit di phpMyAdmin. Migration files dicommit ke Git.

Format naming migration:
- `YYYY_MM_DD_HHMM_<description>.py`
- Contoh: `2026_10_29_1430_init_schema_9_tables.py`

### 9.3 Rollback Plan

Jika migration gagal:
```bash
# Rollback 1 step
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision_id>

# Rollback to beginning
alembic downgrade base
```

---

**End of 05-data-model.md**
