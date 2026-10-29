# 07 — User Flows
# Alur Pengguna Customer & Owner + State Machine

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Source**: Dokumen Perencanaan Bab 8

---

## 1. Customer User Flow — Registrasi & Belanja

Flow berikut menggambarkan perjalanan customer dari pertama kali membuka aplikasi hingga pesanan selesai. Setiap tahap memiliki validasi dan feedback yang jelas untuk memastikan UX yang baik.

### 1.1 Flow: Registrasi Customer Baru

```
[Customer buka aplikasi]
        │
        ▼
[Landing Page / Katalog Produk]
        │
        ├─ Customer klik "Daftar" (jika belum login)
        ▼
[Halaman Registrasi]
        │
        ├─ Form fields:
        │    - Nama Lengkap *
        │    - Email *
        │    - No WhatsApp *
        │    - Password *
        │    - Konfirmasi Password *
        │    - Alamat Lengkap *
        │    - Segmen Customer * (radio button: Ritel / Masyarakat)
        │
        ▼
[Submit Form] ──► POST /api/v1/auth/register
        │
        ├─ FastAPI validasi input (Pydantic)
        ├─ Cek email unik di database
        ├─ Hash password (bcrypt)
        ├─ Insert ke tabel `customers`
        ├─ Generate JWT token
        └─ Return response 201 + token
        │
        ▼
[Registrasi Berhasil]
        │
        ├─ Simpan token di localStorage
        ├─ Redirect ke halaman katalog
        └─ Tampilkan toast: "Selamat datang di Moring Suksok!"
```

### 1.2 Flow: Login Customer

```
[Customer buka aplikasi]
        │
        ▼
[Halaman Login]
        │
        ├─ Form: Email + Password
        │
        ▼
[Submit] ──► POST /api/v1/auth/login
        │
        ├─ FastAPI validasi kredensial
        ├─ Return JWT token + user info
        └─ Simpan token di localStorage
        │
        ▼
[Redirect ke Dashboard Customer]
```

### 1.3 Flow: Browse Katalog & Tambah ke Cart

```
[Customer di halaman Katalog]
        │
        ├─ GET /api/v1/products (dengan pagination & filter)
        │
        ▼
[Render Grid Produk]
        │
        ├─ Klik produk → GET /api/v1/products/{slug}
        │
        ▼
[Halaman Detail Produk]
        │
        ├─ Tampilkan: foto, nama, deskripsi, harga, varian
        ├─ Pilih varian (dropdown)
        ├─ Pilih quantity (input/stepper)
        ├─ Cek stok (real-time dari backend)
        │
        ▼
[Klik "Tambah ke Keranjang"]
        │
        ├─ Jika belum login → redirect ke halaman login
        ├─ Jika sudah login → POST /api/v1/cart/items
        │   ├─ Simpan ke tabel cart (atau localStorage sementara)
        │   └─ Update badge cart counter
        │
        ▼
[Toast: "Produk ditambahkan ke keranjang"]
```

### 1.4 Flow: Checkout & Pembayaran

```
[Customer buka halaman Cart]
        │
        ├─ GET /api/v1/cart (jika cart tersimpan di backend)
        │
        ▼
[Halaman Cart]
        │
        ├─ List items: foto, nama, varian, qty, harga, subtotal
        ├─ Edit qty (real-time update total)
        ├─ Hapus item
        ├─ Subtotal: Rp XXX
        ├─ Ongkir: Rp YYY (flat, dari settings)
        ├─ Total: Rp ZZZ
        │
        ▼
[Klik "Checkout"]
        │
        ▼
[Halaman Checkout]
        │
        ├─ Konfirmasi alamat pengiriman (pre-fill dari profil)
        ├─ Bisa edit alamat (override untuk order ini)
        ├─ Catatan untuk owner (opsional)
        ├─ Pilih metode pengiriman: Pickup / Delivery
        │
        ▼
[Klik "Lanjut ke Pembayaran"]
        │
        ├─ POST /api/v1/orders
        │   ├─ Validasi cart tidak kosong
        │   ├─ Validasi stok masih tersedia
        │   ├─ Generate order_code (ORD-YYYYMMDD-XXX)
        │   ├─ Insert ke `orders` table (status: pending)
        │   ├─ Insert ke `order_items` (snapshot produk+varian+harga)
        │   ├─ Clear cart
        │   └─ Return order_id + total
        │
        ▼
[Halaman Pembayaran]
        │
        ├─ Display: Total Rp ZZZ
        ├─ Pilih metode:
        │   ○ QRIS (default)
        │   ○ Transfer Manual ke DANA
        │
        ├─ Jika QRIS:
        │   ├─ POST /api/v1/payments/{order_id}/qris
        │   ├─ Backend generate QRIS dinamis (nominal embedded)
        │   ├─ Return QR code (base64 image) + raw payload
        │   ├─ Display QR Code besar di layar
        │   ├─ Tombol: "Download QR" & "Buka E-wallet"
        │   └─ Instruksi: "Scan QR via DANA/SeaBank/OVO/m-banking"
        │
        ├─ Jika Transfer Manual:
        │   ├─ Display nomor DANA owner + total
        │   └─ Instruksi: "Transfer ke nomor berikut, lalu upload bukti"
        │
        ▼
[Customer bayar di app e-wallet (di luar sistem)]
        │
        ▼
[Customer screenshot bukti pembayaran]
        │
        ▼
[Klik "Upload Bukti Pembayaran"]
        │
        ├─ Form upload: file input (jpg/png/pdf, max 5MB)
        ├─ Submit → POST /api/v1/payments/{order_id}/upload
        │   ├─ Validasi MIME type & size
        │   ├─ Upload ke Cloudinary → dapat URL
        │   ├─ Update `payments.proof_image_url`
        │   ├─ Update `payments.status = 'pending'`
        │   ├─ Trigger push notification ke owner (FCM)
        │   ├─ Insert ke `notifications` (log)
        │   └─ Return success
        │
        ▼
[Halaman Status Pesanan: "Menunggu Verifikasi"]
        │
        ├─ Tampilkan status real-time
        ├─ Tombol: "📢 Notifikasi Owner via WhatsApp"
        │   ├─ Generate wa.me link dengan pesan otomatis:
        │   │   "Halo Owner Moring Suksok! Saya baru checkout pesanan
        │   │    ORD-XXX sebesar Rp YYY. Mohon segera diverifikasi."
        │   └─ Buka tab baru → wa.me → customer klik Send
        │
        ▼
[Customer tunggu update status dari owner]
```

### 1.5 Flow: Tracking Status Pesanan

```
[Customer di halaman Riwayat Pesanan]
        │
        ├─ GET /api/v1/orders (list pesanan customer)
        │
        ▼
[List Pesanan]
        │
        ├─ Filter by status: Semua / Pending / Diproses / Dikirim / Selesai
        ├─ Klik order → halaman detail
        │
        ▼
[Halaman Detail Pesanan]
        │
        ├─ Order info: code, tanggal, items, total
        ├─ Timeline status (visual progress bar):
        │   ● Pending → ○ Diproses → ○ Dikirim → ○ Selesai
        ├─ Jika status = "shipped":
        │   └─ Tampilkan no resi + link tracking kurir (jika ada)
        │
        ▼
[Customer bisa terima push notification saat status berubah]
        │
        ├─ Notif masuk → klik → langsung ke halaman detail pesanan
        └─ Update timeline status otomatis
```

---

## 2. Owner/Admin User Flow

### 2.1 Flow: Login Admin & Setup Awal

```
[Owner buka URL admin: /admin/login]
        │
        ▼
[Halaman Login Admin]
        │
        ├─ Email + Password (default: admin@moring-suksok.com)
        │
        ▼
[Submit] ──► POST /api/v1/auth/admin/login
        │
        ├─ Validasi role = admin
        └─ Return JWT token (1 hari expiry)
        │
        ▼
[Redirect ke Dashboard Admin]
        │
        ├─ Jika first-time setup (owner_qris_static kosong):
        │   └─ Redirect ke halaman Settings
        │
        ▼
[Halaman Settings - Setup QRIS]
        │
        ├─ Owner scan QRIS statis-nya sendiri via HP
        ├─ Paste raw string QRIS payload ke textarea
        ├─ Save → POST /api/v1/admin/settings
        │   ├─ Validasi QRIS format (qris-utils)
        │   └─ Simpan ke `settings.owner_qris_static`
        │
        ├─ Input nomor DANA owner
        ├─ Input nomor WhatsApp owner
        └─ Save
```

### 2.2 Flow: Kelola Produk

```
[Owner di Dashboard → Menu "Produk"]
        │
        ▼
[List Produk]
        │
        ├─ Search by name
        ├─ Filter by category
        ├─ Pagination
        │
        ▼
[Klik "Tambah Produk"]
        │
        ├─ Form: nama, deskripsi, kategori, harga dasar, foto
        ├─ Upload foto → Cloudinary
        ├─ Varian (multiple):
        │   ├─ Variant Name (contoh: "Original 100gr", "Pedas 100gr")
        │   └─ Stock
        │
        ▼
[Submit] ──► POST /api/v1/admin/products
        │
        ├─ Validasi input
        ├─ Insert ke `products` + `product_variants`
        └─ Return product detail
        │
        ▼
[Toast: "Produk berhasil ditambahkan"]

[Untuk Edit/Hapus: klik produk → tombol Edit/Delete]
```

### 2.3 Flow: Verifikasi Pembayaran

```
[Owner terima Push Notification: "Pesanan baru ORD-XXX"]
        │
        ├─ Klik notif → buka dashboard → langsung ke detail order
        │   ATAU
        ├─ Owner manual buka dashboard → menu "Pesanan Masuk"
        │
        ▼
[List Pesanan dengan filter "Menunggu Verifikasi"]
        │
        ├─ GET /api/v1/admin/orders?status=pending
        │
        ▼
[Klik order untuk lihat detail]
        │
        ├─ Display:
        │   ├─ Order info (code, tanggal, customer)
        │   ├─ Items list (produk, varian, qty, harga)
        │   ├─ Total
        │   ├─ Alamat pengiriman
        │   ├─ Bukti pembayaran (image preview, klik untuk zoom)
        │   └─ Tombol: "✓ Konfirmasi Lunas" | "✗ Tolak"
        │
        ▼
[Owner cek bukti pembayaran]
        │
        ├─ Cocokkan nominal di bukti vs total order
        ├─ (Opsional) cek mutasi DANA owner untuk verifikasi silang
        │
        ▼
[Klik "✓ Konfirmasi Lunas"]
        │
        ├─ PATCH /api/v1/admin/orders/{id}/verify
        │   ├─ Update `payments.status = 'verified'`
        │   ├─ Update `payments.verified_by = admin_id`
        │   ├─ Update `payments.verified_at = NOW()`
        │   ├─ Update `orders.status = 'processed'`
        │   ├─ Trigger push notif ke customer: "Pembayaran terverifikasi!"
        │   ├─ Insert log ke `notifications`
        │   └─ Return success
        │
        ▼
[Toast: "Pembayaran terverifikasi, status diupdate"]

[Atau Klik "✗ Tolak"]
        │
        ├─ Modal muncul: input alasan penolakan
        ├─ PATCH /api/v1/admin/orders/{id}/reject
        │   ├─ Update `payments.status = 'rejected'`
        │   ├─ Update `payments.rejection_reason`
        │   ├─ Update `orders.status = 'cancelled'`
        │   ├─ Trigger push notif ke customer: "Pembayaran ditolak: [reason]"
        │   └─ Return success
```

### 2.4 Flow: Update Status Pengiriman

```
[Owner di Dashboard → menu "Pesanan Diproses"]
        │
        ▼
[List Pesanan dengan status "processed"]
        │
        ▼
[Klik order → tombol "Update: Dikirim"]
        │
        ├─ Modal: input nomor resi (opsional)
        │
        ▼
[Submit] ──► PATCH /api/v1/admin/orders/{id}/ship
        │
        ├─ Update `orders.status = 'shipped'`
        ├─ Update `orders.tracking_number`
        ├─ Trigger push notif ke customer: "Pesanan dikirim! No resi: XXX"
        ├─ (Opsional) Owner klik tombol "Kirim WA ke Customer"
        │   ├─ Generate wa.me link dengan template:
        │   │   "Halo [Nama], pesanan ORD-XXX sudah dikirim via [kurir].
        │   │    No resi: XXX. Estimasi sampai: ..."
        │   └─ Buka tab baru → owner klik Send
        │
        ▼
[Toast: "Status diupdate, customer diberitahu"]

[Setelah customer terima barang]
        │
        ▼
[Owner update: "Selesai"] ──► PATCH /api/v1/admin/orders/{id}/complete
        │
        ├─ Update `orders.status = 'done'`
        ├─ Trigger push notif: "Pesanan selesai. Terima kasih!"
        └─ Transaksi tercatat otomatis di laporan
```

### 2.5 Flow: Lihat Laporan Transaksi

```
[Owner di Dashboard → menu "Laporan"]
        │
        ▼
[Halaman Laporan Transaksi]
        │
        ├─ Filter periode: Hari ini / Minggu ini / Bulan ini / Custom range
        ├─ Filter segmen: Semua / Ritel / Masyarakat
        ├─ Filter status: Semua / Pending / Verified / Rejected
        │
        ▼
[GET /api/v1/admin/reports?from=&to=&segment=&status=]
        │
        ├─ Backend query dengan aggregate:
        │   ├─ Total transaksi (count)
        │   ├─ Total pendapatan (sum total where verified)
        │   ├─ Rata-rata order value
        │   ├─ Produk terlaris (group by product)
        │   └─ Breakdown per segmen (retail vs public)
        │
        ▼
[Render Laporan]
        │
        ├─ Summary cards: total transaksi, total pendapatan, AOV
        ├─ Tabel detail transaksi:
        │   ├─ Order code, tanggal, customer, segmen
        │   ├─ Items count, total
        │   ├─ Status pembayaran, status order
        │   └─ Action: view detail, download nota PDF
        │
        ├─ Grafik (opsional): bar chart penjualan per hari
        │
        ▼
[Tombol Export]
        │
        ├─ "Export PDF" → generate laporan PDF (ReportLab)
        │   └─ GET /api/v1/admin/reports/export?format=pdf
        │
        ├─ "Export Excel" → generate xlsx
        │   └─ GET /api/v1/admin/reports/export?format=excel
        │
        ├─ "Download Nota per Order" → PDF individual
        │   └─ GET /api/v1/admin/orders/{id}/nota.pdf
```

---

## 3. State Machine Status Pesanan

Status pesanan mengikuti state machine berikut. Setiap transisi memiliki trigger yang jelas dan tidak bisa di-skip (kecuali cancel dari pending).

```
                    ┌─────────────────────────────┐
                    │                             │
                    ▼                             │
              ┌──────────┐                  ┌─────┴─────┐
              │ PENDING  │ ──owner tolak──► │ CANCELLED │
              │          │                  │ (final)   │
              └────┬─────┘                  └───────────┘
                   │
                   │ owner verifikasi
                   ▼
              ┌──────────┐
              │ DIPROSES │
              │          │
              └────┬─────┘
                   │
                   │ owner update dikirim + no resi
                   ▼
              ┌──────────┐
              │ DIKIRIM  │
              │          │
              └────┬─────┘
                   │
                   │ owner update selesai
                   ▼
              ┌──────────┐
              │ SELESAI  │
              │ (final)  │
              └──────────┘
```

### 3.1 Status Definitions

| Status | Display Name (Indonesia) | Color | Description |
|---|---|---|---|
| `pending` | Menunggu Verifikasi | Warning (yellow) | Customer sudah upload bukti, menunggu owner verifikasi |
| `processed` | Sedang Diproses | Info (blue) | Owner konfirmasi lunas, pesanan sedang disiapkan/dikemas |
| `shipped` | Dikirim | Purple | Pesanan sudah diserahkan ke kurir, ada no resi |
| `done` | Selesai | Success (green) | Pesanan sudah diterima customer (final state) |
| `cancelled` | Dibatalkan | Danger (red) | Pembayaran ditolak / pesanan dibatalkan (final state) |

### 3.2 Valid Transitions

| From | To | Trigger | API Endpoint |
|---|---|---|---|
| `pending` | `processed` | Owner verify | `PATCH /admin/orders/{id}/verify` |
| `pending` | `cancelled` | Owner reject | `PATCH /admin/orders/{id}/reject` |
| `processed` | `shipped` | Owner update + input no resi | `PATCH /admin/orders/{id}/ship` |
| `shipped` | `done` | Owner mark complete | `PATCH /admin/orders/{id}/complete` |

### 3.3 Invalid Transitions (yang harus di-block)

| From | To | Alasan |
|---|---|---|
| `done` | (any) | Final state, tidak bisa diubah |
| `cancelled` | (any) | Final state, tidak bisa diubah |
| `pending` | `shipped` | Harus lewat `processed` dulu |
| `shipped` | `processed` | Tidak bisa rollback |

Jika user mencoba transisi invalid, return HTTP 422 dengan pesan: "Transisi status tidak valid dari {from} ke {to}".

---

## 4. Notifikasi Trigger Mapping

Tabel ini menunjukkan kapan notifikasi dikirim, ke siapa, via channel apa, dan pesan template-nya:

| # | Trigger Event | Penerima | Channel | Pesan Template |
|---|---|---|---|---|
| 1 | Customer upload bukti pembayaran | Owner/Admin | Push (FCM) | "Pesanan baru {order_code} dari {customer_name}, total Rp {total}. Mohon segera diverifikasi." |
| 1b | (Backup) Customer klik tombol WA | Owner | WhatsApp (wa.me) | "Halo Owner, saya baru upload bukti pembayaran untuk pesanan {order_code} sebesar Rp {total}. Mohon diverifikasi." |
| 2 | Owner konfirmasi pembayaran lunas | Customer | Push (FCM) | "Pembayaran terverifikasi! Pesanan {order_code} sedang diproses. Terima kasih 🌿" |
| 3 | Owner tolak pembayaran | Customer | Push (FCM) | "Maaf, pembayaran untuk pesanan {order_code} ditolak. Alasan: {reason}. Silakan hubungi owner." |
| 4 | Owner update status dikirim | Customer | Push (FCM) | "Pesanan {order_code} telah dikirim. No resi: {tracking_number}" |
| 5 | Owner update status selesai | Customer | Push (FCM) | "Pesanan {order_code} selesai. Terima kasih sudah berbelanja di Moring Suksok! 🌿" |
| 6 | (Opsional) Owner klik "Kirim WA" | Customer | WhatsApp (wa.me) | Custom message dari owner (template pre-filled) |

---

## 5. Notifikasi Trigger — Detail Implementation

### 5.1 Trigger 1: Customer Upload Bukti

**Backend Logic (in `payments.py`):**
```python
# After successful upload
admin_fcm_tokens = db.query(Customer.fcm_token).filter(
    Customer.id.in_(get_admin_ids(db)),
    Customer.fcm_token.isnot(None)
).all()

send_push_notification(
    tokens=[t[0] for t in admin_fcm_tokens],
    title=f"Pesanan baru {order.order_code}",
    body=f"Dari {customer.name}, total Rp {order.total:,.0f}",
    data={"order_id": order.id, "url": f"/admin/orders/{order.id}"}
)

# Log to notifications table
notification = Notification(
    user_type='admin',
    user_id=1,  # default admin
    title=f"Pesanan baru {order.order_code}",
    message=f"Dari {customer.name}, total Rp {order.total:,.0f}",
    type='push',
    status='sent',
    related_order_id=order.id
)
db.add(notification)
db.commit()
```

### 5.2 Trigger 2: Owner Verify Payment

**Backend Logic (in `orders.py`):**
```python
# After payment.status = 'verified', order.status = 'processed'
customer = order.customer
if customer.fcm_token:
    send_push_notification(
        tokens=[customer.fcm_token],
        title=f"Pembayaran terverifikasi",
        body=f"Pesanan {order.order_code} sedang diproses. Terima kasih 🌿",
        data={"order_id": order.id, "url": f"/pesanan/{order.id}"}
    )

# Log notification
db.add(Notification(
    user_type='customer',
    user_id=customer.id,
    title="Pembayaran terverifikasi",
    body=f"Pesanan {order.order_code} sedang diproses. Terima kasih 🌿",
    type='push',
    status='sent',
    related_order_id=order.id
))
db.commit()
```

---

## 6. Edge Cases & Error Handling

### 6.1 Edge Cases yang Harus Diperhatikan

| Skenario | Handling |
|---|---|
| Customer upload bukti tapi order sudah cancelled | Reject upload dengan error 422: "Order sudah dibatalkan" |
| Owner verify payment tapi customer sudah delete account | Tetap allow (admin action), notif ke customer di-skip |
| Customer checkout dengan produk yang sudah dihapus (soft delete) | Reject dengan error 422: "Produk X sudah tidak tersedia" |
| Customer checkout dengan variant stock 0 | Reject dengan error 422: "Stok varian tidak mencukupi" |
| Owner verify payment yang sudah verified | Return 422: "Pembayaran sudah terverifikasi sebelumnya" |
| Customer upload bukti 2x untuk order yang sama | Update bukti yang lama (replace), reset status ke pending |
| FCM token expired / invalid | Catch error dari FCM, set token=null di DB, log warning |
| WhatsApp link gagal dibuka (mobile browser terlarang) | Tampilkan instruksi manual: copy nomor + pesan ke WhatsApp |

### 6.2 Error Handling Pattern

Setiap endpoint harus handle error dengan pattern:

```python
try:
    # Business logic
    result = do_something()
    return {"success": True, "data": result}
except ValidationError as e:
    raise HTTPException(status_code=422, detail=str(e))
except NotFoundError as e:
    raise HTTPException(status_code=404, detail=str(e))
except PermissionError as e:
    raise HTTPException(status_code=403, detail=str(e))
except Exception as e:
    logger.error(f"Unexpected error: {e}", exc_info=True)
    raise HTTPException(status_code=500, detail="Terjadi kesalahan server")
```

---

**End of 07-user-flows.md**
