# 06 — API Contracts
# Spesifikasi Endpoint REST API FastAPI

> **Spec Owner**: Agent A (Planning) | **Status**: Final v1.0.0 | **Last Updated**: 2026-10-29
> **Source**: Dokumen Perencanaan Bab 10

---

## 1. Konvensi API

### 1.1 Base URL

| Environment | Base URL |
|---|---|
| Local Development | `http://localhost:8000/api/v1` |
| Staging | `https://api.moring-suksok-staging.railway.app/api/v1` |
| Production | `https://api.moringsuksok.id/api/v1` |

### 1.2 Format

| Aspek | Konvensi |
|---|---|
| Request format | JSON (`application/json`), kecuali upload file: `multipart/form-data` |
| Response format | JSON konsisten: `{ "success": bool, "message": str, "data": obj/arr, "meta": obj }` |
| Auth | Bearer Token JWT di header: `Authorization: Bearer <token>` |
| Pagination | Query params: `?page=1&per_page=20`; response: `meta: { page, per_page, total, total_pages }` |
| Date format | ISO 8601 (`2026-10-29T14:30:00Z`) |
| Currency | Integer dalam Rupiah (`75000` untuk Rp 75.000) |
| Docs | Swagger UI otomatis di `/docs`; ReDoc di `/redoc` |

### 1.3 HTTP Status Code

| Code | Name | Usage |
|---|---|---|
| 200 | OK | GET success, PATCH/DELETE success |
| 201 | Created | POST create success |
| 204 | No Content | DELETE success (no body) |
| 400 | Bad Request | Invalid input, malformed JSON |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Authenticated but no permission (e.g. customer access admin endpoint) |
| 404 | Not Found | Resource not exists |
| 422 | Unprocessable Entity | Validation error (Pydantic) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### 1.4 Error Response Format

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email sudah terdaftar"
    },
    {
      "field": "password",
      "message": "Password minimal 8 karakter"
    }
  ]
}
```

### 1.5 Success Response Format

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

---

## 2. Daftar Endpoint Lengkap

### 2.1 Auth Module (`/api/v1/auth`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | Public | Registrasi customer baru |
| POST | `/auth/login` | Public | Login customer |
| POST | `/auth/admin/login` | Public | Login admin |
| POST | `/auth/refresh` | Customer/Admin | Refresh JWT token |
| POST | `/auth/logout` | Customer/Admin | Logout (invalidate token) |
| GET | `/auth/me` | Customer/Admin | Get current user profile |
| PATCH | `/auth/me` | Customer/Admin | Update own profile |

#### 2.1.1 POST `/auth/register`

**Request:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890",
  "password": "secret123",
  "address": "Jl. Merdeka No. 1, Jakarta",
  "customer_type": "retail"
}
```

**Response 201:**
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

**Validation Rules:**
- `name`: required, 3-100 chars
- `email`: required, valid email format, unique
- `phone`: required, format `08xxxxxxxx` or `+62xxx`
- `password`: required, min 8 chars, must contain letter+number
- `address`: required, min 10 chars
- `customer_type`: required, enum ['retail', 'public']

#### 2.1.2 POST `/auth/login`

**Request:**
```json
{
  "email": "budi@example.com",
  "password": "secret123"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login berhasil",
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

#### 2.1.3 POST `/auth/admin/login`

**Request:**
```json
{
  "email": "admin@moring-suksok.com",
  "password": "admin123"
}
```

**Response 200:** Same as `/auth/login` but with `role: "admin"` in payload.

#### 2.1.4 GET `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "budi@example.com",
    "name": "Budi Santoso",
    "phone": "081234567890",
    "address": "Jl. Merdeka No. 1, Jakarta",
    "customer_type": "retail",
    "created_at": "2026-10-29T10:00:00Z"
  }
}
```

#### 2.1.5 PATCH `/auth/me`

**Request:**
```json
{
  "name": "Budi S. Updated",
  "phone": "081299999999",
  "address": "Jl. Sudirman No. 2, Jakarta",
  "fcm_token": "firebase-token-string-here"
}
```

**Response 200:** Same as GET `/auth/me` with updated data.

---

### 2.2 Product Module (`/api/v1/products`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/products` | Public | List produk (pagination, search, filter) |
| GET | `/products/{slug}` | Public | Detail produk + varian |
| POST | `/admin/products` | Admin | Tambah produk baru |
| PATCH | `/admin/products/{id}` | Admin | Edit produk |
| DELETE | `/admin/products/{id}` | Admin | Soft delete produk |
| POST | `/admin/products/{id}/variants` | Admin | Tambah varian |
| PATCH | `/admin/products/{id}/variants/{vid}` | Admin | Edit varian |
| DELETE | `/admin/products/{id}/variants/{vid}` | Admin | Hapus varian |

#### 2.2.1 GET `/products`

**Query Params:**
- `page`: int, default 1
- `per_page`: int, default 12, max 50
- `search`: string, optional (search by name)
- `category`: string, optional (filter by category)

**Response 200:**
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
      "image_url": "https://res.cloudinary.com/moring/image/upload/...",
      "variants": [
        {"id": 1, "variant_name": "Original 100gr", "stock": 50},
        {"id": 2, "variant_name": "Original 250gr", "stock": 20}
      ]
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 12,
    "total": 25,
    "total_pages": 3
  }
}
```

#### 2.2.2 GET `/products/{slug}`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Kripik Moring Original",
    "slug": "kripik-moring-original",
    "description": "Kripik daun kelor original...",
    "category": "snack",
    "base_price": 15000,
    "image_url": "https://res.cloudinary.com/moring/...",
    "is_active": true,
    "variants": [
      {"id": 1, "variant_name": "Original 100gr", "stock": 50},
      {"id": 2, "variant_name": "Original 250gr", "stock": 20}
    ],
    "created_at": "2026-10-29T10:00:00Z"
  }
}
```

**Response 404:** Product not found.

#### 2.2.3 POST `/admin/products`

**Auth:** Admin (Bearer token with `role: "admin"`)

**Request (multipart/form-data):**
- `name`: string, required
- `description`: string, optional
- `category`: string, default "snack"
- `base_price`: integer (Rupiah), required, min 1000
- `image`: file (jpg/png/webp), required, max 5MB
- `variants`: JSON string, e.g. `[{"variant_name": "Original 100gr", "stock": 50}]`

**Response 201:**
```json
{
  "success": true,
  "message": "Produk berhasil ditambahkan",
  "data": {
    "id": 2,
    "name": "Kripik Moring Pedas",
    "slug": "kripik-moring-pedas",
    "base_price": 17000,
    "image_url": "https://res.cloudinary.com/moring/...",
    "variants": [
      {"id": 3, "variant_name": "Pedas 100gr", "stock": 40}
    ]
  }
}
```

---

### 2.3 Cart Module (`/api/v1/cart`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/cart` | Customer | Get isi cart |
| POST | `/cart/items` | Customer | Tambah item ke cart |
| PATCH | `/cart/items/{id}` | Customer | Edit qty item |
| DELETE | `/cart/items/{id}` | Customer | Hapus item dari cart |
| DELETE | `/cart` | Customer | Clear cart |

#### 2.3.1 GET `/cart`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Kripik Moring Original",
        "variant_id": 1,
        "variant_name": "Original 100gr",
        "quantity": 2,
        "price_per_unit": 15000,
        "subtotal": 30000,
        "image_url": "https://res.cloudinary.com/moring/..."
      }
    ],
    "subtotal": 30000,
    "shipping_cost": 10000,
    "total": 40000
  }
}
```

#### 2.3.2 POST `/cart/items`

**Request:**
```json
{
  "product_id": 1,
  "variant_id": 1,
  "quantity": 2
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Item ditambahkan ke keranjang",
  "data": {
    "id": 1,
    "product_id": 1,
    "variant_id": 1,
    "quantity": 2,
    "subtotal": 30000
  }
}
```

**Validation:**
- `product_id`: required, must exists and `is_active=true`
- `variant_id`: optional, must belong to product if specified
- `quantity`: required, int, min 1, must ≤ variant stock

---

### 2.4 Order Module (`/api/v1/orders`)

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

#### 2.4.1 POST `/orders` (Checkout)

**Request:**
```json
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

**Response 201:**
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
    "items": [...],
    "created_at": "2026-10-29T14:30:00Z"
  }
}
```

**Business Logic:**
1. Validate cart not empty
2. Validate all products & variants still exists and have stock
3. Generate `order_code` (ORD-YYYYMMDD-XXX, auto-increment per day)
4. Snapshot `product_name`, `variant_name`, `price_per_unit` di order_items
5. Clear cart after order created
6. Return order detail + total

#### 2.4.2 GET `/orders`

**Query Params:**
- `page`, `per_page`: pagination
- `status`: optional filter (pending, processed, shipped, done, cancelled)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "order_code": "ORD-20261029-001",
      "status": "pending",
      "total": 55000,
      "items_count": 3,
      "created_at": "2026-10-29T14:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 5,
    "total_pages": 1
  }
}
```

#### 2.4.3 GET `/orders/{id}`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "order_code": "ORD-20261029-001",
    "status": "shipped",
    "shipping_address": "Jl. Merdeka No. 1, Jakarta",
    "shipping_method": "delivery",
    "shipping_cost": 10000,
    "subtotal": 45000,
    "total": 55000,
    "tracking_number": "JNE1234567890",
    "notes": "Tolong dikemas rapi",
    "items": [
      {
        "product_id": 1,
        "product_name": "Kripik Moring Original",
        "variant_id": 1,
        "variant_name": "Original 100gr",
        "quantity": 2,
        "price_per_unit": 15000,
        "subtotal": 30000
      }
    ],
    "payment": {
      "method": "qris",
      "amount": 55000,
      "status": "verified",
      "verified_at": "2026-10-29T15:00:00Z"
    },
    "created_at": "2026-10-29T14:30:00Z",
    "updated_at": "2026-10-29T16:00:00Z"
  }
}
```

#### 2.4.4 GET `/admin/orders`

**Query Params:**
- `page`, `per_page`: pagination
- `status`: filter by status
- `customer_type`: filter by Ritel/Masyarakat
- `search`: search by order_code or customer name
- `from`, `to`: date range filter (YYYY-MM-DD)

**Response 200:** Same format as `/orders` but include customer info.

#### 2.4.5 PATCH `/admin/orders/{id}/verify`

**Request:**
```json
{}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Pembayaran terverifikasi, status pesanan diupdate ke Diproses",
  "data": {
    "id": 42,
    "status": "processed",
    "payment": {
      "status": "verified",
      "verified_by": 1,
      "verified_at": "2026-10-29T15:00:00Z"
    }
  }
}
```

**Side effects:**
- Update `payments.status = 'verified'`
- Update `payments.verified_by = admin_id`
- Update `payments.verified_at = NOW()`
- Update `orders.status = 'processed'`
- Trigger push notification ke customer: "Pembayaran terverifikasi! Pesanan ORD-XXX sedang diproses"
- Insert log ke `notifications` table

#### 2.4.6 PATCH `/admin/orders/{id}/reject`

**Request:**
```json
{
  "rejection_reason": "Bukti pembayaran tidak jelas, mohon upload ulang"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Pembayaran ditolak, customer telah diberitahu",
  "data": {
    "id": 42,
    "status": "cancelled",
    "payment": {
      "status": "rejected",
      "rejection_reason": "Bukti pembayaran tidak jelas, mohon upload ulang"
    }
  }
}
```

#### 2.4.7 PATCH `/admin/orders/{id}/ship`

**Request:**
```json
{
  "tracking_number": "JNE1234567890"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Pesanan dikirim, customer telah diberitahu",
  "data": {
    "id": 42,
    "status": "shipped",
    "tracking_number": "JNE1234567890"
  }
}
```

#### 2.4.8 PATCH `/admin/orders/{id}/complete`

**Response 200:**
```json
{
  "success": true,
  "message": "Pesanan selesai",
  "data": {
    "id": 42,
    "status": "done"
  }
}
```

---

### 2.5 Payment Module (`/api/v1/payments`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/payments/{order_id}/qris` | Customer | Generate QRIS dinamis |
| POST | `/payments/{order_id}/upload` | Customer | Upload bukti pembayaran |
| GET | `/payments/{order_id}` | Customer/Admin | Detail payment |

#### 2.5.1 POST `/payments/{order_id}/qris`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "order_id": 42,
    "total": 55000,
    "qris_payload": "00020101021226...",
    "qr_image_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
    "expires_at": "2026-10-29T15:30:00Z"
  }
}
```

**Business Logic:**
1. Validate order exists and belongs to customer
2. Get `owner_qris_static` from settings table
3. Inject nominal (order.total) ke QRIS payload (using `qris-utils`)
4. Recalculate CRC16 checksum
5. Generate QR code PNG (using `qrcode` library)
6. Encode QR image to base64
7. Save `qris_payload` to `payments.qris_payload` for reference
8. Return QR image + raw payload

#### 2.5.2 POST `/payments/{order_id}/upload`

**Request (multipart/form-data):**
- `file`: image (jpg/png) or PDF, max 5MB

**Response 200:**
```json
{
  "success": true,
  "message": "Bukti pembayaran berhasil diupload",
  "data": {
    "order_id": 42,
    "payment_id": 1,
    "proof_image_url": "https://res.cloudinary.com/moring/payment-proof/...",
    "status": "pending"
  }
}
```

**Validation:**
- File MIME type must be in: `image/jpeg`, `image/png`, `application/pdf`
- File size max 5MB
- Order must exist and belong to customer

**Side effects:**
1. Upload file to Cloudinary
2. Save URL to `payments.proof_image_url`
3. Update `payments.status = 'pending'`
4. Trigger push notification to admin: "Pesanan baru ORD-XXX dari {customer_name}"
5. Insert log ke `notifications` table

---

### 2.6 Notification Module (`/api/v1/notifications`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/notifications` | Customer/Admin | List notifikasi user |
| POST | `/notifications/fcm-token` | Customer/Admin | Register/update FCM token |
| POST | `/notifications/{id}/wa-link` | Customer/Admin | Generate WhatsApp deep link URL |
| PATCH | `/notifications/{id}/read` | Customer/Admin | Tandai notif sebagai dibaca |

#### 2.6.1 GET `/notifications`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Pesanan baru ORD-20261029-001",
      "message": "Dari Budi Santoso, total Rp 55.000",
      "type": "push",
      "status": "sent",
      "related_order_id": 42,
      "created_at": "2026-10-29T14:35:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 5,
    "total_pages": 1
  }
}
```

#### 2.6.2 POST `/notifications/fcm-token`

**Request:**
```json
{
  "fcm_token": "firebase-token-string-here"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "FCM token berhasil diupdate"
}
```

#### 2.6.3 POST `/notifications/{id}/wa-link`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "wa_link": "https://wa.me/62812xxxxxxx?text=Halo%20Owner%2C%20saya%20baru%20upload%20bukti%20pembayaran%20untuk%20pesanan%20ORD-20261029-001..."
  }
}
```

---

### 2.7 Settings Module (`/api/v1/admin/settings`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/admin/settings` | Admin | Get semua settings |
| PATCH | `/admin/settings` | Admin | Update settings |
| POST | `/admin/settings/qris/validate` | Admin | Validasi QRIS format |

#### 2.7.1 GET `/admin/settings`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "owner_qris_static": "00020101021226...",
    "owner_dana_number": "0812xxxxxxx",
    "owner_whatsapp": "62812xxxxxxx",
    "business_name": "Moring Suksok",
    "business_address": "Jl. [Alamat], [Kota]",
    "shipping_cost_flat": 10000
  }
}
```

#### 2.7.2 PATCH `/admin/settings`

**Request:**
```json
{
  "owner_qris_static": "00020101021226...[updated]",
  "owner_dana_number": "081299999999",
  "owner_whatsapp": "6281299999999"
}
```

**Response 200:** Same as GET response with updated values.

#### 2.7.3 POST `/admin/settings/qris/validate`

**Request:**
```json
{
  "qris_payload": "00020101021226..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "merchant_name": "MORING SUKSOK",
    "merchant_id": "ID1234567890123"
  }
}
```

**Response 200 (invalid):**
```json
{
  "success": true,
  "data": {
    "valid": false,
    "error": "Invalid CRC16 checksum"
  }
}
```

---

### 2.8 Reports Module (`/api/v1/admin/reports`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/admin/reports` | Admin | Laporan transaksi dengan filter |
| GET | `/admin/reports/export` | Admin | Export laporan (PDF/Excel) |
| GET | `/admin/reports/summary` | Admin | Dashboard summary cards |
| GET | `/admin/reports/top-products` | Admin | Produk terlaris |
| GET | `/admin/reports/segment-breakdown` | Admin | Penjualan per segmen customer |
| GET | `/admin/orders/{id}/nota.pdf` | Admin | Download nota PDF per order |

#### 2.8.1 GET `/admin/reports`

**Query Params:**
- `from`: date (YYYY-MM-DD), default 7 days ago
- `to`: date (YYYY-MM-DD), default today
- `customer_type`: optional ('retail' or 'public')
- `status`: optional (filter by order status)
- `page`, `per_page`: pagination

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "order_code": "ORD-20261029-001",
        "order_date": "2026-10-29T14:30:00Z",
        "customer_name": "Budi Santoso",
        "customer_type": "retail",
        "items_count": 3,
        "total": 55000,
        "payment_status": "verified",
        "order_status": "processed"
      }
    ],
    "summary": {
      "total_transactions": 25,
      "total_revenue": 1250000,
      "average_order_value": 50000,
      "retail_count": 10,
      "public_count": 15
    }
  },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 25,
    "total_pages": 2
  }
}
```

#### 2.8.2 GET `/admin/reports/export?format=pdf`

**Query Params:** Same as GET `/admin/reports`

**Response 200:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="laporan-moring-suksok-2026-10-29.pdf"`
- Body: PDF binary stream

#### 2.8.3 GET `/admin/reports/summary`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_customers": 45,
    "total_orders": 125,
    "total_revenue": 6250000,
    "pending_orders": 3,
    "processed_orders": 5,
    "shipped_orders": 2,
    "completed_orders": 115,
    "average_order_value": 50000,
    "repeat_customer_rate": 0.35
  }
}
```

#### 2.8.4 GET `/admin/reports/top-products`

**Query Params:**
- `limit`: int, default 5

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "product_name": "Kripik Moring Original",
      "total_sold": 45,
      "revenue": 675000
    }
  ]
}
```

#### 2.8.5 GET `/admin/reports/segment-breakdown`

**Query Params:**
- `from`, `to`: date range

**Response 200:**
```json
{
  "success": true,
  "data": {
    "retail": {
      "count": 50,
      "revenue": 2750000,
      "percentage": 44
    },
    "public": {
      "count": 75,
      "revenue": 3500000,
      "percentage": 56
    }
  }
}
```

#### 2.8.6 GET `/admin/orders/{id}/nota.pdf`

**Response 200:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="nota-ORD-20261029-001.pdf"`
- Body: PDF binary stream (nota resmi dengan layout professional)

---

## 3. Contoh Implementasi Endpoint (FastAPI)

Berikut contoh implementasi reference untuk Agent B:

```python
# backend/app/api/v1/payments.py
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
    # 1. Validate order milik customer
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

    # 3. Save ke payments table
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
    # 1. Validate file
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

## 4. Rate Limiting

Untuk mencegah abuse, rate limiting diterapkan:

| Endpoint | Rate Limit |
|---|---|
| POST `/auth/login` | 5 requests/minute per IP |
| POST `/auth/register` | 3 requests/minute per IP |
| POST `/payments/*/upload` | 10 requests/hour per customer |
| GET `/products` | 100 requests/minute per IP |
| Other endpoints | 60 requests/minute per user |

Implementation: gunakan `slowapi` middleware FastAPI.

---

## 5. CORS Configuration

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Allowed origins:**
- Dev: `http://localhost:3000`
- Staging: `https://moring-suksok-staging.vercel.app`
- Production: `https://moringsuksok.vercel.app`, `https://moringsuksok.id`

---

## 6. Testing Strategy

Untuk setiap endpoint, Agent B perlu write tests:

### 6.1 Test Levels

1. **Unit test**: Validasi Pydantic schema, business logic di services
2. **Integration test**: Endpoint dengan test database (SQLite in-memory atau MySQL test)
3. **E2E test**: Full flow (register → cart → checkout → upload → verify)

### 6.2 Test Tools

- `pytest` + `pytest-asyncio` untuk async tests
- `httpx` (AsyncClient) untuk API testing
- `pytest-cov` untuk coverage report

### 6.3 Coverage Target

- **Critical modules** (auth, payments, orders): ≥80%
- **Other modules**: ≥60%

---

## 7. Postman Collection

Setelah backend siap, Agent B harus generate Postman collection dan simpan di `docs/api-collection.json` untuk testing manual & handover.

Struktur folder Postman:
- 01 - Auth
- 02 - Products
- 03 - Cart
- 04 - Orders
- 05 - Payments
- 06 - Notifications
- 07 - Settings
- 08 - Reports

---

**End of 06-api-contracts.md**
