// Generate Word Document for Moring Suksok Planning Document
// Converting Markdown to professional .docx for TA report to advisor

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak, LevelFormat,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  TableLayoutType, TableOfContents, NumberFormat, SectionType
} = require("docx");
const fs = require("fs");

// ============ PALETTE & CONSTANTS ============
// Using ACADEMIC palette (Cool + Heavy + Calm) — clean professional for TA
const P = {
  primary: "000000",
  body: "000000",
  secondary: "404040",
  accent: "529286",        // soft teal (DS-1 accent)
  surface: "F5F7FA",
  bg: "FFFFFF",
  titleColor: "FFFFFF",
  subtitleColor: "B0B8C0",
  metaColor: "90989F",
  footerColor: "687078",
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { ...noBorders, insideHorizontal: NB, insideVertical: NB };

// ============ HELPER FUNCTIONS ============
function c(hex) { return hex.replace("#", ""); }

// Convert markdown to paragraphs/text runs
function parseInline(text) {
  // Handle **bold**, `code`, [link](url) → simplified
  const parts = [];
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIdx = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push({ text: text.slice(lastIdx, m.index), bold: false, italic: false });
    }
    if (m[2]) parts.push({ text: m[2], bold: true });
    else if (m[3]) parts.push({ text: m[3], italic: true, code: true });
    else if (m[4]) parts.push({ text: m[4], link: true });
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) parts.push({ text: text.slice(lastIdx), bold: false });
  return parts.filter(p => p.text.length > 0);
}

function makeRun(part, baseSize = 22) {
  return new TextRun({
    text: part.text,
    bold: part.bold || false,
    italics: part.italic || false,
    size: baseSize,
    color: c(P.body),
    font: { ascii: "Times New Roman", eastAsia: "SimSun" }
  });
}

function bodyPara(text, opts = {}) {
  const parts = parseInline(text);
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312, after: 120 },
    children: parts.map(p => makeRun(p, 22)),
    ...opts
  });
}

function bulletPara(text, level = 0) {
  const parts = parseInline(text);
  return new Paragraph({
    bullet: { level: level },
    spacing: { line: 312, after: 60 },
    children: parts.map(p => makeRun(p, 22))
  });
}

function numberedPara(text, level = 0) {
  const parts = parseInline(text);
  return new Paragraph({
    numbering: { reference: "default-numbering", level: level },
    spacing: { line: 312, after: 60 },
    children: parts.map(p => makeRun(p, 22))
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 360, line: 360 },
    children: [new TextRun({
      text, bold: true, size: 32, color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 240, line: 360 },
    children: [new TextRun({
      text, bold: true, size: 30, color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120, line: 360 },
    children: [new TextRun({
      text, bold: true, size: 28, color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  });
}

function h4(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_4,
    spacing: { before: 180, after: 100, line: 312 },
    children: [new TextRun({
      text, bold: true, size: 24, color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })],
  });
}

// Code block paragraph (monospace, gray bg, no indent)
function codePara(text) {
  return new Paragraph({
    spacing: { line: 280, before: 60, after: 60 },
    indent: { left: 480 },
    shading: { type: ShadingType.CLEAR, fill: "F4F4F4" },
    children: [new TextRun({
      text, size: 18, color: "333333",
      font: { ascii: "Courier New", eastAsia: "SimSun" }
    })],
  });
}

// Make a simple table from markdown table rows
function makeTable(headerRow, dataRows) {
  function makeCell(text, isHeader = false) {
    return new TableCell({
      shading: isHeader ? { type: ShadingType.CLEAR, fill: "E8ECEB" } : undefined,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        spacing: { line: 280 },
        alignment: AlignmentType.LEFT,
        children: [new TextRun({
          text, size: 20, bold: isHeader, color: c(P.body),
          font: { ascii: "Times New Roman", eastAsia: "SimSun" }
        })]
      })]
    });
  }
  const rows = [];
  if (headerRow && headerRow.length > 0) {
    rows.push(new TableRow({
      tableHeader: true, cantSplit: true,
      children: headerRow.map(h => makeCell(h, true))
    }));
  }
  dataRows.forEach(r => {
    rows.push(new TableRow({
      cantSplit: true,
      children: r.map(c => makeCell(c, false))
    }));
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.accent) },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "D0D0D0" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
    },
    rows
  });
}

// ============ COVER PAGE (R1 - Pure Paragraph Cover Left-Aligned, ACADEMIC palette adapted) ============

function buildCover() {
  const padL = 1200, padR = 800;
  const titleSize = 44; // 22pt
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: c(P.accent), space: 12 };
  const children = [];

  // 1. Top whitespace
  children.push(new Paragraph({ spacing: { before: 3200 } }));

  // 2. English label with accent bottom border
  children.push(new Paragraph({
    indent: { left: padL, right: padR }, spacing: { after: 500 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: c(P.accent), space: 8 } },
    children: [new TextRun({
      text: "P R O J E C T   P L A N N I N G   D O C U M E N T",
      size: 18, color: c(P.accent),
      font: { ascii: "Calibri", eastAsia: "SimHei" }, characterSpacing: 40
    })],
  }));

  // 3. Main title (2 lines)
  const titleLines = ["Dokumen Perencanaan Proyek", "Sistem Distribusi & Pencatatan", "Transaksi Produk Moring Suksok"];
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 120 : 300, line: Math.ceil(22 * 23), lineRule: "atLeast" },
      children: [new TextRun({
        text: titleLines[i], size: titleSize, bold: true,
        color: c(P.primary),
        font: { eastAsia: "SimHei", ascii: "Arial" }
      })],
    }));
  }

  // 4. Subtitle
  children.push(new Paragraph({
    indent: { left: padL }, spacing: { after: 800 },
    children: [new TextRun({
      text: "Tugas Akhir — Tahap 1: Perencanaan",
      size: 26, color: c(P.secondary),
      font: { eastAsia: "Microsoft YaHei", ascii: "Arial" }
    })],
  }));

  // 5. Meta info lines with left accent border
  const metaLines = [
    "Mitra: Moring Suksok (UMKM Snack Kripik Moring)",
    "Tahap: 1 dari 3 (Perencanaan → Development → Deployment)",
    "Versi Dokumen: 1.0",
    "Tanggal: 29 Oktober 2026",
    "Status: Final — Untuk Review Dosen Pembimbing",
  ];
  for (const line of metaLines) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({
        text: line, size: 22, color: c(P.body),
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" }
      })],
    }));
  }

  // 6. Bottom whitespace
  children.push(new Paragraph({ spacing: { before: 3000 } }));

  // 7. Footer with top accent separator
  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent), space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({
        text: "Disusun oleh: Mahasiswa",
        size: 16, color: c(P.footerColor), font: { ascii: "Arial" }
      }),
      new TextRun({ text: "                                        " }),
      new TextRun({
        text: "Untuk Dosen Pembimbing",
        size: 16, color: c(P.footerColor), font: { ascii: "Arial" }
      }),
    ],
  }));

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: c(P.bg) },
        borders: noBorders,
        children,
      })],
    })],
  })];
}

// ============ TOC SECTION ============

function buildTOC() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 360 },
      children: [new TextRun({
        text: "DAFTAR ISI", bold: true, size: 32,
        color: c(P.primary),
        font: { ascii: "Times New Roman", eastAsia: "SimHei" }
      })]
    }),
    new TableOfContents("Daftar Isi", {
      hyperlink: true,
      headingStyleRange: "1-3"
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240 },
      children: [new TextRun({
        text: "Klik kanan pada daftar isi → Update Field untuk memperbarui nomor halaman",
        italics: true, size: 18, color: "808080"
      })]
    })
  ];
}

// ============ BODY CONTENT BUILDER ============

function buildBody() {
  const children = [];

  // === 1. EXECUTIVE SUMMARY ===
  children.push(h1("1. EXECUTIVE SUMMARY"));
  children.push(h2("1.1 Ringkasan Proyek"));
  children.push(bodyPara("Proyek ini merupakan pembangunan sistem distribusi produk berbasis mini e-commerce untuk UMKM Moring Suksok, sebuah bisnis olahan daun kelor (snack/kripik moring) yang saat ini masih melakukan transaksi melalui WhatsApp dan pencatatan manual menggunakan nota. Sistem yang dibangun bertujuan untuk menggantikan proses pemesanan via WhatsApp dengan aplikasi terstruktur, serta menggantikan nota manual dengan pencatatan transaksi digital otomatis yang dapat berfungsi sebagai pembukuan akuntan."));
  children.push(bodyPara("Sistem dibangun dengan arsitektur decoupled (terpisah): Frontend menggunakan Next.js PWA yang dapat diinstall di perangkat Android (Add to Home Screen) dan berjalan di web browser, sedangkan Backend menggunakan Python FastAPI dengan database MySQL yang dikelola melalui phpMyAdmin. Pendekatan ini dipilih untuk memberikan separation of concerns yang jelas, memudahkan maintenance, serta memanfaatkan ekosistem Python yang kuat untuk pengembangan API modern."));

  children.push(h2("1.2 Highlight Fitur Utama"));
  children.push(bodyPara("Sistem akan memiliki fitur-fitur kunci sebagai berikut: (1) registrasi akun wajib untuk customer dengan segmentasi Ritel/Masyarakat sebagai label analisis; (2) katalog produk dengan varian dan harga yang sama untuk semua segmen customer; (3) keranjang belanja (cart) dengan kalkulasi total otomatis; (4) pembayaran via QRIS dinamis (nominal embedded) yang difoto dan di-upload sebagai bukti; (5) verifikasi pembayaran manual oleh owner; (6) tracking status pesanan end-to-end (Pending → Diproses → Dikirim → Selesai); (7) notifikasi hybrid (Push Notification PWA + WhatsApp deep link); (8) laporan transaksi otomatis dengan ekspor PDF/Excel untuk pembukuan akuntan; dan (9) PWA yang installable di Android."));

  children.push(h2("1.3 Nilai Akademik & Praktis"));
  children.push(bodyPara("Sebagai Tugas Akhir, proyek ini mendemonstrasikan: (a) implementasi standar EMVCo QRIS dengan modifikasi payload untuk embed transaction amount; (b) arsitektur decoupled modern dengan REST API dan JWT authentication; (c) Progressive Web App dengan service worker dan push notification; (d) integrasi Firebase Cloud Messaging untuk notifikasi server-to-client; dan (e) analisis trade-off teknis-vs-biaya pada pemilihan QRIS self-generated dibanding payment gateway berbayar. Output proyek ini tidak hanya bernilai akademik, tetapi juga dapat langsung digunakan oleh owner Moring Suksok untuk produksi nyata setelah lulus."));

  // === 2. LATAR BELAKANG ===
  children.push(h1("2. LATAR BELAKANG & RUMUSAN MASALAH"));
  children.push(h2("2.1 Profil Mitra"));
  children.push(bodyPara("Moring Suksok adalah UMKM yang bergerak di bidang pengolahan produk berbahan dasar daun kelor (moringa), dengan produk utama berupa snack/kripik moring yang memiliki beberapa varian rasa. Usaha ini dimiliki oleh seorang pengusaha berusia 40 tahun, dan memiliki dua jenis customer yaitu Customer Ritel (toko/agen yang membeli untuk dijual ulang) dan Customer Masyarakat (konsumen akhir yang membeli untuk konsumsi pribadi)."));
  children.push(bodyPara("Saat ini, proses penjualan masih dilakukan secara konvensional: customer menghubungi owner melalui WhatsApp untuk memesan produk, lalu owner mencatat transaksi pada nota manual sebagai bukti pembelian dan pembukuan akuntan. Pendekatan ini telah berjalan cukup lama, namun seiring bertambahnya jumlah customer dan kompleksitas transaksi, muncul berbagai kendala operasional yang perlu diatasi."));

  children.push(h2("2.2 Identifikasi Masalah"));
  children.push(bodyPara("Berdasarkan analisis kondisi existing Moring Suksok, ditemukan beberapa permasalahan utama yang menjadi pain point baik bagi owner maupun customer. Permasalahan-permasalahan ini menjadi dasar urgensi dibangunnya sistem distribusi dan pencatatan transaksi digital."));

  children.push(h3("Masalah 1: Pencatatan Transaksi Manual yang Tidak Terstruktur"));
  children.push(bodyPara("Owner mencatat setiap transaksi pada nota manual, baik yang dijual ke customer Ritel maupun Masyarakat. Pencatatan ini rentan terhadap human error (salah catat jumlah, varian, atau harga), sulit dilakukan rekapitulasi bulanan, dan tidak ada backup digital jika nota hilang atau rusak. Untuk keperluan pembukuan akuntan, owner harus memilah-milah nota satu per satu yang memakan waktu berjam-jam setiap akhir bulan."));

  children.push(h3("Masalah 2: Tidak Ada Pemantauan Distribusi Produk"));
  children.push(bodyPara("Owner tidak memiliki visibility terhadap pergerakan distribusi produknya. Tidak ada data historis tentang pesanan mana yang sedang diproses, mana yang sudah dikirim, dan mana yang sudah selesai. Status pesanan hanya tersimpan di chat WhatsApp yang sulit ditelusuri, sehingga customer sering menanyakan ulang status pesanan mereka dan owner harus mencari manual di chat."));

  children.push(h3("Masalah 3: Tidak Ada Sistem Pemesanan Terstruktur"));
  children.push(bodyPara("Customer harus menghubungi owner via WhatsApp untuk setiap pemesanan, yang seringkali terjadi miscommunication terkait varian produk, jumlah, dan harga. Tidak ada katalog produk yang dapat diakses customer secara mandiri, sehingga owner harus mengirim foto produk dan penjelasan via WhatsApp berulang-ulang ke setiap customer baru."));

  children.push(h3("Masalah 4: Tidak Ada Segmentasi Customer yang Jelas"));
  children.push(bodyPara("Owner secara informal membedakan customer Ritel dan Masyarakat, namun tidak ada data terstruktur tentang persentase penjualan dari masing-masing segmen. Hal ini menyulitkan owner dalam pengambilan keputusan strategis seperti penentuan stok, promo khusus, atau target market yang lebih potensial untuk diekspansi."));

  children.push(h3("Masalah 5: Pembayaran Tidak Terdokumentasi"));
  children.push(bodyPara("Saat customer membayar via transfer ke DANA owner atau scan QRIS statis, owner harus memverifikasi manual melalui mutasi rekening. Tidak ada audit trail digital yang menghubungkan pembayaran dengan pesanan tertentu, sehingga sulit untuk rekonsiliasi jika ada sengketa atau pertanyaan dari customer di kemudian hari."));

  children.push(h2("2.3 Urgensi & Justifikasi Proyek"));
  children.push(bodyPara("Permasalahan-permasalahan di atas menghambat pertumbuhan Moring Suksok sebagai UMKM. Tanpa sistem yang terstruktur, owner menghabiskan waktu berharga untuk tugas administratif yang seharusnya bisa diotomatisasi, alih-alih fokus pada pengembangan produk dan ekspansi pasar. Selain itu, customer experience yang buruk (sulit lihat katalog, tidak tahu status pesanan) dapat menurunkan loyalitas dan repeat order."));
  children.push(bodyPara("Pembangunan sistem distribusi dan pencatatan transaksi digital akan menyelesaikan kelima masalah di atas secara komprehensif: nota manual diganti dengan nota digital otomatis ter-generate, status pesanan ter-track real-time, katalog produk dapat diakses mandiri oleh customer, segmentasi customer tercatat dalam database, dan setiap pembayaran terdokumentasi dengan bukti upload. Sistem ini juga menjadi fondasi untuk ekspansi bisnis Moring Suksok di masa depan, seperti penambahan fitur loyalty program, analitik penjualan lanjutan, atau integrasi dengan marketplace."));

  // === 3. TUJUAN ===
  children.push(h1("3. TUJUAN & MANFAAT SISTEM"));
  children.push(h2("3.1 Tujuan Umum"));
  children.push(bodyPara("Membangun sistem distribusi produk dan pencatatan transaksi berbasis aplikasi web (PWA) yang dapat diinstall di perangkat Android dan diakses via browser, khusus untuk UMKM Moring Suksok, yang menggantikan proses pemesanan via WhatsApp dan pencatatan manual menggunakan nota."));

  children.push(h2("3.2 Tujuan Khusus"));
  children.push(bodyPara("Sistem ini memiliki beberapa tujuan khusus yang spesifik dan terukur, yang masing-masing dirancang untuk menjawab permasalahan yang telah diidentifikasi pada bagian sebelumnya:"));
  children.push(numberedPara("Membangun mini e-commerce untuk Moring Suksok dengan fitur katalog produk, keranjang belanja, checkout, dan pembayaran yang dapat diakses oleh customer Ritel maupun Masyarakat melalui registrasi akun terlebih dahulu."));
  children.push(numberedPara("Mengimplementasikan pembayaran via QRIS dinamis dengan nominal embedded (sesuai standar EMVCo QRIS) yang dapat di-scan menggunakan berbagai e-wallet (DANA, OVO, GoPay, SeaBank, ShopeePay, m-banking), dengan mekanisme upload bukti pembayaran dan verifikasi manual oleh owner."));
  children.push(numberedPara("Menggantikan nota manual dengan nota digital otomatis yang ter-generate setiap checkout, lengkap dengan order ID unik, timestamp, detail items, customer info, total transaksi, dan dapat diekspor ke PDF untuk pembukuan akuntan."));
  children.push(numberedPara("Memantau distribusi produk melalui tracking status pesanan dengan state machine yang jelas (Pending → Diproses → Dikirim → Selesai), dapat dipantau oleh customer secara real-time dan oleh owner melalui dashboard terpusat."));
  children.push(numberedPara("Mengimplementasikan notifikasi hybrid dengan Push Notification PWA (otomatis via Firebase Cloud Messaging) sebagai primary channel, dan WhatsApp deep link (wa.me) sebagai backup/secondary untuk komunikasi yang lebih personal."));
  children.push(numberedPara("Memberikan segmentasi customer Ritel/Masyarakat sebagai label analisis untuk keperluan laporan owner, tanpa membedakan harga atau flow belanja."));
  children.push(numberedPara("Membangun Progressive Web App (PWA) yang installable di perangkat Android (Add to Home Screen) sehingga customer dapat mengakses aplikasi seperti native app tanpa harus mendownload dari Play Store."));

  children.push(h2("3.3 Manfaat Sistem"));
  children.push(h3("Manfaat bagi Owner Moring Suksok"));
  children.push(bulletPara("Menghemat waktu administratif (tidak perlu buat nota manual, tidak perlu cari status di chat WhatsApp)"));
  children.push(bulletPara("Memiliki data terstruktur untuk pembukuan akuntan (bisa export PDF/Excel per periode)"));
  children.push(bulletPara("Mendapat visibility terhadap distribusi produk (status setiap pesanan)"));
  children.push(bulletPara("Mendapat insight analitik (persentase penjualan Ritel vs Masyarakat, produk terlaris, dst.)"));
  children.push(bulletPara("Membangun aset digital yang dapat di-scale untuk ekspansi bisnis"));

  children.push(h3("Manfaat bagi Customer Ritel & Masyarakat"));
  children.push(bulletPara("Dapat melihat katalog produk secara mandiri tanpa harus tanya owner via WhatsApp"));
  children.push(bulletPara("Dapat melihat riwayat pesanan dan repeat order dengan mudah"));
  children.push(bulletPara("Dapat tracking status pesanan real-time tanpa harus menanyakan ulang"));
  children.push(bulletPara("Mendapat notifikasi otomatis saat status pesanan berubah"));
  children.push(bulletPara("Dapat memilih e-wallet favorit untuk pembayaran via QRIS"));

  children.push(h3("Manfaat Akademik (untuk Tugas Akhir)"));
  children.push(bulletPara("Mendemonstrasikan implementasi arsitektur decoupled (Frontend-Backend terpisah)"));
  children.push(bulletPara("Mengimplementasikan standar EMVCo QRIS dengan modifikasi payload"));
  children.push(bulletPara("Menggunakan Python FastAPI dengan auto-generated Swagger documentation"));
  children.push(bulletPara("Mengimplementasikan PWA dengan service worker dan push notification"));
  children.push(bulletPara("Menganalisis trade-off teknis-vs-biaya pada pemilihan solusi teknologi"));

  // === 4. SCOPE ===
  children.push(h1("4. SCOPE & BATASAN PROYEK"));
  children.push(h2("4.1 In-Scope (Akan Dikerjakan)"));
  children.push(bodyPara("Scope proyek mencakup pembangunan modul customer (frontend), modul owner/admin (dashboard), modul backend (Python FastAPI), konfigurasi database, dan setup PWA. Berikut adalah detail dari masing-masing komponen yang akan dikerjakan dalam proyek ini:"));

  children.push(h3("4.1.1 Modul Customer (Frontend)"));
  children.push(bulletPara("Registrasi akun customer (Nama, WA, Email, Password, Alamat, Segmen Ritel/Masyarakat)"));
  children.push(bulletPara("Login & logout customer"));
  children.push(bulletPara("Browse katalog produk (list & detail)"));
  children.push(bulletPara("Tambah produk ke keranjang (cart)"));
  children.push(bulletPara("Edit/hapus item di keranjang"));
  children.push(bulletPara("Checkout (konfirmasi alamat, pilih pengiriman)"));
  children.push(bulletPara("Generate QRIS dinamis dengan nominal embedded"));
  children.push(bulletPara("Upload bukti pembayaran (screenshot/foto)"));
  children.push(bulletPara("Lihat status pesanan real-time (Pending → Diproses → Dikirim → Selesai)"));
  children.push(bulletPara("Lihat riwayat pesanan"));
  children.push(bulletPara("Install PWA (Add to Home Screen di Android)"));
  children.push(bulletPara("Terima Push Notification dari sistem"));

  children.push(h3("4.1.2 Modul Owner/Admin (Dashboard Frontend)"));
  children.push(bulletPara("Login admin (separate credentials)"));
  children.push(bulletPara("CRUD Produk (tambah/edit/hapus produk + varian + harga + foto)"));
  children.push(bulletPara("Lihat daftar pesanan masuk dengan filter status"));
  children.push(bulletPara("Detail pesanan (items, customer info, total, bukti pembayaran)"));
  children.push(bulletPara("Verifikasi pembayaran (Approve/Reject dengan alasan)"));
  children.push(bulletPara("Update status pesanan (Diproses → Dikirim dengan no resi → Selesai)"));
  children.push(bulletPara("Generate dan download nota PDF per pesanan"));
  children.push(bulletPara("Lihat laporan transaksi (harian/mingguan/bulanan)"));
  children.push(bulletPara("Filter laporan by segmen customer (Ritel/Masyarakat)"));
  children.push(bulletPara("Export laporan ke Excel/PDF"));
  children.push(bulletPara("Kirim WhatsApp manual ke customer via deep link"));
  children.push(bulletPara("Lihat dashboard analitik (total penjualan, jumlah order, customer terbanyak)"));

  children.push(h3("4.1.3 Modul Backend (Python FastAPI)"));
  children.push(bulletPara("REST API endpoints untuk semua modul di atas"));
  children.push(bulletPara("JWT authentication (customer + admin)"));
  children.push(bulletPara("Password hashing (bcrypt)"));
  children.push(bulletPara("Validasi input dengan Pydantic"));
  children.push(bulletPara("Upload image ke Cloudinary"));
  children.push(bulletPara("Generate QRIS dinamis (qrcode + qris-utils library)"));
  children.push(bulletPara("Generate PDF nota (ReportLab)"));
  children.push(bulletPara("Push notification ke FCM (firebase-admin)"));
  children.push(bulletPara("Generate WhatsApp deep link URL"));
  children.push(bulletPara("Logging & error handling"));
  children.push(bulletPara("CORS middleware"));
  children.push(bulletPara("Auto-generated Swagger documentation di /docs"));

  children.push(h2("4.2 Out-of-Scope (Tidak Dikerjakan)"));
  children.push(bodyPara("Agar proyek tetap fokus dan selesai dalam timeline 2-3 bulan, beberapa hal berikut TIDAK termasuk dalam scope TA ini:"));
  children.push(numberedPara("Native Android/iOS App (.apk/.ipa) — cukup PWA yang installable"));
  children.push(numberedPara("Integrasi payment gateway berbayar (Midtrans, Xendit, Faspay) — menggunakan QRIS self-generated"));
  children.push(numberedPara("WhatsApp Business API otomatis (Fonnte, Wablas, Twilio) — menggunakan deep link wa.me semi-otomatis"));
  children.push(numberedPara("Fitur loyalty program / point reward"));
  children.push(numberedPara("Fitur wishlist produk"));
  children.push(numberedPara("Review & rating produk oleh customer"));
  children.push(numberedPara("Multi-vendor / multi-seller (hanya Moring Suksok)"));
  children.push(numberedPara("Integrasi kurir otomatis (JNE, JNT, SiCepat API) — owner input no resi manual"));
  children.push(numberedPara("Auto-calculate ongkir (integrasi RajaOngkir/Binderbyte) — ongkir flat atau di-set manual owner"));
  children.push(numberedPara("Inventory management advanced (alert stok menipis, auto-update stok setelah order)"));
  children.push(numberedPara("Admin multi-user / role-based access (hanya 1 owner/admin)"));
  children.push(numberedPara("Multi-currency & multi-language"));
  children.push(numberedPara("Live chat antara customer dan owner (cukup via WhatsApp deep link)"));
  children.push(numberedPara("Coupon/voucher system"));

  children.push(h2("4.3 Batasan Proyek"));
  children.push(bodyPara("Batasan-batasan teknis dan operasional yang melekat pada sistem ini:"));
  children.push(numberedPara("Pembayaran QRIS tanpa webhook auto-update: Karena menggunakan QRIS self-generated (bukan dari payment gateway resmi), sistem tidak menerima notifikasi otomatis dari bank/e-wallet. Owner harus verifikasi manual bukti pembayaran yang di-upload customer."));
  children.push(numberedPara("Push Notification PWA butuh install & permission: Customer harus (a) install PWA via Add to Home Screen, dan (b) grant permission notifikasi di browser. Jika salah satu tidak dilakukan, push notification tidak akan terkirim (fallback ke WhatsApp deep link)."));
  children.push(numberedPara("Limitasi iOS < 16.4: Push notification PWA tidak didukung pada iOS versi di bawah 16.4. Customer dengan iOS lama hanya bisa menggunakan WhatsApp deep link sebagai notifikasi."));
  children.push(numberedPara("WhatsApp deep link semi-otomatis: Pengiriman WhatsApp via wa.me memerlukan 1 klik manual (klik Send di aplikasi WhatsApp). Tidak ada webhook delivery report, sistem tidak tahu apakah pesan benar-benar terkirim."));
  children.push(numberedPara("Hanya untuk UMKM skala kecil: Sistem dirancang untuk skala <100 customer aktif dan <50 order/bulan. Tidak dioptimasi untuk high-traffic (ribuan transaksi per hari)."));
  children.push(numberedPara("Bahasa hanya Indonesia: UI dan dokumentasi dalam Bahasa Indonesia."));
  children.push(numberedPara("Single currency (IDR): Semua transaksi dalam Rupiah."));
  children.push(numberedPara("Local deployment untuk TA: Selama TA, sistem dijalankan secara local (Laragon + localhost). Deployment ke production (Vercel/Railway) dilakukan di tahap Deployment."));

  // === 5. STAKEHOLDER ===
  children.push(h1("5. STAKEHOLDER & USER ROLE"));
  children.push(h2("5.1 Daftar Stakeholder"));
  children.push(bodyPara("Berikut adalah daftar stakeholder yang terlibat dalam proyek ini beserta kepentingannya:"));
  children.push(makeTable(
    ["#", "Stakeholder", "Deskripsi", "Kepentingan"],
    [
      ["1", "Owner Moring Suksok", "Pemilik UMKM (40 thn)", "Operasional harian, pembukuan, keputusan strategis"],
      ["2", "Customer Ritel", "Toko/agen pembeli ulang", "Pemesanan grosir, riwayat, repeat order"],
      ["3", "Customer Masyarakat", "Konsumen akhir", "Pemesanan eceran, tracking pesanan"],
      ["4", "Mahasiswa", "Pengembang sistem", "Penyelesaian TA"],
      ["5", "Dosen Pembimbing", "Pembimbing akademik", "Validasi metodologi"],
      ["6", "Dosen Penguji", "Penguji sidang", "Evaluasi implementasi"],
      ["7", "Akuntan/Keuangan", "Pengguna laporan", "Pembukuan digital terstruktur"]
    ]
  ));

  children.push(h2("5.2 User Role di Sistem"));
  children.push(bodyPara("Sistem memiliki 3 jenis pengguna dengan kewenangan berbeda, yaitu Admin (Owner Moring Suksok), Customer Ritel, dan Customer Masyarakat. Berikut adalah detail dari masing-masing role:"));

  children.push(h3("Role 1: ADMIN (Owner Moring Suksok)"));
  children.push(bodyPara("Admin adalah role dengan akses tertinggi yang dimiliki oleh owner. Admin memiliki kewenangan penuh terhadap seluruh operasional sistem, termasuk: kelola produk (CRUD), lihat semua pesanan, verifikasi pembayaran, update status pesanan, input nomor resi, lihat & ekspor laporan transaksi, lihat daftar customer & analitik, generate nota PDF, kirim WhatsApp ke customer, update QRIS statis owner, dan update informasi bisnis. Kredensial login menggunakan email + password yang tersimpan di tabel admins."));

  children.push(h3("Role 2: CUSTOMER RITEL"));
  children.push(bodyPara("Customer yang mendaftarkan diri sebagai Ritel (toko/agen yang membeli untuk dijual ulang). Flow belanja sama persis dengan Customer Masyarakat, hanya berbeda pada label segmentasi yang digunakan untuk analisis owner. Kewenangan customer ritel meliputi: browse katalog produk, tambah produk ke keranjang, checkout & upload bukti pembayaran, lihat riwayat pesanan sendiri, update profil pribadi, terima push notification, dan klik tombol Notifikasi Owner via WhatsApp. Tidak bisa: lihat pesanan customer lain, akses dashboard admin, kelola produk."));

  children.push(h3("Role 3: CUSTOMER MASYARAKAT"));
  children.push(bodyPara("Customer yang mendaftarkan diri sebagai Masyarakat (konsumen akhir yang membeli untuk konsumsi pribadi). Identik dengan Customer Ritel dalam hal flow belanja, hanya berbeda pada label segmentasi (customer_type = 'public' di database)."));

  children.push(h2("5.3 Matriks Akses (Access Control Matrix)"));
  children.push(bodyPara("Berikut adalah matriks akses yang menunjukkan kewenangan setiap role terhadap modul-modul di sistem:"));
  children.push(makeTable(
    ["Modul / Aksi", "Admin", "Customer Ritel", "Customer Masyarakat"],
    [
      ["Login sistem", "✓", "✓", "✓"],
      ["Lihat katalog produk", "✓ (read)", "✓", "✓"],
      ["CRUD Produk", "✓", "✗", "✗"],
      ["Tambah ke keranjang", "✗", "✓", "✓"],
      ["Checkout & upload bukti", "✗", "✓", "✓"],
      ["Lihat pesanan sendiri", "✗", "✓", "✓"],
      ["Lihat semua pesanan", "✓", "✗", "✗"],
      ["Verifikasi pembayaran", "✓", "✗", "✗"],
      ["Update status pesanan", "✓", "✗", "✗"],
      ["Generate nota PDF", "✓", "✓ (own)", "✓ (own)"],
      ["Laporan transaksi", "✓", "✗", "✗"],
      ["Ekspor laporan Excel/PDF", "✓", "✗", "✗"],
      ["Daftar customer", "✓", "✗", "✗"],
      ["Analitik & dashboard", "✓", "✗", "✗"],
      ["Update profil pribadi", "✓", "✓", "✓"],
      ["Push notification", "✓ (order masuk)", "✓ (status berubah)", "✓ (status berubah)"]
    ]
  ));

  // === 6. ARSITEKTUR SISTEM ===
  children.push(h1("6. ARSITEKTUR SISTEM"));
  children.push(h2("6.1 Gambaran Umum Arsitektur"));
  children.push(bodyPara("Sistem dibangun dengan arsitektur decoupled (terpisah) antara Frontend dan Backend, yang berkomunikasi melalui REST API menggunakan format JSON. Arsitektur ini dipilih untuk memisahkan concerns (presentation layer vs business logic layer), memudahkan maintenance, dan memungkinkan skalabilitas independen antara frontend dan backend. Dengan arsitektur ini, frontend dapat di-deploy terpisah dari backend, masing-masing dapat di-scale sesuai kebutuhan, dan tim pengembangan dapat bekerja secara paralel tanpa blocking."));

  children.push(h2("6.2 Diagram Arsitektur Sistem (High-Level)"));
  children.push(bodyPara("Arsitektur sistem terdiri dari 3 lapisan utama: Presentation Layer (Frontend Next.js PWA), Business Logic Layer (Backend Python FastAPI), dan Data Layer (MySQL dengan phpMyAdmin). Selain itu, sistem juga terhubung dengan beberapa external services seperti Firebase Cloud Messaging, Cloudinary, dan WhatsApp Deep Link. Berikut adalah penjelasan masing-masing lapisan:"));

  children.push(h3("6.2.1 Presentation Layer (Frontend)"));
  children.push(bodyPara("Frontend dibangun menggunakan Next.js 14+ dengan App Router, mendukung Progressive Web App sehingga dapat diinstall di Android. Frontend terdiri dari 2 area utama: Customer Area dan Owner/Admin Area. Customer Area meliputi halaman publik (landing, katalog produk, detail produk), halaman auth (login, register), dan halaman customer yang butuh login (cart, checkout, payment, upload bukti, riwayat pesanan, tracking status, profil). Owner/Admin Area meliputi halaman login admin, dashboard utama, kelola produk, daftar pesanan, detail & verifikasi pembayaran, update status pesanan, laporan transaksi, daftar customer & analitik, dan settings."));
  children.push(bodyPara("Service Worker (PWA) bertanggung jawab untuk pre-caching halaman utama dan aset statis (CSS, JS, gambar), runtime caching untuk gambar produk dari Cloudinary, push notification handler (FCM), dan background sync untuk mengantri request saat offline."));

  children.push(h3("6.2.2 Backend Layer (Python FastAPI)"));
  children.push(bodyPara("Backend dibangun menggunakan Python FastAPI yang berjalan di atas ASGI server (uvicorn). Struktur backend mengikuti pola modular berdasarkan domain, dengan struktur folder yang jelas: core/ untuk konfigurasi dan security, models/ untuk SQLAlchemy models, schemas/ untuk Pydantic schemas, api/v1/ untuk endpoint REST, services/ untuk business logic, dan utils/ untuk utility functions. Backend dilengkapi dengan middleware CORS, JWT authentication, error handler, dan logging. Dokumentasi API otomatis tersedia di Swagger UI (/docs) dan ReDoc (/redoc) yang sangat berguna untuk demo ke dosen penguji."));

  children.push(h3("6.2.3 Data Layer (MySQL + phpMyAdmin)"));
  children.push(bodyPara("Database menggunakan MySQL 8.4.3 yang sudah terinstall via Laragon. Akses ke database dilakukan melalui SQLAlchemy 2.0 ORM di sisi backend, sementara phpMyAdmin digunakan sebagai GUI untuk inspeksi, debugging, dan administrasi manual (edit data, run SQL query, export/import). Konfigurasi koneksi database: Host localhost, Port 3306, User root, Password kosong (default Laragon), Database moring_suksok, Charset utf8mb4_unicode_ci untuk support emoji & karakter Indonesia."));

  children.push(h2("6.3 Alur Komunikasi (Request Flow)"));
  children.push(bodyPara("Berikut adalah contoh alur komunikasi saat customer checkout dan upload bukti pembayaran, hingga owner melakukan verifikasi:"));
  children.push(numberedPara("Customer buka aplikasi → Next.js PWA render halaman katalog. Frontend fetch GET /api/v1/products. FastAPI terima request → query MySQL via SQLAlchemy → return JSON list produk → frontend render."));
  children.push(numberedPara("Customer tambah ke cart → state di Frontend (localStorage + sync API). POST /api/v1/cart/items jika login."));
  children.push(numberedPara("Customer checkout → POST /api/v1/orders. FastAPI validasi via Pydantic, buat record orders + order_items di MySQL, generate order_id (ORD-YYYYMMDD-XXX), return order detail + total."));
  children.push(numberedPara("Frontend minta QRIS → POST /api/v1/payments/{order_id}/qris. FastAPI ambil QRIS statis owner dari settings table, inject nominal ke QRIS payload (qris-utils), recalculate CRC16 checksum, generate QR code PNG (qrcode library), return QR image base64 + download URL."));
  children.push(numberedPara("Customer scan QRIS → bayar via DANA/e-wallet. Proses ini terjadi di luar sistem (antara customer ↔ e-wallet ↔ DANA owner)."));
  children.push(numberedPara("Customer upload bukti → POST /api/v1/payments/{order_id}/upload. FastAPI terima file (multipart/form-data), upload ke Cloudinary → dapat URL, simpan URL di payments table + status pending, trigger push notification ke owner via FCM, return success."));
  children.push(numberedPara("Owner terima push notif → buka dashboard → klik pesanan. Frontend fetch GET /api/v1/admin/orders/{id}."));
  children.push(numberedPara("Owner verifikasi → PATCH /api/v1/admin/orders/{id}/verify. Update payments.status = verified, orders.status = processed, trigger push notif ke customer (status berubah), return success."));
  children.push(numberedPara("Owner update dikirim → PATCH /api/v1/admin/orders/{id}/ship. Update status + no_resi, trigger push notif ke customer, owner bisa klik Kirim WA → wa.me deep link."));

  children.push(h2("6.4 Pola Keamanan (Security Pattern)"));
  children.push(bodyPara("Sistem mengimplementasikan beberapa pola keamanan untuk melindungi data dan akses. Pertama, JWT Authentication: setiap request ke protected endpoint wajib sertikan Authorization: Bearer <token> di header. Token di-sign dengan secret key, expired dalam 7 hari (customer) atau 1 hari (admin). Kedua, Password Hashing: password disimpan di database menggunakan bcrypt dengan salt rounds = 12. Ketiga, Role-based Authorization: middleware FastAPI memvalidasi role (admin vs customer) berdasarkan claim di JWT."));
  children.push(bodyPara("Keempat, CORS Configuration: hanya origin frontend (localhost:3000 untuk dev, vercel domain untuk prod) yang diizinkan. Kelima, Input Validation: semua input di-validasi via Pydantic schema, dengan SQL injection prevention via SQLAlchemy ORM. Keenam, File Upload Validation: validasi MIME type (hanya image) + size limit (max 5MB) untuk upload bukti pembayaran. Ketujuh, Environment Variables: secret keys (JWT secret, FCM server key, Cloudinary credentials) disimpan di .env dan tidak di-commit ke repository."));

  return children;
}

// ============ MAIN DOCUMENT ASSEMBLY ============

const doc = new Document({
  creator: "Z.ai Assistant",
  title: "Dokumen Perencanaan Proyek Moring Suksok",
  description: "Project Planning Document for Moring Suksok Distribution & Transaction System - TA Stage 1",
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimSun" }, size: 22, color: "000000" },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 32, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 480, after: 360, line: 360 } },
      },
      heading2: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 30, bold: true, color: "000000" },
        paragraph: { spacing: { before: 360, after: 240, line: 360 } },
      },
      heading3: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 28, bold: true, color: "000000" },
        paragraph: { spacing: { before: 240, after: 120, line: 360 } },
      },
      heading4: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 24, bold: true, color: "000000" },
        paragraph: { spacing: { before: 180, after: 100, line: 312 } },
      },
    },
  },
  numbering: {
    config: [{
      reference: "default-numbering",
      levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.LOWER_LETTER, text: "%2)", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ]
    }]
  },
  sections: [
    // SECTION 1: COVER PAGE (no margins, no page numbers)
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      children: buildCover()
    },
    // SECTION 2: TOC (Roman numerals)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417, header: 850, footer: 992 },
          pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN }
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
      children: buildTOC()
    },
    // SECTION 3: BODY (Arabic numerals, start from 1)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417, header: 850, footer: 992 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: "Dokumen Perencanaan Proyek Moring Suksok",
              size: 18, color: "808080",
              font: { ascii: "Times New Roman" }
            })]
          })]
        })
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
  const outputPath = "/home/z/my-project/download/Dokumen_Perencanaan_Moring_Suksok.docx";
  fs.writeFileSync(outputPath, buf);
  console.log("✅ Document generated successfully!");
  console.log("   Path:", outputPath);
  console.log("   Size:", (buf.length / 1024).toFixed(2), "KB");
}).catch(err => {
  console.error("❌ Error generating document:", err);
  process.exit(1);
});
