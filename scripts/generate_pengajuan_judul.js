// Generate Word Document: Rencana Pengajuan Judul Tugas Akhir
// Moring Suksok Project — Template-following document for lecturer submission

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak, LevelFormat,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  TableLayoutType, NumberFormat, SectionType
} = require("docx");
const fs = require("fs");

// ============ PALETTE & CONSTANTS ============
const P = {
  primary: "000000",
  body: "000000",
  secondary: "404040",
  accent: "2D6A4F",  // Moring green
  surface: "F5F7FA",
  bg: "FFFFFF",
};

function c(hex) { return hex.replace("#", ""); }

// ============ HELPER FUNCTIONS ============

function bodyPara(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 360, after: 0 },
    children: [new TextRun({
      text, size: 24, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimSun" }
    })],
    ...opts
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 240, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({
      text, bold: true, size: 32, color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({
      text, bold: true, size: 28, color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  });
}

function numberedItem(num, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 720, hanging: 480 },
    spacing: { line: 360, after: 0 },
    children: [new TextRun({
      text: `${num}. ${text}`, size: 24, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimSun" }
    })],
  });
}

// ============ COVER PAGE ============

function buildCover() {
  const children = [];

  // Top spacing
  children.push(new Paragraph({ spacing: { before: 2000 } }));

  // Title
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360, line: 480 },
    children: [new TextRun({
      text: "RENCANA PENGAJUAN JUDUL",
      bold: true, size: 44, color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 1200, line: 480 },
    children: [new TextRun({
      text: "TUGAS AKHIR",
      bold: true, size: 44, color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  }));

  // Divider
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: c(P.accent), space: 4 } },
    spacing: { after: 800 },
    children: [new TextRun({ text: "" })],
  }));

  // Dosen Pembimbing
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 360 },
    children: [new TextRun({
      text: "Dosen Pembimbing:",
      size: 26, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimSun" }
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80, line: 360 },
    children: [new TextRun({
      text: "Nurfitria Khoirunnisa, S.Tr.Kom., M.Kom.",
      bold: true, size: 28, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimSun" }
    })],
  }));

  children.push(new Paragraph({ spacing: { before: 800 } }));

  // Disusun Oleh
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 360 },
    children: [new TextRun({
      text: "Disusun Oleh:",
      size: 26, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimSun" }
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60, line: 360 },
    children: [new TextRun({
      text: "Raid Javier Julian",
      bold: true, size: 28, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimSun" }
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 800, line: 360 },
    children: [new TextRun({
      text: "NIM: 10601027",
      size: 26, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimSun" }
    })],
  }));

  // Bottom divider
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: c(P.accent), space: 4 } },
    spacing: { after: 800 },
    children: [new TextRun({ text: "" })],
  }));

  // Program Studi
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 360 },
    children: [new TextRun({
      text: "PROGRAM STUDI D4 TEKNOLOGI REKAYASA PERANGKAT LUNAK",
      bold: true, size: 24, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 360 },
    children: [new TextRun({
      text: "JURUSAN TEKNOLOGI INFORMASI DAN KOMPUTER",
      bold: true, size: 24, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 360 },
    children: [new TextRun({
      text: "POLITEKNIK NEGERI SUBANG",
      bold: true, size: 28, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 360 },
    children: [new TextRun({
      text: "TAHUN 2026",
      bold: true, size: 26, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  }));

  return children;
}

// ============ BODY CONTENT ============

function buildBody() {
  const children = [];

  // ============ Rencana Judul ============
  children.push(h1("Rencana Judul"));
  children.push(new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 360, after: 240 },
    children: [new TextRun({
      text: "Rancang Bangun Sistem Distribusi dan Pencatatan Transaksi Produk UMKM Moring Suksok Berbasis Progressive Web App dengan Verifikasi Pembayaran QRIS dan Notifikasi Otomatis",
      bold: true, size: 26, color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "SimSun" }
    })],
  }));

  // ============ Latar Belakang Masalah ============
  children.push(h1("Latar Belakang Masalah"));

  children.push(bodyPara("UMKM Moring Suksok merupakan usaha pengolahan produk berbahan dasar daun kelor (moringa) dengan produk utama berupa snack/kripik moring yang memiliki beberapa varian rasa. Usaha ini dimiliki oleh seorang pengusaha berusia 40 tahun dan melayani dua jenis pelanggan, yaitu Customer Ritel (toko/agen yang membeli untuk dijual ulang) dan Customer Masyarakat (konsumen akhir yang membeli untuk konsumsi pribadi)."));

  children.push(bodyPara("Saat ini, proses penjualan masih dilakukan secara konvensional. Pelanggan menghubungi pemilik usaha melalui WhatsApp untuk melakukan pemesanan, kemudian pemilik mencatat transaksi pada nota manual sebagai bukti pembelian dan pembukuan akuntan. Pendekatan ini telah berjalan cukup lama, namun seiring bertambahnya jumlah pelanggan dan kompleksitas transaksi, muncul berbagai kendala operasional yang perlu diatasi."));

  children.push(bodyPara("Berdasarkan observasi awal yang dilakukan terhadap proses bisnis Moring Suksok, beberapa potensi masalah yang ditemukan adalah sebagai berikut:"));

  children.push(numberedItem(1, "Pencatatan transaksi manual yang tidak terstruktur: Pemilik mencatat setiap transaksi pada nota manual, baik yang dijual ke customer Ritel maupun Masyarakat. Pencatatan ini rentan terhadap human error (salah catat jumlah, varian, atau harga), sulit dilakukan rekapitulasi bulanan, dan tidak ada backup digital jika nota hilang atau rusak. Untuk keperluan pembukuan akuntan, pemilik harus memilah-milah nota satu per satu yang memakan waktu berjam-jam setiap akhir bulan."));

  children.push(numberedItem(2, "Tidak ada pemantauan distribusi produk: Pemilik tidak memiliki visibility terhadap pergerakan distribusi produknya. Tidak ada data historis tentang pesanan mana yang sedang diproses, mana yang sudah dikirim, dan mana yang sudah selesai. Status pesanan hanya tersimpan di chat WhatsApp yang sulit ditelusuri, sehingga customer sering menanyakan ulang status pesanan mereka dan pemilik harus mencari manual di chat."));

  children.push(numberedItem(3, "Tidak ada sistem pemesanan terstruktur: Customer harus menghubungi pemilik via WhatsApp untuk setiap pemesanan, yang seringkali terjadi miscommunication terkait varian produk, jumlah, dan harga. Tidak ada katalog produk yang dapat diakses customer secara mandiri, sehingga pemilik harus mengirim foto produk dan penjelasan via WhatsApp berulang-ulang ke setiap customer baru."));

  children.push(numberedItem(4, "Tidak ada segmentasi customer yang jelas: Pemilik secara informal membedakan customer Ritel dan Masyarakat, namun tidak ada data terstruktur tentang persentase penjualan dari masing-masing segmen. Hal ini menyulitkan pemilik dalam pengambilan keputusan strategis seperti penentuan stok, promo khusus, atau target market yang lebih potensial untuk diekspansi."));

  children.push(numberedItem(5, "Pembayaran tidak terdokumentasi: Saat customer membayar via transfer ke DANA pemilik atau scan QRIS statis, pemilik harus memverifikasi manual melalui mutasi rekening. Tidak ada audit trail digital yang menghubungkan pembayaran dengan pesanan tertentu, sehingga sulit untuk rekonsiliasi jika ada sengketa atau pertanyaan dari customer di kemudian hari."));

  children.push(bodyPara("Berdasarkan potensi permasalahan tersebut, diusulkan pengembangan sistem informasi berbasis Progressive Web App (PWA) yang mengintegrasikan pencatatan katalog produk, keranjang belanja, checkout, pembayaran QRIS dinamis dengan upload bukti, verifikasi oleh pemilik, pemantauan status pesanan, notifikasi otomatis, serta penyusunan laporan transaksi otomatis. Kebutuhan akhir sistem akan ditetapkan berdasarkan hasil pengumpulan data di lokasi mitra yang menjadi objek penelitian."));

  // ============ Analisis yang sudah dilakukan ============
  children.push(h1("Analisis yang sudah dilakukan"));

  children.push(bodyPara("Analisis yang telah dilakukan pada tahap pengajuan ini terbatas pada penelaahan ketentuan tugas akhir, kajian awal regulasi dan standar industri terkait QRIS (Quick Response Code Indonesian Standard), serta penyusunan model kebutuhan sistem. Observasi lapangan dan wawancara mendalam pada mitra UMKM Moring Suksok telah dilakukan secara awal untuk memahami alur bisnis existing yang berjalan."));

  // Analisis Objek dan Batas Proses
  children.push(h2("Analisis Objek dan Batas Proses"));

  children.push(bodyPara("Objek yang dikelola adalah produk olahan daun kelor (snack/kripik moring) beserta varian yang dimiliki, transaksi pemesanan dari customer, serta bukti pembayaran yang perlu diverifikasi."));

  children.push(bodyPara("Satu pesanan dapat memiliki lebih dari satu item produk dengan varian berbeda. Sebagai contoh, satu pesanan dapat berisi 2 pack Kripik Moring Original 100gr dan 1 pack Kripik Moring Pedas 250gr dengan total harga yang dihitung otomatis oleh sistem."));

  children.push(bodyPara("Aplikasi tidak menggantikan proses produksi atau manajemen stok bahan baku, tidak menangani pengesahan legal dokumen, dan tidak melakukan akuntansi lengkap (pajak, laba-rugi). Aplikasi hanya membantu pencatatan transaksi, verifikasi pembayaran, pemantauan distribusi produk jadi, serta penyusunan laporan dasar untuk pembukuan akuntan."));

  // Analisis Pengguna dan Hak Akses
  children.push(h2("Analisis Pengguna dan Hak Akses"));

  children.push(bodyPara("Rancangan awal mencakup tiga peran berikut:"));

  children.push(numberedItem(1, "Admin/Owner (Pemilik Moring Suksok): Mengelola data produk dan varian, melihat semua pesanan masuk, memverifikasi pembayaran, memperbarui status pesanan, menginput nomor resi pengiriman, mengunduh laporan transaksi, serta mengelola pengaturan sistem (QRIS statis pemilik, info bisnis, ongkir default)."));

  children.push(numberedItem(2, "Customer Ritel: Pelanggan pemilik toko/agen yang melakukan registrasi akun, browse katalog produk, menambah produk ke keranjang, checkout, melakukan pembayaran via QRIS dinamis, mengunggah bukti pembayaran, serta melacak status pesanan. Tidak dapat melihat pesanan customer lain atau mengakses dashboard admin."));

  children.push(numberedItem(3, "Customer Masyarakat: Pelanggan konsumen akhir dengan flow belanja yang identik dengan Customer Ritel, hanya berbeda pada label segmentasi yang digunakan untuk analisis penjualan pemilik (untuk keperluan laporan dan pengambilan keputusan strategis)."));

  // Analisis Proses Bisnis Utama
  children.push(h2("Analisis Proses Bisnis Utama"));

  children.push(bodyPara("Proses bisnis yang direncanakan adalah pengelolaan siklus distribusi produk dari pemesanan hingga penyelesaian:"));

  children.push(numberedItem(1, "Registrasi dan Login: Customer melakukan registrasi dengan data nama, email, nomor WhatsApp, alamat, dan segmen (Ritel/Masyarakat). Sistem memberikan JWT token untuk autentikasi (Hasil: Customer terdaftar dan dapat login)."));

  children.push(numberedItem(2, "Browse Katalog: Customer melihat daftar produk aktif dengan filter dan pencarian berdasarkan nama produk dan kategori (Hasil: Customer memilih produk yang ingin dibeli)."));

  children.push(numberedItem(3, "Keranjang Belanja: Customer menambahkan produk dengan pilihan varian dan quantity ke keranjang, dapat mengedit jumlah dan menghapus item. Sistem menghitung subtotal, ongkir flat, dan total secara otomatis (Hasil: Daftar item yang akan dibeli beserta total harga)."));

  children.push(numberedItem(4, "Checkout: Customer mengkonfirmasi alamat pengiriman, metode pengiriman (pickup/delivery), dan catatan untuk pemilik. Sistem membuat order dengan kode unik (format: ORD-YYYYMMDD-XXX) dan menyimpan snapshot data produk beserta harga saat checkout untuk menjaga integritas data historis (Hasil: Pesanan tersimpan dengan status pending)."));

  children.push(numberedItem(5, "Pembayaran QRIS Dinamis: Sistem generate QR code dengan nominal embedded sesuai standar EMVCo QRIS. Customer scan QR via e-wallet (DANA/OVO/GoPay/SeaBank/ShopeePay/m-banking), bayar sesuai nominal yang tertera, lalu upload screenshot bukti pembayaran ke sistem (Hasil: Bukti pembayaran tersimpan di Cloudinary, status pesanan menunggu verifikasi)."));

  children.push(numberedItem(6, "Verifikasi Pembayaran: Pemilik menerima notifikasi push notification, melihat detail pesanan dan bukti pembayaran, lalu mengonfirmasi \"Lunas\" atau \"Tolak\" dengan alasan. Jika ditolak, customer dapat upload ulang bukti pembayaran (Hasil: Status pesanan menjadi Diproses atau Dibatalkan)."));

  children.push(numberedItem(7, "Pengiriman: Pemilik mempersiapkan dan mengemas produk, menginput nomor resi kurir, lalu update status menjadi Dikirim. Customer menerima notifikasi otomatis via Push Notification PWA dan/atau WhatsApp deep link (Hasil: Status pesanan menjadi Dikirim dengan nomor resi)."));

  children.push(numberedItem(8, "Penyelesaian: Setelah customer menerima produk, pemilik update status menjadi Selesai. Transaksi otomatis tercatat di laporan sebagai transaksi selesai untuk pembukuan akuntan (Hasil: Pesanan selesai, transaksi tercatat untuk laporan)."));

  // Analisis Status dan Aturan Bisnis
  children.push(h2("Analisis Status dan Aturan Bisnis"));

  children.push(bodyPara("Status utama yang diusulkan meliputi: Pending (Menunggu Verifikasi), Diproses, Dikirim, Selesai, dan Dibatalkan. Status ini mengikuti state machine yang jelas dengan transisi yang tidak dapat di-skip (kecuali cancel dari pending). Aturan bisnis awal meliputi:"));

  children.push(numberedItem(1, "Customer wajib melakukan registrasi akun sebelum dapat melakukan pemesanan."));
  children.push(numberedItem(2, "Harga produk sama untuk semua segmen customer (Ritel & Masyarakat), pembeda hanya label segmentasi untuk analisis."));
  children.push(numberedItem(3, "Status pesanan mengikuti state machine: Pending → Diproses → Dikirim → Selesai, atau Pending → Dibatalkan (jika pembayaran ditolak)."));
  children.push(numberedItem(4, "Status final (Selesai/Dibatalkan) tidak dapat diubah kembali untuk menjaga integritas data historis."));
  children.push(numberedItem(5, "Pembayaran via QRIS dinamis menggunakan QRIS statis pemilik yang dimodifikasi dengan inject nominal sesuai standar EMVCo."));
  children.push(numberedItem(6, "Verifikasi pembayaran wajib dilakukan oleh pemilik (admin), tidak otomatis, karena tidak ada integrasi dengan payment gateway berbayar yang menyediakan webhook."));
  children.push(numberedItem(7, "Penolakan pembayaran wajib disertai alasan yang jelas untuk transparansi kepada customer."));
  children.push(numberedItem(8, "Snapshot data produk (nama, varian, harga) disimpan saat checkout untuk menjaga integritas data historis meskipun produk diubah atau dihapus di kemudian hari."));
  children.push(numberedItem(9, "Notifikasi perubahan status pesanan dikirim via Push Notification PWA (primary channel) dan WhatsApp deep link wa.me (backup channel) untuk customer yang belum install PWA."));
  children.push(numberedItem(10, "Pemilik dapat mengupdate QRIS statis melalui halaman settings bila QRIS owner mengalami perubahan."));
  children.push(numberedItem(11, "Ongkir menggunakan tarif flat yang dapat dikonfigurasi oleh pemilik melalui halaman settings."));
  children.push(numberedItem(12, "Perubahan penting (verifikasi pembayaran, update status, input nomor resi) dicatat bersama identitas pengguna dan timestamp."));

  // Analisis Kebutuhan Data
  children.push(h2("Analisis Kebutuhan Data"));

  children.push(bodyPara("Data utama yang direncanakan meliputi: data admin/owner (login credentials), data customer (dengan segmen Ritel/Masyarakat dan Firebase Cloud Messaging token untuk push notification), data produk (dengan deskripsi, harga, foto), data varian produk (nama varian dan stok), data pesanan (header dengan kode unik, alamat pengiriman, total), data detail item pesanan (snapshot produk+varian+harga saat checkout), data pembayaran (method QRIS/manual transfer, raw QRIS payload, URL bukti upload, status verifikasi), data notifikasi (log push notif dan WhatsApp deep link), serta data pengaturan sistem (settings: QRIS statis pemilik, nomor DANA, info bisnis, ongkir default)."));

  // ============ Rencana Solusi ============
  children.push(h1("Rencana Solusi"));

  children.push(bodyPara("Solusi yang direncanakan adalah aplikasi Progressive Web App (PWA) terpusat untuk mengelola distribusi dan pencatatan transaksi produk Moring Suksok, dengan arsitektur decoupled antara frontend (Next.js PWA) dan backend (Python FastAPI):"));

  children.push(numberedItem(1, "Pengelolaan katalog produk: Sistem menyediakan pencatatan produk dengan varian (rasa/ukuran), harga, foto, dan stok. Pemilik dapat menambah, mengedit, dan menghapus produk melalui dashboard admin. Foto produk diunggah dan disimpan di Cloudinary untuk optimasi CDN."));

  children.push(numberedItem(2, "Pemesanan terstruktur: Customer dapat melakukan registrasi akun, browse katalog produk, menambahkan produk ke keranjang dengan pilihan varian dan quantity, melakukan checkout dengan konfirmasi alamat pengiriman dan catatan. Sistem otomatis generate kode pesanan unik (format ORD-YYYYMMDD-XXX) serta menyimpan snapshot data produk untuk menjaga integritas data historis."));

  children.push(numberedItem(3, "Pembayaran QRIS dinamis: Sistem generate QR code dengan nominal embedded sesuai standar EMVCo QRIS, menggunakan QRIS statis pemilik yang dimodifikasi dengan inject transaction amount dan recalculate CRC16 checksum. Customer dapat scan QR menggunakan berbagai e-wallet (DANA, OVO, GoPay, SeaBank, ShopeePay, m-banking) dengan nominal yang otomatis terisi. Customer kemudian upload bukti pembayaran, dan pemilik melakukan verifikasi manual melalui dashboard."));

  children.push(numberedItem(4, "Pemantauan status pesanan: Customer dapat melacak status pesanan secara real-time dengan timeline visual (Pending → Diproses → Dikirim → Selesai). Pemilik dapat update status dan input nomor resi pengiriman melalui dashboard admin. Setiap perubahan status tercatat dengan timestamp dan identitas pengguna."));

  children.push(numberedItem(5, "Notifikasi hybrid: Push Notification otomatis via Firebase Cloud Messaging (FCM) sebagai channel utama untuk menginformasikan perubahan status pesanan kepada customer dan notifikasi pesanan baru kepada pemilik. WhatsApp deep link (wa.me) sebagai backup channel untuk customer yang belum menginstall PWA atau menolak permission notifikasi."));

  children.push(numberedItem(6, "Laporan transaksi otomatis: Sistem otomatis mencatat setiap transaksi yang terverifikasi dan menyediakan laporan harian, mingguan, dan bulanan dengan filter berdasarkan segmen customer (Ritel/Masyarakat) dan status pembayaran. Pemilik dapat mengunduh laporan dalam format PDF atau Excel, serta mengunduh nota PDF per pesanan untuk pembukuan akuntan."));

  children.push(numberedItem(7, "Segmentasi customer: Customer memilih segmen (Ritel/Masyarakat) saat registrasi. Sistem menyediakan analitik persentase penjualan per segmen untuk membantu pemilik mengambil keputusan strategis terkait target market dan stok produk."));

  children.push(numberedItem(8, "PWA installable: Aplikasi dapat diinstall di perangkat Android melalui fitur \"Add to Home Screen\" tanpa perlu download dari Play Store, sehingga customer dapat mengakses aplikasi seperti native app. Service worker memungkinkan offline caching untuk halaman utama dan push notification di background."));

  children.push(bodyPara("Batasan pengembangan: Diterapkan untuk satu UMKM (Moring Suksok) dengan skala lokal kecil (di bawah 100 customer aktif), berfokus pada produk olahan daun kelor (snack/kripik), tidak mencakup integrasi payment gateway berbayar (Midtrans/Xendit/Faspay) dengan biaya admin per transaksi, tidak mencakup WhatsApp Business API otomatis (Fonnte/Wablas) yang berbayar per pesan dan cukup menggunakan deep link wa.me sebagai alternatif gratis, tidak mencakup auto-calculate ongkir berdasarkan jarak (RajaOngkir/Binderbyte), tidak mencakup inventory management advanced dengan alert stok otomatis, tidak mencakup multi-vendor/multi-seller, serta tidak mencakup fitur loyalty program, wishlist, review produk, dan coupon system."));

  // ============ Referensi ============
  children.push(h1("Referensi"));

  // References with hanging indent (APA-like format)
  function refPara(text) {
    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 720, hanging: 720 },
      spacing: { line: 360, after: 120 },
      children: [new TextRun({
        text, size: 24, color: c(P.body),
        font: { ascii: "Times New Roman", eastAsia: "SimSun" }
      })],
    });
  }

  children.push(refPara("Bank Indonesia. (2019). Quick Response Code Indonesian Standard (QRIS): Standar Nasional Pembayaran Berbasis QR Code. https://www.qris.id"));
  children.push(refPara("EMVCo. (2019). EMVCo Specifications for QR Code: Merchant-Presented Mode. https://www.emvco.com"));
  children.push(refPara("Kementerian Koperasi dan UKM Republik Indonesia. (2021). Rencana Aksi Nasional Pengembangan Ekosistem Ekonomi Digital untuk UMKM. Sekretariat Kementerian Koperasi dan UKM."));
  children.push(refPara("Primandaru, B., & Kusdarini, E. (2021). Penyelenggaraan musyawarah desa Trikarso Kecamatan Sruweng Kabupaten Kebumen. E-CIVICS: Journal Student UNY, 10(4), 422–431."));
  children.push(refPara("Susanto, A., & Sutrisno, B. (2020). Penerapan E-Commerce pada UMKM sebagai Upaya Peningkatan Daya Saing di Era Digital. Jurnal Manajemen dan Inovasi, 10(2), 145–156."));
  children.push(refPara("World Wide Web Consortium (W3C). (2022). Progressive Web Apps Specification. https://www.w3.org/community/pwa/"));

  return children;
}

// ============ MAIN DOCUMENT ASSEMBLY ============

const doc = new Document({
  creator: "Raid Javier Julian",
  title: "Rencana Pengajuan Judul Tugas Akhir - Moring Suksok",
  description: "Pengajuan Judul Tugas Akhir untuk mitra UMKM Moring Suksok",
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimSun" }, size: 24, color: "000000" },
        paragraph: { spacing: { line: 360 } },
      },
      heading1: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 32, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 360, after: 240, line: 360 } },
      },
      heading2: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 28, bold: true, color: "000000" },
        paragraph: { spacing: { before: 240, after: 120, line: 360 } },
      },
    },
  },
  sections: [
    // SECTION 1: COVER PAGE
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 }
        }
      },
      children: buildCover()
    },
    // SECTION 2: BODY (Arabic numerals, start from 1)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417, header: 850, footer: 992 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL }
        }
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              children: [PageNumber.CURRENT], size: 20,
              font: { ascii: "Times New Roman" }
            })]
          })]
        })
      },
      children: buildBody()
    }
  ]
});

// Generate the document
Packer.toBuffer(doc).then(buf => {
  const outputPath = "/home/z/my-project/download/Pengajuan_Judul_TA_Moring_Suksok.docx";
  fs.writeFileSync(outputPath, buf);
  console.log("✅ Document generated successfully!");
  console.log("   Path:", outputPath);
  console.log("   Size:", (buf.length / 1024).toFixed(2), "KB");
}).catch(err => {
  console.error("❌ Error generating document:", err);
  process.exit(1);
});
