// Generate Proposal Tugas Akhir D4 TRPL 2026 — v2 with story owner + masalah 6 + acquisition_channel
const {
  Document, Packer, Paragraph, TextRun, Footer, Header,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  TableLayoutType, NumberFormat, SectionType, TabStopType, UnderlineType, VerticalAlign
} = require("docx");
const fs = require("fs");

const P = { primary: "000000", body: "000000", accent: "2D6A4F" };
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { ...noBorders, insideHorizontal: NB, insideVertical: NB };

function bp(text, opts = {}) {
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 480 }, spacing: { line: 360, after: 0 }, children: [new TextRun({ text, size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })], ...opts });
}
function h1c(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 240, after: 240, line: 360 }, children: [new TextRun({ text, bold: true, size: 32, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120, line: 360 }, children: [new TextRun({ text, bold: true, size: 28, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 120, line: 360 }, children: [new TextRun({ text, bold: true, size: 26, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }); }
function li(text) { return new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { left: 720, hanging: 360 }, spacing: { line: 360, after: 60 }, children: [new TextRun({ text, size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }); }
function refIEEE(num, text) { return new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { left: 600, hanging: 600 }, spacing: { line: 360, after: 120 }, children: [new TextRun({ text: `[${num}] ${text}`, size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }); }
function ep() { return new Paragraph({ children: [new TextRun({ text: "" })], spacing: { line: 240 } }); }

function makeTable(headers, rows) {
  function mc(text, isH = false) {
    return new TableCell({ shading: isH ? { type: ShadingType.CLEAR, fill: "E8ECEB" } : undefined, margins: { top: 80, bottom: 80, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ spacing: { line: 280 }, children: [new TextRun({ text, size: 20, bold: isH, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] })] });
  }
  const allRows = [new TableRow({ tableHeader: true, cantSplit: true, children: headers.map(h => mc(h, true)) })];
  rows.forEach(r => allRows.push(new TableRow({ cantSplit: true, children: r.map(c => mc(c, false)) })));
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, layout: TableLayoutType.FIXED, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: P.body }, bottom: { style: BorderStyle.SINGLE, size: 4, color: P.body }, left: { style: BorderStyle.SINGLE, size: 4, color: P.body }, right: { style: BorderStyle.SINGLE, size: 4, color: P.body }, insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "808080" }, insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "808080" } }, rows: allRows });
}
function tCap(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120, line: 280 }, children: [new TextRun({ text, bold: true, size: 22, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }); }
function fCap(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 240, line: 280 }, children: [new TextRun({ text, bold: true, size: 22, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }); }
function placeholder(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 120 }, children: [new TextRun({ text, italics: true, size: 22, color: "808080", font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }); }

// ===== COVER 1 =====
function cover1() {
  const c = [];
  c.push(new Paragraph({ spacing: { before: 1800 } }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 }, children: [new TextRun({ text: "PROPOSAL TUGAS AKHIR", bold: true, size: 36, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }));
  ["RANCANG BANGUN SISTEM DISTRIBUSI DAN", "PENCATATAN TRANSAKSI PRODUK UMKM", "MORING SUKSOK BERBASIS PROGRESSIVE WEB", "APP DENGAN VERIFIKASI PEMBAYARAN QRIS", "DAN NOTIFIKASI OTOMATIS"].forEach(l => c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, after: 60 }, children: [new TextRun({ text: l, bold: true, size: 28, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] })));
  c.push(new Paragraph({ spacing: { before: 1800 } }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "Disusun oleh:", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Raid Javier Julian", bold: true, size: 26, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1800 }, children: [new TextRun({ text: "NIM 10601027", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  ["PROGRAM STUDI D4 TEKNOLOGI REKAYASA PERANGKAT LUNAK", "JURUSAN TEKNOLOGI INFORMASI DAN KOMPUTER", "POLITEKNIK NEGERI SUBANG", "NOVEMBER 2026"].forEach((t, i) => c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: t, bold: true, size: i === 2 ? 26 : 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] })));
  return c;
}

// ===== COVER 2 (with statement) =====
function cover2() {
  const c = [...cover1().slice(0, 7)];
  c.push(new Paragraph({ spacing: { before: 1200 } }));
  c.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 600, line: 360 }, indent: { left: 720, right: 720 }, children: [new TextRun({ text: "Diajukan sebagai salah satu syarat untuk melaksanakan Tugas Akhir pada Program Studi D4 Teknologi Rekayasa Perangkat Lunak", size: 26, color: P.body, italics: true, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  c.push(new Paragraph({ spacing: { before: 600 } }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "Disusun oleh:", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Raid Javier Julian", bold: true, size: 26, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1800 }, children: [new TextRun({ text: "NIM 10601027", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  ["PROGRAM STUDI D4 TEKNOLOGI REKAYASA PERANGKAT LUNAK", "JURUSAN TEKNOLOGI INFORMASI DAN KOMPUTER", "POLITEKNIK NEGERI SUBANG", "NOVEMBER 2026"].forEach((t, i) => c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: t, bold: true, size: i === 2 ? 26 : 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] })));
  return c;
}

// ===== HALAMAN PERSETUJUAN =====
function persetujuan() {
  const c = [];
  c.push(new Paragraph({ spacing: { before: 600 } }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: "HALAMAN PERSETUJUAN", bold: true, size: 32, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: "PROPOSAL TUGAS AKHIR", bold: true, size: 28, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }));
  ["RANCANG BANGUN SISTEM DISTRIBUSI DAN", "PENCATATAN TRANSAKSI PRODUK UMKM", "MORING SUKSOK BERBASIS PROGRESSIVE WEB", "APP DENGAN VERIFIKASI PEMBAYARAN QRIS", "DAN NOTIFIKASI OTOMATIS"].forEach(l => c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, after: 60 }, children: [new TextRun({ text: l, bold: true, size: 24, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] })));
  c.push(new Paragraph({ spacing: { before: 360 } }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "Disusun oleh:", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 }, children: [new TextRun({ text: "Raid Javier Julian / NIM 10601027", bold: true, size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 360 }, indent: { left: 480, right: 480 }, children: [new TextRun({ text: "Proposal Tugas Akhir ini telah diperiksa dan disetujui oleh Dosen Pembimbing sebagai salah satu syarat untuk melaksanakan Tugas Akhir pada Program Studi D4 Teknologi Rekayasa Perangkat Lunak, Jurusan Teknologi Informasi dan Komputer, Politeknik Negeri Subang.", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: "Subang, November 2026", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  const sigCell = (title, name, nip) => new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: noBorders, margins: { top: 60, bottom: 60, left: 60, right: 60 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: title, size: 22, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }), new Paragraph({ spacing: { before: 1440 } }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, bold: true, size: 22, color: P.body, underline: { type: UnderlineType.SINGLE }, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: nip, size: 22, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] })] });
  c.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, layout: TableLayoutType.FIXED, borders: allNoBorders, rows: [new TableRow({ children: [sigCell("Pembimbing I,", "Nurfitria Khoirunnisa, S.Tr.Kom., M.Kom.", "NIP/NIDN ____________________"), sigCell("Pembimbing II,", "____________________________", "NIP/NIDN ____________________")] }), new TableRow({ children: [sigCell("Mahasiswa,", "Raid Javier Julian", "NIM 10601027"), sigCell("Mengetahui, Koordinator Program Studi D4 TRPL,", "____________________________", "NIP ____________________")] })] }));
  return c;
}

// ===== DAFTAR ISI =====
function daftarIsi() {
  const c = [];
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 360 }, children: [new TextRun({ text: "DAFTAR ISI", bold: true, size: 32, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }));
  c.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 240, line: 360 }, children: [new TextRun({ text: "[Klik kanan → Update Field → Update entire table untuk memperbarui]", italics: true, size: 20, color: "808080", font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }));
  const items = [["ABSTRAK","i"],["BAB I PENDAHULUAN|1"],["1.1 Latar Belakang|1"],["1.2 Rumusan Masalah|4"],["1.3 Batasan Masalah|4"],["1.4 Tujuan|5"],["1.5 Manfaat|6"],["BAB II TINJAUAN PUSTAKA|7"],["2.1 Kajian Terdahulu|7"],["2.2 Landasan Teori|11"],["BAB III METODE PENELITIAN|15"],["3.1 Data dan Alat Penelitian|15"],["3.2 Prosedur Penelitian|16"],["3.3 Perancangan|17"],["3.4 Gambaran Hasil Penelitian|21"],["BAB IV PENUTUP|22"],["4.1 Jadwal Penelitian|22"],["DAFTAR PUSTAKA|23"],["LAMPIRAN|25"]];
  items.forEach(item => {
    const [title, page] = item[0].includes("|") ? item[0].split("|") : [item[0], item[1]];
    c.push(new Paragraph({ indent: title.match(/^\d/) ? { left: 480 } : {}, spacing: { line: 360, after: 60 }, tabStops: [{ type: TabStopType.RIGHT, position: 9000, leader: "dot" }], children: [new TextRun({ text: title, size: 24, bold: !title.match(/^\d/), color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } }), new TextRun({ text: `\t${page}`, size: 24, color: P.body, font: { ascii: "Times New Roman" } })] }));
  });
  return c;
}

// ===== ABSTRAK =====
function abstrak() {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 360 }, children: [new TextRun({ text: "ABSTRAK", bold: true, size: 32, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 240, after: 240 }, children: [new TextRun({ text: "UMKM Moring Suksok merupakan usaha kuliner yang berawal dari hobi dan mengolah produk camilan khas berupa cimol kering (moring) dengan beberapa varian rasa. Saat ini proses penjualan masih dilakukan secara konvensional melalui WhatsApp dan pencatatan manual menggunakan nota, sehingga menimbulkan kendala seperti pencatatan transaksi yang tidak terstruktur, tidak adanya pemantauan distribusi produk, tidak adanya sistem pemesanan terstruktur, tidak adanya segmentasi customer yang jelas, pembayaran yang tidak terdokumentasi, serta pemasaran yang belum tergabungkan secara digital padahal owner menjalankan 6 jalur pemasaran. Penelitian ini bertujuan merancang bangun sistem distribusi dan pencatatan transaksi produk berbasis Progressive Web App (PWA) dengan verifikasi pembayaran QRIS dan notifikasi otomatis. Sistem dibangun dengan arsitektur decoupled menggunakan Next.js PWA untuk frontend dan Python FastAPI untuk backend, dengan database MySQL. Metode pengembangan perangkat lunak yang digunakan adalah Waterfall. Pengujian dilakukan menggunakan Black Box Testing dan User Acceptance Testing (UAT). Hasil yang diharapkan adalah sistem yang mampu menggantikan proses pemesanan via WhatsApp dan nota manual, dengan fitur katalog produk, keranjang belanja, checkout, pembayaran QRIS dinamis sesuai standar EMVCo, verifikasi pembayaran oleh owner, tracking status pesanan end-to-end, notifikasi hybrid (Push Notification PWA + WhatsApp deep link), laporan transaksi otomatis dengan ekspor PDF/Excel, serta tracking acquisition channel customer untuk analisis efektivitas pemasaran.", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 240, after: 240 }, children: [new TextRun({ text: "Kata kunci: ", bold: true, size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimHei" } }), new TextRun({ text: "Progressive Web App; QRIS; UMKM; FastAPI; Notifikasi Otomatis", size: 24, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] }),
  ];
}

// ===== BAB I =====
function bab1() {
  const c = [];
  c.push(h1c("BAB I")); c.push(h1c("PENDAHULUAN"));
  c.push(h2("1.1 Latar Belakang"));
  c.push(bp("Usaha Mikro, Kecil, dan Menengah (UMKM) merupakan tulang punggung perekonomian Indonesia yang berkontribusi signifikan terhadap Produk Domestik Bruto (PDB), penyerapan tenaga kerja, serta pemerataan ekonomi. Berdasarkan data Badan Pusat Statistik (BPS), jumlah UMKM di Indonesia mencapai 64,2 juta unit pada tahun 2022 [1]. Karakteristik UMKM yang fleksibel, adaptif, serta mampu bertahan dalam berbagai kondisi ekonomi menjadikan sektor ini sebagai sasaran utama dalam pengembangan ekosistem digital nasional."));
  c.push(bp("Transformasi digital yang terjadi dalam satu dekade terakhir telah mendorong perubahan signifikan pada sistem pembayaran global, termasuk di Indonesia. Bank Indonesia merespons perkembangan ini dengan meluncurkan Quick Response Code Indonesian Standard (QRIS) sebagai standar nasional untuk pembayaran digital berbasis QR Code pada 1 Januari 2020 [2]. QRIS memungkinkan berbagai aplikasi pembayaran menggunakan satu kode terpadu, menghadirkan efisiensi, kecepatan, dan kemudahan transaksi baik bagi konsumen maupun pelaku usaha."));
  c.push(bp("Moring Suksok merupakan salah satu UMKM kuliner yang berawal dari hobi dan coba-coba. Awalnya dibuat sendiri, diracik sendiri, lalu dibagikan ke tetangga untuk dicicipi. Alhamdulillah, responsnya positif, katanya enak. Dari situlah muncul keberanian untuk mulai berjualan. Dulu memulai dari harga Rp500 saja, dan kini produk moring ukuran mini sudah dihargai Rp2.000. Perjalanannya terus berkembang dengan pemasaran yang semakin luas melalui berbagai pilihan kemasan, mulai dari ukuran mini, standing pouch, sampai aluminium foil, yang disesuaikan dengan kebutuhan dan target pasar. Ternyata, hobi kalau ditekuni dengan serius bisa menjadi jalan rezeki."));
  c.push(bp("Produk utama Moring Suksok adalah cimol kering (moring) — yaitu cimol yang digoreng dengan tekstur kering, renyah, dan tahan lama — dengan beberapa varian rasa antara lain Original, Pedas, Keju, Balado, dan Jagung. Usaha ini dimiliki oleh seorang pengusaha berusia 40 tahun dan melayani dua jenis pelanggan, yaitu Customer Ritel (toko/agen/reseller yang membeli untuk dijual ulang) dan Customer Masyarakat (konsumen akhir yang membeli untuk konsumsi pribadi). Owner menjalankan 6 jalur pemasaran: reseller, e-commerce (platform belanja online), sekolah-sekolah, penjualan online via media sosial, retail modern (Alfamart dan Indomart di Kabupaten Subang), serta toko oleh-oleh di Kabupaten Subang."));
  c.push(bp("Berdasarkan hasil observasi dan wawancara yang dilakukan terhadap proses bisnis Moring Suksok, ditemukan beberapa permasalahan operasional. Pertama, pencatatan transaksi masih dilakukan secara manual menggunakan nota, yang rentan terhadap human error (salah catat jumlah, varian, atau harga), sulit dilakukan rekapitulasi bulanan, serta tidak memiliki backup digital jika nota hilang atau rusak. Kedua, tidak terdapat pemantauan distribusi produk yang terstruktur, sehingga owner tidak memiliki visibility terhadap status pesanan mana yang sedang diproses, sudah dikirim, atau sudah selesai. Ketiga, customer harus menghubungi owner via WhatsApp untuk setiap pemesanan, yang seringkali menimbulkan miscommunication terkait varian produk, jumlah, dan harga, serta tidak tersedia katalog produk yang dapat diakses customer secara mandiri."));
  c.push(bp("Keempat, owner secara informal membedakan customer Ritel dan Masyarakat, namun tidak ada data terstruktur tentang persentase penjualan dari masing-masing segmen. Kelima, saat customer membayar via transfer ke DANA owner atau scan QRIS statis, owner harus memverifikasi manual melalui mutasi rekening, tanpa audit trail digital yang menghubungkan pembayaran dengan pesanan tertentu. Keenam, owner menjalankan 6 jalur pemasaran namun belum terdapat sistem terpusat yang dapat mengelola dan melacak customer dari berbagai sumber tersebut, sehingga owner tidak memiliki data terstruktur tentang dari mana customer berasal (acquisition channel) untuk mengukur efektivitas tiap jalur pemasaran."));
  c.push(bp("Penelitian Rahardjo (2025) terhadap 124 UMKM menunjukkan bahwa 45,97% UMKM telah mengadopsi QRIS dan merasakan manfaat berupa efisiensi transaksi, peningkatan keamanan pembayaran, kemudahan pencatatan keuangan, serta meningkatnya kenyamanan pelanggan [3]. Sholihah dan Nurhapsari (2023) dalam penelitian berbasis Technology Acceptance Model (TAM) menyatakan bahwa persepsi kemanfaatan (perceived usefulness) dan persepsi kemudahan (perceived ease of use) berpengaruh positif dan signifikan terhadap intensi penggunaan QRIS oleh UMKM [4]. Hasil studi tersebut mengkonfirmasi bahwa semakin bermanfaat dan mudah digunakannya suatu teknologi pembayaran digital, semakin besar pula kemungkinan UMKM untuk mengadopsinya."));
  c.push(bp("Dari sisi teknologi, Progressive Web App (PWA) merupakan konsep pengembangan aplikasi web yang menyatukan kelebihan aplikasi web dan aplikasi native. Amrullah et al. (2021) menerapkan PWA pada aplikasi e-commerce dan memperoleh skor kualitas PWA sebesar 93,75 dari 100 berdasarkan baseline progressive web app checklist [5]. Prayudha et al. (2024) berhasil membangun aplikasi Point of Sale berbasis PWA untuk UMKM dengan respon sangat positif berdasarkan User Acceptance Testing (skor 544/600) [6]. Prista dan Wulandari (2024) mengimplementasikan Firebase Cloud Messaging (FCM) pada aplikasi agenda rapat dan memperoleh skor System Usability Scale (SUS) sebesar 89,08 yang termasuk kategori \"Sangat Memuaskan\" [7]."));
  c.push(bp("Berdasarkan permasalahan dan dukungan literatur tersebut, diusulkan pengembangan sistem distribusi dan pencatatan transaksi produk UMKM Moring Suksok berbasis Progressive Web App dengan verifikasi pembayaran QRIS dan notifikasi otomatis. Sistem ini dirancang dengan arsitektur decoupled antara frontend (Next.js PWA) dan backend (Python FastAPI). Pembayaran menggunakan QRIS dinamis dengan nominal embedded sesuai standar EMVCo, tanpa integrasi payment gateway berbayar. Notifikasi menggunakan pendekatan hybrid yaitu Push Notification PWA via FCM sebagai channel utama dan WhatsApp deep link (wa.me) sebagai backup. Sistem juga mencatat acquisition channel customer saat registrasi untuk analisis efektivitas pemasaran."));
  c.push(h2("1.2 Rumusan Masalah"));
  c.push(bp("Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam penelitian ini adalah: bagaimana merancang dan membangun sistem distribusi dan pencatatan transaksi produk UMKM Moring Suksok berbasis Progressive Web App yang dapat menggantikan proses pemesanan via WhatsApp dan nota manual, dengan fitur verifikasi pembayaran QRIS dinamis, notifikasi otomatis, dan tracking acquisition channel customer untuk analisis efektivitas pemasaran."));
  c.push(h2("1.3 Batasan Masalah"));
  c.push(bp("Agar penelitian tetap fokus dan terarah, ditetapkan batasan masalah sebagai berikut:"));
  ["1. Sistem diterapkan untuk satu UMKM (Moring Suksok) dengan skala lokal kecil (di bawah 100 customer aktif dan di bawah 50 order per bulan).","2. Produk yang dikelola berfokus pada camilan cimol kering (moring) dengan varian rasa Original, Pedas, Keju, Balado, dan Jagung.","3. Pembayaran menggunakan QRIS self-generated dengan nominal embedded sesuai standar EMVCo, tanpa integrasi payment gateway berbayar.","4. Verifikasi pembayaran dilakukan secara manual oleh owner melalui upload bukti pembayaran oleh customer.","5. Notifikasi menggunakan pendekatan hybrid: Push Notification PWA via FCM sebagai channel utama, dan WhatsApp deep link (wa.me) sebagai backup.","6. Ongkos kirim menggunakan tarif flat yang dapat dikonfigurasi oleh owner, tanpa integrasi auto-calculate ongkir berbasis jarak.","7. Tracking acquisition channel customer terbatas pada 5 kategori: direct, reseller, social_media, word_of_mouth, dan other.","8. Tidak mencakup fitur loyalty program, wishlist, review produk, multi-vendor, inventory management advanced, dan coupon system.","9. Platform yang ditargetkan adalah perangkat Android (PWA installable) dan web browser modern."].forEach(t => c.push(li(t)));
  c.push(h2("1.4 Tujuan"));
  c.push(bp("Tujuan yang akan dicapai dalam penelitian ini adalah:"));
  ["1. Merancang dan membangun sistem distribusi produk berbasis mini e-commerce untuk UMKM Moring Suksok yang dapat menggantikan proses pemesanan via WhatsApp dengan katalog produk, keranjang belanja, dan checkout yang terstruktur.","2. Mengimplementasikan pembayaran via QRIS dinamis dengan nominal embedded sesuai standar EMVCo QRIS, dengan mekanisme upload bukti pembayaran dan verifikasi manual oleh owner.","3. Menggantikan nota manual dengan nota digital otomatis yang dapat diekspor ke PDF untuk pembukuan akuntan.","4. Memantau distribusi produk melalui tracking status pesanan dengan state machine yang jelas (Pending → Diproses → Dikirim → Selesai).","5. Mengimplementasikan notifikasi hybrid dengan Push Notification PWA (FCM) sebagai channel utama, dan WhatsApp deep link (wa.me) sebagai backup.","6. Mencatat acquisition channel customer saat registrasi untuk analisis efektivitas pemasaran owner.","7. Membangun Progressive Web App (PWA) yang installable di perangkat Android (Add to Home Screen)."].forEach(t => c.push(li(t)));
  c.push(h2("1.5 Manfaat"));
  c.push(bp("Manfaat yang diharapkan dari penelitian ini adalah:"));
  ["1. Bagi Owner Moring Suksok: menghemat waktu administratif, memiliki data terstruktur untuk pembukuan akuntan, mendapat visibility terhadap distribusi produk, insight analitik (persentase penjualan Ritel vs Masyarakat, efektivitas acquisition channel), serta foundation untuk ekspansi pasar nasional.","2. Bagi Customer: dapat melihat katalog mandiri, tracking status real-time, notifikasi otomatis, dan pilihan e-wallet fleksibel via QRIS.","3. Bagi Pengembangan Ilmu: mendemonstrasikan implementasi arsitektur decoupled, standar EMVCo QRIS dengan modifikasi payload, PWA dengan service worker dan push notification, serta analisis trade-off teknis-vs-biaya.","4. Bagi Industri UMKM: memberikan referensi implementasi sistem distribusi terstruktur berbasis PWA yang dapat dijadikan model untuk UMKM kuliner lain."].forEach(t => c.push(li(t)));
  return c;
}

// ===== BAB II =====
function bab2() {
  const c = [];
  c.push(h1c("BAB II")); c.push(h1c("TINJAUAN PUSTAKA"));
  c.push(h2("2.1 Kajian Terdahulu"));
  c.push(bp("Tinjauan pustaka terhadap penelitian terdahulu dilakukan untuk memahami perkembangan hasil penelitian yang berkaitan dengan Progressive Web App, QRIS, UMKM, dan Firebase Cloud Messaging. Berikut disajikan rangkuman kajian terdahulu dalam Tabel 2.1."));
  c.push(tCap("Tabel 2.1 Kajian Terdahulu"));
  c.push(makeTable(["No","Penulis (Tahun)","Judul","Metode","Hasil","Keterbatasan / Gap"],[
    ["1","Amrullah et al. (2021) [5]","Implementasi PWA pada E-Commerce","Metode Prototype dengan WordPress","Skor PWA 93,75/100; 45% SS, 55% S","Tidak ada QRIS; tidak ada tracking distribusi; tidak spesifik UMKM cimol"],
    ["2","Prayudha et al. (2024) [6]","POS App Berbasis PWA untuk UMKM","Metode Waterfall dengan Laravel","Black Box 83/83 lulus; UAT 544/600","Tidak ada QRIS dinamis; tidak ada notifikasi push; tidak ada segmentasi customer"],
    ["3","Prista & Wulandari (2024) [7]","Implementasi FCM pada Aplikasi Agenda Rapat","Metode Prototype dengan Firebase","Skor SUS 89,08 (Sangat Memuaskan)","Konteks organisasi mahasiswa; tidak ada QRIS; tidak ada PWA installable"],
    ["4","Rahardjo (2025) [3]","Analisis Adopsi QRIS pada UMKM","Deskriptif kualitatif; 124 UMKM","45,97% adopsi QRIS; manfaat efisiensi & pencatatan","Studi survei; tidak ada implementasi sistem; tidak ada PWA"],
    ["5","Sholihah & Nurhapsari (2023) [4]","Intensi Pengguna QRIS Berdasarkan TAM","Kuantitatif kausal SEM-PLS; 100 responden","Persepsi kemanfaatan (β=0,605) & kemudahan (β=0,285) signifikan; R²=68,6%","Studi kuantitatif; tidak ada implementasi sistem; tidak ada PWA"],
    ["6","Bank Indonesia (2020) [2]","QRIS: Standar Nasional Pembayaran","Regulasi dan standar nasional","QRIS diluncurkan sebagai standar nasional","Dokumen regulasi; tidak ada implementasi teknis QRIS dinamis"],
    ["7","Nurwanto (2019) [8]","Penerapan PWA pada E-Commerce","Studi pustaka dan implementasi","Service worker dan manifest untuk offline caching","Tidak spesifik UMKM; tidak ada QRIS; tidak ada segmentasi"],
    ["8","Adi et al. (2017) [9]","PWA untuk E-Learning Pemrograman Web","Metode Prototype","PWA pada e-learning meningkatkan aksesibilitas","Konteks e-learning; tidak ada QRIS; tidak ada FCM"],
    ["9","Pratama & Diana (2021) [10]","E-Commerce dengan WordPress WooCommerce","Studi implementasi","E-commerce mudah dibangun dan di-deploy","Menggunakan WordPress; tidak ada PWA; tidak ada QRIS"],
    ["10","Kurniawan (2020) [11]","Analisis Performa PWA pada Mobile","Analisis Lighthouse pada 9 situs PWA","Skor PWA 86-97,5 (sangat baik)","Studi analisis; tidak spesifik UMKM; tidak ada QRIS"]
  ]));
  c.push(ep());
  c.push(bp("Berdasarkan Tabel 2.1, dapat diidentifikasi beberapa gap penelitian. Pertama, mayoritas penelitian PWA [5][6][7][8][9][11] tidak mengintegrasikan QRIS sebagai metode pembayaran. Kedua, penelitian QRIS [3][4] berfokus pada aspek adopsi dan persepsi, namun belum banyak yang mengimplementasikan QRIS dinamis dengan nominal embedded sesuai standar EMVCo secara self-generated. Ketiga, penelitian POS App berbasis PWA untuk UMKM [6] belum mengintegrasikan fitur notifikasi otomatis via FCM dan WhatsApp deep link. Keempat, belum ada penelitian yang menggabungkan secara komprehensif: PWA + QRIS dinamis + notifikasi hybrid (FCM + WA) + segmentasi customer + tracking acquisition channel + laporan transaksi otomatis, dalam satu sistem yang dirancang khusus untuk UMKM camilan khas. Tugas akhir ini mengisi gap tersebut."));
  c.push(h2("2.2 Landasan Teori"));
  c.push(h3("2.2.1 Progressive Web App (PWA)"));
  c.push(bp("Progressive Web App (PWA) adalah konsep pengembangan aplikasi web yang menyatukan kelebihan aplikasi web dan aplikasi native, diperkenalkan oleh Google pada Juni 2015 [5]. PWA menggunakan kemampuan web modern yang menggambarkan koleksi teknologi, konsep desain, dan Web API yang bekerja bersama untuk menghadirkan pengalaman pengguna seperti aplikasi native. PWA dapat dijalankan dengan mengklik ikon di layar utama perangkat mobile, dapat berjalan meskipun tidak ada koneksi internet melalui service worker, serta mendukung splash screen dan push notification [5][6]. Tiga komponen utama PWA adalah: (1) Web App Manifest; (2) App Shell; dan (3) Service Worker."));
  c.push(h3("2.2.2 Quick Response Code Indonesian Standard (QRIS)"));
  c.push(bp("Quick Response Code Indonesian Standard (QRIS) adalah standar kode QR pembayaran yang diinisiasi oleh Bank Indonesia bersama Asosiasi Sistem Pembayaran Indonesia (ASPI), diluncurkan mulai 1 Januari 2020 [2]. QRIS merupakan kombinasi dari banyak kode QR yang disediakan untuk membuat proses transaksi pembayaran jauh lebih cepat, mudah, murah, aman, dan handal. Terdapat dua jenis QRIS: QRIS Statis (kode QR yang sama untuk semua transaksi, customer input nominal manual) dan QRIS Dinamis (kode QR yang berubah setiap transaksi, nominal sudah di-embed di dalam QR code). QRIS Dinamis mengikuti standar EMVCo QR Code Specification dengan struktur payload TLV (Tag-Length-Value) yang mencakup tag 54 untuk Transaction Amount dan tag 63 untuk CRC16 checksum."));
  c.push(h3("2.2.3 Firebase Cloud Messaging (FCM)"));
  c.push(bp("Firebase Cloud Messaging (FCM) adalah layanan yang ditawarkan oleh Google yang memungkinkan pengembang mengirimkan pesan atau pemberitahuan melalui smartphone dan browser secara gratis dan unlimited [7]. FCM memungkinkan koneksi antar server dan antar device, sehingga pesan notifikasi dapat dikirim dengan lancar di Android, iOS, dan website. Prista dan Wulandari (2024) mengimplementasikan FCM pada aplikasi agenda rapat dan memperoleh skor SUS 89,08 yang termasuk kategori \"Sangat Memuaskan\" [7]."));
  c.push(h3("2.2.4 Arsitektur Decoupled dan Technology Acceptance Model (TAM)"));
  c.push(bp("Arsitektur decoupled adalah pendekatan pengembangan perangkat lunak yang memisahkan antara lapisan presentasi (frontend) dan lapisan business logic (backend) ke dalam dua codebase terpisah yang berkomunikasi melalui REST API menggunakan format JSON. Dalam penelitian ini, frontend menggunakan Next.js PWA dan backend menggunakan Python FastAPI, dengan JWT sebagai mekanisme autentikasi stateless. Technology Acceptance Model (TAM) merupakan model adopsi teknologi yang dikembangkan oleh Davis (1989) yang mengidentifikasi dua faktor kunci: Persepsi Kemanfaatan (Perceived Usefulness) dan Persepsi Kemudahan (Perceived Ease of Use) [4]. Sholihah dan Nurhapsari (2023) membuktikan bahwa kedua faktor tersebut berpengaruh positif dan signifikan terhadap intensi penggunaan QRIS oleh UMKM [4]. Hasil ini menjadi landasan desain sistem yang diusulkan."));
  c.push(h3("2.2.5 Metode Pengembangan Perangkat Lunak Waterfall"));
  c.push(bp("Metode Waterfall merupakan model pengembangan perangkat lunak yang bersifat sekuensial dan linear, di mana setiap tahap harus selesai sebelum tahap berikutnya dimulai [6]. Tahapan Waterfall terdiri dari: (1) Analisis Kebutuhan; (2) Perancangan; (3) Implementasi; (4) Pengujian; (5) Penyebaran; dan (6) Pemeliharaan. Metode Waterfall dipilih karena cocok untuk proyek dengan requirement yang jelas dan well-defined sejak awal."));
  return c;
}

// ===== BAB III =====
function bab3() {
  const c = [];
  c.push(h1c("BAB III")); c.push(h1c("METODE PENELITIAN"));
  c.push(h2("3.1 Data dan Alat Penelitian"));
  c.push(h3("3.1.1 Data Penelitian"));
  c.push(bp("Data penelitian diperoleh dari hasil observasi dan wawancara langsung dengan owner UMKM Moring Suksok. Observasi dilakukan terhadap proses bisnis existing yang berjalan, mencakup alur pemesanan via WhatsApp, pencatatan transaksi manual menggunakan nota, proses pembayaran via QRIS statis dan transfer DANA, serta proses pengiriman produk ke customer. Wawancara dilakukan untuk mengidentifikasi pain points, kebutuhan fungsional, latar belakang usaha, serta 6 jalur pemasaran yang dijalankan owner. Data transaksi yang dihasilkan dari sistem akan disimpan dalam database MySQL dengan 9 tabel utama: admins, customers (dengan field acquisition_channel untuk tracking sumber customer), products, product_variants, orders, order_items, payments, notifications, dan settings."));
  c.push(h3("3.1.2 Alat Penelitian"));
  c.push(bp("Alat penelitian yang digunakan dalam penelitian ini disajikan dalam Tabel 3.1."));
  c.push(tCap("Tabel 3.1 Alat Penelitian"));
  c.push(makeTable(["No","Jenis","Nama Alat","Spesifikasi / Fungsi"],[
    ["1","Perangkat keras","Laptop","Untuk pengembangan frontend dan backend (minimum 8GB RAM, SSD)"],
    ["2","Perangkat keras","Smartphone Android","Untuk pengujian PWA installable dan push notification (Android 8+)"],
    ["3","Perangkat lunak","Visual Studio Code","Code editor untuk pengembangan"],
    ["4","Perangkat lunak","Node.js 18+ dan npm","Runtime dan package manager untuk Next.js PWA"],
    ["5","Perangkat lunak","Python 3.11+","Runtime untuk FastAPI backend"],
    ["6","Perangkat lunak","Next.js 16","Framework React untuk frontend PWA"],
    ["7","Perangkat lunak","FastAPI","Framework Python untuk REST API backend"],
    ["8","Perangkat lunak","SQLAlchemy 2.0 + Alembic","ORM dan migration tool untuk MySQL"],
    ["9","Perangkat lunak","MySQL 8.4.3 + phpMyAdmin","Database server dan GUI management via Laragon"],
    ["10","Perangkat lunak","Tailwind CSS + shadcn/ui","Styling dan komponen UI untuk frontend"],
    ["11","Perangkat lunak","Firebase Cloud Messaging","Layanan push notification gratis dari Google"],
    ["12","Perangkat lunak","Cloudinary","Image CDN untuk upload bukti pembayaran dan foto produk"],
    ["13","Perangkat lunak","Git + GitHub","Version control dan kolaborasi"],
    ["14","Perangkat lunak","Postman","API testing untuk endpoint FastAPI"]
  ]));
  c.push(h2("3.2 Prosedur Penelitian"));
  c.push(bp("Prosedur penelitian mengikuti metode Waterfall dengan tahapan: (1) Studi Literatur dan Pengumpulan Data; (2) Analisis Kebutuhan; (3) Perancangan; (4) Implementasi; (5) Pengujian; (6) Penyebaran; (7) Pemeliharaan; (8) Penyusunan Laporan dan Artikel Ilmiah. Bagan alur penelitian disajikan pada Gambar 3.1."));
  c.push(placeholder("[Bagan alur penelitian — sisipkan gambar di sini]"));
  c.push(fCap("Gambar 3.1 Alur Penelitian"));
  c.push(h2("3.3 Perancangan"));
  c.push(h3("3.3.1 Analisis Kebutuhan"));
  c.push(bp("Analisis kebutuhan menghasilkan spesifikasi kebutuhan fungsional dan non-fungsional sistem. Kebutuhan fungsional mencakup modul autentikasi (registrasi dengan customer_type dan acquisition_channel, login customer, login admin), modul produk (CRUD produk dan varian, katalog, search, filter), modul keranjang, modul checkout, modul pembayaran (generate QRIS dinamis, upload bukti, verifikasi owner), modul tracking status, modul notifikasi (push via FCM, WhatsApp deep link backup), modul laporan (filter periode, segmen, acquisition channel, export PDF/Excel), dan modul settings."));
  c.push(h3("3.3.2 Analisis Sistem Berjalan dan Sistem Usulan"));
  c.push(bp("Sistem berjalan saat ini: customer menghubungi owner via WhatsApp, owner mencatat di nota manual, customer bayar via DANA atau QRIS statis, owner verifikasi manual via mutasi, owner kirim produk dengan catat status di chat WhatsApp. Sistem yang diusulkan: customer registrasi dan login, browse katalog mandiri, tambah ke keranjang, checkout dengan generate order_code, scan QRIS dinamis dengan nominal embedded, upload bukti pembayaran, owner verifikasi via dashboard, update status dengan tracking real-time, notifikasi otomatis via FCM dan WA deep link, laporan transaksi otomatis dengan export PDF/Excel, serta analisis acquisition channel customer."));
  c.push(h3("3.3.3 Rancangan Sistem"));
  c.push(bp("Rancangan sistem menggunakan diagram UML. Use Case Diagram disajikan pada Gambar 3.2, Activity Diagram untuk proses checkout disajikan pada Gambar 3.3, dan Class Diagram untuk struktur database (9 tabel dengan field acquisition_channel di tabel customers) disajikan pada Gambar 3.4."));
  c.push(placeholder("[Use Case Diagram — sisipkan gambar]")); c.push(fCap("Gambar 3.2 Use Case Diagram"));
  c.push(placeholder("[Activity Diagram Checkout — sisipkan gambar]")); c.push(fCap("Gambar 3.3 Activity Diagram Checkout"));
  c.push(placeholder("[Class Diagram — sisipkan gambar]")); c.push(fCap("Gambar 3.4 Class Diagram"));
  c.push(h3("3.3.4 Rancangan Antarmuka"));
  c.push(bp("Rancangan antarmuka low fidelity dirancang dengan pendekatan mobile-first. Color palette menggunakan tema hijau natural (primary #2D6A4F). Tipografi menggunakan Plus Jakarta Sans untuk body text. Komponen UI menggunakan shadcn/ui (New York style) dengan Tailwind CSS. Halaman utama mencakup: landing page dengan katalog produk, detail produk, keranjang, checkout, pembayaran dengan QRIS, tracking status pesanan, login/registrasi customer (dengan dropdown acquisition channel), dashboard admin, kelola produk, daftar pesanan, laporan transaksi, dan settings."));
  c.push(h2("3.4 Gambaran Hasil Penelitian"));
  c.push(bp("Gambaran hasil penelitian yang diharapkan adalah sistem distribusi dan pencatatan transaksi produk UMKM Moring Suksok berbasis PWA yang berfungsi dengan baik. Sistem diharapkan mampu: (1) menggantikan proses pemesanan via WhatsApp; (2) mengimplementasikan pembayaran QRIS dinamis; (3) menggantikan nota manual dengan nota digital; (4) menyediakan tracking status pesanan end-to-end; (5) mengirimkan notifikasi otomatis via FCM dan WhatsApp; (6) mencatat acquisition channel customer untuk analisis pemasaran; dan (7) menyediakan laporan transaksi dengan filter dan export."));
  c.push(bp("Pengujian meliputi: (1) Black Box Testing dengan indikator keberhasilan 100% test case lulus; dan (2) User Acceptance Testing (UAT) dengan target skor SUS minimal 70. Indikator keberhasilan keseluruhan: semua fitur prioritas \"Must\" terimplementasi, sistem dapat di-deploy ke production, PWA installable di Android, serta mendapat respon positif dari owner dalam UAT."));
  return c;
}

// ===== BAB IV =====
function bab4() {
  const c = [];
  c.push(h1c("BAB IV")); c.push(h1c("PENUTUP"));
  c.push(h2("4.1 Jadwal Penelitian"));
  c.push(bp("Jadwal kegiatan penelitian disusun per bulan selama 6 bulan. Rincian jadwal disajikan dalam Tabel 4.1."));
  c.push(tCap("Tabel 4.1 Jadwal Penelitian"));
  function mc(text) { return new TableCell({ margins: { top: 60, bottom: 60, left: 60, right: 60 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240 }, children: [new TextRun({ text, size: 20, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] })] }); }
  function lc(text, w) { return new TableCell({ width: { size: w || 3000, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 240 }, children: [new TextRun({ text, size: 20, color: P.body, font: { ascii: "Times New Roman", eastAsia: "SimSun" } })] })] }); }
  const hdr = new TableRow({ tableHeader: true, cantSplit: true, children: [lc("No",600), lc("Kegiatan",4000), mc("Bln 1"), mc("Bln 2"), mc("Bln 3"), mc("Bln 4"), mc("Bln 5"), mc("Bln 6")] });
  const rows = [["1","Studi literatur dan pengumpulan data","X","X","","","",""],["2","Analisis kebutuhan dan perancangan","","X","X","","","","3","Implementasi","","","X","X","X",""],["4","Pengujian dan evaluasi","","","","X","X",""],["5","Penyusunan laporan dan artikel ilmiah","","","","","X","X"]].map(r => new TableRow({ cantSplit: true, children: [lc(r[0],600), lc(r[1],4000), mc(r[2]), mc(r[3]), mc(r[4]), mc(r[5]), mc(r[6]), mc(r[7])] }));
  c.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, layout: TableLayoutType.FIXED, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: P.body }, bottom: { style: BorderStyle.SINGLE, size: 4, color: P.body }, left: { style: BorderStyle.SINGLE, size: 4, color: P.body }, right: { style: BorderStyle.SINGLE, size: 4, color: P.body }, insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "808080" }, insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "808080" } }, rows: [hdr, ...rows] }));
  return c;
}

// ===== DAFTAR PUSTAKA =====
function daftarPustaka() {
  const c = [];
  c.push(h1c("DAFTAR PUSTAKA"));
  const refs = [
    "Badan Pusat Statistik, \"Profil Statistik UMKM Indonesia 2022,\" BPS, Jakarta, 2022. [Daring]. Tersedia: https://www.bps.go.id/",
    "Bank Indonesia, \"Quick Response Code Indonesian Standard (QRIS),\" Bank Indonesia, Jakarta, 2020. [Daring]. Tersedia: https://www.bi.go.id/id/id/edukasi/Pages/QRIS.aspx",
    "W. S. Rahardjo, \"Analisis Manfaat dan Kendala Adopsi QRIS pada UMKM: Temuan Survei Lapangan di Wilayah Ciayumajakuning,\" J. Econ. Bus. UBS, vol. 14, no. 6, hlm. 1610–1620, Desember 2025.",
    "E. Sholihah dan R. Nurhapsari, \"Percepatan Implementasi Digital Payment pada UMKM: Intensi Pengguna QRIS Berdasarkan Technology Acceptance Model,\" Nominal Barom. Ris. Akunt. Manaj., vol. 12, no. 1, hlm. 1–12, April 2023, doi: 10.21831/nominal.v12i1.52480.",
    "A. Amrullah, Y. Salim, dan A. R. Manga, \"Implementasi Progressive Web App terhadap Aplikasi E-Commerce,\" Buletin Sist. Inf. Teknol. Islam, vol. 2, no. 3, hlm. 213–221, Agustus 2021.",
    "I. D. Prayudha, M. A. Irwansyah, dan H. Anra, \"Rancang Bangun Aplikasi Point of Sale (POS App) Berbasis Progressive Web App untuk UMKM,\" JUSTIN, vol. 12, no. 2, hlm. 330–337, April 2024, doi: 10.26418/justin.v12i2.76824.",
    "F. C. Prista dan S. Wulandari, \"Implementasi Firebase Cloud Messaging (FCM) pada Aplikasi Agenda Rapat,\" JSAI, vol. 7, no. 3, hlm. 440–448, November 2024, doi: 10.36085.",
    "Nurwanto, \"Penerapan Progressive Web Application (PWA) pada E-Commerce,\" Techno.COM, vol. XVIII, no. 3, hlm. 227–235, 2019.",
    "L. Adi, R. J. Akbar, dan W. N. Khotimah, \"Platform E-Learning untuk Pembelajaran Pemrograman Web Menggunakan Konsep Progressive Web Apps,\" Jurnal Tek. ITS, vol. VI, no. 2, hlm. 579–583, 2017.",
    "A. F. Pratama dan A. Diana, \"Implementasi E-Commerce dengan Content Management System WordPress Menggunakan WooCommerce,\" Indones. J. Inf. Syst., vol. IV, no. 1, hlm. 20–30, 2021.",
    "A. A. Kurniawan, \"Analisis Performa Progressive Web Application (PWA) pada Perangkat Mobile,\" Jurnal Ilm. Inform. Komput., vol. 25, no. 1, hlm. 18–31, 2020.",
    "I. Sommerville, Software Engineering, 10th ed. Boston: Pearson, 2015."
  ];
  refs.forEach((r, i) => c.push(refIEEE(i + 1, r)));
  return c;
}

// ===== LAMPIRAN =====
function lampiran() {
  return [h1c("LAMPIRAN"), bp("Lampiran 1: Tautan Repository GitHub — Source code sistem dapat diakses pada repository GitHub: https://github.com/rdjeee/moring-suksok (akses private, hubungi penulis)."), ep(), bp("Lampiran 2: Instrument Wawancara dengan Owner Moring Suksok — Daftar pertanyaan wawancara dapat diakses dengan menghubungi penulis."), ep(), bp("Lampiran 3: Spesifikasi Detail Sistem — Spesifikasi lengkap (arsitektur, ERD, API contracts, user flows, acceptance criteria) didokumentasikan dalam folder specs/ di repository GitHub.")];
}

// ===== ASSEMBLY =====
const doc = new Document({
  creator: "Raid Javier Julian",
  title: "Proposal Tugas Akhir - Moring Suksok (v2)",
  styles: { default: { document: { run: { font: { ascii: "Times New Roman", eastAsia: "SimSun" }, size: 24, color: "000000" }, paragraph: { spacing: { line: 360 } } }, heading1: { run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 32, bold: true, color: "000000" }, paragraph: { spacing: { before: 360, after: 240, line: 360 } } }, heading2: { run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 28, bold: true, color: "000000" }, paragraph: { spacing: { before: 240, after: 120, line: 360 } } }, heading3: { run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 26, bold: true, color: "000000" }, paragraph: { spacing: { before: 180, after: 120, line: 360 } } } } },
  sections: [
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } }, children: cover1() },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } }, children: cover2() },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } }, children: persetujuan() },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417, header: 850, footer: 992 } } }, footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, font: { ascii: "Times New Roman" } })] })] }) }, children: daftarIsi() },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417, header: 850, footer: 992 } } }, footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, font: { ascii: "Times New Roman" } })] })] }) }, children: abstrak() },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417, header: 850, footer: 992 }, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } }, headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Proposal TA — Raid Javier Julian (NIM 10601027)", size: 18, color: "808080", italics: true, font: { ascii: "Times New Roman" } })] })] }) }, footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, font: { ascii: "Times New Roman" } })] })] }) }, children: [...bab1(), ...bab2(), ...bab3(), ...bab4(), ...daftarPustaka(), ...lampiran()] }
  ]
});

Packer.toBuffer(doc).then(buf => {
  const outputPath = "/home/z/my-project/download/Proposal_TA_Moring_Suksok.docx";
  fs.writeFileSync(outputPath, buf);
  console.log("✅ Document generated successfully!");
  console.log("   Path:", outputPath);
  console.log("   Size:", (buf.length / 1024).toFixed(2), "KB");
}).catch(err => { console.error("❌ Error:", err); process.exit(1); });
