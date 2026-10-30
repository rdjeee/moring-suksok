# 01 — Requirements
# Latar Belakang, Scope & Batasan Proyek

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Source**: Dokumen Perencanaan Bab 2 & 4

---

## 1. Latar Belakang & Profil Mitra

### 1.1 Profil Moring Suksok

Moring Suksok adalah UMKM yang bergerak di bidang pengolahan produk berbahan dasar cimol kering (moring), dengan produk utama berupa cimol kering (moring) yang memiliki beberapa varian rasa. Usaha ini dimiliki oleh seorang pengusaha berusia 40 tahun, dan memiliki dua jenis customer yaitu Customer Ritel (toko/agen yang membeli untuk dijual ulang) dan Customer Masyarakat (konsumen akhir yang membeli untuk konsumsi pribadi).

Saat ini, proses penjualan masih dilakukan secara konvensional: customer menghubungi owner melalui WhatsApp untuk memesan produk, lalu owner mencatat transaksi pada nota manual sebagai bukti pembelian dan pembukuan akuntan. Pendekatan ini telah berjalan cukup lama, namun seiring bertambahnya jumlah customer dan kompleksitas transaksi, muncul berbagai kendala operasional yang perlu diatasi.

### 1.2 Identifikasi Masalah

Berdasarkan analisis kondisi existing Moring Suksok, ditemukan beberapa permasalahan utama yang menjadi pain point baik bagi owner maupun customer:

#### Masalah 1: Pencatatan Transaksi Manual yang Tidak Terstruktur
Owner mencatat setiap transaksi pada nota manual, baik yang dijual ke customer Ritel maupun Masyarakat. Pencatatan ini rentan terhadap human error (salah catat jumlah, varian, atau harga), sulit dilakukan rekapitulasi bulanan, dan tidak ada backup digital jika nota hilang atau rusak. Untuk keperluan pembukuan akuntan, owner harus memilah-milah nota satu per satu yang memakan waktu berjam-jam setiap akhir bulan.

#### Masalah 2: Tidak Ada Pemantauan Distribusi Produk
Owner tidak memiliki visibility terhadap pergerakan distribusi produknya. Tidak ada data historis tentang pesanan mana yang sedang diproses, mana yang sudah dikirim, dan mana yang sudah selesai. Status pesanan hanya tersimpan di chat WhatsApp yang sulit ditelusuri, sehingga customer sering menanyakan ulang status pesanan mereka dan owner harus mencari manual di chat.

#### Masalah 3: Tidak Ada Sistem Pemesanan Terstruktur
Customer harus menghubungi owner via WhatsApp untuk setiap pemesanan, yang seringkali terjadi miscommunication terkait varian produk, jumlah, dan harga. Tidak ada katalog produk yang dapat diakses customer secara mandiri, sehingga owner harus mengirim foto produk dan penjelasan via WhatsApp berulang-ulang ke setiap customer baru.

#### Masalah 4: Tidak Ada Segmentasi Customer yang Jelas
Owner secara informal membedakan customer Ritel dan Masyarakat, namun tidak ada data terstruktur tentang persentase penjualan dari masing-masing segmen. Hal ini menyulitkan owner dalam pengambilan keputusan strategis seperti penentuan stok, promo khusus, atau target market yang lebih potensial untuk diekspansi.

#### Masalah 5: Pembayaran Tidak Terdokumentasi
Saat customer membayar via transfer ke DANA owner atau scan QRIS statis, owner harus memverifikasi manual melalui mutasi rekening. Tidak ada audit trail digital yang menghubungkan pembayaran dengan pesanan tertentu, sehingga sulit untuk rekonsiliasi jika ada sengketa atau pertanyaan dari customer di kemudian hari.

### 1.3 Urgensi & Justifikasi Proyek

Permasalahan-permasalahan di atas menghambat pertumbuhan Moring Suksok sebagai UMKM. Tanpa sistem yang terstruktur, owner menghabiskan waktu berharga untuk tugas administratif yang seharusnya bisa diotomatisasi, alih-alih fokus pada pengembangan produk dan ekspansi pasar. Selain itu, customer experience yang buruk (sulit lihat katalog, tidak tahu status pesanan) dapat menurunkan loyalitas dan repeat order.

Pembangunan sistem distribusi dan pencatatan transaksi digital akan menyelesaikan kelima masalah di atas secara komprehensif: nota manual diganti dengan nota digital otomatis ter-generate, status pesanan ter-track real-time, katalog produk dapat diakses mandiri oleh customer, segmentasi customer tercatat dalam database, dan setiap pembayaran terdokumentasi dengan bukti upload.

---

## 2. Functional Requirements

### 2.1 Modul Customer (Frontend)

Customer-facing features yang harus diimplementasi:

| ID | Requirement | Priority |
|---|---|---|
| FR-C01 | Registrasi akun customer dengan data: Nama, WA, Email, Password, Alamat, Segmen (Ritel/Masyarakat) | Must |
| FR-C02 | Login & logout customer | Must |
| FR-C03 | Browse katalog produk (list dengan pagination, search, filter) | Must |
| FR-C04 | Lihat detail produk (foto, nama, deskripsi, harga, varian, stok) | Must |
| FR-C05 | Tambah produk ke keranjang dengan pilih varian & qty | Must |
| FR-C06 | Edit qty item di keranjang | Must |
| FR-C07 | Hapus item dari keranjang | Must |
| FR-C08 | Checkout dengan konfirmasi alamat + catatan | Must |
| FR-C09 | Generate QRIS dinamis dengan nominal embedded | Must |
| FR-C10 | Upload bukti pembayaran (screenshot/foto, max 5MB) | Must |
| FR-C11 | Lihat status pesanan real-time | Must |
| FR-C12 | Lihat riwayat pesanan dengan filter status | Must |
| FR-C13 | Terima Push Notification dari sistem | Must |
| FR-C14 | Install PWA via "Add to Home Screen" | Must |
| FR-C15 | Update profil pribadi | Should |
| FR-C16 | Tombol "Notifikasi Owner via WhatsApp" (deep link wa.me) | Should |
| FR-C17 | Cart persistent di backend (akses dari device lain) | Should |

### 2.2 Modul Owner/Admin (Dashboard)

Admin-facing features yang harus diimplementasi:

| ID | Requirement | Priority |
|---|---|---|
| FR-A01 | Login admin dengan credentials terpisah | Must |
| FR-A02 | CRUD Produk (tambah/edit/hapus produk + varian + harga + foto) | Must |
| FR-A03 | Lihat daftar pesanan masuk dengan filter status | Must |
| FR-A04 | Detail pesanan (items, customer info, total, bukti pembayaran) | Must |
| FR-A05 | Verifikasi pembayaran (Approve/Reject dengan alasan) | Must |
| FR-A06 | Update status pesanan (Diproses → Dikirim → Selesai) | Must |
| FR-A07 | Input no resi pengiriman | Must |
| FR-A08 | Generate & download nota PDF per pesanan | Must |
| FR-A09 | Lihat laporan transaksi (harian/mingguan/bulanan) | Must |
| FR-A10 | Filter laporan by segmen customer (Ritel/Masyarakat) | Must |
| FR-A11 | Export laporan ke PDF | Must |
| FR-A12 | Lihat dashboard analitik (summary cards) | Must |
| FR-A13 | Setup QRIS statis owner di settings | Must |
| FR-A14 | Terima push notification saat order baru masuk | Must |
| FR-A15 | Export laporan ke Excel | Should |
| FR-A16 | Lihat daftar customer & analitik | Should |
| FR-A17 | Tombol "Kirim WhatsApp ke Customer" (deep link) | Should |
| FR-A18 | Lihat produk terlaris (top 5) | Should |
| FR-A19 | Lihat persentase penjualan Ritel vs Masyarakat | Should |
| FR-A20 | Grafik penjualan per hari (bar chart) | Should |

### 2.3 Modul Backend (Python FastAPI)

Backend services yang harus diimplementasi:

| ID | Requirement | Priority |
|---|---|---|
| FR-B01 | REST API endpoints untuk semua modul customer & admin | Must |
| FR-B02 | JWT authentication (customer + admin) | Must |
| FR-B03 | Password hashing dengan bcrypt (salt rounds = 12) | Must |
| FR-B04 | Validasi input dengan Pydantic | Must |
| FR-B05 | Upload image ke Cloudinary | Must |
| FR-B06 | Generate QRIS dinamis (qrcode + qris-utils) | Must |
| FR-B07 | Generate PDF nota (ReportLab) | Must |
| FR-B08 | Push notification ke FCM (firebase-admin) | Must |
| FR-B09 | Generate WhatsApp deep link URL | Must |
| FR-B10 | Logging & error handling | Must |
| FR-B11 | CORS middleware | Must |
| FR-B12 | Auto-generated Swagger documentation di /docs | Must |
| FR-B13 | Role-based authorization (customer vs admin) | Must |
| FR-B14 | Generate Excel laporan (openpyxl) | Should |
| FR-B15 | Validasi QRIS format di settings | Should |

### 2.4 Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Performance - API response time | <500ms untuk 95% request |
| NFR-02 | Performance - Page load time (frontend) | <3 detik untuk landing page |
| NFR-03 | Scalability - Concurrent users | Support 50 concurrent users |
| NFR-04 | Availability - Uptime | 99% (untuk TA, tidak SLA production) |
| NFR-05 | Security - Password storage | bcrypt hash, no plain text |
| NFR-06 | Security - Token expiry | Customer 7 hari, Admin 1 hari |
| NFR-07 | Security - File upload validation | MIME type + size limit 5MB |
| NFR-08 | Compatibility - Browser | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| NFR-09 | Compatibility - Mobile | Android 8+ (PWA installable), iOS 16.4+ (push) |
| NFR-10 | Maintainability - Code coverage | ≥60% untuk critical modules |
| NFR-11 | Documentation - API docs | Swagger UI auto-generated |
| NFR-12 | Localization - Language | Bahasa Indonesia only |
| NFR-13 | Currency | IDR (Rupiah) only |

---

## 3. User Roles & Permissions

Sistem memiliki **3 jenis pengguna** dengan kewenangan berbeda. Detail lengkap matriks akses lihat di `02-architecture.md` § 4.

### 3.1 Admin (Owner Moring Suksok)

- **Auth**: Email + password, disimpan di tabel `admins`
- **Token expiry**: 1 hari
- **Akses**: Full access ke semua modul operasional

### 3.2 Customer Ritel

- **Auth**: Email + password, disimpan di tabel `customers` dengan `customer_type = 'retail'`
- **Token expiry**: 7 hari
- **Akses**: Belanja normal, label segmentasi untuk analisis owner
- **Flow belanja**: Identik dengan Customer Masyarakat

### 3.3 Customer Masyarakat

- **Auth**: Email + password, disimpan di tabel `customers` dengan `customer_type = 'public'`
- **Token expiry**: 7 hari
- **Akses**: Belanja normal, label segmentasi untuk analisis owner
- **Flow belanja**: Identik dengan Customer Ritel

> **Catatan**: Secara flow belanja, Ritel & Masyarakat sama persis. Pembeda hanya label di akun untuk keperluan laporan owner.

---

## 4. Scope & Batasan

### 4.1 In-Scope (Akan Dikerjakan)

#### 4.1.1 Modul Customer (Frontend)
- Registrasi akun customer (Nama, WA, Email, Password, Alamat, Segmen Ritel/Masyarakat)
- Login & logout customer
- Browse katalog produk (list & detail)
- Tambah produk ke keranjang (cart)
- Edit/hapus item di keranjang
- Checkout (konfirmasi alamat, pilih pengiriman)
- Generate QRIS dinamis dengan nominal embedded
- Upload bukti pembayaran (screenshot/foto)
- Lihat status pesanan real-time (Pending → Diproses → Dikirim → Selesai)
- Lihat riwayat pesanan
- Install PWA (Add to Home Screen di Android)
- Terima Push Notification dari sistem

#### 4.1.2 Modul Owner/Admin (Dashboard Frontend)
- Login admin (separate credentials)
- CRUD Produk (tambah/edit/hapus produk + varian + harga + foto)
- Lihat daftar pesanan masuk dengan filter status
- Detail pesanan (items, customer info, total, bukti pembayaran)
- Verifikasi pembayaran (Approve/Reject dengan alasan)
- Update status pesanan (Diproses → Dikirim dengan no resi → Selesai)
- Generate dan download nota PDF per pesanan
- Lihat laporan transaksi (harian/mingguan/bulanan)
- Filter laporan by segmen customer (Ritel/Masyarakat)
- Export laporan ke Excel/PDF
- Kirim WhatsApp manual ke customer via deep link
- Lihat dashboard analitik (total penjualan, jumlah order, customer terbanyak)

#### 4.1.3 Modul Backend (Python FastAPI)
- REST API endpoints untuk semua modul di atas
- JWT authentication (customer + admin)
- Password hashing (bcrypt)
- Validasi input dengan Pydantic
- Upload image ke Cloudinary
- Generate QRIS dinamis (qrcode + qris-utils library)
- Generate PDF nota (ReportLab)
- Push notification ke FCM (firebase-admin)
- Generate WhatsApp deep link URL
- Logging & error handling
- CORS middleware
- Auto-generated Swagger documentation di /docs

#### 4.1.4 Database (MySQL via phpMyAdmin)
- Desain ERD (Entity Relationship Diagram) lengkap - lihat `05-data-model.md`
- Setup schema via Alembic migration
- Seed data awal (admin user, contoh produk)

#### 4.1.5 PWA Configuration
- Manifest.json (name, icons, theme color, display mode)
- Service Worker (offline caching, push notification handler)
- Install prompt (Add to Home Screen)
- FCM setup (Firebase project, VAPID keys, server key)

#### 4.1.6 Deployment
- Frontend deploy ke Vercel
- Backend deploy ke Railway/Render
- Database production: PlanetScale atau Railway MySQL
- Setup environment variables (production)

### 4.2 Out-of-Scope (Tidak Dikerjakan)

Agar proyek tetap fokus dan selesai dalam timeline 2-3 bulan, beberapa hal berikut **TIDAK termasuk dalam scope** TA ini:

1. **Native Android/iOS App (.apk/.ipa)** — cukup PWA yang installable
2. **Integrasi payment gateway berbayar** (Midtrans, Xendit, Faspay) — menggunakan QRIS self-generated
3. **WhatsApp Business API otomatis** (Fonnte, Wablas, Twilio) — menggunakan deep link wa.me semi-otomatis
4. **Fitur loyalty program / point reward**
5. **Fitur wishlist produk**
6. **Review & rating produk oleh customer**
7. **Multi-vendor / multi-seller** (hanya Moring Suksok)
8. **Integrasi kurir otomatis** (JNE, JNT, SiCepat API) — owner input no resi manual
9. **Auto-calculate ongkir** (integrasi RajaOngkir/Binderbyte) — ongkir flat atau di-set manual owner
10. **Inventory management advanced** (alert stok menipis, auto-update stok setelah order)
11. **Admin multi-user / role-based access** (hanya 1 owner/admin)
12. **Multi-currency & multi-language**
13. **Live chat antara customer dan owner** (cukup via WhatsApp deep link)
14. **Coupon/voucher system**

### 4.3 Batasan Proyek

Batasan-batasan teknis dan operasional yang melekat pada sistem ini:

1. **Pembayaran QRIS tanpa webhook auto-update**: Karena menggunakan QRIS self-generated (bukan dari payment gateway resmi), sistem tidak menerima notifikasi otomatis dari bank/e-wallet. Owner harus verifikasi manual bukti pembayaran yang di-upload customer.

2. **Push Notification PWA butuh install & permission**: Customer harus (a) install PWA via "Add to Home Screen", dan (b) grant permission notifikasi di browser. Jika salah satu tidak dilakukan, push notification tidak akan terkirim (fallback ke WhatsApp deep link).

3. **Limitasi iOS < 16.4**: Push notification PWA tidak didukung pada iOS versi di bawah 16.4. Customer dengan iOS lama hanya bisa menggunakan WhatsApp deep link sebagai notifikasi.

4. **WhatsApp deep link semi-otomatis**: Pengiriman WhatsApp via wa.me memerlukan 1 klik manual (klik "Send" di aplikasi WhatsApp). Tidak ada webhook delivery report, sistem tidak tahu apakah pesan benar-benar terkirim.

5. **Hanya untuk UMKM skala kecil**: Sistem dirancang untuk skala <100 customer aktif dan <50 order/bulan. Tidak dioptimasi untuk high-traffic (ribuan transaksi per hari).

6. **Bahasa hanya Indonesia**: UI dan dokumentasi dalam Bahasa Indonesia.

7. **Single currency (IDR)**: Semua transaksi dalam Rupiah.

8. **Local deployment untuk TA**: Selama TA, sistem dijalankan secara local (Laragon + localhost). Deployment ke production (Vercel/Railway) dilakukan di tahap Deployment.

---

## 5. Asumsi & Dependensi

### 5.1 Asumsi

1. Owner Moring Suksok sudah memiliki QRIS statis (yang aktif dan terhubung ke DANA/e-wallet) yang akan di-input ke sistem settings
2. Owner Moring Suksok sudah memiliki nomor DANA untuk pembayaran manual alternatif
3. Customer memiliki smartphone Android (mayoritas) atau iOS 16.4+ (minoritas) dengan akses internet
4. Customer memiliki setidaknya 1 e-wallet (DANA/OVO/GoPay/SeaBank/ShopeePay) untuk scan QRIS
5. Dosen pembimbing menyetujui dokumen perencanaan ini sebelum development dimulai

### 5.2 Dependensi

1. **Laragon** sudah terinstall di mesin development (MySQL 8.4.3 + phpMyAdmin 6.2.3)
2. **Node.js 18+** sudah terinstall (untuk Next.js)
3. **Python 3.11+** sudah terinstall (untuk FastAPI backend)
4. **Cloudinary account** sudah dibuat (free tier OK)
5. **Firebase project** sudah dibuat dengan Cloud Messaging enabled
6. **GitHub account** untuk version control

---

## 6. Glossary

| Term | Definisi |
|---|---|
| **PWA** | Progressive Web App — web aplikasi yang dapat diinstall di HP seperti native app |
| **QRIS** | Quick Response Code Indonesian Standard — standar QR code pembayaran Indonesia |
| **QRIS Dinamis** | QR code yang nominalnya sudah di-embed di dalam payload, customer tinggal scan tanpa input nominal manual |
| **QRIS Statis** | QR code yang sama untuk semua transaksi, customer input nominal manual saat scan |
| **EMVCo** | Standar internasional untuk QR code pembayaran (Visa/Mastercard/American Express合力) |
| **FCM** | Firebase Cloud Messaging — service Google untuk push notification gratis |
| **wa.me** | WhatsApp deep link URL scheme (https://wa.me/62xxx?text=...) |
| **JWT** | JSON Web Token — standar token untuk autentikasi |
| **UMKM** | Usaha Mikro, Kecil, dan Menengah |
| **Customer Ritel** | Toko/agen yang membeli produk Moring Suksok untuk dijual ulang |
| **Customer Masyarakat** | Konsumen akhir yang membeli produk Moring Suksok untuk konsumsi pribadi |
| **Owner** | Pemilik Moring Suksok (40 tahun) |
| **Nota Digital** | Bukti transaksi digital (PDF) yang ter-generate otomatis oleh sistem, menggantikan nota manual |
| **State Machine** | Model status pesanan dengan transisi yang jelas (Pending → Diproses → Dikirim → Selesai) |
| **Decoupled Architecture** | Arsitektur dengan Frontend dan Backend terpisah, berkomunikasi via REST API |

---

**End of 01-requirements.md**
