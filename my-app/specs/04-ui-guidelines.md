# 04 — UI Guidelines
# Direction, Palette, dan Komponen UI

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Source**: Penyusunan UI direction berdasarkan persona UMKM

---

## 1. Design Philosophy

### 1.1 Tujuan UX
Membangun antarmuka yang **sederhana, ramah, dan profesional** untuk UMKM Moring Suksok. Target user customer adalah masyarakat awam (berbagai usia, dominan 25-50 tahun) yang familiar dengan e-commerce seperti Tokopedia/Shopee tapi tidak tech-savvy. Target user admin adalah owner (40 tahun) yang butuh dashboard simple dengan info penting prominent.

### 1.2 Prinsip Desain

1. **Sederhana & Jelas**: Setiap halaman harus fokus ke 1 primary action
2. **Mobile-First**: 70% traffic akan dari mobile (Android). Desktop secondary
3. **Familiar Pattern**: Ikuti pattern e-commerce yang sudah dikenal (cart, checkout, tracking)
4. **Touch-Friendly**: Min target ukuran 44x44px untuk tap area
5. **Fast Loading**: Optimasi image, lazy load, skeleton loading
6. **Accessibility**: WCAG 2.1 Level AA, contrast ratio ≥4.5:1 untuk text
7. **Branding Moring**: Warna hijau daun kelor + natural earthy tone

### 1.3 Tone & Voice
- **Bahasa**: Indonesia formal-santai (tidak kaku, tapi profesional)
- **Tone**: Ramah, transparent, helpful
- **Example copy**:
  - ✅ "Selamat datang di Moring Suksok! 🌿"
  - ✅ "Pesanan Anda sedang diproses. Kami akan memberi tahu saat sudah dikirim."
  - ❌ "Pesanan dalam proses verifikasi administratif."
  - ❌ "Terima kasih telah melakukan transaksi pada platform kami."

---

## 2. Color Palette

### 2.1 Primary Colors (Branding Moring)

Palet warna terinspirasi dari daun kelor (moringa) — hijau alami dengan aksen earthy. Memberikan kesan natural, healthy, dan trustworthy.

| Token | Hex | Usage |
|---|---|---|
| `moring-green-primary` | `#2D6A4F` | Primary brand color, header, primary buttons |
| `moring-green-dark` | `#1B4332` | Hover state, footer |
| `moring-green-light` | `#52B788` | Success state, secondary accent |
| `moring-green-pale` | `#D8F3DC` | Background highlight, badge background |

### 2.2 Neutral Colors

| Token | Hex | Usage |
|---|---|---|
| `neutral-900` | `#1A1A1A` | Body text (primary) |
| `neutral-700` | `#404040` | Body text (secondary) |
| `neutral-500` | `#6B7280` | Captions, disabled text |
| `neutral-300` | `#D1D5DB` | Borders, dividers |
| `neutral-100` | `#F3F4F6` | Surface background (cards, table header) |
| `neutral-50` | `#FAFAFA` | Page background |
| `white` | `#FFFFFF` | Card background, inputs |

### 2.3 Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `success` | `#10B981` | Success toast, verified status |
| `warning` | `#F59E0B` | Pending status, warning toast |
| `danger` | `#EF4444` | Error toast, rejected status |
| `info` | `#3B82F6` | Info toast, info badge |

### 2.4 Status Pesanan Colors

| Status | Background | Text | Icon |
|---|---|---|---|
| Pending | `#FEF3C7` (warning-pale) | `#92400E` (warning-dark) | ⏳ Clock |
| Diproses | `#DBEAFE` (info-pale) | `#1E40AF` (info-dark) | 📦 Package |
| Dikirim | `#E0E7FF` (purple-pale) | `#3730A3` (purple-dark) | 🚚 Truck |
| Selesai | `#D1FAE5` (success-pale) | `#065F46` (success-dark) | ✅ Check |
| Ditolak | `#FEE2E2` (danger-pale) | `#991B1B` (danger-dark) | ❌ X |

---

## 3. Typography

### 3.1 Font Family

| Usage | Font | Source |
|---|---|---|
| Heading & Body | **Plus Jakarta Sans** | Google Fonts (free, modern, friendly) |
| Numeric/Monospace | **JetBrains Mono** | Google Fonts (untuk order code, no resi) |

**Fallback**: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`

**Kenapa Plus Jakarta Sans?**
- Modern dan clean
- Punya character (tidak generic seperti Inter)
- Free & open source
- Mendukung Bahasa Indonesia dengan baik
- Cocok untuk brand "Moring" yang ramah

### 3.2 Font Scale (Mobile-First)

| Element | Size | Weight | Line Height |
|---|---|---|---|
| H1 (page title) | 28px | 700 Bold | 1.2 |
| H2 (section) | 24px | 700 Bold | 1.3 |
| H3 (subsection) | 20px | 600 SemiBold | 1.4 |
| H4 (card title) | 18px | 600 SemiBold | 1.4 |
| Body Large | 16px | 400 Regular | 1.5 |
| Body Default | 14px | 400 Regular | 1.5 |
| Body Small (caption) | 12px | 400 Regular | 1.5 |
| Button Text | 14px | 600 SemiBold | 1.2 |
| Input Label | 12px | 600 SemiBold | 1.4 |
| Input Value | 16px | 400 Regular | 1.5 |

### 3.3 Numeric Display

Untuk harga, total, dan angka penting lainnya:
- Font: JetBrains Mono (tabular figures)
- Weight: 600 SemiBold
- Format: `Rp 75.000` (titik sebagai pemisah ribuan, tanpa desimal)

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (8px base)

Gunakan kelipatan 4px (untuk fine-tuning) atau 8px (utama):

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Tight spacing (icon to text) |
| `space-2` | 8px | Default between small elements |
| `space-3` | 12px | Between form fields |
| `space-4` | 16px | Card padding (mobile), default between elements |
| `space-5` | 20px | Card padding (desktop) |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Major section spacing |
| `space-10` | 40px | Page top/bottom padding |
| `space-12` | 48px | Hero section spacing |

### 4.2 Container & Grid

- **Mobile** (<640px): Full width, padding 16px
- **Tablet** (640-1024px): Max-width 768px, padding 24px
- **Desktop** (>1024px): Max-width 1200px, padding 32px
- **Admin Dashboard**: Max-width 1440px (more space for tables)

### 4.3 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Small badges, tags |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Hero sections |
| `radius-full` | 9999px | Pills, avatars, FAB |

### 4.4 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle depth (inputs) |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, dropdowns |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, popovers |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Floating elements, FAB |

---

## 5. Component Library

### 5.1 Buttons

#### Variants
```tsx
// Primary (green) - main CTA
<Button variant="primary">Beli Sekarang</Button>

// Secondary (outline) - alternative action
<Button variant="secondary">Lihat Detail</Button>

// Ghost (text only) - tertiary action
<Button variant="ghost">Batal</Button>

// Danger (red) - destructive action
<Button variant="danger">Hapus</Button>

// Success (green-light) - confirmation
<Button variant="success">Konfirmasi Lunas</Button>
```

#### Sizes
- **Small**: 32px height, padding 8px 12px
- **Medium** (default): 40px height, padding 12px 16px
- **Large**: 48px height, padding 16px 24px (untuk primary CTA di mobile)
- **Block**: Full width (untuk mobile checkout buttons)

#### States
- Default, Hover (bg darker 10%), Active (bg darker 20%), Disabled (50% opacity, not-allowed cursor), Loading (spinner + disabled)

### 5.2 Cards

```tsx
// Product Card (grid layout)
<Card>
  <CardImage src={product.image_url} alt={product.name} />
  <CardContent>
    <CardTitle>{product.name}</CardTitle>
    <CardPrice>Rp {product.base_price.toLocaleString('id-ID')}</CardPrice>
    <CardButton variant="primary" size="small">Tambah ke Keranjang</CardButton>
  </CardContent>
</Card>
```

### 5.3 Forms & Inputs

- **Input**: rounded-md, border-gray-300, focus:border-moring-green
- **Label**: text-sm, font-semibold, mb-1
- **Helper text**: text-xs, text-gray-500, mt-1
- **Error text**: text-xs, text-red-500, mt-1
- **Required asterisk**: text-red-500, ml-1

### 5.4 Status Badge

```tsx
<StatusBadge status="pending">
  ⏳ Menunggu Verifikasi
</StatusBadge>
<StatusBadge status="processed">
  📦 Sedang Diproses
</StatusBadge>
<StatusBadge status="shipped">
  🚚 Dikirim
</StatusBadge>
<StatusBadge status="done">
  ✅ Selesai
</StatusBadge>
```

### 5.5 Toast Notifications

- Position: top-center (mobile) / top-right (desktop)
- Auto-dismiss: 4 detik
- Stack: max 3 toasts
- Animasi: slide in dari top, fade out

### 5.6 Modal / Dialog

- Backdrop: `rgba(0,0,0,0.5)` + blur(2px)
- Modal: white background, rounded-lg, shadow-xl
- Max width: 90% viewport (mobile), 480px (desktop)
- Close: X button top-right + click backdrop

### 5.7 Tables (Admin)

- Horizontal lines only (no vertical)
- Header: bold, bg-neutral-100
- Row hover: bg-neutral-50
- Pagination: bottom right
- Empty state: illustration + message

### 5.8 Empty States

Setiap list/table harus punya empty state yang ramah:
```tsx
<EmptyState
  icon="📦"
  title="Belum ada pesanan"
  message="Pesanan yang masuk akan muncul di sini."
/>
```

---

## 6. Layout Patterns

### 6.1 Customer Area

#### Landing Page (/)
```
┌─────────────────────────────────────┐
│ Header (logo + cart + login)         │
├─────────────────────────────────────┤
│ Hero Section (banner + CTA)          │
├─────────────────────────────────────┤
│ Featured Products (grid 2 cols mobile)│
├─────────────────────────────────────┤
│ Categories Filter                    │
├─────────────────────────────────────┤
│ All Products (grid 2 cols mobile)    │
├─────────────────────────────────────┤
│ Footer (info + social)               │
└─────────────────────────────────────┘
```

#### Product Detail (/produk/[slug])
```
┌─────────────────────────────────────┐
│ Back button + product name           │
├─────────────────────────────────────┤
│ Product Image (large)                 │
├─────────────────────────────────────┤
│ Product Name + Price                 │
│ Description                           │
├─────────────────────────────────────┤
│ Variant Selector (dropdown/radio)    │
├─────────────────────────────────────┤
│ Quantity Stepper                     │
├─────────────────────────────────────┤
│ Stock indicator                      │
├─────────────────────────────────────┤
│ [Tambah ke Keranjang] (primary btn)  │
│ [Beli Sekarang] (secondary btn)      │
└─────────────────────────────────────┘
```

#### Cart (/cart)
```
┌─────────────────────────────────────┐
│ Header: Keranjang Belanja            │
├─────────────────────────────────────┤
│ Cart Item 1 (foto + name + qty + x)  │
│ Cart Item 2                          │
│ Cart Item 3                          │
├─────────────────────────────────────┤
│ Subtotal: Rp XXX                     │
│ Ongkir: Rp YYY                       │
│ Total: Rp ZZZ (highlighted)          │
├─────────────────────────────────────┤
│ [Checkout] (primary btn, full width) │
└─────────────────────────────────────┘
```

#### Payment (/payment/[orderId])
```
┌─────────────────────────────────────┐
│ Header: Pembayaran                   │
├─────────────────────────────────────┤
│ Order Summary (order code + total)   │
│ Total: Rp 75.000 (large)             │
├─────────────────────────────────────┤
│ Pilih Metode:                        │
│  ○ QRIS (selected)                   │
│  ○ Transfer ke DANA                  │
├─────────────────────────────────────┤
│ QR Code (large, centered)            │
│ [Download QR] (secondary btn)        │
├─────────────────────────────────────┤
│ Instruksi:                           │
│ 1. Scan QR via DANA/OVO/SeaBank      │
│ 2. Bayar sesuai nominal              │
│ 3. Upload bukti pembayaran           │
├─────────────────────────────────────┤
│ [Upload Bukti] (primary btn)         │
│ [Saya sudah bayar] (ghost btn)       │
└─────────────────────────────────────┘
```

### 6.2 Admin Dashboard

#### Dashboard (/admin)
```
┌─────────────────────────────────────┐
│ Sidebar (logo + nav menu)            │
├─────────────────────────────────────┤
│ Topbar (admin name + notifications)  │
├─────────────────────────────────────┤
│ Welcome + Date                       │
├─────────────────────────────────────┤
│ Stat Cards (4 cards):                │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───┐│
│ │ Total │ │ Total │ │ Order │ │New││
│ │ Order │ │ Revenue│ │Pending││   ││
│ └───────┘ └───────┘ └───────┘ └───┘│
├─────────────────────────────────────┤
│ Recent Orders (table, 5 latest)      │
├─────────────────────────────────────┤
│ Quick Actions:                       │
│ - Kelola Produk                     │
│ - Lihat Semua Pesanan               │
│ - Laporan Transaksi                 │
└─────────────────────────────────────┘
```

#### Admin Orders (/admin/orders)
```
┌─────────────────────────────────────┐
│ Header: Daftar Pesanan               │
├─────────────────────────────────────┤
│ Filter: [Semua] [Pending] [Diproses] │
│         [Dikirim] [Selesai] [Ditolak]│
├─────────────────────────────────────┤
│ Search by order code / customer     │
├─────────────────────────────────────┤
│ Table:                               │
│ | Order | Customer | Total | Status |│
│ |  Code |   Name   |       |        |│
│ |-------|----------|-------|--------|│
│ | ORD-..| Budi     | Rp75k | Pending││
│ | ORD-..| Siti     | Rp120k| Proses ││
├─────────────────────────────────────┤
│ Pagination                          │
└─────────────────────────────────────┘
```

---

## 7. Iconography

### 7.1 Icon Library
- **Library**: Lucide React (sudah included via shadcn/ui)
- **Style**: Outline, 1.5px stroke, rounded corners
- **Default size**: 20px (mobile), 18px (desktop)
- **Color**: inherit dari parent text color

### 7.2 Custom Icons Needed

| Icon | Usage |
|---|---|
| Logo Moring (leaf) | Header, footer, splash |
| Cart icon | Header cart button |
| QR Code icon | Payment section |
| WhatsApp icon | WA button |
| Bank/e-wallet icons | Payment method selector |

---

## 8. Image Guidelines

### 8.1 Product Images
- **Aspect ratio**: 1:1 (square) atau 4:3
- **Resolution**: min 600x600px, recommended 1024x1024px
- **Format**: WebP (preferred) atau JPG
- **Size**: max 500KB per image
- **Background**: Putih atau netral (no busy background)
- **Upload**: via Cloudinary (auto-optimize)

### 8.2 Bukti Pembayaran
- **Format**: JPG, PNG, atau PDF
- **Size**: max 5MB
- **Storage**: Cloudinary (image), Supabase/Vercel Blob (PDF)

### 8.3 Icons & Illustrations
- **Icons**: SVG (Lucide React)
- **Illustrations**: undraw.co (free, customizable)
- **Empty state illustrations**: 240x240px

---

## 9. Responsive Breakpoints

Tailwind CSS default breakpoints:

| Breakpoint | Width | Target |
|---|---|---|
| `sm` | 640px | Large phones (landscape), small tablets |
| `md` | 768px | Tablets (portrait) |
| `lg` | 1024px | Tablets (landscape), small laptops |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Mobile-First Rule
Default styles untuk mobile (<640px). Gunakan `sm:`, `md:`, `lg:` untuk override di screen lebih besar.

```tsx
// Example: 2 columns mobile, 3 columns tablet, 4 columns desktop
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
```

---

## 10. Loading & Empty States

### 10.1 Loading States

| Component | Loading Pattern |
|---|---|
| Page load | Skeleton screen (mirip layout akhir) |
| Button click | Spinner inside button + disabled |
| Image load | Blurhash placeholder |
| API call | Skeleton list/cards |
| Long task (upload PDF) | Progress bar |

### 10.2 Skeleton Loading
```tsx
<ProductCardSkeleton />
// Gray placeholder dengan animasi shimmer
```

### 10.3 Empty States
Setiap list harus punya empty state:
- **Icon**: ilustrasi atau emoji besar
- **Title**: judul singkat ("Belum ada pesanan")
- **Message**: penjelasan ramah ("Pesanan yang masuk akan muncul di sini.")
- **CTA** (opsional): tombol aksi ("Mulai belanja")

---

## 11. Animation & Transitions

### 11.1 Default Transitions

| Element | Property | Duration | Easing |
|---|---|---|---|
| Button hover | background-color | 150ms | ease-out |
| Modal open | opacity + transform | 200ms | ease-out |
| Toast in | opacity + translateY | 300ms | ease-out |
| Page transition | opacity | 200ms | ease-in-out |
| List item enter | opacity + translateY | 250ms | ease-out |

### 11.2 Reduce Motion
Respect `prefers-reduced-motion: reduce` (CSS media query). Disable non-essential animations.

---

## 12. Accessibility (WCAG 2.1 AA)

### 12.1 Wajib
- **Contrast ratio**: ≥4.5:1 untuk text normal, ≥3:1 untuk large text
- **Focus visible**: outline 2px solid moring-green saat keyboard nav
- **Alt text**: semua image wajib alt text descriptive
- **Form labels**: semua input wajib label associated (via `htmlFor`)
- **Semantic HTML**: gunakan `<button>`, `<nav>`, `<main>`, `<article>`, dll
- **ARIA**: tambah ARIA labels untuk icon-only buttons
- **Keyboard nav**: semua interactive elements dapat diakses via Tab
- **Skip to content**: link "Skip to main content" di awal page

### 12.2 Recommended
- Screen reader testing dengan NVDA/VoiceOver
- Color blindness simulator (Chrome DevTools)
- Lighthouse audit score ≥90

---

## 13. PWA UI Considerations

### 13.1 Install Prompt
- Tampilkan setelah user login + browse 2+ halaman
- Custom prompt (jangan default browser prompt)
- Tombol "Install App" di header (mobile)
- Setelah install: tampilkan toast "Berhasil diinstall!"

### 13.2 Standalone Mode (setelah install)
- Hide browser address bar
- Safe area insets (iPhone notch)
- Splash screen dengan logo Moring
- Status bar color sesuai theme

### 13.3 Offline Mode
- Cache halaman utama (katalog, cart, profil)
- Show offline indicator di header
- Disable buttons yang butuh API call saat offline
- Queue actions untuk sync saat online

---

## 14. Branding Assets

### 14.1 Logo
- **Primary**: Logo Moring Suksok (leaf icon + text)
- **Variants**:
  - Horizontal (header)
  - Stacked (footer, splash)
  - Icon only (favicon, app icon)
- **Colors**: moring-green-primary + white (atau dark untuk light bg)

### 14.2 Favicon & App Icons
- **Favicon**: 32x32, 16x16 (PNG)
- **PWA Icon**: 192x192, 512x512 (PNG)
- **Apple Touch Icon**: 180x180 (PNG)
- **Maskable Icon**: 512x512 dengan safe area (80% center)

### 14.3 Splash Screen (PWA)
- Background: moring-green-primary
- Logo: white, centered
- Loading: spinner bawah

---

## 15. Reference Inspiration

UI inspiration untuk Agent B (Dev) — bukan untuk dicopy 1:1, tapi untuk memahami direction:

| Aspek | Reference | URL |
|---|---|---|
| Color scheme | Tailwind UI E-commerce | https://tailwindui.com |
| Layout | Tokopedia lite (simplified) | https://tokopedia.com |
| Card design | Stripe Press | https://press.stripe.com |
| Admin Dashboard | Tremor (dashboard library) | https://tremor.so |
| Form design | Vercel Forms | https://vercel.com |
| Empty states | unDraw illustrations | https://undraw.co |

---

## 16. Component Library Stack

| Library | Usage | Version |
|---|---|---|
| **shadcn/ui** | Base components (Button, Card, Input, Modal, Toast) | latest |
| **Radix UI** | Accessible primitives (under shadcn/ui) | latest |
| **Lucide React** | Icons | latest |
| **Tailwind CSS** | Styling utility-first | 3.4+ |
| **class-variance-authority** | Component variants | latest |
| **clsx + tailwind-merge** | className utility | latest |

### 16.1 Custom Components Needed

Selain shadcn/ui default, Agent B perlu build:
- `<ProductCard />` - Card produk khusus
- `<StatusBadge />` - Badge status pesanan (5 variants)
- `<OrderTimeline />` - Timeline visual status pesanan
- `<QRCodeDisplay />` - Wrapper qrcode.react dengan download button
- `<PriceTag />` - Format harga IDR (tabular figures)
- `<CartDrawer />` - Drawer cart di mobile
- `<EmptyState />` - Empty state dengan icon + message + CTA
- `<StatCard />` - Stat card untuk admin dashboard
- `<DataTable />` - Table dengan filter, sort, pagination

---

**End of 04-ui-guidelines.md**
