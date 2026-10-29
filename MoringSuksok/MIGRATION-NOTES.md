# MIGRATION-NOTES.md
# Alembic Database Migration Log

> **Owner**: Agent B (Dev) | **Started**: TBD
> **Purpose**: Log semua Alembic migration yang dijalankan (local + production)

---

## 📋 Migration History

| Date | Migration ID | Description | Environment | Status | Run By |
|---|---|---|---|---|---|
| TBD | TBD | init schema - 9 tables | local | ⏳ Pending | Agent B |

---

## 🔄 Rollback Log

> Catatan rollback yang pernah dilakukan (jika ada)

| Date | Migration ID | Reason | Rollback To | Result |
|---|---|---|---|---|
| - | - | - | - | - |

---

## 📝 Migration Notes

### Migration: init schema - 9 tables (TBD)

**Tables created**:
1. `admins`
2. `customers`
3. `products`
4. `product_variants`
5. `orders`
6. `order_items`
7. `payments`
8. `notifications`
9. `settings`

**Seed data inserted**:
- Admin: `admin@moring-suksok.com` (default password: `admin123`)
- Settings: 6 keys (owner_qris_static, owner_dana_number, owner_whatsapp, business_name, business_address, shipping_cost_flat)
- Products: 3 contoh produk (Original, Pedas, Keju) dengan varian masing-masing

**Commands run**:
```bash
cd backend
alembic revision --autogenerate -m "init schema - 9 tables"
alembic upgrade head
python seed.py
```

**Verification**:
- [ ] Cek di phpMyAdmin: 9 tabel ter-create
- [ ] Cek `admins` table: 1 record (admin default)
- [ ] Cek `settings` table: 6 records
- [ ] Cek `products` table: 3 records + variants di `product_variants`

---

## 🚨 Migration Issues Log

> Catatan issue yang ditemukan saat migration + solusinya

- (TBD)

---

## 📚 Alembic Cheat Sheet

```bash
# Generate migration dari perubahan SQLAlchemy models
alembic revision --autogenerate -m "description here"

# Apply migration (upgrade ke revision terbaru)
alembic upgrade head

# Rollback 1 step
alembic downgrade -1

# Rollback ke revision tertentu
alembic downgrade <revision_id>

# Lihat status migration
alembic current

# Lihat history migration
alembic history --verbose
```

---

**Last Updated**: 2026-10-29 (template initial)
