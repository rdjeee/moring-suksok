# ADR-002: Payment Method Selection
# QRIS Self-Generated (NO Payment Gateway)

> **Status**: Accepted | **Date**: 2026-10-29 | **Decision Maker**: Mahasiswa (with Owner consultation)

---

## Context

Sistem perlu modul pembayaran untuk customer Moring Suksok. Owner Moring Suksok adalah UMKM kecil dengan budget terbatas. Owner sudah memiliki QRIS statis (terhubung ke DANA) yang aktif dan dipakai untuk transaksi via WhatsApp saat ini.

Pertanyaan: Apakah sistem harus mengintegrasikan payment gateway berbayar (Midtrans/Xendit/Faspay) atau cukup gunakan QRIS self-generated (tanpa gateway)?

## Options Considered

### Option A: Midtrans Payment Gateway (Full Integration)

**Implementation**:
- Daftar akun Midtrans (free untuk sandbox, butuh KTP+NPWP untuk production)
- Integrate Midtrans Snap API
- Auto-generate QRIS/VA setiap checkout
- Webhook callback untuk auto-update status pembayaran

**Fee structure**:
- QRIS: 0.7% per transaksi
- Virtual Account (BCA/Mandiri/BNI/BRI): Rp 4.000 flat per transaksi
- Credit Card: 2.9% + Rp 2.000 per transaksi
- Settlement: H+1 (QRIS, VA BCA) atau H+2 (VA lain, credit card)

**Contoh perhitungan untuk Moring Suksok (50 order/bulan, avg Rp 75.000)**:
- 0.7% × 50 × 75.000 = Rp 26.250/bulan
- Rp 315.000/tahun

**Pros**:
- ✅ Status pembayaran auto-update (webhook dari bank/e-wallet)
- ✅ Customer tidak perlu upload bukti (seamless UX)
- ✅ Cash flow ter-track otomatis
- ✅ Multiple payment methods (QRIS, VA, CC, e-wallet)
- ✅ Dashboard analytics dari Midtrans

**Cons**:
- ❌ Fee 0.7% per transaksi (Rp 315rb/tahun untuk 50 order/bulan)
- ❌ Butuh verifikasi dokumen untuk production (KTP, NPWP, rekening bank)
- ❌ Cash flow H+1 (tidak real-time ke DANA owner)
- ❌ Settlement ke rekening bank, bukan DANA (perlu transfer manual jika owner mau pakai DANA)
- ❌ Vendor lock-in (Midtrans-specific API)
- ❌ Untuk TA: perlu setup akun production yang tidak feasible

### Option B: QRIS Self-Generated (CHOSEN)

**Implementation**:
- Owner scan QRIS statis-nya sendiri, paste raw payload ke settings
- Sistem generate QRIS dinamis dengan inject nominal (sesuai EMVCo standard)
- Customer scan QR, bayar via e-wallet apapun (DANA/OVO/GoPay/SeaBank/ShopeePay/m-banking)
- Customer upload screenshot bukti pembayaran
- Owner verifikasi manual (cek bukti + match dengan mutasi DANA)

**Fee structure**:
- Rp 0 (gratis, no gateway)
- Hanya biaya reguler dari e-wallet customer (biasanya gratis untuk QRIS)

**Pros**:
- ✅ Tanpa biaya gateway (Rp 0/year)
- ✅ Tanpa registrasi merchant (cukup scan QRIS statis owner)
- ✅ Cash flow real-time (langsung masuk DANA owner)
- ✅ Customer bebas pilih e-wallet apapun (QRIS universal)
- ✅ Nominal presisi (embedded di QR code)
- ✅ Tanpa vendor lock-in (QRIS adalah standar nasional)
- ✅ Untuk TA: tidak butuh setup tambahan, bisa demo langsung

**Cons**:
- ❌ Status pembayaran TIDAK auto-update (tidak ada webhook dari bank)
- ❌ Customer harus upload bukti (1 langkah ekstra)
- ❌ Owner harus verifikasi manual (cek bukti + match mutasi DANA)
- ❌ Tidak ada dashboard analytics dari gateway
- ❌ Implementasi QRIS dinamis butuh pemahaman EMVCo standard

### Option C: Hybrid (Both Methods, Owner Choose)

**Implementation**:
- Owner bisa pilih mode di dashboard: "Manual QRIS" atau "Midtrans Auto"
- Customer checkout, pilih metode yang aktif

**Pros**:
- ✅ Fleksibilitas penuh untuk owner
- ✅ Bisa demo kedua pendekatan untuk sidang

**Cons**:
- ❌ Development time 2x (2 implementasi)
- ❌ Maintenance kompleks
- ❌ Tidak feasible untuk timeline TA 8 minggu

## Decision

Pilih **Option B: QRIS Self-Generated**.

## Rationale

1. **UMKM budget constraint**: Owner Moring Suksok adalah UMKM kecil. Fee Rp 315rb/tahun mungkin terasa kecil untuk bisnis besar, tapi untuk UMKM yang transaksinya <50/bulan, setiap rupiah dihitung. Apalagi fee ini ongoing selama sistem dipakai.

2. **Cash flow real-time critical**: Owner sering butuh uang langsung dipakai (beli bahan baku daun kelor, dll). Settlement H+1 dari Midtrans akan menghambat operasional. Dengan QRIS self-generated, uang langsung masuk DANA owner dan bisa dipakai hari yang sama.

3. **Existing assets**: Owner sudah punya QRIS statis aktif. Tidak perlu setup merchant baru, cukup scan dan paste payload-nya.

4. **No vendor lock-in**: QRIS adalah standar nasional Indonesia. Sistem tidak terikat ke Midtrans/Xendit manapun. Owner bebas pindah-pindah e-wallet tanpa affecting sistem.

5. **Academic demonstration**: Untuk TA, implementasi QRIS dinamis sesuai EMVCo standard adalah bonus teknis yang menarik. Saya bisa menjelaskan:
   - Bagaimana QRIS payload di-encode (TLV format)
   - Bagaimana inject transaction amount (tag 54)
   - Bagaimana recalculate CRC16 checksum (tag 63)
   - Trade-off teknis-vs-biaya (analisis kritis untuk TA)

6. **Limitasi dapat dijelaskan**: Verifikasi manual owner bisa dijelaskan sebagai trade-off yang acceptable untuk skala UMKM kecil. Tidak ada sistem yang perfect, yang penting fit sesuai kebutuhan.

7. **Future upgrade path**: Kalau owner mau upgrade ke Midtrans nanti (setelah TA), arsitektur sudah disiapkan. Tinggal tambah modul Midtrans, owner pilih mode di settings. Tidak perlu rewrite dari awal.

## Consequences

### Positive
- Tanpa biaya gateway
- Cash flow real-time (DANA langsung masuk)
- Customer fleksibel pilih e-wallet
- Implementasi sesuai EMVCo standard (bonus akademik)
- Owner tidak perlu daftar merchant baru
- Future-proof (bisa upgrade ke Midtrans nanti)

### Negative
- Owner harus verifikasi manual setiap pembayaran (effort administratif)
- Customer harus upload bukti (UX 1 langkah ekstra)
- Tidak ada webhook auto-update status
- Risiko customer bohong "sudah bayar" padahal belum

### Neutral
- Limitasi iOS < 16.4 untuk push notif (mitigasi: WhatsApp deep link fallback)

## Mitigation

| Risk | Mitigation |
|---|---|
| Owner lupa verifikasi | Push notif otomatis ke owner saat customer upload bukti (FCM); dashboard highlight order pending |
| Customer upload bukti salah/tidak jelas | Owner bisa minta re-upload via "Tolak" dengan alasan; customer bisa lihat status real-time |
| Customer bohong sudah bayar | Owner cek mutasi DANA untuk verifikasi silang; bukti upload tetap wajib |
| QRIS owner berubah/expired | Owner bisa update QRIS statis di settings; sistem validasi format QRIS baru sebelum save |
| Tidak ada webhook | Implementasi QRIS dengan nominal unik (3 digit suffix per order) sebagai backup matching — gunakan tag 54 (amount) + custom suffix |

## Implementation Notes

### Library yang Dipakai
- `qris-utils` (Python): parse & modify QRIS payload sesuai EMVCo
- `qrcode` (Python): generate QR code PNG dari string payload
- Custom CRC16 implementation (atau pakai dari `qris-utils`)

### Algoritma Inject Nominal
1. Parse raw QRIS payload (TLV format: Tag-Length-Value)
2. Cek apakah tag 54 (Transaction Amount) sudah ada:
   - Jika ada: replace value dengan nominal baru
   - Jika tidak ada: insert tag 54 di posisi yang sesuai
3. Recalculate CRC16 checksum (tag 63) dengan rumus standar EMVCo
4. Re-encode payload ke string
5. Generate QR code dari string tersebut

### Test Plan
- Test scan QR dengan minimal 3 e-wallet berbeda (DANA, OVO, SeaBank)
- Test nominal benar ter-embed (auto-filled di e-wallet)
- Test edge cases: nominal Rp 0, nominal max (Rp 999,999,999), nominal dengan desimal

## References

- EMVCo QR Code Specification: https://www.emvco.com/
- Bank Indonesia QRIS Documentation: https://qris.id/
- QRIS dinamis vs statis: https://qris.id/dinamis-vs-statis/
- qris-utils library: https://github.com/aiotcloudx/qris-utils

---

**End of ADR-002**
