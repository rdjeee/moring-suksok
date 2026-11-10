# DOKUMEN PERENCANAAN PROYEK (PROJECT PLANNING DOCUMENT)
## Sistem Distribusi & Pencatatan Transaksi Produk Moring Suksok

> **Dokumen Tahap 1: Perencanaan** dari 3 tahap proyek (Perencanaan → Development → Deployment)
> Versi: 1.0 | Status: Final | Tanggal: 2026-10-29

---

## DAFTAR ISI

1. [Executive Summary](#1-executive-summary)
2. [Latar Belakang & Rumusan Masalah](#2-latar-belakang--rumusan-masalah)
3. [Tujuan & Manfaat Sistem](#3-tujuan--manfaat-sistem)
4. [Scope & Batasan Proyek](#4-scope--batasan-proyek)
5. [Stakeholder & User Role](#5-stakeholder--user-role)
6. [Arsitektur Sistem](#6-arsitektur-sistem)
7. [Desain Database (ERD)](#7-desain-database-erd)
8. [User Flow Detail](#8-user-flow-detail)
9. [Feature Breakdown (Epic → Story)](#9-feature-breakdown-epic--story)
10. [Spesifikasi API Endpoint](#10-spesifikasi-api-endpoint)
11. [Tech Stack Detail](#11-tech-stack-detail)
12. [Milestone Development](#12-milestone-development)
13. [Risiko & Mitigasi](#13-risiko--mitigasi)
14. [Limitasi Sistem](#14-limitasi-sistem-untuk-laporan-ta)
15. [Delivery & Deployment Plan](#15-delivery--deployment-plan)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Ringkasan Proyek

Proyek ini merupakan pembangunan **sistem distribusi produk berbasis mini e-commerce** untuk UMKM **Moring Suksok**, sebuah bisnis olahan daun kelor (snack/kripik moring) yang saat ini masih melakukan transaksi melalui WhatsApp dan pencatatan manual menggunakan nota. Sistem yang dibangun bertujuan untuk **menggantikan proses pemesanan via WhatsApp** dengan aplikasi terstruktur, serta **menggantikan nota manual** dengan pencatatan transaksi digital otomatis yang dapat berfungsi sebagai pembukuan akuntan.

Sistem dibangun dengan arsitektur **decoupled (terpisah)**: Frontend menggunakan Next.js PWA yang dapat diinstall di perangkat Android (Add to Home Screen) dan berjalan di web browser, sedangkan Backend menggunakan Python FastAPI dengan database MySQL yang dikelola melalui phpMyAdmin. Pendekatan ini dipilih untuk memberikan separation of concerns yang jelas, memudahkan skalabilitas, serta memanfaatkan ekosistem Python yang kuat untuk pengembangan API modern.

### 1.2 Highlight Fitur Utama

Sistem akan memiliki fitur-fitur kunci sebagai berikut: (1) registrasi akun wajib untuk customer dengan segmentasi Ritel/Masyarakat sebagai label analisis; (2) katalog produk dengan varian dan harga yang sama untuk semua segmen customer; (3) keranjang belanja (cart) dengan kalkulasi total otomatis; (4) pembayaran via QRIS dinamis (nominal embedded) yang difoto dan di-upload sebagai bukti; (5) verifikasi pembayaran manual oleh owner; (6) tracking status pesanan end-to-end (Pending → Diproses → Dikirim → Selesai); (7) notifikasi hybrid (Push Notification PWA + WhatsApp deep link); (8) laporan transaksi otomatis dengan ekspor PDF/Excel untuk pembukuan akuntan; dan (9) PWA yang installable di Android.

### 1.3 Nilai Akademik & Praktis

Sebagai Tugas Akhir, proyek ini mendemonstrasikan: (a) implementasi standar EMVCo QRIS dengan modifikasi payload untuk embed transaction amount; (b) arsitektur decoupled modern dengan REST API dan JWT authentication; (c) Progressive Web App dengan service worker dan push notification; (d) integrasi Firebase Cloud Messaging untuk notifikasi server-to-client; dan (e) analisis trade-off teknis-vs-biaya pada pemilihan QRIS self-generated dibanding payment gateway berbayar. Output proyek ini tidak hanya bernilai akademik, tetapi juga dapat langsung digunakan oleh owner Moring Suksok untuk produksi nyata setelah lulus.

---

## 2. LATAR BELAKANG & RUMUSAN MASALAH

### 2.1 Profil Mitra

Moring Suksok adalah UMKM yang bergerak di bidang pengolahan produk berbahan dasar daun kelor (moringa), dengan produk utama berupa snack/kripik moring yang memiliki beberapa varian rasa. Usaha ini dimiliki oleh seorang pengusia berusia 40 tahun, dan memiliki dua jenis customer yaitu Customer Ritel (toko/agen yang membeli untuk dijual ulang) dan Customer Masyarakat (konsumen akhir yang membeli untuk konsumsi pribadi).

Saat ini, proses penjualan masih dilakukan secara konvensional: customer menghubungi owner melalui WhatsApp untuk memesan produk, lalu owner mencatat transaksi pada nota manual sebagai bukti pembelian dan pembukuan akuntan. Pendekatan ini telah berjalan cukup lama, namun seiring bertambahnya jumlah customer dan kompleksitas transaksi, muncul berbagai kendala operasional yang perlu diatasi.

### 2.2 Identifikasi Masalah

Berdasarkan analisis kondisi existing Moring Suksok, ditemukan beberapa permasalahan utama yang menjadi pain point baik bagi owner maupun customer. Permasalahan-permasalahan ini menjadi dasar urgensi dibangunnya sistem distribusi dan pencatatan transaksi digital.

**Masalah 1: Pencatatan Transaksi Manual yang Tidak Terstruktur**
Owner mencatat setiap transaksi pada nota manual, baik yang dijual ke customer Ritel maupun Masyarakat. Pencatatan ini rentan terhadap human error (salah catat jumlah, varian, atau harga), sulit dilakukan rekapitulasi bulanan, dan tidak ada backup digital jika nota hilang atau rusak. Untuk keperluan pembukuan akuntan, owner harus memilah-milah nota satu per satu yang memakan waktu berjam-jam setiap akhir bulan.

**Masalah 2: Tidak Ada Pemantauan Distribusi Produk**
Owner tidak memiliki visibility terhadap pergerakan distribusi produknya. Tidak ada data historis tentang pesanan mana yang sedang diproses, mana yang sudah dikirim, dan mana yang sudah selesai. Status pesanan hanya tersimpan di chat WhatsApp yang sulit ditelusuri, sehingga customer sering menanyakan ulang status pesanan mereka dan owner harus mencari manual di chat.

**Masalah 3: Tidak Ada Sistem Pemesanan Terstruktur**
Customer harus menghubungi owner via WhatsApp untuk setiap pemesanan, yang seringkali terjadi miscommunication terkait varian produk, jumlah, dan harga. Tidak ada katalog produk yang dapat diakses customer secara mandiri, sehingga owner harus mengirim foto produk dan penjelasan via WhatsApp berulang-ulang ke setiap customer baru.

**Masalah 4: Tidak Ada Segmentasi Customer yang Jelas**
Owner secara informal membedakan customer Ritel dan Masyarakat, namun tidak ada data terstruktur tentang persentase penjualan dari masing-masing segmen. Hal ini menyulitkan owner dalam pengambilan keputusan strategis seperti penentuan stok, promo khusus, atau target market yang lebih potensial untuk diekspansi.

**Masalah 5: Pembayaran Tidak Terdokumentasi**
Saat customer membayar via transfer ke DANA owner atau scan QRIS statis, owner harus memverifikasi manual melalui mutasi rekening. Tidak ada audit trail digital yang menghubungkan pembayaran dengan pesanan tertentu, sehingga sulit untuk rekonsiliasi jika ada sengketa atau pertanyaan dari customer di kemudian hari.

### 2.3 Urgensi & Justifikasi Proyek

Permasalahan-permasalahan di atas menghambat pertumbuhan Moring Suksok sebagai UMKM. Tanpa sistem yang terstruktur, owner menghabiskan waktu berharga untuk tugas administratif yang seharusnya bisa diotomatisasi, alih-alih fokus pada pengembangan produk dan ekspansi pasar. Selain itu, customer experience yang buruk (sulit lihat katalog, tidak tahu status pesanan) dapat menurunkan loyalitas dan repeat order.

Pembangunan sistem distribusi dan pencatatan transaksi digital akan menyelesaikan kelima masalah di atas secara komprehensif: nota manual diganti dengan nota digital otomatis ter-generate, status pesanan ter-track real-time, katalog produk dapat diakses mandiri oleh customer, segmentasi customer tercatat dalam database, dan setiap pembayaran terdokumentasi dengan bukti upload. Sistem ini juga menjadi fondasi untuk ekspansi bisnis Moring Suksok di masa depan, seperti penambahan fitur loyalty program, analitik penjualan lanjutan, atau integrasi dengan marketplace.

---

## 3. TUJUAN & MANFAAT SISTEM

### 3.1 Tujuan Umum

Membangun sistem distribusi produk dan pencatatan transaksi berbasis aplikasi web (PWA) yang dapat diinstall di perangkat Android dan diakses via browser, khusus untuk UMKM Moring Suksok, yang menggantikan proses pemesanan via WhatsApp dan pencatatan manual menggunakan nota.

### 3.2 Tujuan Khusus

Sistem ini memiliki beberapa tujuan khusus yang spesifik dan terukur, yang masing-masing dirancang untuk menjawab permasalahan yang telah diidentifikasi pada bagian sebelumnya:

1. **Membangun mini e-commerce untuk Moring Suksok** dengan fitur katalog produk, keranjang belanja, checkout, dan pembayaran yang dapat diakses oleh customer Ritel maupun Masyarakat melalui registrasi akun terlebih dahulu.
2. **Mengimplementasikan pembayaran via QRIS dinamis** dengan nominal embedded (sesuai standar EMVCo QRIS) yang dapat di-scan menggunakan berbagai e-wallet (DANA, OVO, GoPay, SeaBank, ShopeePay, m-banking), dengan mekanisme upload bukti pembayaran dan verifikasi manual oleh owner.
3. **Menggantikan nota manual dengan nota digital otomatis** yang ter-generate setiap checkout, lengkap dengan order ID unik, timestamp, detail items, customer info, total transaksi, dan dapat diekspor ke PDF untuk pembukuan akuntan.
4. **Memantau distribusi produk melalui tracking status pesanan** dengan state machine yang jelas (Pending → Diproses → Dikirim → Selesai), dapat dipantau oleh customer secara real-time dan oleh owner melalui dashboard terpusat.
5. **Mengimplementasikan notifikasi hybrid** dengan Push Notification PWA (otomatis via Firebase Cloud Messaging) sebagai primary channel, dan WhatsApp deep link (wa.me) sebagai backup/secondary untuk komunikasi yang lebih personal.
6. **Memberikan segmentasi customer Ritel/Masyarakat** sebagai label analisis untuk keperluan laporan owner, tanpa membedakan harga atau flow belanja.
7. **Membangun Progressive Web App (PWA)** yang installable di perangkat Android (Add to Home Screen) sehingga customer dapat mengakses aplikasi seperti native app tanpa harus mendownload dari Play Store.

### 3.3 Manfaat Sistem

**Manfaat bagi Owner Moring Suksok:**
- Menghemat waktu administratif (tidak perlu buat nota manual, tidak perlu cari status di chat WhatsApp)
- Memiliki data terstruktur untuk pembukuan akuntan (bisa export PDF/Excel per periode)
- Mendapat visibility terhadap distribusi produk (status setiap pesanan)
- Mendapat insight analitik (persentase penjualan Ritel vs Masyarakat, produk terlaris, dst.)
- Membangun aset digital yang dapat di-scale untuk ekspansi bisnis

**Manfaat bagi Customer Ritel & Masyarakat:**
- Dapat melihat katalog produk secara mandiri tanpa harus tanya owner via WhatsApp
- Dapat melihat riwayat pesanan dan repeat order dengan mudah
- Dapat tracking status pesanan real-time tanpa harus menanyakan ulang
- Mendapat notifikasi otomatis saat status pesanan berubah
- Dapat memilih e-wallet favorit untuk pembayaran via QRIS

**Manfaat Akademik (untuk Tugas Akhir):**
- Mendemonstrasikan implementasi arsitektur decoupled (Frontend-Backend terpisah)
- Mengimplementasikan standar EMVCo QRIS dengan modifikasi payload
- Menggunakan Python FastAPI dengan auto-generated Swagger documentation
- Mengimplementasikan PWA dengan service worker dan push notification
- Menganalisis trade-off teknis-vs-biaya pada pemilihan solusi teknologi

---

## 4. SCOPE & BATASAN PROYEK

### 4.1 In-Scope (Akan Dikerjakan)

**4.1.1 Modul Customer (Frontend)**
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

**4.1.2 Modul Owner/Admin (Dashboard Frontend)**
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

**4.1.3 Modul Backend (Python FastAPI)**
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
- Auto-generated Swagger documentation di `/docs`

**4.1.4 Database (MySQL via phpMyAdmin)**
- Desain ERD (Entity Relationship Diagram) lengkap
- Setup schema via Alembic migration
- Seed data awal (admin user, contoh produk)

**4.1.5 PWA Configuration**
- Manifest.json (name, icons, theme color, display mode)
- Service Worker (offline caching, push notification handler)
- Install prompt (Add to Home Screen)
- FCM setup (Firebase project, VAPID keys, server key)

**4.1.6 Deployment**
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

## 5. STAKEHOLDER & USER ROLE

### 5.1 Daftar Stakeholder

| # | Stakeholder | Deskripsi | Kepentingan |
|---|---|---|---|
| 1 | Owner Moring Suksok (Pemilik Usaha, 40 thn) | Pemilik UMKM yang akan menggunakan sistem | Operasional harian, pembukuan, pengambilan keputusan strategis |
| 2 | Customer Ritel | Toko/agen yang membeli produk untuk dijual ulang | Pemesanan grosir, riwayat pembelian, kemudahan repeat order |
| 3 | Customer Masyarakat | Konsumen akhir yang membeli untuk konsumsi pribadi | Pemesanan eceran, tracking pesanan, notifikasi status |
| 4 | Mahasiswa (Anda) | Pengembang sistem sekaligus pemilik Tugas Akhir | Penyelesaian TA dengan implementasi teknis yang dapat dipertanggungjawabkan |
| 5 | Dosen Pembimbing | Pembimbing akademik TA | Validasi metodologi dan kelayakan teknis |
| 6 | Dosen Penguji | Penguji pada sidang TA | Evaluasi implementasi dan dokumentasi |
| 7 | Akuntan / Bagian Keuangan | Pihak yang menggunakan laporan transaksi | Menerima laporan digital terstruktur untuk pembukuan |

### 5.2 User Role di Sistem

Sistem memiliki **3 jenis pengguna** dengan kewenangan berbeda:

#### Role 1: ADMIN (Owner Moring Suksok)

Admin adalah role dengan akses tertinggi yang dimiliki oleh owner. Admin memiliki kewenangan penuh terhadap seluruh operasional sistem.

**Kewenangan:**
- Kelola produk (Create, Read, Update, Delete)
- Lihat semua pesanan dari semua customer
- Verifikasi pembayaran (approve/reject)
- Update status pesanan
- Input nomor resi pengiriman
- Lihat & ekspor laporan transaksi
- Lihat daftar customer & analitik
- Generate nota PDF
- Kirim WhatsApp ke customer (via deep link)
- Update QRIS statis owner (1x setup)
- Update informasi bisnis (nama, kontak, alamat)

**Kredensial Login:** Email + Password (tersimpan di tabel `admins`)

#### Role 2: CUSTOMER RITEL

Customer yang mendaftarkan diri sebagai Ritel (toko/agen yang membeli untuk dijual ulang). Flow belanja sama persis dengan Customer Masyarakat, hanya berbeda pada label segmentasi yang digunakan untuk analisis owner.

**Kewenangan:**
- Browse katalog produk
- Tambah produk ke keranjang
- Checkout & upload bukti pembayaran
- Lihat riwayat pesanan sendiri
- Update profil pribadi
- Terima push notification
- Klik tombol "Notifikasi Owner via WhatsApp"

**Tidak Bisa:**
- Lihat pesanan customer lain
- Akses dashboard admin
- Kelola produk

**Kredensial Login:** Email + Password (tersimpan di tabel `customers` dengan `customer_type = 'retail'`)

#### Role 3: CUSTOMER MASYARAKAT

Customer yang mendaftarkan diri sebagai Masyarakat (konsumen akhir yang membeli untuk konsumsi pribadi). Identik dengan Customer Ritel dalam hal flow belanja, hanya berbeda pada label segmentasi.

**Kewenangan:** Sama persis dengan Customer Ritel (hanya berbeda `customer_type = 'public'` di database)

### 5.3 Matriks Akses (Access Control Matrix)

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

## 6. ARSITEKTUR SISTEM

### 6.1 Gambaran Umum Arsitektur

Sistem dibangun dengan **arsitektur decoupled (terpisah)** antara Frontend dan Backend, yang berkomunikasi melalui REST API menggunakan format JSON. Arsitektur ini dipilih untuk memisahkan concerns (presentation layer vs business logic layer), memudahkan maintenance, dan memungkinkan skalabilitas independen antara frontend dan backend.

### 6.2 Diagram Arsitektur Sistem (High-Level)

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
│  │  - customers         │        │  - Browse tabel              │   │
│  │  - admins            │        │  - Edit data manual          │   │
│  │  - products          │        │  - Run SQL query             │   │
│  │  - variants          │        │  - Export/Import             │   │
│  │  - orders            │        │                              │   │
│  │  - order_items       │        └──────────────────────────────┘   │
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

### 6.3 Komponen Arsitektur Detail

#### 6.3.1 Frontend Layer (Next.js PWA)

Frontend dibangun menggunakan Next.js 14+ dengan App Router, mendukung Progressive Web App sehingga dapat diinstall di Android. Frontend terdiri dari 2 area utama:

1. **Customer Area** (`/` dan `/customer/*`)
   - Halaman publik: landing, katalog produk, detail produk
   - Halaman auth: login, register
   - Halaman customer (butuh login): cart, checkout, payment, upload bukti, riwayat pesanan, tracking status, profil

2. **Owner/Admin Area** (`/admin/*`)
   - Halaman login admin
   - Dashboard utama (statistik ringkas)
   - Kelola produk (list, create, edit, delete)
   - Daftar pesanan (dengan filter status)
   - Detail & verifikasi pembayaran
   - Update status pesanan
   - Laporan transaksi (filter periode, export PDF/Excel)
   - Daftar customer & analitik
   - Settings (QRIS statis owner, info bisnis)

**Service Worker (PWA):**
- Pre-caching: halaman utama, aset statis (CSS, JS, gambar)
- Runtime caching: gambar produk dari Cloudinary
- Push notification handler (FCM)
- Background sync (jika offline, antrikan request saat online)

#### 6.3.2 Backend Layer (Python FastAPI)

Backend dibangun menggunakan Python FastAPI yang berjalan di atas ASGI server (uvicorn). Struktur backend mengikuti pola modular berdasarkan domain:

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
│   │   ├── qris_service.py    # QRIS generation
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

#### 6.3.3 Data Layer (MySQL + phpMyAdmin)

Database menggunakan MySQL 8.4.3 yang sudah terinstall via Laragon. Akses ke database dilakukan melalui SQLAlchemy 2.0 ORM di sisi backend, sementara phpMyAdmin digunakan sebagai GUI untuk inspeksi, debugging, dan administrasi manual (edit data, run SQL query, export/import).

**Konfigurasi Koneksi:**
- Host: localhost
- Port: 3306
- User: root
- Password: (kosong untuk default Laragon)
- Database: moring_suksok
- Charset: utf8mb4_unicode_ci (support emoji & karakter Indonesia)

### 6.4 Alur Komunikasi (Request Flow)

#### Skenario: Customer Checkout + Upload Bukti + Verifikasi Owner

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

### 6.5 Pola Keamanan (Security Pattern)

1. **JWT Authentication**: Setiap request ke protected endpoint wajib sertakan `Authorization: Bearer <token>` di header. Token di-sign dengan secret key, expired dalam 7 hari (customer) / 1 hari (admin).

2. **Password Hashing**: Password disimpan di database menggunakan bcrypt dengan salt rounds = 12.

3. **Role-based Authorization**: Middleware FastAPI memvalidasi role (admin vs customer) berdasarkan claim di JWT.

4. **CORS Configuration**: Hanya origin frontend (localhost:3000 untuk dev, vercel domain untuk prod) yang diizinkan.

5. **Input Validation**: Semua input di-validasi via Pydantic schema (SQL injection prevention via SQLAlchemy ORM).

6. **File Upload Validation**: Validasi MIME type (hanya image) + size limit (max 5MB) untuk upload bukti pembayaran.

7. **Environment Variables**: Secret keys (JWT secret, FCM server key, Cloudinary credentials) disimpan di `.env` dan tidak di-commit ke repository.

---

## 7. DESAIN DATABASE (ERD)

### 7.1 Daftar Tabel

Sistem memiliki **9 tabel utama** di database MySQL:

| # | Nama Tabel | Deskripsi |
|---|---|---|
| 1 | `admins` | Data admin/owner (login) |
| 2 | `customers` | Data customer Ritel & Masyarakat |
| 3 | `products` | Data produk (snack kripik moring) |
| 4 | `product_variants` | Varian produk (rasa/ukuran) |
| 5 | `orders` | Header pesanan (1 pesanan = 1 record) |
| 6 | `order_items` | Detail item per pesanan (1 pesanan bisa banyak item) |
| 7 | `payments` | Data pembayaran + bukti upload |
| 8 | `notifications` | Log notifikasi yang dikirim |
| 9 | `settings` | Konfigurasi sistem (QRIS owner, info bisnis) |

### 7.2 ERD (Entity Relationship Diagram)

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
│ user_type           │         │ key (UQ)            │
│   (customer/admin)  │         │ value (TEXT/JSON)   │
│ user_id (FK)        │         │ description         │
│ title               │         │ updated_at          │
│ message             │         └─────────────────────┘
│ type                │
│   (push/wa)         │
│ status              │
│   (sent/failed)     │
│ related_order_id    │
│ created_at          │
└─────────────────────┘
```

### 7.3 Detail Skema Tabel

#### Tabel 1: `admins`

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

#### Tabel 2: `customers`

```sql
CREATE TABLE customers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    address         TEXT NOT NULL,
    customer_type   ENUM('retail', 'public') NOT NULL DEFAULT 'public',
    fcm_token       TEXT NULL,  -- untuk push notification
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_type (customer_type)
);
```

#### Tabel 3: `products`

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

#### Tabel 4: `product_variants`

```sql
CREATE TABLE product_variants (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    product_id   INT NOT NULL,
    variant_name VARCHAR(100) NOT NULL,  -- contoh: "Original 100gr", "Pedas 100gr"
    stock        INT DEFAULT 0,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_product_variant (product_id, variant_name)
);
```

#### Tabel 5: `orders`

```sql
CREATE TABLE orders (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    order_code       VARCHAR(30) NOT NULL UNIQUE,  -- ORD-YYYYMMDD-XXX
    customer_id      INT NOT NULL,
    customer_type    ENUM('retail', 'public') NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_method  VARCHAR(50),  -- 'pickup', 'delivery'
    shipping_cost    DECIMAL(12,2) DEFAULT 0,
    subtotal         DECIMAL(12,2) NOT NULL,
    total            DECIMAL(12,2) NOT NULL,
    status           ENUM('pending', 'processed', 'shipped', 'done', 'cancelled')
                     DEFAULT 'pending',
    tracking_number  VARCHAR(100),  -- no resi
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_status (status),
    INDEX idx_customer (customer_id),
    INDEX idx_created (created_at)
);
```

#### Tabel 6: `order_items`

```sql
CREATE TABLE order_items (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT NOT NULL,
    product_id     INT NOT NULL,
    variant_id     INT,
    product_name   VARCHAR(150) NOT NULL,  -- snapshot saat checkout
    variant_name   VARCHAR(100),           -- snapshot saat checkout
    quantity       INT NOT NULL,
    price_per_unit DECIMAL(12,2) NOT NULL, -- snapshot harga saat checkout
    subtotal       DECIMAL(12,2) NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);
```

#### Tabel 7: `payments`

```sql
CREATE TABLE payments (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    order_id         INT NOT NULL UNIQUE,
    method           ENUM('qris', 'manual_transfer') DEFAULT 'qris',
    amount           DECIMAL(12,2) NOT NULL,
    qris_payload     TEXT,        -- raw QRIS string (untuk regenerate jika perlu)
    proof_image_url  VARCHAR(500), -- URL Cloudinary
    status           ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by      INT,         -- admin id yang verifikasi
    verified_at      TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_status (status)
);
```

#### Tabel 8: `notifications`

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
    wa_link           TEXT NULL,  -- URL wa.me jika type=whatsapp
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (related_order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user (user_type, user_id)
);
```

#### Tabel 9: `settings`

```sql
CREATE TABLE settings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    key_name    VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT NOT NULL,  -- bisa JSON atau string
    description VARCHAR(255),
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed data awal:
INSERT INTO settings (key_name, value, description) VALUES
('owner_qris_static', '', 'QRIS statis owner (raw string payload)'),
('owner_dana_number', '', 'Nomor DANA owner'),
('owner_whatsapp', '', 'Nomor WhatsApp owner untuk notifikasi'),
('business_name', 'Moring Suksok', 'Nama bisnis'),
('business_address', '', 'Alamat bisnis'),
('shipping_cost_flat', '10000', 'Ongkir default (flat)');
```

### 7.4 Relasi Antar Tabel (Ringkasan)

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

### 7.5 Index Strategy

Index ditambahkan pada kolom yang sering di-query untuk performance:

- `customers.email` — UNIQUE index (login)
- `customers.customer_type` — untuk filter laporan
- `orders.order_code` — UNIQUE index (lookup by code)
- `orders.status` — untuk filter dashboard
- `orders.customer_id` — untuk list pesanan per customer
- `orders.created_at` — untuk sorting & filter periode laporan
- `payments.status` — untuk filter verifikasi
- `notifications.user_type, user_id` — untuk list notif per user

---

## 8. USER FLOW DETAIL

### 8.1 Customer User Flow — Registrasi & Belanja

Flow berikut menggambarkan perjalanan customer dari pertama kali membuka aplikasi hingga pesanan selesai. Setiap tahap memiliki validasi dan feedback yang jelas untuk memastikan UX yang baik.

#### Flow 8.1.1: Registrasi Customer Baru

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

#### Flow 8.1.2: Login Customer

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

#### Flow 8.1.3: Browse Katalog & Tambah ke Cart

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

#### Flow 8.1.4: Checkout & Pembayaran

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

#### Flow 8.1.5: Tracking Status Pesanan

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

### 8.2 Owner/Admin User Flow

#### Flow 8.2.1: Login Admin & Setup Awal

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

#### Flow 8.2.2: Kelola Produk

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

#### Flow 8.2.3: Verifikasi Pembayaran

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

#### Flow 8.2.4: Update Status Pengiriman

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

#### Flow 8.2.5: Lihat Laporan Transaksi

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

### 8.3 State Machine Status Pesanan

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

### 8.4 Notifikasi Trigger Mapping

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

## 9. FEATURE BREAKDOWN (EPIC → STORY)

### 9.1 Struktur Epic

Sistem dibagi menjadi **7 Epic** utama yang masing-masing mencakup satu domain fungsional:

| # | Epic | Deskripsi | Estimasi Effort |
|---|---|---|---|
| E1 | Authentication & Authorization | Registrasi, login, JWT, role-based access | Medium |
| E2 | Product Management | CRUD produk + varian, katalog, search | Medium |
| E3 | Cart & Checkout | Cart management, checkout, order creation | Large |
| E4 | Payment & Verification | QRIS generation, upload bukti, verifikasi | Large |
| E5 | Order Tracking & Notification | Status update, push notif, WA link | Medium |
| E6 | Reporting & Analytics | Laporan transaksi, export, analitik | Medium |
| E7 | PWA Configuration & Deployment | PWA setup, service worker, deployment | Medium |

### 9.2 Detail Epic & User Stories

#### Epic E1: Authentication & Authorization

| Story ID | User Story | Acceptance Criteria | Priority |
|---|---|---|---|
| E1-S1 | Sebagai customer, saya ingin mendaftar akun dengan email & password | Form valid; email unik; password hashed; JWT diberikan; redirect ke katalog | Must |
| E1-S2 | Sebagai customer, saya ingin memilih segmen (Ritel/Masyarakat) saat registrasi | Radio button wajib; tersimpan di `customer_type`; muncul di laporan owner | Must |
| E1-S3 | Sebagai customer, saya ingin login dengan email & password | Validasi kredensial; JWT diberikan; redirect dashboard | Must |
| E1-S4 | Sebagai admin, saya ingin login terpisah dari customer | Endpoint `/auth/admin/login`; role check; token expiry 1 hari | Must |
| E1-S5 | Sebagai user, saya ingin logout | Hapus token dari localStorage; redirect landing | Must |
| E1-S6 | Sebagai customer, saya ingin update profil pribadi | Form edit; validasi; update DB | Should |
| E1-S7 | Sebagai backend, semua endpoint terproteksi wajib JWT | Middleware FastAPI validasi token; return 401 jika invalid | Must |
| E1-S8 | Sebagai developer, saya ingin password di-hash dengan bcrypt | Salt rounds = 12; tidak ada plain text di DB | Must |

#### Epic E2: Product Management

| Story ID | User Story | Acceptance Criteria | Priority |
|---|---|---|---|
| E2-S1 | Sebagai admin, saya ingin menambah produk baru | Form: nama, deskripsi, kategori, harga, foto; foto upload ke Cloudinary; insert ke DB | Must |
| E2-S2 | Sebagai admin, saya ingin menambah varian produk | Multi-form varian: nama varian + stock; insert ke `product_variants` | Must |
| E2-S3 | Sebagai admin, saya ingin edit produk | Pre-fill form; validasi; update DB; foto baru optional | Must |
| E2-S4 | Sebagai admin, saya ingin hapus produk (soft delete) | Set `is_active = false`; tidak muncul di katalog; tetap ada di riwayat order | Must |
| E2-S5 | Sebagai customer, saya ingin melihat katalog produk | Grid produk dengan foto, nama, harga; pagination; search | Must |
| E2-S6 | Sebagai customer, saya ingin melihat detail produk | Halaman detail dengan foto besar, deskripsi, varian, stok | Must |
| E2-S7 | Sebagai customer, saya ingin search produk by nama | Search bar di katalog; real-time filter | Should |
| E2-S8 | Sebagai customer, saya ingin filter produk by kategori | Dropdown filter; re-render grid | Should |
| E2-S9 | Sebagai admin, saya ingin kelola stok varian | Edit stock di form varian; update DB | Should |

#### Epic E3: Cart & Checkout

| Story ID | User Story | Acceptance Criteria | Priority |
|---|---|---|---|
| E3-S1 | Sebagai customer, saya ingin tambah produk ke cart | Klik tombol "Tambah"; validasi stok; simpan ke localStorage/API | Must |
| E3-S2 | Sebagai customer, saya ingin lihat isi cart | Halaman cart; list items dengan foto, nama, varian, qty, harga, subtotal | Must |
| E3-S3 | Sebagai customer, saya ingin edit qty item di cart | Stepper +/-; real-time update subtotal & total; cek stok | Must |
| E3-S4 | Sebagai customer, saya ingin hapus item dari cart | Tombol hapus; konfirmasi; re-render cart | Must |
| E3-S5 | Sebagai customer, saya ingin checkout | Form alamat (pre-fill profil); catatan opsional; pilih pengiriman | Must |
| E3-S6 | Sebagai backend, saya ingin generate order_code unik | Format: ORD-YYYYMMDD-XXX; auto-increment per hari | Must |
| E3-S7 | Sebagai backend, saya ingin snapshot produk+harga saat checkout | Simpan `product_name`, `variant_name`, `price_per_unit` di `order_items` | Must |
| E3-S8 | Sebagai customer, saya ingin cart persistent di backend | Cart tersimpan di DB; bisa akses dari device lain | Should |
| E3-S9 | Sebagai customer, saya ingin kalkulasi ongkir flat | Ambil dari `settings.shipping_cost_flat`; tampilkan di cart | Must |

#### Epic E4: Payment & Verification

| Story ID | User Story | Acceptance Criteria | Priority |
|---|---|---|---|
| E4-S1 | Sebagai customer, saya ingin melihat QRIS dinamis dengan nominal embedded | Generate QR code PNG; nominal sesuai total order; tampil di halaman payment | Must |
| E4-S2 | Sebagai customer, saya ingin download QR code | Tombol download; format PNG; filename: QRIS-{order_code}.png | Must |
| E4-S3 | Sebagai customer, saya ingin upload bukti pembayaran | File input (jpg/png/pdf); max 5MB; upload ke Cloudinary; simpan URL | Must |
| E4-S4 | Sebagai customer, saya ingin lihat status verifikasi | Halaman status; tampilkan "Menunggu Verifikasi"; update real-time | Must |
| E4-S5 | Sebagai admin, saya ingin lihat daftar pesanan pending | Filter by status; pagination; sort by created_at desc | Must |
| E4-S6 | Sebagai admin, saya ingin lihat detail pesanan + bukti pembayaran | Modal/halaman detail; image preview bukti; zoom | Must |
| E4-S7 | Sebagai admin, saya ingin konfirmasi pembayaran lunas | Tombol "Konfirmasi"; update status; trigger push notif customer | Must |
| E4-S8 | Sebagai admin, saya ingin tolak pembayaran dengan alasan | Modal input alasan; update status; trigger push notif | Must |
| E4-S9 | Sebagai admin, saya ingin setup QRIS statis owner di settings | Textarea paste raw QRIS; validasi format; save ke `settings` | Must |
| E4-S10 | Sebagai backend, saya ingin generate QRIS dinamis sesuai standar EMVCo | qris-utils library; inject nominal; recalculate CRC16 | Must |
| E4-S11 | Sebagai customer, saya ingin pilih metode pembayaran alternatif (transfer manual) | Radio button: QRIS / Transfer Manual; tampilkan instruksi DANA | Should |

#### Epic E5: Order Tracking & Notification

| Story ID | User Story | Acceptance Criteria | Priority |
|---|---|---|---|
| E5-S1 | Sebagai customer, saya ingin lihat riwayat pesanan | List pesanan; sort by tanggal; filter by status | Must |
| E5-S2 | Sebagai customer, saya ingin lihat detail pesanan + timeline status | Timeline visual: Pending → Diproses → Dikirim → Selesai | Must |
| E5-S3 | Sebagai admin, saya ingin update status pesanan menjadi "Dikirim" | Modal input no resi; update DB; trigger push notif | Must |
| E5-S4 | Sebagai admin, saya ingin update status pesanan menjadi "Selesai" | Tombol "Selesai"; update DB; trigger push notif | Must |
| E5-S5 | Sebagai customer, saya ingin terima push notification saat status berubah | FCM integration; service worker handler; notif muncul walau app tutup | Must |
| E5-S6 | Sebagai admin, saya ingin terima push notification saat order baru masuk | FCM ke admin device; notif dengan order_code + customer_name | Must |
| E5-S7 | Sebagai customer, saya ingin punya tombol "Notifikasi Owner via WhatsApp" | Generate wa.me link dengan template; tombol di halaman status | Should |
| E5-S8 | Sebagai admin, saya ingin punya tombol "Kirim WhatsApp ke Customer" | Generate wa.me link dengan template; tombol di detail order | Should |
| E5-S9 | Sebagai backend, saya ingin log semua notifikasi di tabel `notifications` | Insert row setiap trigger; simpan status (sent/failed) | Must |
| E5-S10 | Sebagai customer, saya ingin install PWA di Android | Add to Home Screen prompt; manifest.json lengkap; icon 192/512 | Must |

#### Epic E6: Reporting & Analytics

| Story ID | User Story | Acceptance Criteria | Priority |
|---|---|---|---|
| E6-S1 | Sebagai admin, saya ingin lihat laporan transaksi harian/mingguan/bulanan | Filter periode; summary cards (total transaksi, pendapatan, AOV) | Must |
| E6-S2 | Sebagai admin, saya ingin filter laporan by segmen customer | Filter Ritel/Masyarakat; tampilkan breakdown | Must |
| E6-S3 | Sebagai admin, saya ingin export laporan ke PDF | Generate PDF dengan ReportLab; layout professional | Must |
| E6-S4 | Sebagai admin, saya ingin export laporan ke Excel | Generate xlsx; kolom terstruktur | Should |
| E6-S5 | Sebagai admin, saya ingin download nota PDF per pesanan | PDF individual; layout nota resmi | Must |
| E6-S6 | Sebagai admin, saya ingin lihat dashboard analitik | Cards: total customer, total order, total revenue, repeat order rate | Should |
| E6-S7 | Sebagai admin, saya ingin lihat produk terlaris | Top 5 produk by qty sold; tampilkan di dashboard | Should |
| E6-S8 | Sebagai admin, saya ingin lihat persentase penjualan Ritel vs Masyarakat | Pie chart atau breakdown; filter periode | Should |

#### Epic E7: PWA Configuration & Deployment

| Story ID | User Story | Acceptance Criteria | Priority |
|---|---|---|---|
| E7-S1 | Sebagai developer, saya ingin setup next-pwa | Install next-pwa; config di next.config.js; manifest.json | Must |
| E7-S2 | Sebagai developer, saya ingin implement service worker | Cache strategy: pre-cache statis, runtime-cache images; offline fallback | Must |
| E7-S3 | Sebagai developer, saya ingin setup Firebase Cloud Messaging | Firebase project; VAPID keys; service worker push handler | Must |
| E7-S4 | Sebagai developer, saya ingin deploy frontend ke Vercel | Git push; auto-deploy; environment variables set | Must |
| E7-S5 | Sebagai developer, saya ingin deploy backend ke Railway/Render | Dockerfile atau Procfile; environment variables; MySQL connection | Must |
| E7-S6 | Sebagai developer, saya ingin setup MySQL production | PlanetScale atau Railway MySQL; migration run; seed data | Must |
| E7-S7 | Sebagai developer, saya ingin dokumentasi user untuk owner | README dengan screenshot; cara install PWA; cara pakai dashboard | Should |

### 9.3 Backlog Prioritization (MoSCoW)

**Must Have (MVP — wajib untuk TA):**
- Semua story dengan priority "Must" (~50 stories)
- Fokus pada happy path: register → belanja → bayar → verifikasi → kirim → selesai

**Should Have (nice-to-have, jika waktu cukup):**
- Story dengan priority "Should"
- Termasuk: cart persistent, filter produk, export Excel, analitik lanjutan

**Could Have (opsional, hanya jika MVP selesai lebih cepat):**
- Tambahan fitur seperti wishlist, review produk (out-of-scope saat ini)

**Won't Have (out-of-scope TA):**
- Lihat section 4.2 Out-of-Scope

---

## 10. SPESIFIKASI API ENDPOINT

### 10.1 Konvensi API

| Aspek | Konvensi |
|---|---|
| Base URL | `http://localhost:8000/api/v1` (dev) / `https://api.moringsuksok.id/api/v1` (prod) |
| Format Request | JSON (application/json), kecuali upload file: multipart/form-data |
| Format Response | JSON konsisten: `{ "success": bool, "message": str, "data": obj/arr, "meta": obj }` |
| Auth | Bearer Token JWT di header: `Authorization: Bearer <token>` |
| Pagination | Query params: `?page=1&per_page=20`; response: `meta: { page, per_page, total, total_pages }` |
| Error Code | 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation Error, 500 Server Error |
| Docs | Swagger UI otomatis di `/docs`; ReDoc di `/redoc` |

### 10.2 Daftar Endpoint Lengkap

#### 10.2.1 Auth Module (`/api/v1/auth`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | Public | Registrasi customer baru |
| POST | `/auth/login` | Public | Login customer |
| POST | `/auth/admin/login` | Public | Login admin |
| POST | `/auth/refresh` | Customer/Admin | Refresh JWT token |
| POST | `/auth/logout` | Customer/Admin | Logout (invalidate token di blacklist) |
| GET | `/auth/me` | Customer/Admin | Get current user profile |
| PATCH | `/auth/me` | Customer/Admin | Update own profile |

**Contoh Request Register:**
```json
POST /api/v1/auth/register
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890",
  "password": "secret123",
  "address": "Jl. Merdeka No. 1, Jakarta",
  "customer_type": "retail"
}
```

**Contoh Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": 1,
    "email": "budi@example.com",
    "name": "Budi Santoso",
    "customer_type": "retail"
  },
  "meta": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2026-11-05T10:00:00Z"
  }
}
```

#### 10.2.2 Product Module (`/api/v1/products`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/products` | Public | List produk (pagination, search, filter) |
| GET | `/products/{slug}` | Public | Detail produk + varian |
| POST | `/admin/products` | Admin | Tambah produk baru |
| PATCH | `/admin/products/{id}` | Admin | Edit produk |
| DELETE | `/admin/products/{id}` | Admin | Soft delete produk (set is_active=false) |
| POST | `/admin/products/{id}/variants` | Admin | Tambah varian |
| PATCH | `/admin/products/{id}/variants/{vid}` | Admin | Edit varian |
| DELETE | `/admin/products/{id}/variants/{vid}` | Admin | Hapus varian |

**Contoh GET /products?search=kripik&category=snack&page=1&per_page=12:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kripik Moring Original",
      "slug": "kripik-moring-original",
      "category": "snack",
      "base_price": 15000,
      "image_url": "https://res.cloudinary.com/...",
      "variants": [
        {"id": 1, "variant_name": "Original 100gr", "stock": 50},
        {"id": 2, "variant_name": "Original 250gr", "stock": 20}
      ]
    }
  ],
  "meta": { "page": 1, "per_page": 12, "total": 25, "total_pages": 3 }
}
```

#### 10.2.3 Cart Module (`/api/v1/cart`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/cart` | Customer | Get isi cart |
| POST | `/cart/items` | Customer | Tambah item ke cart |
| PATCH | `/cart/items/{id}` | Customer | Edit qty item |
| DELETE | `/cart/items/{id}` | Customer | Hapus item dari cart |
| DELETE | `/cart` | Customer | Clear cart |

#### 10.2.4 Order Module (`/api/v1/orders`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/orders` | Customer | Buat order baru (checkout) |
| GET | `/orders` | Customer | List order milik customer |
| GET | `/orders/{id}` | Customer | Detail order milik customer |
| GET | `/admin/orders` | Admin | List semua order (filter) |
| GET | `/admin/orders/{id}` | Admin | Detail order (admin view) |
| PATCH | `/admin/orders/{id}/verify` | Admin | Verifikasi pembayaran lunas |
| PATCH | `/admin/orders/{id}/reject` | Admin | Tolak pembayaran |
| PATCH | `/admin/orders/{id}/ship` | Admin | Update status: dikirim + no resi |
| PATCH | `/admin/orders/{id}/complete` | Admin | Update status: selesai |

**Contoh POST /orders (checkout):**
```json
POST /api/v1/orders
{
  "items": [
    {"product_id": 1, "variant_id": 1, "quantity": 2},
    {"product_id": 2, "variant_id": 3, "quantity": 1}
  ],
  "shipping_address": "Jl. Merdeka No. 1, Jakarta",
  "shipping_method": "delivery",
  "notes": "Tolong dikemas rapi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pesanan berhasil dibuat",
  "data": {
    "id": 42,
    "order_code": "ORD-20261029-001",
    "status": "pending",
    "subtotal": 45000,
    "shipping_cost": 10000,
    "total": 55000,
    "items": [...]
  }
}
```

#### 10.2.5 Payment Module (`/api/v1/payments`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/payments/{order_id}/qris` | Customer | Generate QRIS dinamis |
| POST | `/payments/{order_id}/upload` | Customer | Upload bukti pembayaran |
| GET | `/payments/{order_id}` | Customer/Admin | Detail payment |

**Response POST /payments/{order_id}/qris:**
```json
{
  "success": true,
  "data": {
    "order_id": 42,
    "total": 55000,
    "qris_payload": "00020101021226...",
    "qr_image_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
    "expires_at": "2026-10-29T11:00:00Z"
  }
}
```

#### 10.2.6 Notification Module (`/api/v1/notifications`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/notifications` | Customer/Admin | List notifikasi user |
| POST | `/notifications/fcm-token` | Customer/Admin | Register FCM token untuk push notif |
| POST | `/notifications/{id}/wa-link` | Customer/Admin | Generate WhatsApp deep link URL |
| PATCH | `/notifications/{id}/read` | Customer/Admin | Tandai notif sebagai sudah dibaca |

#### 10.2.7 Settings Module (`/api/v1/admin/settings`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/admin/settings` | Admin | Get semua settings |
| PATCH | `/admin/settings` | Admin | Update settings (QRIS owner, DANA, WA, dll) |
| POST | `/admin/settings/qris/validate` | Admin | Validasi format QRIS payload |

#### 10.2.8 Reports Module (`/api/v1/admin/reports`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/admin/reports` | Admin | Laporan transaksi dengan filter |
| GET | `/admin/reports/export?format=pdf` | Admin | Export laporan ke PDF |
| GET | `/admin/reports/export?format=excel` | Admin | Export laporan ke Excel |
| GET | `/admin/reports/summary` | Admin | Dashboard summary (cards) |
| GET | `/admin/reports/top-products` | Admin | Produk terlaris |
| GET | `/admin/reports/segment-breakdown` | Admin | Penjualan per segmen customer |
| GET | `/admin/orders/{id}/nota.pdf` | Admin | Download nota PDF per order |

### 10.3 Contoh Implementasi Endpoint (FastAPI)

```python
# app/api/v1/payments.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_customer
from app.services.qris_service import generate_dynamic_qris
from app.services.cloudinary_service import upload_image
from app.services.fcm_service import send_push_notification
from app.models import Order, Payment, Customer

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/{order_id}/qris")
async def generate_qris(
    order_id: int,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    # 1. Validasi order milik customer
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.customer_id == current_customer.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order tidak ditemukan")
    
    # 2. Generate QRIS dinamis dengan nominal embedded
    qris_payload, qr_image = generate_dynamic_qris(
        amount=order.total,
        owner_qris_static=get_setting(db, 'owner_qris_static')
    )
    
    # 3. Simpan ke payments table
    payment = db.query(Payment).filter(Payment.order_id == order_id).first()
    if not payment:
        payment = Payment(order_id=order_id, amount=order.total, method='qris')
        db.add(payment)
    payment.qris_payload = qris_payload
    db.commit()
    
    return {
        "success": True,
        "data": {
            "order_id": order_id,
            "total": float(order.total),
            "qris_payload": qris_payload,
            "qr_image_base64": qr_image
        }
    }

@router.post("/{order_id}/upload")
async def upload_payment_proof(
    order_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    # 1. Validasi file
    if file.content_type not in ["image/jpeg", "image/png", "application/pdf"]:
        raise HTTPException(status_code=422, detail="Format file tidak didukung")
    if file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=422, detail="Ukuran file maksimal 5MB")
    
    # 2. Upload ke Cloudinary
    image_url = await upload_image(file)
    
    # 3. Update payment record
    payment = db.query(Payment).filter(Payment.order_id == order_id).first()
    payment.proof_image_url = image_url
    payment.status = 'pending'
    db.commit()
    
    # 4. Trigger push notification ke admin
    admin_fcm_tokens = get_admin_fcm_tokens(db)
    send_push_notification(
        tokens=admin_fcm_tokens,
        title=f"Pesanan baru {payment.order.order_code}",
        body=f"Dari {current_customer.name}, total Rp {payment.amount:,.0f}"
    )
    
    # 5. Log notifikasi
    log_notification(db, user_type='admin', title='Pesanan baru', ...)
    
    return {"success": True, "message": "Bukti pembayaran berhasil diupload"}
```

---

## 11. TECH STACK DETAIL

### 11.1 Frontend Stack

| Komponen | Teknologi | Versi | Alasan |
|---|---|---|---|
| Framework | Next.js | 14.x+ (App Router) | Modern, SSR+SSG+ISR, PWA support, deployment mudah |
| UI Library | React | 18.x | Komponen reusable, ekosistem besar |
| Language | TypeScript | 5.x | Type safety, autocomplete, refactoring aman |
| Styling | Tailwind CSS | 3.4+ | Utility-first, konsisten, dark mode support |
| UI Components | shadcn/ui | latest | Komponen aksesible, customizable, copy-paste |
| Icons | Lucide React | latest | Lightweight, modern, tree-shakeable |
| State Management | Zustand | 4.x | Simpler than Redux, hooks-based |
| Data Fetching | TanStack Query (React Query) | 5.x | Caching, retry, optimistic update |
| Form | React Hook Form + Zod | latest | Performance, schema validation |
| HTTP Client | Axios | 1.x | Interceptor, cancel token |
| PWA | next-pwa | 5.x | Service worker, manifest, offline support |
| Push Notification | firebase (web SDK) | 10.x | FCM client-side integration |
| QR Code | qrcode.react | 3.x | Render QR code di React |
| Date | date-fns | 3.x | Lightweight, format Indonesia |
| Charts (opsional) | Recharts | 2.x | Untuk dashboard analitik |

### 11.2 Backend Stack

| Komponen | Teknologi | Versi | Alasan |
|---|---|---|---|
| Framework | FastAPI | 0.110+ | Modern, async, auto-docs |
| ASGI Server | uvicorn | latest | Production-ready ASGI |
| Language | Python | 3.11+ | Type hints, performance, ekosistem |
| ORM | SQLAlchemy | 2.0+ | Type-safe, async support, mature |
| Migration | Alembic | latest | Version-controlled schema migration |
| Validation | Pydantic | 2.x | Type safety, JSON schema auto-generate |
| Auth | python-jose (JWT) + passlib (bcrypt) | latest | JWT signing + password hashing |
| Database Driver | PyMySQL | 1.x | Pure Python MySQL driver |
| File Upload | python-multipart | latest | Multipart form data parsing |
| QRIS | qris-utils (Python) + qrcode | latest | QRIS payload manipulation + QR generation |
| Image Storage | cloudinary | 1.x | Upload bukti pembayaran |
| Push Notification | firebase-admin | 6.x | FCM server-side integration |
| PDF Generation | ReportLab | 4.x | Generate nota PDF & laporan |
| Excel Export | openpyxl | 3.x | Generate xlsx |
| HTTP Client | httpx | 0.27+ | Async HTTP untuk webhook (jika diperlukan) |
| CORS | fastapi-cors (built-in) | - | Cross-origin support |
| Logging | logging (stdlib) + loguru | latest | Structured logging |
| Testing | pytest + httpx | latest | API testing |
| Code Style | ruff + black | latest | Linting + formatting |

### 11.3 Database Stack

| Komponen | Teknologi | Versi | Alasan |
|---|---|---|---|
| Database Server | MySQL | 8.4.3 Community | Stable, ACID, fitur lengkap (sudah via Laragon) |
| Web GUI | phpMyAdmin | 6.2.3 | Visual management, query builder, export/import |
| Charset | utf8mb4_unicode_ci | - | Support emoji & karakter Indonesia |
| Storage Engine | InnoDB | - | Transactional, FK support, row-level locking |

### 11.4 External Services

| Service | Purpose | Tier | Biaya |
|---|---|---|---|
| Cloudinary | Image CDN (bukti pembayaran, foto produk) | Free (25 credits/month) | Rp 0 |
| Firebase Cloud Messaging | Push notification server-to-device | Free unlimited | Rp 0 |
| WhatsApp Deep Link | Backup notifikasi via wa.me URL | Free | Rp 0 |
| Vercel | Frontend hosting | Hobby (free) | Rp 0 |
| Railway / Render | Backend Python hosting | Free tier (sleep after inactivity) / $5/mo | Rp 0 - Rp 75rb/bulan |
| PlanetScale / Railway MySQL | Database production | Free tier 5GB | Rp 0 |
| Gmail SMTP (opsional) | Email transaksional (jika ditambahkan) | Free | Rp 0 |

### 11.5 Development Tools

| Tool | Purpose |
|---|---|
| VS Code | Code editor |
| Postman / Insomnia | API testing manual |
| Git + GitHub | Version control & collaboration |
| Laragon | Local MySQL + phpMyAdmin + Apache |
| Python venv | Isolated Python environment |
| Node Version Manager (nvm) | Multiple Node.js versions |
| DBeaver (opsional) | Alternative DB GUI jika perlu |
| Docker (opsional) | Containerization untuk deployment konsisten |

### 11.6 File Structure Proyek

```
moring-suksok/
├── frontend/                    # Next.js PWA
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── (public)/         # Public routes (katalog, detail produk)
│   │   │   ├── (auth)/           # Login, register
│   │   │   ├── (customer)/       # Customer-only routes
│   │   │   │   ├── cart/
│   │   │   │   ├── checkout/
│   │   │   │   ├── orders/
│   │   │   │   └── profile/
│   │   │   └── (admin)/         # Admin-only routes
│   │   │       ├── dashboard/
│   │   │       ├── products/
│   │   │       ├── orders/
│   │   │       ├── reports/
│   │   │       └── settings/
│   │   ├── components/           # Reusable components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── product/
│   │   │   ├── cart/
│   │   │   ├── order/
│   │   │   └── layout/
│   │   ├── lib/                  # Utilities
│   │   │   ├── api.ts            # API client (Axios)
│   │   │   ├── auth.ts           # Auth helpers
│   │   │   └── utils.ts
│   │   ├── hooks/                # Custom React hooks
│   │   ├── stores/               # Zustand stores
│   │   ├── types/                # TypeScript types
│   │   └── public/               # Static assets (icons, manifest.json)
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # Python FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   └── dependencies.py
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── api/v1/
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   ├── cart.py
│   │   │   ├── orders.py
│   │   │   ├── payments.py
│   │   │   ├── notifications.py
│   │   │   ├── settings.py
│   │   │   └── reports.py
│   │   ├── services/
│   │   │   ├── qris_service.py
│   │   │   ├── fcm_service.py
│   │   │   ├── cloudinary_service.py
│   │   │   ├── pdf_service.py
│   │   │   ├── excel_service.py
│   │   │   └── wa_service.py
│   │   └── utils/
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── .env.example
│   └── Dockerfile
│
├── docs/                        # Documentation
│   ├── Dokumen_Perencanaan_Moring_Suksok.md  (this file)
│   ├── api-collection.json     # Postman collection
│   └── screenshots/
│
├── scripts/                     # Utility scripts
│   ├── seed.py                  # Seed data
│   └── test_qris.py             # QRIS testing
│
├── .gitignore
├── README.md
└── docker-compose.yml (opsional)
```

---

## 12. MILESTONE DEVELOPMENT

### 12.1 Timeline Overview (8 Minggu)

Timeline dikalkulasi untuk 8 minggu penuh development, dengan asumsi Anda bekerja **15-20 jam/minggu** (paralel dengan aktivitas akademik lain). Timeline dibagi menjadi 4 fase dengan milestone review di akhir setiap fase.

```
Minggu 1-2: FASE 1 — Setup & Foundation
Minggu 3-4: FASE 2 — Core Features (Auth, Products, Cart)
Minggu 5-6: FASE 3 — Payment, Order, Notification
Minggu 7-8: FASE 4 — Polish, PWA, Testing, Deploy
```

### 12.2 Detail Milestone Per Minggu

#### MINGGU 1 — Project Setup & Database Design

**Tujuan:** Setup environment development, desain database lengkap, dan scaffold project structure.

| # | Task | Output | Status Check |
|---|---|---|---|
| 1.1 | Setup Git repo + .gitignore + README | GitHub repo `moring-suksok` | Repo bisa di-clone |
| 1.2 | Setup Python venv + install FastAPI stack | `requirements.txt` | `uvicorn` bisa jalan di localhost:8000 |
| 1.3 | Setup Node.js + create Next.js app | `frontend/` folder | `npm run dev` jalan di localhost:3000 |
| 1.4 | Buat database MySQL `moring_suksok` via phpMyAdmin | Database kosong | Bisa lihat di phpMyAdmin |
| 1.5 | Setup SQLAlchemy models (9 tabel) | `models/*.py` | Models terdefinisi |
| 1.6 | Setup Alembic + initial migration | `alembic/` | `alembic upgrade head` jalan, tabel ter-create |
| 1.7 | Buat seed script (admin, contoh produk) | `seed.py` | phpMyAdmin menampilkan data seed |
| 1.8 | Setup FastAPI app skeleton + CORS + logging | `main.py` | Swagger UI accessible di `/docs` |
| 1.9 | Setup Next.js app skeleton + Tailwind + shadcn/ui | Layout dasar | Landing page bisa di-render |
| 1.10 | Setup environment variables (.env) | `.env` files | Tidak ter-commit ke git |

**Milestone Review Akhir Minggu 1:**
- ✅ Backend FastAPI jalan dengan Swagger UI
- ✅ Frontend Next.js jalan dengan Tailwind
- ✅ Database MySQL ter-setup dengan 9 tabel (lihat di phpMyAdmin)
- ✅ Seed data admin + produk contoh

#### MINGGU 2 — Auth Module & Basic UI

**Tujuan:** Implementasi modul autentikasi lengkap (registrasi, login, JWT, role-based access) di backend, serta halaman login/register di frontend.

| # | Task | Output | Status Check |
|---|---|---|---|
| 2.1 | Implementasi JWT (sign, verify, decode) | `security.py` | Token bisa di-generate & di-verify |
| 2.2 | Implementasi password hashing (bcrypt) | `security.py` | Hash bisa diverify |
| 2.3 | Implementasi endpoint POST `/auth/register` | `auth.py` | Postman test berhasil |
| 2.4 | Implementasi endpoint POST `/auth/login` | `auth.py` | Postman test berhasil |
| 2.5 | Implementasi endpoint POST `/auth/admin/login` | `auth.py` | Postman test berhasil |
| 2.6 | Implementasi endpoint GET/PATCH `/auth/me` | `auth.py` | Postman test berhasil |
| 2.7 | Implementasi middleware JWT verification | `dependencies.py` | Protected endpoint return 401 jika no token |
| 2.8 | Implementasi role-based access (customer vs admin) | `dependencies.py` | Admin-only endpoint return 403 jika customer |
| 2.9 | Buat halaman Register (frontend) | `/register` page | Form submit berhasil |
| 2.10 | Buat halaman Login (frontend) | `/login` page | Form submit → JWT disimpan di localStorage |
| 2.11 | Buat layout dasar (header, footer, nav) | Layout component | Responsive di mobile |
| 2.12 | Setup API client (Axios) dengan interceptor JWT | `lib/api.ts` | Auto-attach Authorization header |

**Milestone Review Akhir Minggu 2:**
- ✅ Customer bisa registrasi & login
- ✅ Admin bisa login (separate endpoint)
- ✅ JWT terverifikasi di setiap request
- ✅ Frontend simpan token & redirect setelah login

#### MINGGU 3 — Product Module

**Tujuan:** Implementasi CRUD produk (admin) + katalog produk (customer) dengan varian.

| # | Task | Output | Status Check |
|---|---|---|---|
| 3.1 | Implementasi endpoint CRUD admin produk | `products.py` | Postman tests pass |
| 3.2 | Implementasi endpoint CRUD admin varian | `products.py` | Postman tests pass |
| 3.3 | Implementasi upload foto ke Cloudinary | `cloudinary_service.py` | URL gambar tersimpan |
| 3.4 | Implementasi endpoint GET `/products` (list+pagination+search) | `products.py` | Pagination works |
| 3.5 | Implementasi endpoint GET `/products/{slug}` (detail) | `products.py` | Detail lengkap dengan varian |
| 3.6 | Buat halaman Katalog Produk (frontend) | `/` page | Grid produk tampil |
| 3.7 | Buat halaman Detail Produk (frontend) | `/produk/[slug]` | Foto + varian + harga |
| 3.8 | Buat halaman admin Kelola Produk (CRUD UI) | `/admin/produk` | Form tambah/edit/hapus |
| 3.9 | Implementasi search bar + filter kategori | UI component | Real-time filter |
| 3.10 | Implementasi pagination component | UI component | Page navigation works |

**Milestone Review Akhir Minggu 3:**
- ✅ Admin bisa CRUD produk + varian dengan foto
- ✅ Customer bisa browse katalog + lihat detail
- ✅ Search & pagination berfungsi

#### MINGGU 4 — Cart & Checkout

**Tujuan:** Implementasi cart (frontend state + backend persistent) dan checkout flow.

| # | Task | Output | Status Check |
|---|---|---|---|
| 4.1 | Implementasi cart store di frontend (Zustand) | `stores/cart.ts` | Cart state management |
| 4.2 | Implementasi endpoint POST `/cart/items` | `cart.py` | Cart item tersimpan di DB |
| 4.3 | Implementasi endpoint GET `/cart` | `cart.py` | List cart items |
| 4.4 | Implementasi endpoint PATCH `/cart/items/{id}` (edit qty) | `cart.py` | Qty updated |
| 4.5 | Implementasi endpoint DELETE `/cart/items/{id}` | `cart.py` | Item removed |
| 4.6 | Buat halaman Cart (frontend) | `/cart` page | List items + edit + delete |
| 4.7 | Implementasi badge cart counter | Header component | Real-time count |
| 4.8 | Implementasi endpoint POST `/orders` (checkout) | `orders.py` | Order + items ter-create |
| 4.9 | Implementasi generate order_code (ORD-YYYYMMDD-XXX) | `orders.py` | Code unik & terurut |
| 4.10 | Implementasi snapshot produk+harga di order_items | `orders.py` | Field tersimpan saat checkout |
| 4.11 | Buat halaman Checkout (frontend) | `/checkout` page | Form alamat + total |
| 4.12 | Implementasi kalkulasi ongkir (flat from settings) | `orders.py` | Total = subtotal + ongkir |

**Milestone Review Akhir Minggu 4:**
- ✅ Customer bisa tambah/edit/hapus item di cart
- ✅ Checkout berhasil buat order baru
- ✅ Snapshot data tersimpan di order_items

#### MINGGU 5 — Payment Module (QRIS)

**Tujuan:** Implementasi pembayaran QRIS dinamis + upload bukti + verifikasi owner.

| # | Task | Output | Status Check |
|---|---|---|---|
| 5.1 | Setup Cloudinary account + credentials | `.env` | Upload test berhasil |
| 5.2 | Implementasi endpoint POST `/payments/{order_id}/qris` | `payments.py` | QR code ter-generate |
| 5.3 | Implementasi service generate QRIS dinamis | `qris_service.py` | Nominal embedded di payload |
| 5.4 | Test scan QRIS via DANA/OVO/SeaBank | Manual test | QR scannable |
| 5.5 | Implementasi endpoint POST `/payments/{order_id}/upload` | `payments.py` | Bukti tersimpan |
| 5.6 | Validasi file upload (MIME type + size) | `payments.py` | Reject jika invalid |
| 5.7 | Buat halaman Payment (frontend) — display QR + tombol download | `/payment/[id]` | UI lengkap |
| 5.8 | Buat halaman Upload Bukti (frontend) | UI section | Form upload berfungsi |
| 5.9 | Implementasi halaman Status "Menunggu Verifikasi" | UI section | Status real-time |
| 5.10 | Implementasi tombol "Notifikasi Owner via WA" (wa.me) | UI button | WA link ter-generate |
| 5.11 | Implementasi admin endpoint untuk list pesanan pending | `orders.py` (admin) | Filter by status |
| 5.12 | Buat halaman admin List Pesanan (frontend) | `/admin/pesanan` | Table + filter |

**Milestone Review Akhir Minggu 5:**
- ✅ QRIS dinamis ter-generate dengan nominal benar
- ✅ Customer bisa upload bukti pembayaran
- ✅ Admin bisa lihat daftar pesanan pending

#### MINGGU 6 — Verification, Status, Notification

**Tujuan:** Implementasi verifikasi owner, update status pesanan, dan sistem notifikasi (push + WA).

| # | Task | Output | Status Check |
|---|---|---|---|
| 6.1 | Implementasi endpoint PATCH `/admin/orders/{id}/verify` | `orders.py` | Status → processed |
| 6.2 | Implementasi endpoint PATCH `/admin/orders/{id}/reject` | `orders.py` | Status → cancelled |
| 6.3 | Implementasi endpoint PATCH `/admin/orders/{id}/ship` | `orders.py` | Status → shipped + no resi |
| 6.4 | Implementasi endpoint PATCH `/admin/orders/{id}/complete` | `orders.py` | Status → done |
| 6.5 | Setup Firebase project + FCM credentials | `.env` | FCM bisa kirim test |
| 6.6 | Implementasi FCM service (server-side) | `fcm_service.py` | Push notif terkirim |
| 6.7 | Implementasi register FCM token (frontend) | SW + firebase | Token tersimpan di DB |
| 6.8 | Implementasi service worker push handler | `public/sw.js` | Notif tampil walau app tutup |
| 6.9 | Buat halaman admin Detail Pesanan + bukti | `/admin/pesanan/[id]` | Image preview |
| 6.10 | Buat tombol "Konfirmasi/Tolak" (admin) | UI buttons | Trigger PATCH endpoint |
| 6.11 | Buat halaman customer Tracking Status | `/pesanan/[id]` | Timeline visual |
| 6.12 | Implementasi WhatsApp deep link service | `wa_service.py` | URL ter-generate |
| 6.13 | Buat tombol "Kirim WA ke Customer" (admin) | UI button | WA link terbuka |

**Milestone Review Akhir Minggu 6:**
- ✅ Admin bisa verifikasi/tolak/update status
- ✅ Push notif terkirim ke customer & admin
- ✅ Customer bisa lihat timeline status

#### MINGGU 7 — Reporting & Settings

**Tujuan:** Implementasi laporan transaksi (PDF/Excel) + settings page (QRIS owner setup).

| # | Task | Output | Status Check |
|---|---|---|---|
| 7.1 | Implementasi endpoint GET `/admin/reports` | `reports.py` | Laporan dengan filter |
| 7.2 | Implementasi aggregate query (sum, count, avg) | SQL queries | Summary benar |
| 7.3 | Implementasi export PDF laporan (ReportLab) | `pdf_service.py` | PDF ter-generate |
| 7.4 | Implementasi export Excel laporan (openpyxl) | `excel_service.py` | XLSX ter-generate |
| 7.5 | Implementasi download nota PDF per order | `pdf_service.py` | Nota resmi ter-generate |
| 7.6 | Buat halaman admin Laporan Transaksi | `/admin/laporan` | Filter + table + export |
| 7.7 | Implementasi settings endpoint (CRUD) | `settings.py` | Settings bisa diupdate |
| 7.8 | Implementasi validasi QRIS format | `qris_service.py` | Reject jika invalid |
| 7.9 | Buat halaman admin Settings | `/admin/settings` | Form QRIS + DANA + WA |
| 7.10 | Buat halaman admin Dashboard (summary cards) | `/admin` | Stats real-time |
| 7.11 | (Opsional) Implementasi grafik penjualan | Charts UI | Bar chart per hari |
| 7.12 | (Opsional) Implementasi produk terlaris | Top 5 produk | List di dashboard |

**Milestone Review Akhir Minggu 7:**
- ✅ Laporan transaksi lengkap dengan filter & export
- ✅ Nota PDF ter-generate per order
- ✅ Owner bisa setup QRIS statis di settings

#### MINGGU 8 — PWA, Testing, Deployment

**Tujuan:** Finalisasi PWA configuration, end-to-end testing, dan deployment ke production.

| # | Task | Output | Status Check |
|---|---|---|---|
| 8.1 | Setup next-pwa (manifest.json, service worker) | `next.config.js` | PWA installable |
| 8.2 | Implementasi offline caching strategy | `public/sw.js` | App jalan offline (limited) |
| 8.3 | Setup icons PWA (192x192, 512x512) | `public/icons/` | Install prompt muncul |
| 8.4 | Test "Add to Home Screen" di Android | Manual test | Icon muncul di home |
| 8.5 | Test push notification di Android | Manual test | Notif masuk walau app tutup |
| 8.6 | End-to-end testing happy path | Test scenarios | All flow works |
| 8.7 | Bug fixing & polishing UI | Various | No critical bugs |
| 8.8 | Setup environment variables production | Vercel + Railway | Set in dashboards |
| 8.9 | Deploy frontend ke Vercel | Vercel URL | https://moringsuksok.vercel.app |
| 8.10 | Deploy backend ke Railway/Render | Railway URL | https://api.moringsuksok.railway.app |
| 8.11 | Setup MySQL production (PlanetScale) | Production DB | Migration run |
| 8.12 | Run production migration + seed admin | Alembic + seed | Production ready |
| 8.13 | Final testing di production | Manual test | All features work in prod |
| 8.14 | Tulis README user untuk owner | `docs/README.md` | Cara pakai + screenshot |
| 8.15 | Buat dokumentasi API untuk sidang | `docs/api-collection.json` | Postman collection |

**Milestone Review Akhir Minggu 8:**
- ✅ Aplikasi live di production (Vercel + Railway)
- ✅ PWA installable di Android
- ✅ Push notification berfungsi
- ✅ Dokumentasi lengkap untuk sidang

### 12.3 Buffer & Risk Mitigation Timeline

- **Buffer 1 minggu** disisihkan untuk handle bug tak terduga atau feature tambahan yang diminta dosen pembimbing.
- Jika timeline terlambat, prioritas MVP (priority "Must") wajib selesai; story "Should" bisa di-skip atau dijadikan "future work" di laporan TA.

### 12.4 Deliverables Per Fase

| Fase | Minggu | Deliverable |
|---|---|---|
| Fase 1 | 1-2 | Foundation: project structure, DB schema, auth module |
| Fase 2 | 3-4 | Core: katalog produk + cart + checkout |
| Fase 3 | 5-6 | Payment: QRIS + verifikasi + notifikasi |
| Fase 4 | 7-8 | Polish: laporan + PWA + deploy production |

---

## 13. RISIKO & MITIGASI

### 13.1 Identifikasi Risiko Proyek

Risiko proyek adalah ketidakpastian yang dapat mempengaruhi keberhasilan TA, baik dari sisi teknis, timeline, maupun adopsi pengguna. Identifikasi risiko dilakukan secara proaktif agar mitigasi dapat dipersiapkan sebelumnya.

### 13.2 Matriks Risiko & Mitigasi

| # | Kategori | Risiko | Probability | Impact | Mitigasi |
|---|---|---|---|---|---|
| R1 | Teknis | Implementasi QRIS dinamis gagal (CRC16 salah, QR tidak scannable) | Medium | High | Test dengan multi e-wallet (DANA, OVO, GoPay) sejak awal; fallback ke QRIS statis (customer input nominal manual) |
| R2 | Teknis | Push notification PWA tidak berfungsi di Android tertentu | Low | Medium | Fallback ke WhatsApp deep link (wa.me); dokumentasikan iOS limitation (<16.4) |
| R3 | Teknis | CORS error saat frontend ↔ backend berbeda origin | Medium | Low | Setup CORS middleware di FastAPI sejak awal; allow origin Vercel domain |
| R4 | Teknis | Upload image ke Cloudinary gagal / rate limit | Low | Medium | Local fallback: simpan di `/public/uploads/` jika Cloudinary error; retry mechanism |
| R5 | Teknis | Database migration Alembic conflict saat team collaboration | Low | Medium | Selalu commit migration files; review sebelum merge; dokumentasi changelog |
| R6 | Teknis | JWT secret ter-expose di repo public | Low | High | Gunakan `.env` + `.gitignore`; rotasi secret jika ter-expose; gunakan environment variables di production |
| R7 | Timeline | Timeline 8 minggu terlalu ketat, fitur tidak selesai | Medium | High | Prioritaskan MVP (priority "Must"); story "Should" bisa di-skip; buffer 1 minggu |
| R8 | Timeline | Feature creep (terus nambah fitur) | Medium | Medium | Patuhi scope di section 4; tambahan fitur → future work di laporan TA |
| R9 | Timeline | Penundaan karena ujian/aktivitas akademik lain | High | Medium | Komunikasi dengan dosen pembimbing; adjust timeline; kerjakan di weekend |
| R10 | Adopsi | Owner tidak mau pakai sistem (resistance to change) | Medium | High | Demo langsung ke owner; training session; manfaatkan PWA yang familiar mirip aplikasi biasa |
| R11 | Adopsi | Customer tidak mau registrasi akun | Medium | Medium | Form registrasi simpel (1 halaman); UX friendly; jelaskan manfaat (tracking, repeat order) |
| R12 | Adopsi | Customer tidak install PWA | Medium | Low | Tombol "Install App" prominent; instruksi visual; fallback web tetap berfungsi |
| R13 | Operasional | Owner lupa verifikasi pembayaran | Medium | Medium | Push notification otomatis ke owner saat order masuk; dashboard highlight order pending |
| R14 | Operasional | Customer upload bukti yang salah/tidak jelas | Medium | Low | Preview image sebelum submit; field opsional "catatan"; owner bisa minta re-upload |
| R15 | Operasional | QRIS owner berubah/expired | Low | Medium | Owner bisa update QRIS statis di settings; validasi format; test scan setelah update |
| R16 | Eksternal | Cloudinary free tier habis (>25 uploads/month) | Low | Low | Upgrade ke paid plan (~$10/bulan); atau pindah ke self-hosted (Cloudinary → Vercel Blob) |
| R17 | Eksternal | Railway/Render free tier sleep after inactivity | Medium | Low | Cold start ~30 detik; setup cron job untuk ping endpoint; atau upgrade ke paid ($5/bulan) |
| R18 | Eksternal | Midtrans (jika ditambahkan nanti) menolak registrasi owner | Low | Medium | Tetap pakai QRIS self-generated; alternatif: Xendit, Faspay, atau manual bank transfer |
| R19 | Keamanan | SQL injection via input customer | Low | High | SQLAlchemy ORM parameterized query; Pydantic validation; tidak ada raw SQL |
| R20 | Keamanan | CSRF attack pada form submission | Low | Medium | SameSite cookies; CSRF token (jika pakai session-based); JWT di header (immune CSRF) |
| R21 | Keamanan | File upload berbahaya (PHP shell, virus) | Low | High | Validasi MIME type & extension; scan dengan antivirus (opsional); store di Cloudinary (isolated) |
| R22 | Akademik | Dosen penguji mempertanyakan kelayakan teknis | Medium | Medium | Dokumen ini lengkap; demo Swagger UI; siapkan penjelasan trade-off teknis |

### 13.3 Top 5 Risiko Kritis (Wajib Dimonitor)

Berdasarkan matriks di atas, 5 risiko dengan kombinasi probability × impact tertinggi yang wajib dimonitor ketat:

1. **R1 — QRIS Dinamis Gagal**: Buat test plan sejak minggu 5 dengan multi e-wallet. Siapkan fallback QRIS statis.
2. **R7 — Timeline Ketat**: Disiplin dengan prioritas MoSCoW. Komunikasi proaktif ke dosen pembimbing jika ada delay.
3. **R10 — Owner Tidak Mau Pakai**: Libatkan owner sejak fase perencanaan; demo berkala; training session.
4. **R13 — Owner Lupa Verifikasi**: Pastikan push notif ke owner sangat prominent; dashboard highlight urgen.
5. **R22 — Dosen Penguji Pertanyaan Teknis**: Siapkan penjelasan trade-off (QRIS vs Midtrans, FastAPI vs Next.js API, dll).

### 13.4 Risiko Out-of-Scope (Tidak Ditangani TA)

Risiko-risiko berikut tidak masuk scope TA dan akan ditangani jika sistem di-deploy ke produksi nyata pasca-lulus:
- Scaling untuk high-traffic (>1000 order/hari)
- Multi-tenant SaaS (untuk multiple UMKM)
- SLA uptime 99.9%
- Compliance regulasi (UU PDP, PCI-DSS jika pakai credit card)
- Backup & disaster recovery otomatis

---

## 14. LIMITASI SISTEM (UNTUK LAPORAN TA)

### 14.1 Mengapa Limitasi Harus Didokumentasikan

Pada laporan Tugas Akhir, limitasi sistem adalah bagian penting yang menunjukkan pemahaman kritis Anda terhadap trade-off teknis dan biaya. Limitasi bukan kelemahan, melainkan keputusan desain yang disengaja dengan justifikasi yang dapat dipertanggungjawabkan. Berikut adalah limitasi-limitasi sistem yang harus dicatat di laporan TA beserta justifikasinya.

### 14.2 Daftar Limitasi Sistem

#### Limitasi 1: Pembayaran QRIS Tanpa Auto-Update Status

**Deskripsi:** Sistem tidak menerima notifikasi otomatis dari bank/e-wallet ketika customer selesai membayar QRIS. Owner harus memverifikasi bukti pembayaran secara manual.

**Alasan Teknis:** QRIS self-generated (yang menggunakan QRIS statis owner sebagai base) tidak terhubung ke payment gateway resmi (Midtrans, Xendit, Faspay) yang menyediakan webhook callback. Hanya payment gateway resmi yang memiliki akses ke notifikasi transaksi dari bank/e-wallet.

**Justifikasi Pilihan:** Owner Moring Suksok sebagai UMKM kecil tidak mau membayar fee 0.7% per transaksi (sekitar Rp 26.250/bulan untuk 50 order) yang dikenakan oleh payment gateway. Sebagai trade-off, owner mengorbankan otomatisasi verifikasi pembayaran. Untuk skala Moring Suksok saat ini (<50 order/bulan), verifikasi manual masih feasible.

**Mitigasi di Sistem:** Sistem menyediakan push notification otomatis ke owner saat customer upload bukti pembayaran, sehingga owner langsung tahu ada pesanan yang perlu diverifikasi. Bukti pembayaran tersimpan digital di Cloudinary sehingga owner bisa cek kapan saja.

#### Limitasi 2: WhatsApp Notifikasi Semi-Otomatis (via Deep Link wa.me)

**Deskripsi:** Notifikasi WhatsApp tidak otomatis terkirim ke penerima. Pengirim (customer atau owner) harus mengklik tombol "Kirim" secara manual di aplikasi WhatsApp setelah link wa.me terbuka.

**Alasan Teknis:** WhatsApp Business API (resmi) yang memungkinkan pengiriman otomatis memerlukan registrasi via provider pihak ketiga (Fonnte, Wablas, Twilio) dengan biaya per pesan (~Rp 50-100/pesan). Tidak ada API gratis dari WhatsApp/Meta untuk pengiriman otomatis kecuali via provider berbayar.

**Justifikasi Pilihan:** Untuk skala Moring Suksok (~50 order/bulan), biaya WhatsApp Business API (~Rp 250rb/bulan) tidak sebanding dengan manfaat. Sebagai alternatif, deep link wa.me digunakan sebagai fallback gratis dengan konsekuensi 1 klik manual.

**Mitigasi di Sistem:** Sistem mengimplementasikan Push Notification PWA (gratis via Firebase Cloud Messaging) sebagai channel notifikasi utama yang otomatis 100%. WhatsApp deep link hanya sebagai backup untuk customer yang belum install PWA atau menolak permission notifikasi.

#### Limitasi 3: Push Notification PWA Butuh Install & Permission

**Deskripsi:** Customer harus (a) install PWA via "Add to Home Screen" dan (b) grant permission notifikasi di browser agar push notification berfungsi. Jika salah satu tidak dilakukan, notifikasi tidak akan terkirim.

**Alasan Teknis:** Ini adalah limitation bawaan dari arsitektur PWA & Web Push API. Browser tidak mengizinkan notifikasi tanpa explicit user consent (anti-spam). Install PWA diperlukan agar service worker aktif untuk menerima push di background.

**Justifikasi Pilihan:** PWA dipilih sebagai pendekatan cross-platform (Android + Web + iOS) tanpa harus membangun native app terpisah. Trade-off berupa requirement install & permission dianggap acceptable untuk UMKM.

**Mitigasi di Sistem:** UI memberikan prompt yang jelas untuk install PWA dan grant permission. Sistem tetap berfungsi penuh tanpa push notification (fallback ke WhatsApp deep link). Notifikasi in-app juga tersedia (bell icon) saat customer membuka aplikasi.

#### Limitasi 4: Tidak Mendukung iOS < 16.4 untuk Push Notification

**Deskripsi:** Push notification PWA tidak berfungsi pada perangkat iOS dengan versi di bawah 16.4. Customer dengan iOS lama hanya bisa menggunakan WhatsApp deep link sebagai notifikasi.

**Alasan Teknis:** Apple baru mendukung Web Push API untuk PWA di iOS 16.4+ (Maret 2023). Sebelum itu, push notification PWA tidak didukung di iOS (hanya di Android & desktop).

**Justifikasi Pilihan:** Karena target customer Moring Suksok mayoritas pengguna Android (UMKM lokal Indonesia), limitasi iOS dianggap minor. Selain itu, tidak ada solusi alternatif gratis selain PWA untuk push notification cross-platform.

**Mitigasi di Sistem:** Sistem mendeteksi iOS version dan menampilkan pesan yang sesuai (recommend upgrade atau use WhatsApp fallback). Dokumentasi user mencantumkan requirement iOS 16.4+.

#### Limitasi 5: Tidak Ada Auto-Calculate Ongkir (Integrasi RajaOngkir/Binderbyte)

**Deskripsi:** Ongkir di sistem menggunakan tarif flat (default Rp 10.000) yang di-set manual oleh owner. Tidak ada kalkulasi otomatis berdasarkan jarak, berat, atau kurir.

**Alasan Teknis:** Integrasi API RajaOngkir/Binderbyte memerlukan subscription berbayar (Rp 100rb-500rb/bulan tergantung plan). Selain itu, perhitungan ongkir yang akurat memerlukan input berat paket yang belum tentu owner punya data-nya.

**Justifikasi Pilihan:** Untuk skala Moring Suksok lokal (1 kota), ongkir flat sudah representatif. Owner bisa update ongkir di settings sesuai kondisi. Implementasi auto-calculate akan ditambahkan di versi future jika owner ekspansi ke lintas kota.

**Mitigasi di Sistem:** Owner bisa set ongkir flat di settings. Pada checkout, customer melihat ongkir yang sama untuk semua order. Field catatan disediakan jika customer mau nego ongkir (misal: pickup di lokasi owner).

#### Limitasi 6: Tidak Ada Integrasi Kurir Otomatis (JNE/JNT/SiCepat API)

**Deskripsi:** Owner harus input nomor resi secara manual setelah mengirim paket via kurir. Sistem tidak terintegrasi dengan API kurir untuk auto-generate resi atau tracking otomatis.

**Alasan Teknis:** API kurir resmi (JNE, JNT, SiCepat) memerlukan akun corporate dan biaya subscription. Selain itu, proses pickup kurir masih dilakukan manual oleh owner (datang ke counter kurir).

**Justifikasi Pilihan:** Untuk UMKM kecil, integrasi kurir otomatis tidak feasible secara biaya dan operasional. Owner cukup input no resi manual setelah kirim paket.

**Mitigasi di Sistem:** Field no resi di form update status. Customer bisa lihat no resi di halaman tracking. Sistem tidak menampilkan tracking otomatis (link ke website kurir saja jika perlu).

#### Limitasi 7: Tidak Ada Inventory Management Otomatis (Stok Alert)

**Deskripsi:** Stok produk di tabel `product_variants` tidak otomatis ter-update saat ada order. Owner harus manual kurangi stok. Tidak ada alert otomatis saat stok menipis.

**Alasan Teknis:** Implementasi auto-decrement stok memerlukan trigger atau transaction yang kompleks (terutama untuk handle cancel/refund). Untuk MVP TA, ini di-skip agar fokus ke happy path.

**Justifikasi Pilihan:** Owner Moring Suksok bisa cek stok via phpMyAdmin atau dashboard. Untuk skala kecil, manual stock management masih memadai.

**Mitigasi di Sistem:** Stok tetap tersimpan di database (untuk referensi). Field stock di form varian bisa diupdate manual oleh owner. Future improvement: implementasi auto-decrement + alert.

#### Limitasi 8: Single Admin Account (Tidak Multi-User)

**Deskripsi:** Sistem hanya mendukung 1 akun admin (owner Moring Suksok). Tidak ada role-based access control (RBAC) untuk multiple admin (kasir, gudang, owner).

**Alasan Teknis:** Implementasi RBAC menambah kompleksitas. Untuk skala UMKM kecil, single admin sudah cukup.

**Justifikasi Pilihan:** Owner Moring Suksok mengelola sendiri semua operasional. Tidak ada staf tambahan yang butuh akses sistem.

**Mitigasi di Sistem:** Owner bisa share login credentials dengan staf kepercayaan jika diperlukan (dengan risiko keamanan ditanggung owner). Future improvement: multi-admin dengan role.

#### Limitasi 9: Tidak Ada Bahasa Inggris (Hanya Indonesia)

**Deskripsi:** UI dan dokumentasi hanya dalam Bahasa Indonesia. Tidak ada i18n (internationalization).

**Alasan Teknis:** Target customer 100% orang Indonesia (UMKM lokal). Implementasi i18n menambah kompleksitas tanpa manfaat signifikan.

**Justifikasi Pilihan:** Fokus ke UX yang baik untuk target market Indonesia.

**Mitigasi di Sistem:** - (Tidak perlu mitigasi, ini sesuai target market)

#### Limitasi 10: Local Deployment untuk TA, Production untuk Pasca-Graduation

**Deskripsi:** Selama TA, sistem dijalankan secara local (Laragon + localhost). Deployment ke production (Vercel/Railway) dilakukan di minggu terakhir sebagai demonstrasi, bukan untuk operasional penuh.

**Alasan Teknis:** Limitasi waktu TA (8 minggu) tidak cukup untuk setup production environment yang fully operational (production database, domain, SSL, monitoring, dll).

**Justifikasi Pilihan:** Setelah lulus, owner bisa melanjutkan deployment production dengan bantuan mahasiswa atau developer. Selama TA, demo local sudah cukup untuk evaluasi.

**Mitigasi di Sistem:** Dokumentasi deployment lengkap di section 15. Sistem dirancang dengan environment variables agar mudah switch dari local ke production.

### 14.3 Cara Penulisan Limitasi di Laporan TA

Limitasi-limitasi di atas dapat ditulis di Bab IV (Hasil & Pembahasan) atau Bab V (Penutup) dengan struktur seperti ini:

> **4.X Keterbatasan Sistem (Limitations)**
>
> Sistem yang dibangun memiliki beberapa keterbatasan yang merupakan keputusan desain dengan justifikasi teknis dan biaya tertentu. Keterbatasan-keterbatasan ini dipilih sebagai trade-off yang disengaja untuk sesuai dengan kebutuhan dan kapasitas UMKM Moring Suksok sebagai mitra Tugas Akhir.
>
> 1. **Pembayaran QRIS tanpa auto-update status**: Sistem tidak menerima notifikasi otomatis dari bank/e-wallet...
> 2. **WhatsApp notifikasi semi-otomatis**: ...
> 3. **Push notification butuh install PWA & permission**: ...
> [dst.]

---

## 15. DELIVERY & DEPLOYMENT PLAN

### 15.1 Strategi Delivery

Delivery dilakukan bertahap sesuai milestone 8 minggu, dengan review di akhir setiap fase. Pendekatan ini memastikan setiap modul teruji sebelum melanjutkan ke fase berikutnya, dan memungkinkan iterasi cepat jika ada masalah.

### 15.2 Environment Deployment

Sistem akan dijalankan di 3 environment berbeda sepanjang development:

| Environment | Tujuan | Tech Stack | Database | URL |
|---|---|---|---|---|
| **Local Development** | Coding & testing harian | Next.js dev + FastAPI dev | MySQL via Laragon (localhost) | `localhost:3000` + `localhost:8000` |
| **Staging** | Pre-production testing | Vercel preview + Railway preview | Railway MySQL (free) | `preview-moringsuksok.vercel.app` |
| **Production** | Live untuk owner & customer | Vercel + Railway | PlanetScale atau Railway MySQL | `moringsuksok.vercel.app` (frontend) + `api.moringsuksok.railway.app` (backend) |

### 15.3 Local Development Setup

Untuk setup environment local development (yang akan dipakai selama TA):

**Backend (Python FastAPI):**
```bash
# 1. Clone repo
git clone https://github.com/username/moring-suksok.git
cd moring-suksok/backend

# 2. Setup Python venv
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau: venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup .env file (copy dari .env.example)
cp .env.example .env
# Edit .env:
#   DATABASE_URL=mysql+pymysql://root:@localhost:3306/moring_suksok
#   JWT_SECRET=your-secret-key-change-this
#   CLOUDINARY_CLOUD_NAME=xxx
#   CLOUDINARY_API_KEY=xxx
#   CLOUDINARY_API_SECRET=xxx
#   FCM_SERVER_KEY=xxx
#   CORS_ORIGINS=http://localhost:3000

# 5. Setup database MySQL via phpMyAdmin (Laragon)
#    - Buka http://localhost/phpmyadmin
#    - Buat database baru: moring_suksok (collation: utf8mb4_unicode_ci)

# 6. Run migration
alembic upgrade head

# 7. Seed data
python seed.py

# 8. Run server
uvicorn app.main:app --reload --port 8000
# Backend available di http://localhost:8000
# Swagger UI di http://localhost:8000/docs
```

**Frontend (Next.js PWA):**
```bash
# 1. Pindah ke folder frontend
cd ../frontend

# 2. Install dependencies
npm install
# atau: bun install (lebih cepat)

# 3. Setup .env.local
cp .env.example .env.local
# Edit .env.local:
#   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
#   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
#   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
#   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
#   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
#   NEXT_PUBLIC_FIREBASE_APP_ID=xxx
#   NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxx

# 4. Run dev server
npm run dev
# Frontend available di http://localhost:3000
```

**Test Setup Local Berhasil:**
- Buka `http://localhost:3000` → Next.js landing page muncul
- Buka `http://localhost:8000/docs` → Swagger UI muncul dengan list endpoint
- Buka `http://localhost/phpmyadmin` → database `moring_suksok` dengan 9 tabel terlihat

### 15.4 Staging Deployment (Opsional - Pre-Production)

Staging digunakan untuk testing di lingkungan yang mirip production sebelum deploy final. Berguna untuk demo ke dosen pembimbing.

**Backend ke Railway Staging:**
```bash
# 1. Buat Railway account
# 2. Connect GitHub repo
# 3. Pilih folder backend/
# 4. Set environment variables di Railway dashboard
# 5. Auto-deploy saat git push ke branch staging
```

**Frontend ke Vercel Preview:**
```bash
# 1. Push code ke branch staging di GitHub
# 2. Vercel auto-deploy
# 3. Dapat preview URL: https://moring-suksok-staging.vercel.app
```

**Database Staging:**
- Railway MySQL (free tier 5GB)
- Auto-provision saat backend deploy
- Run migration via Railway CLI: `railway run alembic upgrade head`

### 15.5 Production Deployment

Production deployment dilakukan di Minggu 8, setelah semua fitur selesai dan testing di staging lulus.

#### 15.5.1 Frontend → Vercel Production

```bash
# 1. Pastikan code sudah merge ke branch main di GitHub
# 2. Login ke Vercel dashboard
# 3. Import project dari GitHub
# 4. Pilih repo: moring-suksok
# 5. Set Root Directory: frontend
# 6. Set Build Command: npm run build
# 7. Set Output Directory: .next
# 8. Set Environment Variables (production):
#    - NEXT_PUBLIC_API_URL=https://api.moringsuksok.railway.app/api/v1
#    - [Firebase config vars]
# 9. Click "Deploy"
# 10. Dapat URL: https://moringsuksok.vercel.app
# 11. (Opsional) Setup custom domain: moringsuksok.id
```

#### 15.5.2 Backend → Railway Production

```bash
# 1. Login ke Railway dashboard
# 2. New Project → Deploy from GitHub repo
# 3. Pilih repo: moring-suksok
# 4. Set Root Directory: backend
# 5. Set Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
# 6. Add MySQL Database plugin (Railway provision MySQL)
# 7. Set Environment Variables ( Railway dashboard ):
#    - DATABASE_URL=mysql+pymysql://... (auto from Railway MySQL plugin)
#    - JWT_SECRET=your-production-secret
#    - CLOUDINARY_CLOUD_NAME=xxx
#    - [other env vars]
# 8. Deploy
# 9. Dapat URL: https://api.moringsuksok.railway.app
# 10. Run production migration:
#     railway run alembic upgrade head
# 11. Run seed (admin only):
#     railway run python seed.py
# 12. Setup custom domain (opsional): api.moringsuksok.id
```

#### 15.5.3 Database Production

**Option A: Railway MySQL (recommended untuk simplicity)**
- Provision via Railway (auto-attached ke backend)
- Free 5GB untuk hobby plan
- Backup otomatis harian
- Akses via Railway dashboard atau MySQL client

**Option B: PlanetScale (recommended untuk scale)**
- Free tier: 5GB, 1 billion reads/month, 10 million writes/month
- Web GUI mirip phpMyAdmin
- Branching untuk dev/prod
- Lebih canggih tapi setup sedikit lebih kompleks

#### 15.5.4 External Services Production

**Cloudinary:**
- Account: daftar gratis di cloudinary.com
- Free tier: 25 credits (1 credit = 1 GB storage + 1 GB bandwidth)
- Setup credentials di env vars production

**Firebase Cloud Messaging:**
- Buat Firebase project (gratis) di console.firebase.google.com
- Enable Cloud Messaging
- Generate VAPID keys (untuk web push)
- Get server key (untuk backend FCM)
- Setup credentials di env vars production (frontend & backend)

### 15.6 Post-Deployment Checklist

Setelah deployment production, jalankan checklist berikut untuk memastikan sistem operasional:

```markdown
## Production Deployment Checklist

### Frontend (Vercel)
- [ ] Frontend accessible di URL production
- [ ] Landing page load dalam <3 detik
- [ ] Halaman katalog menampilkan produk
- [ ] Halaman register berfungsi
- [ ] Halaman login berfungsi
- [ ] Customer bisa login & redirect ke dashboard
- [ ] PWA installable (Add to Home Screen muncul)
- [ ] Manifest.json accessible (/manifest.json)
- [ ] Service Worker registered (/sw.js)
- [ ] Icons PWA tampil setelah install

### Backend (Railway)
- [ ] Backend accessible di URL production
- [ ] Swagger UI accessible di /docs
- [ ] CORS configured (allow Vercel domain)
- [ ] Database connection established
- [ ] Migration run successfully
- [ ] Seed admin run successfully
- [ ] Endpoint /auth/register return 201
- [ ] Endpoint /auth/login return 200 + token
- [ ] Endpoint /products return list produk

### Database (PlanetScale / Railway MySQL)
- [ ] 9 tabel ter-create (cek via web GUI)
- [ ] Admin account ter-seed (email: admin@moring-suksok.com)
- [ ] Settings ter-seed (business_name: Moring Suksok)
- [ ] Connection string benar di env vars

### External Services
- [ ] Cloudinary upload test berhasil (foto produk)
- [ ] FCM push notif test berhasil (ke admin device)
- [ ] WhatsApp deep link test (wa.me terbuka di WhatsApp)
- [ ] QRIS generation test (scan via DANA)

### End-to-End Test (Happy Path)
- [ ] Customer register → login → tambah cart → checkout → bayar QRIS → upload bukti
- [ ] Owner terima push notif → buka dashboard → verifikasi → update dikirim → update selesai
- [ ] Customer terima push notif setiap status berubah
- [ ] Laporan transaksi muncul dengan data benar
- [ ] Export PDF laporan berhasil download
- [ ] Nota PDF per order berhasil download

### Security Test
- [ ] Endpoint terproteksi return 401 tanpa token
- [ ] Admin endpoint return 403 dengan customer token
- [ ] Password di-hash (cek di database, tidak plain text)
- [ ] File upload valid MIME type (reject file berbahaya)
- [ ] CORS hanya allow domain yang diizinkan
```

### 15.7 Handover ke Owner (Pasca TA)

Setelah TA selesai dan lulus, lakukan handover formal ke owner Moring Suksok:

**Dokumen yang Diserahkan:**
1. Laporan TA lengkap (cetak & soft copy)
2. Source code (GitHub repo access)
3. User Manual (cara pakai dashboard owner)
4. Customer Manual (cara register & belanja)
5. Admin Credentials (email + password)
6. Production URLs (frontend + backend)
7. Cloudinary & Firebase credentials
8. Backup database (export SQL via phpMyAdmin)

**Training Session ke Owner (Recommended):**
- Sesi 1 (1 jam): Demo end-to-end flow + cara login admin
- Sesi 2 (1 jam): Cara kelola produk + verifikasi pembayaran
- Sesi 3 (1 jam): Cara lihat laporan + download nota PDF
- Sesi 4 (30 menit): Cara setup QRIS di settings (jika owner ganti QRIS)

**Support Pasca-Handover (Opsional):**
- Berikan kontak Anda untuk support selama 1 bulan pertama
- Untuk bug kritis → fix gratis
- Untuk feature tambahan → nego biaya (jika owner mau extend)

### 15.8 Maintenance Plan

| Task | Frequency | PIC |
|---|---|---|
| Backup database | Daily (auto Railway) | Railway auto |
| Check error logs | Weekly | Owner / Mahasiswa |
| Update dependencies (security patch) | Monthly | Mahasiswa (selama TA) / Owner (pasca) |
| Monitor Cloudinary quota | Monthly | Owner |
| Monitor Railway/PlanetScale usage | Monthly | Owner |
| Renew domain (jika pakai custom) | Annual | Owner |

---

## PENUTUP DOKUMEN PERENCANAAN

Dokumen perencanaan ini merupakan output Tahap 1 dari 3 tahap proyek (Perencanaan → Development → Deployment). Dokumen ini menjadi acuan formal untuk eksekusi development di Tahap 2 dan deployment di Tahap 3.

### Next Steps

1. **Review Dokumen**: Anda review dokumen perencanaan ini bersama dosen pembimbing untuk mendapatkan feedback
2. **Approval & Sign-off**: Setelah disetujui, dokumen ini menjadi baseline untuk development
3. **Mulai Tahap 2 (Development)**: Eksekusi milestone Minggu 1 (Project Setup & Database Design)
4. **Iterasi jika perlu**: Jika ada perubahan requirement selama development, update dokumen ini (version control)

### Ringkasan Keputusan Final

| Dimensi | Keputusan |
|---|---|
| Mitra | Moring Suksok (UMKM snack kripik moring) |
| Produk | Snack/Kripik Moring dengan varian |
| Customer | Ritel & Masyarakat (label segmentasi untuk analisis) |
| Harga | Sama rata untuk semua segmen |
| Pembayaran | QRIS Dinamis (self-generated) + Upload Bukti + Verifikasi Manual Owner |
| Registrasi | Customer wajib registrasi akun |
| Notifikasi | Hybrid: Push Notification PWA (FCM) + WhatsApp Deep Link (wa.me) |
| Tech Stack | Frontend: Next.js PWA; Backend: Python FastAPI; Database: MySQL + phpMyAdmin |
| Timeline | 8 minggu development + 1 minggu buffer |
| Output TA | Aplikasi PWA installable di Android + Web + Dokumen Laporan |

---

**Dokumen ini ditandatangani sebagai baseline perencanaan proyek.**

| Pihak | Nama | Tanggal |
|---|---|---|
| Mahasiswa (Anda) | _______________________ | 2026-10-29 |
| Dosen Pembimbing | _______________________ | ____________ |

**Versi Dokumen:**
- v1.0 (2026-10-29): Initial draft — disusun setelah sesi clarifikasi requirements dengan mahasiswa

---

**End of Planning Document — Ready for Phase 2: Development** 🚀
