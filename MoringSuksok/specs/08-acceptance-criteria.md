# 08 — Acceptance Criteria
# Kriteria Penerimaan per User Story

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Source**: Dokumen Perencanaan Bab 9 + Standar BDD/Gherkin

---

## Tujuan Dokumen Ini

Dokumen ini berisi **Acceptance Criteria (AC)** untuk setiap user story di `03-features.json`. Agent B (Dev) **WAJIB** memenuhi semua AC sebelum menyatakan story selesai. Format yang digunakan adalah **Given-When-Then (Gherkin)** yang mudah diuji baik manual maupun otomatis.

Setiap AC memiliki ID unik (e.g. `AC-E1-S1`) yang dapat di-reference di commit message, PR description, dan test cases.

---

## Epic E1: Authentication & Authorization

### AC-E1-S1: Registrasi customer baru

**User Story**: Sebagai customer, saya ingin mendaftar akun dengan email & password

**Acceptance Criteria (Given-When-Then)**:

```gherkin
Scenario: Registrasi berhasil dengan data valid
  Given customer berada di halaman registrasi
  And customer mengisi form dengan:
    | name              | Budi Santoso           |
    | email             | budi@example.com       |
    | phone             | 081234567890           |
    | password          | secret123             |
    | confirm_password  | secret123             |
    | address           | Jl. Merdeka No. 1, Jakarta |
    | customer_type     | retail                |
  When customer klik tombol "Daftar"
  Then sistem validasi semua input lulus
  And sistem cek email belum terdaftar di database
  And sistem hash password dengan bcrypt (salt rounds = 12)
  And sistem insert record ke tabel `customers`
  And sistem generate JWT token dengan expiry 7 hari
  And sistem return response 201 dengan token
  And frontend simpan token ke localStorage
  And frontend redirect ke halaman katalog
  And frontend tampilkan toast "Selamat datang di Moring Suksok!"

Scenario: Registrasi gagal karena email sudah terdaftar
  Given customer mengisi email "existing@example.com" yang sudah ada di DB
  When customer klik "Daftar"
  Then sistem return response 422
  And frontend tampilkan error "Email sudah terdaftar"

Scenario: Registrasi gagal karena password tidak match
  Given customer mengisi password "secret123" dan confirm "secret456"
  When customer klik "Daftar"
  Then frontend tampilkan error inline "Password tidak cocok"
  And form tidak disubmit ke backend

Scenario: Validasi field minimal
  Given customer mengisi form dengan field kosong
  When customer klik "Daftar"
  Then frontend tampilkan error inline per field:
    | name    | "Nama lengkap wajib diisi"     |
    | email   | "Email wajib diisi"            |
    | phone   | "Nomor WhatsApp wajib diisi"  |
    | password| "Password wajib diisi"         |
```

---

### AC-E1-S2: Pilih segmen customer saat registrasi

**User Story**: Sebagai customer, saya ingin memilih segmen (Ritel/Masyarakat) saat registrasi

```gherkin
Scenario: Radio button segmen wajib dipilih
  Given customer di halaman registrasi
  Then tampil radio button dengan 2 opsi:
    | Ritel     | "Saya pemilik toko/agen yang akan menjual ulang" |
    | Masyarakat| "Saya konsumen akhir untuk konsumsi pribadi"      |
  And radio button wajib dipilih (required)
  When customer submit form tanpa pilih segmen
  Then tampilkan error "Segmen customer wajib dipilih"

Scenario: Nilai tersimpan ke database
  Given customer memilih segmen "Ritel" dan submit form valid
  When record baru dibuat di tabel `customers`
  Then field `customer_type` bernilai "retail"

Scenario: Nilai muncul di laporan owner
  Given admin login ke dashboard
  And ada customer dengan customer_type "retail" yang sudah checkout
  When admin buka halaman Laporan
  Then di summary breakdown tampil:
    | Retail    | X transaksi, Rp Y  |
    | Masyarakat| Z transaksi, Rp W  |
```

---

### AC-E1-S3: Login customer

**User Story**: Sebagai customer, saya ingin login dengan email & password

```gherkin
Scenario: Login berhasil
  Given customer terdaftar dengan email "budi@example.com" dan password "secret123"
  When customer submit form login dengan kredensial yang benar
  Then sistem verifikasi password dengan bcrypt.verify()
  And sistem generate JWT token dengan expiry 7 hari
  And sistem return response 200 dengan token + user info
  And frontend simpan token ke localStorage
  And frontend redirect ke dashboard customer

Scenario: Login gagal karena password salah
  Given customer terdaftar dengan email "budi@example.com"
  When customer submit dengan password "wrongpass"
  Then sistem return response 401
  And frontend tampilkan error "Email atau password salah"
  And form tidak redirect

Scenario: Login gagal karena email tidak terdaftar
  When customer submit dengan email "nonexistent@example.com"
  Then sistem return response 401
  And frontend tampilkan error "Email atau password salah"

Scenario: Login gagal karena akun nonaktif (is_active=false)
  Given customer dengan is_active=false
  When customer submit kredensial yang benar
  Then sistem return response 403
  And frontend tampilkan error "Akun Anda dinonaktifkan, hubungi admin"

Scenario: Field validation
  Given customer submit form dengan field kosong
  Then frontend tampilkan error inline
  And form tidak disubmit ke backend
```

---

### AC-E1-S4: Login admin terpisah dari customer

**User Story**: Sebagai admin, saya ingin login terpisah dari customer

```gherkin
Scenario: Login admin berhasil
  Given admin terdaftar dengan email "admin@moring-suksok.com" dan password "admin123"
  When admin submit form login di URL /admin/login
  Then sistem cek kredensial di tabel `admins` (bukan `customers`)
  And sistem generate JWT token dengan expiry 1 hari (lebih pendek dari customer)
  And JWT payload berisi { role: "admin" }
  And sistem redirect ke /admin/dashboard

Scenario: Customer tidak bisa login via admin endpoint
  Given customer dengan email "budi@example.com" ada di tabel `customers` tapi tidak di `admins`
  When customer submit di /admin/login dengan email customer
  Then sistem return 401
  And tampilkan error "Kredensial admin tidak valid"

Scenario: Token admin diperlukan untuk akses dashboard
  Given user memiliki JWT token dengan role "customer"
  When user akses endpoint /api/v1/admin/orders
  Then middleware validasi role != "admin"
  And sistem return 403 Forbidden
```

---

### AC-E1-S5: Logout

**User Story**: Sebagai user, saya ingin logout

```gherkin
Scenario: Logout berhasil
  Given user sudah login dengan token tersimpan di localStorage
  When user klik tombol "Logout"
  Then frontend hapus token dari localStorage
  And frontend redirect ke landing page
  And frontend reset state (cart, profile, dll)
  And request API berikutnya tanpa Authorization header akan return 401

Scenario: Token lama tidak bisa digunakan
  Given user sudah logout
  When user coba akses endpoint protected dengan token lama
  Then middleware validasi token
  And sistem return 401 (token blacklisted atau expired)
```

---

### AC-E1-S6: Update profil pribadi

**User Story**: Sebagai customer, saya ingin update profil pribadi

```gherkin
Scenario: Update profil berhasil
  Given customer sudah login
  When customer buka halaman profil, edit name dan phone, klik "Simpan"
  Then frontend PATCH /api/v1/auth/me dengan data baru
  And sistem update record di tabel `customers`
  And sistem return response 200 dengan data terbaru
  And frontend tampilkan toast "Profil berhasil diupdate"

Scenario: Email tidak bisa diubah (untuk security)
  Given customer di halaman profil
  Then field email dalam keadaan disabled (read-only)
  And tampilkan note "Email tidak dapat diubah. Hubungi admin jika perlu."

Scenario: Update FCM token untuk push notification
  Given customer install PWA dan grant permission notif
  When frontend dapat FCM token dari Firebase
  Then frontend otomatis PATCH /api/v1/auth/me dengan fcm_token
  And sistem update field `customers.fcm_token`
  And sistem tidak tampilkan toast (silent update)
```

---

### AC-E1-S7: JWT verification di semua endpoint terproteksi

**User Story**: Sebagai backend, semua endpoint terproteksi wajib JWT

```gherkin
Scenario: Endpoint terproteksi return 401 tanpa token
  When request GET /api/v1/orders tanpa Authorization header
  Then sistem return 401 Unauthorized
  And response body: { "success": false, "message": "Token tidak ditemukan" }

Scenario: Endpoint terproteksi return 401 dengan token invalid
  Given Authorization header berisi "Bearer invalidtoken123"
  When request GET /api/v1/orders
  Then sistem return 401
  And response body: { "success": false, "message": "Token tidak valid" }

Scenario: Endpoint terproteksi return 401 dengan token expired
  Given token dengan exp di masa lalu
  When request GET /api/v1/orders
  Then sistem return 401
  And response body: { "success": false, "message": "Token sudah kedaluwarsa, silakan login kembali" }

Scenario: Endpoint public tidak butuh token
  When request GET /api/v1/products tanpa Authorization header
  Then sistem return 200 OK dengan list produk
```

---

### AC-E1-S8: Password hashing bcrypt

**User Story**: Sebagai developer, saya ingin password di-hash dengan bcrypt

```gherkin
Scenario: Password tidak disimpan plain text
  When customer registrasi dengan password "secret123"
  Then field `customers.password_hash` berisi bcrypt hash (bukan "secret123")
  And hash dimulai dengan "$2b$12$" (bcrypt dengan cost 12)

Scenario: Login verify password dengan benar
  Given customer dengan password_hash bcrypt dari "secret123"
  When customer login dengan password "secret123"
  Then passlib.verify("secret123", hash) return True
  And sistem berikan token

Scenario: Password berbeda verify false
  When customer login dengan password "wrongpass"
  Then passlib.verify("wrongpass", hash) return False
  And sistem return 401
```

---

## Epic E2: Product Management

### AC-E2-S1: Tambah produk baru

**User Story**: Sebagai admin, saya ingin menambah produk baru

```gherkin
Scenario: Tambah produk berhasil
  Given admin sudah login di dashboard
  When admin buka /admin/products/new, isi form:
    | name        | Kripik Moring Pedas       |
    | description | Kripik dengan bumbu pedas |
    | category    | snack                     |
    | base_price  | 17000                     |
    | image       | kripik-pedas.jpg (1.2MB)  |
  And admin klik "Simpan Produk"
  Then frontend upload image ke Cloudinary → dapat URL
  And frontend POST /api/v1/admin/products (multipart/form-data)
  And sistem insert ke tabel `products` dengan slug auto-generate "kripik-moring-pedas"
  And sistem return 201 dengan product detail
  And frontend redirect ke /admin/products
  And tampilkan toast "Produk berhasil ditambahkan"

Scenario: Validasi field wajib
  Given admin submit form dengan field name kosong
  Then sistem return 422 dengan error:
    | field | message                |
    | name  | "Nama produk wajib diisi" |

Scenario: Validasi harga minimal
  Given admin input base_price = 500
  Then sistem return 422 dengan error "Harga minimal Rp 1.000"

Scenario: Validasi ukuran file image
  Given admin upload image 6MB
  Then sistem return 422 dengan error "Ukuran file maksimal 5MB"

Scenario: Auto-generate slug unik
  Given sudah ada produk dengan slug "kripik-moring-pedas"
  When admin tambah produk baru dengan name "Kripik Moring Pedas"
  Then sistem generate slug "kripik-moring-pedas-2" (atau dengan suffix lain)
```

---

### AC-E2-S2: Tambah varian produk

**User Story**: Sebagai admin, saya ingin menambah varian produk

```gherkin
Scenario: Tambah varian berhasil
  Given admin di halaman edit produk ID=1
  When admin klik "Tambah Varian", isi variant_name="Pedas 100gr", stock=40, klik "Simpan"
  Then frontend POST /api/v1/admin/products/1/variants
  And sistem insert ke tabel `product_variants` dengan product_id=1
  And sistem return 201
  And frontend refresh list varian

Scenario: Varian name unik per produk
  Given produk ID=1 sudah punya variant "Original 100gr"
  When admin tambah varian baru dengan name yang sama "Original 100gr"
  Then sistem return 422 dengan error "Varian dengan nama ini sudah ada untuk produk tersebut"

Scenario: Stock tidak boleh negatif
  Given admin input stock = -5
  Then sistem return 422 dengan error "Stok tidak boleh negatif"
```

---

### AC-E2-S3: Edit produk

```gherkin
Scenario: Edit produk berhasil
  Given admin di halaman edit produk ID=1
  And form ter-pre-fill dengan data existing
  When admin ubah description, klik "Simpan"
  Then frontend PATCH /api/v1/admin/products/1
  And sistem update record di `products`
  And frontend tampilkan toast "Produk berhasil diupdate"

Scenario: Edit image produk (opsional)
  Given admin upload image baru
  Then sistem upload ke Cloudinary, dapat URL baru
  And sistem update field `products.image_url`
  And image lama di Cloudinary tetap (tidak dihapus)
```

---

### AC-E2-S4: Hapus produk (soft delete)

```gherkin
Scenario: Soft delete produk
  Given admin di halaman list produk
  When admin klik tombol "Hapus" pada produk ID=1, konfirmasi "Ya, hapus"
  Then frontend DELETE /api/v1/admin/products/1
  And sistem set `products.is_active = false` (TIDAK hard delete)
  And produk tidak muncul di katalog customer
  And produk tetap muncul di admin list dengan badge "Nonaktif"
  And frontend tampilkan toast "Produk berhasil dihapus"

Scenario: Produk yang sudah dipesan tidak bisa di-hard-delete
  Given produk ID=1 sudah ada di order_items (sudah pernah dipesan)
  When admin klik "Hapus"
  Then sistem hanya soft delete (set is_active=false)
  And data order history tetap utuh (karena order_items pakai snapshot)

Scenario: Restore produk yang di-soft-delete
  Given admin di list produk dengan filter "Nonaktif"
  When admin klik "Restore" pada produk ID=1
  Then sistem set `products.is_active = true`
  And produk muncul kembali di katalog customer
```

---

### AC-E2-S5: Lihat katalog produk (customer)

```gherkin
Scenario: Katalog menampilkan produk aktif
  Given ada 25 produk aktif dan 5 produk nonaktif di database
  When customer buka halaman / (katalog)
  Then frontend GET /api/v1/products?page=1&per_page=12
  And sistem return 12 produk aktif (produk nonaktif tidak muncul)
  And frontend render grid 2 kolom (mobile) atau 4 kolom (desktop)
  And setiap card menampilkan: foto, nama, harga, tombol "Tambah"

Scenario: Pagination berfungsi
  When customer klik halaman 2
  Then frontend GET /api/v1/products?page=2&per_page=12
  And return 12 produk berikutnya
  And UI pagination update (active state, total pages)

Scenario: Loading state
  When API call sedang berlangsung
  Then tampilkan skeleton card (gray placeholder dengan shimmer animation)
  And setelah data return, skeleton hilang, produk muncul

Scenario: Empty state
  Given tidak ada produk aktif di database
  Then tampilkan empty state:
    - Icon: 🌿
    - Title: "Belum ada produk"
    - Message: "Produk akan segera hadir, pantau terus!"
```

---

### AC-E2-S6: Lihat detail produk

```gherkin
Scenario: Detail produk lengkap
  When customer klik produk di katalog
  Then frontend GET /api/v1/products/{slug}
  And return data: name, description, base_price, image_url (full size), variants[]
  And tampilkan layout:
    - Image besar di atas
    - Name + harga
    - Description
    - Variant selector (dropdown atau radio)
    - Quantity stepper
    - Stock indicator
    - Tombol "Tambah ke Keranjang"

Scenario: Produk tidak ditemukan
  When customer akses /produk/nonexistent-slug
  Then sistem return 404
  And tampilkan halaman 404 dengan link kembali ke katalog
```

---

### AC-E2-S7: Search produk by nama

```gherkin
Scenario: Search realtime
  Given customer di halaman katalog
  When customer ketik "pedas" di search bar (debounce 300ms)
  Then frontend GET /api/v1/products?search=pedas
  And return produk dengan name mengandung "pedas" (case-insensitive)
  And re-render grid dengan hasil pencarian

Scenario: Search dengan hasil kosong
  When customer search "nonexistent"
  Then return empty array
  And tampilkan empty state "Tidak ada produk yang cocok dengan pencarian 'nonexistent'"
```

---

### AC-E2-S8: Filter produk by kategori

```gherkin
Scenario: Filter by kategori
  Given ada produk dengan kategori "snack" dan "minuman"
  When customer pilih filter "snack"
  Then frontend GET /api/v1/products?category=snack
  And hanya tampilkan produk dengan kategori "snack"
  And UI dropdown menampilkan "snack" sebagai selected

Scenario: Filter "Semua" reset
  When customer pilih "Semua" di dropdown
  Then GET /api/v1/products (tanpa param category)
  And tampilkan semua produk aktif
```

---

### AC-E2-S9: Kelola stok varian

```gherkin
Scenario: Update stok varian
  Given admin di halaman edit produk, ada varian "Original 100gr" stock=50
  When admin ubah stock jadi 30, klik "Simpan"
  Then frontend PATCH /api/v1/admin/products/1/variants/1 dengan stock=30
  And sistem update field `product_variants.stock`
  And tampilkan toast "Stok varian berhasil diupdate"

Scenario: Stok tampil di detail produk (customer)
  Given varian "Original 100gr" stock=30
  When customer buka detail produk
  Then tampilkan "Stok: 30 tersedia" di samping variant selector
  And jika customer pilih qty > 30, tampilkan error "Melebihi stok tersedia"
```

---

## Epic E3: Cart & Checkout

### AC-E3-S1: Tambah produk ke cart

```gherkin
Scenario: Tambah ke cart berhasil (sudah login)
  Given customer sudah login dan berada di detail produk
  When customer pilih varian "Original 100gr", qty=2, klik "Tambah ke Keranjang"
  Then frontend POST /api/v1/cart/items
  And sistem insert/update record di cart (atau localStorage)
  And update badge cart counter di header (+1)
  And tampilkan toast "Produk ditambahkan ke keranjang"

Scenario: Tidak login redirect ke login
  Given customer belum login
  When klik "Tambah ke Keranjang"
  Then frontend redirect ke /login
  And tampilkan toast "Silakan login dulu untuk belanja"
  And setelah login, redirect balik ke detail produk

Scenario: Validasi qty melebihi stok
  Given varian stock=5
  When customer input qty=10
  Then frontend disable tombol "Tambah"
  And tampilkan error "Melebihi stok (5 tersedia)"
```

---

### AC-E3-S2: Lihat isi cart

```gherkin
Scenario: Cart menampilkan items
  Given customer punya 3 item di cart
  When customer buka halaman /cart
  Then frontend GET /api/v1/cart
  And tampilkan list items:
    - Foto produk (thumbnail)
    - Nama produk + varian
    - Qty stepper
    - Harga per unit
    - Subtotal
    - Tombol hapus (X)
  And tampilkan summary:
    - Subtotal: Rp XXX
    - Ongkir: Rp YYY (dari settings.shipping_cost_flat)
    - Total: Rp ZZZ (highlighted)
  And tombol "Checkout" (primary, full width di mobile)

Scenario: Cart kosong
  Given customer tidak punya item di cart
  Then tampilkan empty state:
    - Icon: 🛒
    - Title: "Keranjang Anda kosong"
    - Message: "Yuk tambah produk favorit Anda!"
    - CTA: "Mulai Belanja" (link ke katalog)
```

---

### AC-E3-S3: Edit qty item di cart

```gherkin
Scenario: Tambah qty
  Given item di cart dengan qty=2
  When customer klik tombol "+" di stepper
  Then qty berubah jadi 3
  And subtotal item update real-time
  And total cart update real-time
  And frontend PATCH /api/v1/cart/items/{id} dengan qty=3 (debounced)

Scenario: Kurang qty
  Given item dengan qty=3
  When customer klik "-"
  Then qty berubah jadi 2
  And tombol "-" disabled jika qty=1 (tidak bisa 0 atau negatif)

Scenario: Qty melebihi stok varian
  Given varian stock=5 dan item qty=5
  When customer klik "+"
  Then tampilkan toast "Stok tidak mencukupi (max 5)"
  And qty tetap 5
```

---

### AC-E3-S4: Hapus item dari cart

```gherkin
Scenario: Hapus item dengan konfirmasi
  Given item di cart
  When customer klik tombol "X" atau "Hapus"
  Then tampilkan modal konfirmasi: "Hapus item ini dari keranjang?"
  When customer klik "Ya, hapus"
  Then frontend DELETE /api/v1/cart/items/{id}
  And item hilang dari list
  And total update
  And tampilkan toast "Item dihapus dari keranjang"

Scenario: Undo (opsional)
  Given customer baru hapus item
  Then tampilkan toast dengan tombol "Undo"
  When customer klik "Undo" dalam 5 detik
  Then item restore ke cart
```

---

### AC-E3-S5: Checkout

```gherkin
Scenario: Checkout berhasil
  Given customer punya 2 item di cart
  When customer klik "Checkout"
  Then tampilkan halaman checkout:
    - Alamat pengiriman (pre-fill dari profil, bisa edit)
    - Catatan untuk owner (opsional textarea)
    - Metode pengiriman: Pickup / Delivery (radio)
  When customer klik "Lanjut ke Pembayaran"
  Then frontend POST /api/v1/orders dengan items + shipping info
  And sistem:
    - Validasi cart tidak kosong
    - Validasi semua produk & varian masih ada dan stok cukup
    - Generate order_code (ORD-YYYYMMDD-XXX)
    - Insert ke `orders` (status: pending)
    - Insert ke `order_items` (snapshot product_name, variant_name, price_per_unit)
    - Clear cart
  And sistem return 201 dengan order detail + total
  And frontend redirect ke /payment/[orderId]

Scenario: Validasi cart kosong
  Given customer cart kosong
  When customer akses /checkout langsung
  Then redirect ke /cart dengan toast "Keranjang masih kosong"

Scenario: Stok berubah saat checkout
  Given varian stock=2 di awal, customer input qty=2
  And antara add-to-cart dan checkout, stok berubah jadi 1 (admin update)
  When customer klik "Checkout"
  Then sistem return 422 dengan error "Stok varian X berubah, tersisa 1. Mohon update keranjang"
  And frontend kembali ke cart, tampilkan error
```

---

### AC-E3-S6: Generate order_code unik

```gherkin
Scenario: Format order_code
  When checkout terjadi pada 2026-10-29
  Then order_code pertama hari itu: "ORD-20261029-001"
  And order_code kedua: "ORD-20261029-002"
  And seterusnya (auto-increment per hari)

Scenario: Reset counter per hari
  Given hari 2026-10-29 sudah ada 5 order (ORD-...-005)
  When hari berubah ke 2026-10-30 dan ada order baru
  Then order_code: "ORD-20261030-001" (counter reset)

Scenario: Unique constraint
  Then field `orders.order_code` adalah UNIQUE
  And tidak mungkin ada 2 order dengan code sama
```

---

### AC-E3-S7: Snapshot produk+harga saat checkout

```gherkin
Scenario: Order items menyimpan snapshot
  Given customer checkout dengan produk "Kripik Original" harga 15000
  When order dibuat
  Then tabel `order_items` menyimpan:
    - product_id: 1
    - product_name: "Kripik Moring Original" (snapshot, bukan lookup)
    - variant_id: 1
    - variant_name: "Original 100gr" (snapshot)
    - price_per_unit: 15000 (snapshot)
    - quantity: 2
    - subtotal: 30000

Scenario: Harga produk berubah tidak affect order history
  Given order sudah dibuat dengan price_per_unit=15000
  When admin ubah base_price produk jadi 20000
  Then di order detail, price_per_unit tetap 15000 (snapshot)
  And total order tetap sama (tidak berubah)
```

---

### AC-E3-S8: Cart persistent di backend

```gherkin
Scenario: Cart disimpan di DB, bukan localStorage saja
  Given customer login di device A, tambah item ke cart
  When customer login di device B
  Then cart di device B menampilkan item yang sama (sinkron dari DB)

Scenario: Cart tidak hilang saat refresh
  Given customer punya 3 item di cart
  When customer refresh browser
  Then cart tetap menampilkan 3 item (load dari DB)
```

---

### AC-E3-S9: Kalkulasi ongkir flat

```gherkin
Scenario: Ongkir flat dari settings
  Given settings.shipping_cost_flat = 10000
  When customer checkout dengan subtotal 45000
  Then total = 45000 + 10000 = 55000
  And di halaman cart tampilkan: "Ongkir: Rp 10.000"

Scenario: Pickup tidak ada ongkir
  Given customer pilih shipping_method = "pickup"
  Then shipping_cost = 0
  And total = subtotal saja

Scenario: Admin bisa ubah ongkir flat
  Given admin di settings, ubah shipping_cost_flat dari 10000 ke 15000
  Then order yang baru dibuat pakai ongkir 15000
  And order lama tetap pakai ongkir saat checkout (snapshot di order.shipping_cost)
```

---

## Epic E4: Payment & Verification

### AC-E4-S1: Generate QRIS dinamis dengan nominal embedded

**User Story**: Sebagai customer, saya ingin melihat QRIS dinamis dengan nominal embedded

```gherkin
Scenario: Generate QRIS berhasil
  Given customer sudah checkout, order_id=42, total=55000
  When customer di halaman /payment/42, klik "Bayar via QRIS"
  Then frontend POST /api/v1/payments/42/qris
  And backend:
    - Get `owner_qris_static` dari settings
    - Inject nominal 55000 ke QRIS payload (sesuai EMVCo standard)
    - Recalculate CRC16 checksum
    - Generate QR code PNG (300x300px)
    - Encode ke base64
    - Save raw payload ke `payments.qris_payload`
  And return 200 dengan:
    - order_id: 42
    - total: 55000
    - qris_payload: "00020101021226..."
    - qr_image_base64: "iVBORw0KGgoAAAANS..."
    - expires_at: "2026-10-29T15:30:00Z" (1 jam)
  And frontend render QR code di layar (300x300)
  And tampilkan total nominal di atas QR: "Rp 55.000"

Scenario: QR Code bisa di-scan oleh e-wallet
  When customer scan QR code via DANA
  Then DANA app menampilkan:
    - Nama merchant: "MORING SUKSOK"
    - Nominal: Rp 55.000 (auto-filled, tidak perlu input manual)
    - Tombol "Bayar"

Scenario: Validasi QRIS format di settings
  Given owner input QRIS statis yang tidak valid di settings
  When customer generate QRIS
  Then sistem return 422 dengan error "QRIS owner tidak valid, mohon kontak admin"

Scenario: QR Code expired setelah 1 jam
  Given QR code dengan expires_at = 2026-10-29T15:30:00Z
  When customer akses setelah waktu tersebut
  Then tampilkan "QR Code kedaluwarsa, klik regenerate"
  And tombol "Generate QR Baru" muncul
```

---

### AC-E4-S2: Download QR code

```gherkin
Scenario: Download QR code sebagai PNG
  Given customer di halaman payment dengan QR code tampil
  When customer klik tombol "Download QR"
  Then frontend download file PNG: "QRIS-ORD-20261029-001.png"
  And file bisa dibuka di gallery/file manager

Scenario: Download di mobile
  Given customer di Android
  When customer klik "Download QR"
  Then file tersimpan di folder Downloads
  And tampilkan toast "QR Code tersimpan di Downloads"
```

---

### AC-E4-S3: Upload bukti pembayaran

```gherkin
Scenario: Upload bukti berhasil
  Given customer sudah bayar via DANA, ada screenshot di HP
  When customer klik "Upload Bukti Pembayaran", pilih file bukti.jpg (1.5MB)
  Then frontend POST /api/v1/payments/42/upload (multipart/form-data)
  And backend:
    - Validasi MIME type = image/jpeg ✓
    - Validasi size ≤ 5MB ✓ (1.5MB)
    - Upload ke Cloudinary → dapat URL
    - Update `payments.proof_image_url`
    - Update `payments.status = 'pending'`
    - Trigger push notification ke admin (FCM)
    - Insert log ke `notifications` table
  And return 200 dengan payment_id + URL
  And frontend redirect ke halaman status: "Menunggu Verifikasi"

Scenario: Validasi file type
  When customer upload file .docx
  Then sistem return 422 dengan error "Format file tidak didukung. Hanya JPG, PNG, atau PDF"

Scenario: Validasi file size
  When customer upload file 6MB
  Then sistem return 422 dengan error "Ukuran file maksimal 5MB"

Scenario: Upload ulang (replace)
  Given customer sudah upload bukti pertama
  When customer upload bukti kedua
  Then sistem replace bukti lama dengan yang baru
  And reset `payments.status = 'pending'` (karena bukti baru belum diverifikasi)
  And tampilkan toast "Bukti pembayaran berhasil diupdate"

Scenario: Order tidak ditemukan / bukan milik customer
  Given customer A mencoba upload ke order customer B
  Then sistem return 404 atau 403
```

---

### AC-E4-S4: Lihat status verifikasi

```gherkin
Scenario: Status menunggu verifikasi
  Given customer sudah upload bukti, payment.status='pending'
  When customer buka halaman status pesanan
  Then tampilkan:
    - Order code + total
    - Status badge: "⏳ Menunggu Verifikasi" (warna kuning)
    - Image bukti pembayaran yang diupload
    - Tombol "📢 Notifikasi Owner via WhatsApp"
    - Catatan: "Mohon tunggu verifikasi dari owner. Anda akan dapat notifikasi saat pembayaran dikonfirmasi."

Scenario: Status berubah real-time
  Given customer di halaman status
  When owner konfirmasi pembayaran di device lain
  Then customer terima push notification
  And status di halaman otomatis update ke "Sedang Diproses" (tanpa refresh)
```

---

### AC-E4-S5: List pesanan pending (admin)

```gherkin
Scenario: Admin lihat daftar pesanan pending
  Given ada 3 pesanan dengan status=pending
  When admin buka /admin/orders?status=pending
  Then tampilkan tabel dengan 3 pesanan:
    - Order code | Customer | Total | Tanggal | Status | Action
  And tombol action: "Lihat Detail"
  And filter tabs di atas: Semua | Pending | Diproses | Dikirim | Selesai | Ditolak
  And badge "Pending" aktif
  And sorting: terbaru di atas (created_at DESC)

Scenario: Filter by status lain
  When admin klik tab "Diproses"
  Then tabel hanya menampilkan pesanan dengan status=processed

Scenario: Search by order_code atau customer name
  When admin ketik "ORD-2026" di search bar
  Then filter tabel realtime dengan order_code contains "ORD-2026"
```

---

### AC-E4-S6: Detail pesanan + bukti pembayaran (admin)

```gherkin
Scenario: Detail pesanan lengkap
  Given admin klik order ORD-20261029-001
  Then tampilkan:
    - Order info: code, tanggal, customer name, customer type (Ritel/Masyarakat)
    - Shipping address
    - Items list: foto + nama + varian + qty + harga + subtotal
    - Subtotal + ongkir + total
    - Bukti pembayaran (image preview, klik untuk zoom modal)
    - Catatan dari customer (jika ada)
    - Tombol action: "✓ Konfirmasi Lunas" | "✗ Tolak"

Scenario: Image preview zoom
  When admin klik image bukti pembayaran
  Then modal muncul dengan image ukuran penuh
  And tombol close (X) untuk tutup modal
  And klik di luar image juga tutup modal
```

---

### AC-E4-S7: Konfirmasi pembayaran lunas

```gherkin
Scenario: Konfirmasi berhasil
  Given admin di detail order dengan status=pending
  When admin klik "✓ Konfirmasi Lunas"
  Then tampilkan modal konfirmasi: "Yakin konfirmasi pembayaran Rp 55.000 dari Budi Santoso?"
  When admin klik "Ya, Konfirmasi"
  Then frontend PATCH /api/v1/admin/orders/42/verify
  And backend:
    - Update `payments.status = 'verified'`
    - Update `payments.verified_by = admin_id`
    - Update `payments.verified_at = NOW()`
    - Update `orders.status = 'processed'`
    - Trigger push notif ke customer: "Pembayaran terverifikasi! Pesanan ORD-XXX sedang diproses. Terima kasih 🌿"
    - Insert log ke `notifications` (type=push, user_type=customer)
  And return 200 dengan order status terbaru
  And frontend tampilkan toast "Pembayaran terverifikasi"
  And redirect ke list pesanan

Scenario: Tidak bisa konfirmasi order yang sudah verified
  Given order dengan status=processed (sudah verified)
  When admin coba PATCH /admin/orders/42/verify lagi
  Then sistem return 422 dengan error "Pembayaran sudah diverifikasi sebelumnya"
```

---

### AC-E4-S8: Tolak pembayaran dengan alasan

```gherkin
Scenario: Tolak dengan alasan
  Given admin di detail order dengan status=pending
  When admin klik "✗ Tolak"
  Then tampilkan modal dengan textarea "Alasan Penolakan" (required)
  When admin input "Bukti pembayaran tidak jelas, mohon upload ulang dengan kualitas lebih baik" dan klik "Tolak"
  Then frontend PATCH /api/v1/admin/orders/42/reject
  And backend:
    - Update `payments.status = 'rejected'`
    - Update `payments.rejection_reason` dengan alasan
    - Update `orders.status = 'cancelled'`
    - Trigger push notif ke customer: "Maaf, pembayaran untuk pesanan ORD-XXX ditolak. Alasan: [reason]. Silakan hubungi owner."
    - Insert log ke `notifications`
  And return 200
  And tampilkan toast "Pesanan ditolak, customer telah diberitahu"

Scenario: Alasan wajib diisi
  When admin klik "Tolak" tanpa isi alasan
  Then modal tidak bisa di-submit, tampilkan error "Alasan penolakan wajib diisi"
```

---

### AC-E4-S9: Setup QRIS statis owner di settings

```gherkin
Scenario: Setup QRIS awal (first-time)
  Given owner_qris_static kosong di settings
  When admin login pertama kali
  Then redirect ke /admin/settings dengan banner "Silakan setup QRIS statis Anda"
  And tampilkan form:
    - Textarea: "Paste raw QRIS payload di sini"
    - Tombol: "Validasi QRIS"
    - Tombol: "Simpan"
  And tampilkan instruksi: "Cara dapat QRIS payload: scan QRIS statis Anda via aplikasi QR scanner, copy hasil string-nya"

Scenario: Validasi QRIS sebelum simpan
  When admin paste QRIS payload dan klik "Validasi"
  Then frontend POST /api/v1/admin/settings/qris/validate
  And sistem cek format: CRC16 checksum valid, structure EMVCo-compliant
  And return 200 dengan:
    - valid: true/false
    - merchant_name: "MORING SUKSOK" (jika valid)
    - merchant_id: "ID1234567890123"

Scenario: Simpan QRIS ke settings
  Given QRIS valid
  When admin klik "Simpan"
  Then frontend PATCH /api/v1/admin/settings dengan owner_qris_static
  And sistem update field `settings.value` (key=owner_qris_static)
  And tampilkan toast "QRIS berhasil disimpan"
```

---

### AC-E4-S10: Generate QRIS dinamis sesuai EMVCo

**User Story**: Sebagai backend, saya ingin generate QRIS dinamis sesuai standar EMVCo

```gherkin
Scenario: QRIS payload mengandung nominal
  Given order total = 55000
  When generate QRIS dinamis
  Then payload mengandung tag 54 (Transaction Amount) dengan value "55000.00"
  And CRC16 checksum di tag 63 di-recalculate

Scenario: QR code bisa di-scan multi e-wallet
  When QR di-scan dengan DANA
  Then DANA app recognize QR sebagai QRIS valid
  And tampilkan merchant info + nominal auto-filled

  When QR di-scan dengan OVO
  Then OVO app recognize QR sebagai QRIS valid
  And tampilkan merchant info + nominal auto-filled

  When QR di-scan dengan GoPay / SeaBank / ShopeePay / m-banking
  Then e-wallet recognize QR sebagai QRIS valid
  And nominal auto-filled

Scenario: Payload disimpan di DB untuk regenerate
  Given QRIS sudah digenerate untuk order 42
  When customer request QRIS lagi (refresh halaman)
  Then return QR code yang sama (dari payload yang tersimpan di payments.qris_payload)
  AtAU generate baru dengan timestamp baru (jika expired)
```

---

### AC-E4-S11: Pilih metode pembayaran alternatif (transfer manual)

```gherkin
Scenario: Pilih transfer manual ke DANA
  Given customer di halaman payment
  When customer pilih radio "Transfer Manual ke DANA"
  Then tampilkan:
    - Nomor DANA: 0812-xxxx-xxxx (dari settings.owner_dana_number)
    - Atas nama: Moring Suksok
    - Total: Rp 55.000
    - Instruksi: "Transfer ke nomor DANA di atas, lalu upload bukti pembayaran"
    - Tombol "Copy Nomor DANA" (clipboard)
    - Tombol "Buka App DANA" (deep link ke DANA app)
    - Tombol "Upload Bukti"
```

---

## Epic E5: Order Tracking & Notification

### AC-E5-S1: Lihat riwayat pesanan

```gherkin
Scenario: List pesanan customer
  Given customer sudah login dan punya 5 pesanan
  When customer buka /pesanan
  Then frontend GET /api/v1/orders
  And tampilkan list pesanan:
    - Order code | Tanggal | Total | Status badge | Action (Lihat Detail)
  And sorting: terbaru di atas
  And filter by status di atas

Scenario: Filter by status
  When customer klik filter "Dikirim"
  Then hanya tampilkan pesanan dengan status=shipped

Scenario: Empty state
  Given customer belum punya pesanan
  Then tampilkan empty state: "Belum ada pesanan. Yuk mulai belanja!" dengan CTA ke katalog
```

---

### AC-E5-S2: Detail pesanan + timeline status

```gherkin
Scenario: Timeline visual
  Given customer di detail pesanan dengan status=processed
  Then tampilkan timeline horizontal:
    ● Pending ── ● Diproses ── ○ Dikirim ── ○ Selesai
    (status aktif highlight, status belum capai grayed out)

Scenario: Detail lengkap
  Then tampilkan:
    - Order code, tanggal
    - Customer info (pre-fill from profil)
    - Shipping address
    - Items list dengan foto, nama, varian, qty, harga, subtotal
    - Subtotal + ongkir + total
    - Payment info (method, status, verified_at)
    - Tracking number (jika status=shipped)
    - Tombol "Buka di App Kurir" (link tracking, jika ada no resi)

Scenario: Update status real-time via push notif
  Given customer di halaman detail pesanan status=pending
  When owner verify payment
  Then customer terima push notification
  And frontend polling atau WebSocket untuk refresh status
  And timeline update otomatis tanpa manual refresh
```

---

### AC-E5-S3: Update status pesanan jadi Dikirim

```gherkin
Scenario: Input no resi
  Given admin di detail order dengan status=processed
  When admin klik "Update: Dikirim"
  Then tampilkan modal input: "Nomor Resi" (opsional)
  When admin input "JNE1234567890" dan klik "Simpan"
  Then frontend PATCH /api/v1/admin/orders/42/ship
  And backend:
    - Update `orders.status = 'shipped'`
    - Update `orders.tracking_number = 'JNE1234567890'`
    - Trigger push notif ke customer: "Pesanan ORD-XXX telah dikirim. No resi: JNE1234567890"
    - Insert log ke `notifications`
  And return 200
  And tampilkan toast "Status diupdate, customer diberitahu"
```

---

### AC-E5-S4: Update status pesanan jadi Selesai

```gherkin
Scenario: Mark complete
  Given admin di detail order dengan status=shipped
  When admin klik "Update: Selesai"
  Then tampilkan konfirmasi "Yakin pesanan sudah diterima customer?"
  When admin klik "Ya, Selesai"
  Then frontend PATCH /api/v1/admin/orders/42/complete
  And backend:
    - Update `orders.status = 'done'`
    - Trigger push notif ke customer: "Pesanan ORD-XXX selesai. Terima kasih sudah berbelanja di Moring Suksok! 🌿"
  And return 200
  And transaksi otomatis tercatat di laporan sebagai "completed"
```

---

### AC-E5-S5: Terima push notification (customer)

```gherkin
Scenario: Push notif masuk saat status berubah
  Given customer sudah install PWA dan grant permission notif
  When owner update status order customer dari pending ke processed
  Then backend trigger FCM dengan:
    - title: "Pembayaran terverifikasi"
    - body: "Pesanan ORD-XXX sedang diproses. Terima kasih 🌿"
    - data: { order_id: 42, url: "/pesanan/42" }
  And service worker di HP customer terima push event
  And tampilkan notif di notification drawer HP
  And saat customer klik notif, buka aplikasi langsung ke /pesanan/42

Scenario: Push notif walau app ditutup
  Given customer tutup aplikasi (tidak di-foreground)
  When push event masuk
  Then service worker tetap berjalan di background
  And notif muncul di notification drawer
  And badge app (jika support) bertambah

Scenario: Customer belum install PWA / belum grant permission
  Given customer belum install PWA atau reject permission notif
  Then push notif tidak terkirim (atau failed silently)
  But notifikasi tetap tersimpan di tabel `notifications`
  And customer bisa lihat notif di halaman "Notifikasi" (in-app)
```

---

### AC-E5-S6: Terima push notification (admin)

```gherkin
Scenario: Admin terima notif saat order baru
  Given admin sudah install PWA admin dan grant permission
  When customer upload bukti pembayaran
  Then backend trigger FCM ke admin:
    - title: "Pesanan baru ORD-20261029-001"
    - body: "Dari Budi Santoso, total Rp 55.000. Mohon segera diverifikasi."
    - data: { order_id: 42, url: "/admin/orders/42" }
  And admin terima push notif di HP
  And saat klik notif, buka dashboard langsung ke detail order

Scenario: Multiple admin (future)
  Given sistem support multiple admin (tidak di MVP)
  Then notif terkirim ke semua admin device yang punya fcm_token
```

---

### AC-E5-S7: Tombol Notifikasi Owner via WhatsApp (customer)

```gherkin
Scenario: Generate wa.me link
  Given customer di halaman status "Menunggu Verifikasi"
  When customer klik "📢 Notifikasi Owner via WhatsApp"
  Then frontend POST /api/v1/notifications/{id}/wa-link
  And backend generate URL:
    "https://wa.me/62812xxxxxxx?text=Halo%20Owner%20Moring%20Suksok!%20Saya%20baru%20checkout%20pesanan%20ORD-20261029-001%20sebesar%20Rp%2055.000.%20Mohon%20segera%20diverifikasi.%20Terima%20kasih!"
  And return 200 dengan wa_link
  And frontend buka link di tab baru
  And WhatsApp Web/App terbuka dengan:
    - Tujuan: nomor owner
    - Pesan: pre-filled (sesuai template)
    - Status: draft (belum terkirim)
  And customer klik tombol "Send" di WhatsApp untuk mengirim

Scenario: Save wa_link ke notifications log
  Given wa.me link sudah digenerate
  Then insert ke `notifications`:
    - user_type: 'admin'
    - type: 'whatsapp'
    - status: 'pending' (belum diketahui terkirim atau tidak)
    - wa_link: [URL]
```

---

### AC-E5-S8: Tombol Kirim WhatsApp ke Customer (admin)

```gherkin
Scenario: Admin kirim WA ke customer
  Given admin di detail order
  When admin klik "Kirim WA ke Customer"
  Then frontend generate wa.me link dengan nomor customer:
    "https://wa.me/{customer.phone}?text=Halo%20{customer.name},%20pesanan%20ORD-XXX%20sudah%20diproses..."
  And buka link di tab baru
  And admin klik "Send" di WhatsApp

Scenario: Template pesan otomatis
  Given template berbeda untuk setiap status:
    - Pending: "Halo {name}, terima kasih sudah order. Mohon tunggu verifikasi pembayaran."
    - Processed: "Halo {name}, pembayaran terverifikasi! Pesanan {order_code} sedang diproses."
    - Shipped: "Halo {name}, pesanan {order_code} sudah dikirim. No resi: {tracking}."
    - Done: "Halo {name}, pesanan {order_code} selesai. Terima kasih sudah berbelanja! 🌿"
  Then admin bisa pilih template atau edit pesan custom
```

---

### AC-E5-S9: Log semua notifikasi di tabel notifications

```gherkin
Scenario: Setiap push notif tercatat
  When backend kirim push notif ke customer
  Then insert row ke `notifications`:
    - user_type: 'customer'
    - user_id: [customer_id]
    - title: [judul notif]
    - message: [isi notif]
    - type: 'push'
    - status: 'sent' atau 'failed'
    - related_order_id: [order_id] (jika terkait order)
    - created_at: NOW()

Scenario: Customer bisa lihat history notif
  When customer buka halaman "Notifikasi"
  Then GET /api/v1/notifications
  And tampilkan list notif (sort by created_at DESC)
  And tampilkan unread indicator (badge) jika ada notif belum dibaca

Scenario: Mark as read
  When customer klik notif
  Then PATCH /api/v1/notifications/{id}/read
  And notif marked as read
  And badge unread count berkurang
```

---

### AC-E5-S10: Install PWA di Android

```gherkin
Scenario: Install prompt muncul
  Given customer buka aplikasi di Chrome Android (sudah kunjungi 2+ halaman)
  Then tampilkan custom install prompt:
    "Install Aplikasi Moring Suksok untuk akses cepat & notifikasi pesanan"
    [Install] [Nanti saja]
  When customer klik "Install"
  Then Chrome tampilkan native install prompt
  And saat confirmed, app icon muncul di home screen Android
  And app terbuka dalam standalone mode (no browser address bar)

Scenario: Install button di header
  Given customer belum install PWA
  Then tampilkan tombol "Install App" di header (icon download)
  When customer klik
  Then trigger same install flow

Scenario: Setelah install, hide install button
  Given customer sudah install PWA
  Then tombol "Install App" hilang dari header
  And tampilkan toast "Aplikasi sudah terinstall di perangkat Anda"
```

---

## Epic E6: Reporting & Analytics

### AC-E6-S1: Lihat laporan transaksi

```gherkin
Scenario: Laporan default 7 hari terakhir
  Given admin buka /admin/laporan
  Then default filter: from = 7 hari lalu, to = hari ini
  And tampilkan:
    - Summary cards: total transaksi, total pendapatan, AOV, jumlah customer
    - Tabel detail transaksi (order code, tanggal, customer, segmen, total, status)
    - Tombol Export PDF & Excel
    - Filter periode (Hari ini, Minggu ini, Bulan ini, Custom)

Scenario: Custom date range
  When admin pilih "Custom" dan input dari 2026-10-01 sampai 2026-10-31
  Then GET /api/v1/admin/reports?from=2026-10-01&to=2026-10-31
  And tampilkan data transaksi dalam range tersebut

Scenario: Empty state
  Given tidak ada transaksi di periode dipilih
  Then tampilkan empty state: "Tidak ada transaksi di periode ini"
```

---

### AC-E6-S2: Filter laporan by segmen customer

```gherkin
Scenario: Filter by Ritel
  When admin pilih filter "Ritel"
  Then GET /api/v1/admin/reports?customer_type=retail
  And tampilkan hanya transaksi dari customer dengan customer_type=retail
  And summary update: total transaksi retail, total revenue retail

Scenario: Breakdown per segmen
  Given ada 10 transaksi Ritel (Rp 500rb) dan 15 transaksi Masyarakat (Rp 750rb)
  When admin lihat summary
  Then tampilkan breakdown:
    - Retail: 10 transaksi (40%), Rp 500.000
    - Masyarakat: 15 transaksi (60%), Rp 750.000
    - Total: 25 transaksi, Rp 1.250.000
```

---

### AC-E6-S3: Export laporan ke PDF

```gherkin
Scenario: Export PDF berhasil
  Given admin di halaman laporan dengan data terfilter
  When admin klik "Export PDF"
  Then frontend GET /api/v1/admin/reports/export?format=pdf&from=...&to=...
  And backend generate PDF dengan ReportLab:
    - Header: "Laporan Transaksi Moring Suksok"
    - Periode: dari-tanggal sampai tanggal
    - Summary section (total transaksi, revenue, AOV)
    - Tabel detail transaksi
    - Footer: "Dibuat pada [tanggal], oleh [admin name]"
  And return response dengan Content-Type: application/pdf
  And download file: "laporan-moring-suksok-2026-10-01-2026-10-31.pdf"
  And tampilkan toast "PDF berhasil didownload"

Scenario: PDF layout professional
  Then PDF harus punya:
    - Page header dengan logo Moring Suksok
    - Page numbers di footer
    - Table dengan border horizontal
    - Font Times New Roman atau Arial
    - Margin sesuai standar (2.5cm)
```

---

### AC-E6-S4: Export laporan ke Excel

```gherkin
Scenario: Export Excel berhasil
  Given admin di halaman laporan
  When admin klik "Export Excel"
  Then backend generate xlsx dengan openpyxl:
    - Sheet 1: "Summary" (cards summary)
    - Sheet 2: "Detail Transaksi" (table)
  And return dengan Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  And download file: "laporan-moring-suksok-2026-10-01-2026-10-31.xlsx"
```

---

### AC-E6-S5: Download nota PDF per order

```gherkin
Scenario: Download nota per order
  Given admin di detail order atau di list orders
  When admin klik "Download Nota"
  Then frontend GET /api/v1/admin/orders/42/nota.pdf
  And backend generate PDF dengan layout nota resmi:
    - Header: "MORING SUKSOK" + alamat + nomor telp
    - Order info: code, tanggal, customer name, customer type
    - Shipping address
    - Items table: product, varian, qty, harga, subtotal
    - Subtotal, ongkir, total
    - Payment info: method, status, verified_at
    - Footer: "Terima kasih telah berbelanja" + signature line
  And download file: "nota-ORD-20261029-001.pdf"

Scenario: Customer juga bisa download nota (own order)
  Given customer di detail pesanan miliknya sendiri
  When customer klik "Download Nota"
  Then GET /api/v1/orders/42/nota.pdf (endpoint customer)
  And sistem validasi order.customer_id == current_customer.id
  And generate PDF nota yang sama
```

---

### AC-E6-S6: Dashboard analitik

```gherkin
Scenario: Stat cards di dashboard
  Given admin buka /admin (dashboard)
  Then tampilkan 4 stat cards:
    - Total Customer: 45
    - Total Order: 125
    - Total Revenue: Rp 6.250.000
    - New Order (Pending): 3
  And setiap card ada icon, angka besar, label

Scenario: Recent orders di dashboard
  Then tampilkan tabel 5 order terbaru:
    - Order code | Customer | Total | Status | Tanggal
  And tombol "Lihat Semua" redirect ke /admin/orders

Scenario: Quick actions
  Then tampilkan tombol quick access:
    - "Kelola Produk" → /admin/products
    - "Lihat Pesanan" → /admin/orders
    - "Laporan Transaksi" → /admin/laporan
```

---

### AC-E6-S7: Lihat produk terlaris

```gherkin
Scenario: Top 5 produk terlaris
  Given ada order history
  When admin buka dashboard atau /admin/reports/top-products
  Then GET /api/v1/admin/reports/top-products?limit=5
  And tampilkan list:
    - Rank 1: Kripik Moring Original - 45 sold - Rp 675.000
    - Rank 2: Kripik Moring Pedas - 30 sold - Rp 510.000
    - dst
```

---

### AC-E6-S8: Persentase penjualan Ritel vs Masyarakat

```gherkin
Scenario: Pie chart breakdown
  Given admin di dashboard
  Then tampilkan pie chart dengan 2 segment:
    - Ritel: 40% (warna hijau tua)
    - Masyarakat: 60% (warna hijau muda)
  And legend di samping chart
  And angka persentase & nominal di bawah legend

Scenario: Filter periode pie chart
  When admin pilih periode "Bulan ini"
  Then pie chart update dengan data bulan ini saja
```

---

## Epic E7: PWA Configuration & Deployment

### AC-E7-S1: Setup next-pwa

```gherkin
Scenario: PWA installable
  Given frontend sudah setup next-pwa dengan manifest.json
  When audit dengan Lighthouse PWA
  Then PWA score ≥ 90
  And manifest.json valid (name, icons 192+512, theme_color, display standalone)
```

---

### AC-E7-S2: Implement service worker

```gherkin
Scenario: Pre-cache halaman utama
  Given service worker terdaftar
  When customer buka aplikasi pertama kali (online)
  Then service worker pre-cache:
    - / (landing)
    - /static/css/main.css
    - /static/js/main.js
    - Logo & icons

Scenario: Runtime caching images
  When customer browse katalog (images dari Cloudinary)
  Then service worker cache images di runtime (Cache API)
  And saat customer buka halaman yang sama lagi, images load dari cache (lebih cepat)

Scenario: Offline fallback
  Given customer tidak ada koneksi internet
  When customer buka aplikasi
  Then tampilkan halaman offline custom: "Anda sedang offline. Beberapa fitur tidak tersedia."
  And tombol "Coba Lagi" untuk refresh
  And cart & profil (yang sudah ter-cache) tetap bisa diakses
```

---

### AC-E7-S3: Setup Firebase Cloud Messaging

```gherkin
Scenario: FCM setup di frontend
  Given Firebase project sudah dibuat dengan Cloud Messaging enabled
  When customer install PWA dan grant permission notif
  Then frontend dapat FCM token dari Firebase
  And POST /api/v1/notifications/fcm-token untuk save token ke DB
  And token tersimpan di `customers.fcm_token`

Scenario: Push event handler di service worker
  When backend trigger push via FCM
  Then service worker terima 'push' event
  And tampilkan notif dengan title, body, icon, badge, data
  And saat notif di-click, focus app atau buka URL dari data

Scenario: Permission denied
  When customer reject permission notif
  Then frontend tampilkan message: "Notifikasi tidak diaktifkan. Anda tetap bisa lihat status pesanan di aplikasi."
  And tetap bisa pakai aplikasi tanpa notifikasi
```

---

### AC-E7-S4: Deploy frontend ke Vercel

```gherkin
Scenario: Deploy berhasil
  When git push ke main branch
  Then Vercel auto-deploy
  And build success (npm run build)
  And dapat URL production: https://moringsuksok.vercel.app
  And environment variables ter-set

Scenario: Production test
  When buka URL production
  Then landing page load < 3 detik
  And katalog produk tampil
  And bisa register & login
```

---

### AC-E7-S5: Deploy backend ke Railway

```gherkin
Scenario: Deploy backend berhasil
  When git push backend ke Railway
  Then Railway auto-deploy
  And dapat URL production: https://api.moringsuksok.railway.app
  And Swagger UI accessible di /docs

Scenario: Database migration di production
  When first deploy
  Then run: railway run alembic upgrade head
  And tabel ter-create di production MySQL
  And seed admin & settings
```

---

### AC-E7-S6: Setup MySQL production

```gherkin
Scenario: PlanetScale atau Railway MySQL
  Given backend sudah deploy ke Railway
  When add MySQL database plugin
  Then dapat connection string auto
  And set DATABASE_URL env var di backend
  And run alembic upgrade head
  And run python seed.py untuk admin & settings default
```

---

### AC-E7-S7: Dokumentasi user untuk owner

```gherkin
Scenario: README lengkap
  Given documentation sudah dibuat di /docs
  Then README.md mengandung:
    - Cara install PWA di Android (dengan screenshot)
    - Cara register & login customer
    - Cara belanja (katalog → cart → checkout → payment → tracking)
    - Cara login admin
    - Cara kelola produk
    - Cara verifikasi pembayaran
    - Cara update status pesanan
    - Cara lihat laporan & download nota
    - Cara setup QRIS di settings
    - FAQ
```

---

## Cross-Epic Acceptance Criteria

### Performance
- **AC-PERF-01**: API response time < 500ms untuk 95% request
- **AC-PERF-02**: Landing page load < 3 detik (Lighthouse Performance ≥ 80)
- **AC-PERF-03**: Support 50 concurrent users tanpa error

### Security
- **AC-SEC-01**: Semua password di-hash dengan bcrypt (cost 12)
- **AC-SEC-02**: JWT token dengan expiry & proper validation
- **AC-SEC-03**: Role-based access control enforced (403 untuk unauthorized)
- **AC-SEC-04**: File upload validation (MIME type + size limit)
- **AC-SEC-05**: CORS hanya allow frontend domains
- **AC-SEC-06**: No SQL injection (SQLAlchemy parameterized)
- **AC-SEC-07**: No XSS (React escapes by default, sanitize user input)

### Compatibility
- **AC-COMP-01**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **AC-COMP-02**: Android 8+ (PWA installable)
- **AC-COMP-03**: iOS 16.4+ (push notification support)
- **AC-COMP-04**: Responsive (mobile-first, tablet, desktop)

### Accessibility
- **AC-A11Y-01**: WCAG 2.1 Level AA
- **AC-A11Y-02**: Contrast ratio ≥ 4.5:1 untuk text
- **AC-A11Y-03**: All interactive elements keyboard accessible
- **AC-A11Y-04**: Alt text untuk semua images
- **AC-A11Y-05**: Focus visible (outline 2px solid moring-green)

---

**End of 08-acceptance-criteria.md**
