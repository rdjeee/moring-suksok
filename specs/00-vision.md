# 00 — Vision Document
# Sistem Distribusi & Pencatatan Transaksi Produk Moring Suksok

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Source**: Dokumen Perencanaan Bab 1 & 3

---

## 1. Ringkasan Visi

Membangun **sistem distribusi produk berbasis mini e-commerce** untuk UMKM **Moring Suksok**, sebuah bisnis camilan cimol kering (cimol kering (moring)) yang saat ini masih melakukan transaksi melalui WhatsApp dan pencatatan manual menggunakan nota. Sistem yang dibangun bertujuan untuk **menggantikan proses pemesanan via WhatsApp** dengan aplikasi terstruktur, serta **menggantikan nota manual** dengan pencatatan transaksi digital otomatis yang dapat berfungsi sebagai pembukuan akuntan.

Sistem dibangun dengan **arsitektur decoupled** (Frontend-Backend terpisah): Frontend menggunakan Next.js PWA yang dapat diinstall di Android dan berjalan di web browser, sedangkan Backend menggunakan Python FastAPI dengan database MySQL yang dikelola melalui phpMyAdmin. Pendekatan ini dipilih untuk memberikan separation of concerns yang jelas, memudahkan maintenance, serta memanfaatkan ekosistem Python yang kuat untuk pengembangan API modern.

## 2. Profil Mitra

| Item | Detail |
|---|---|
| Nama Mitra | Moring Suksok |
| Jenis Usaha | UMKM Camilan Khas (Cimol Kering / Moring) |
| Usia Owner | 40 Tahun |
| Produk Utama | Cimol Kering (Moring) dengan beberapa varian rasa |
| Customer | Ritel (toko/agen) & Masyarakat (konsumen akhir) |
| Cara Penjualan Saat Ini | Pemesanan via WhatsApp + nota manual |
| Skala Bisnis | Lokal kecil (<100 customer aktif, <50 order/bulan) |
| Timeline TA | 8 minggu development + 1 minggu buffer |

## 3. Highlight Fitur Utama

Sistem akan memiliki fitur-fitur kunci sebagai berikut:

1. **Registrasi akun wajib** untuk customer dengan segmentasi Ritel/Masyarakat sebagai label analisis
2. **Katalog produk** dengan varian dan harga yang sama untuk semua segmen customer
3. **Keranjang belanja (cart)** dengan kalkulasi total otomatis
4. **Pembayaran via QRIS dinamis** (nominal embedded) yang difoto dan di-upload sebagai bukti
5. **Verifikasi pembayaran manual** oleh owner
6. **Tracking status pesanan end-to-end** (Pending → Diproses → Dikirim → Selesai)
7. **Notifikasi hybrid** (Push Notification PWA + WhatsApp deep link)
8. **Laporan transaksi otomatis** dengan ekspor PDF/Excel untuk pembukuan akuntan
9. **PWA yang installable** di Android (Add to Home Screen)

## 4. Tujuan Umum

Membangun sistem distribusi produk dan pencatatan transaksi berbasis aplikasi web (PWA) yang dapat diinstall di perangkat Android dan diakses via browser, khusus untuk UMKM Moring Suksok, yang menggantikan proses pemesanan via WhatsApp dan pencatatan manual menggunakan nota.

## 5. Tujuan Khusus

1. Membangun mini e-commerce untuk Moring Suksok dengan fitur katalog produk, keranjang belanja, checkout, dan pembayaran yang dapat diakses oleh customer Ritel maupun Masyarakat melalui registrasi akun terlebih dahulu
2. Mengimplementasikan pembayaran via QRIS dinamis dengan nominal embedded (sesuai standar EMVCo QRIS) yang dapat di-scan menggunakan berbagai e-wallet (DANA, OVO, GoPay, SeaBank, ShopeePay, m-banking), dengan mekanisme upload bukti pembayaran dan verifikasi manual oleh owner
3. Menggantikan nota manual dengan nota digital otomatis yang ter-generate setiap checkout, lengkap dengan order ID unik, timestamp, detail items, customer info, total transaksi, dan dapat diekspor ke PDF untuk pembukuan akuntan
4. Memantau distribusi produk melalui tracking status pesanan dengan state machine yang jelas (Pending → Diproses → Dikirim → Selesai), dapat dipantau oleh customer secara real-time dan oleh owner melalui dashboard terpusat
5. Mengimplementasikan notifikasi hybrid dengan Push Notification PWA (otomatis via Firebase Cloud Messaging) sebagai primary channel, dan WhatsApp deep link (wa.me) sebagai backup/secondary
6. Memberikan segmentasi customer Ritel/Masyarakat sebagai label analisis untuk keperluan laporan owner, tanpa membedakan harga atau flow belanja
7. Membangun Progressive Web App (PWA) yang installable di perangkat Android (Add to Home Screen) sehingga customer dapat mengakses aplikasi seperti native app tanpa harus mendownload dari Play Store

## 6. Manfaat Sistem

### Manfaat bagi Owner Moring Suksok
- Menghemat waktu administratif (tidak perlu buat nota manual, tidak perlu cari status di chat WhatsApp)
- Memiliki data terstruktur untuk pembukuan akuntan (bisa export PDF/Excel per periode)
- Mendapat visibility terhadap distribusi produk (status setiap pesanan)
- Mendapat insight analitik (persentase penjualan Ritel vs Masyarakat, produk terlaris, dst.)
- Membangun aset digital yang dapat di-scale untuk ekspansi bisnis

### Manfaat bagi Customer Ritel & Masyarakat
- Dapat melihat katalog produk secara mandiri tanpa harus tanya owner via WhatsApp
- Dapat melihat riwayat pesanan dan repeat order dengan mudah
- Dapat tracking status pesanan real-time tanpa harus menanyakan ulang
- Mendapat notifikasi otomatis saat status pesanan berubah
- Dapat memilih e-wallet favorit untuk pembayaran via QRIS

### Manfaat Akademik (untuk Tugas Akhir)
- Mendemonstrasikan implementasi arsitektur decoupled (Frontend-Backend terpisah)
- Mengimplementasikan standar EMVCo QRIS dengan modifikasi payload
- Menggunakan Python FastAPI dengan auto-generated Swagger documentation
- Mengimplementasikan PWA dengan service worker dan push notification
- Menganalisis trade-off teknis-vs-biaya pada pemilihan solusi teknologi

## 7. Stakeholder Utama

| # | Stakeholder | Kepentingan |
|---|---|---|
| 1 | Owner Moring Suksok | Operasional harian, pembukuan, keputusan strategis |
| 2 | Customer Ritel | Pemesanan grosir, riwayat, repeat order |
| 3 | Customer Masyarakat | Pemesanan eceran, tracking pesanan |
| 4 | Mahasiswa (Anda) | Penyelesaian TA |
| 5 | Dosen Pembimbing | Validasi metodologi |
| 6 | Dosen Penguji | Evaluasi implementasi |
| 7 | Akuntan/Keuangan | Menerima laporan digital terstruktur |

## 8. Lingkungan Operasional

- **Local Development**: Laragon (MySQL 8.4.3 + phpMyAdmin 6.2.3) + Next.js dev + FastAPI dev
- **Staging** (opsional): Vercel preview + Railway preview
- **Production**: Vercel (frontend) + Railway/Render (backend) + PlanetScale/Railway MySQL
- **External Services**: Cloudinary, Firebase Cloud Messaging, WhatsApp Deep Link

## 9. Out-of-Scope (Quick Reference)

Untuk detail lengkap, lihat `01-requirements.md` § 4.2. Singkatnya: native app, payment gateway berbayar, WhatsApp Business API otomatis, loyalty program, wishlist, review produk, multi-vendor, integrasi kurir otomatis, auto-calculate ongkir, inventory management advanced, multi-admin, multi-currency, multi-language, live chat, coupon system.

## 10. Definition of Done (Proyek)

Proyek dinyatakan selesai ketika:

1. ✅ Semua fitur MVP (priority "Must" di `03-features.json`) terimplementasi
2. ✅ Sistem di-deploy ke production (Vercel + Railway/Render)
3. ✅ PWA installable di Android dengan push notification berfungsi
4. ✅ Dokumentasi user untuk owner lengkap (README + User Manual)
5. ✅ Dokumen laporan TA siap untuk sidang
6. ✅ Handover formal ke owner Moring Suksok

---

**End of 00-vision.md**
