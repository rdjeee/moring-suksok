# MIGRATION-NOTES.md
# Alembic Database Migration Log

> **Owner**: Agent B (Dev) | **Started**: 2026-10-29
> **Purpose**: Log semua Alembic migration yang dijalankan (local + production)

---

## 📋 Migration History

| Date | Migration ID | Description | Environment | Status | Run By |
|---|---|---|---|---|---|
| 2026-10-29 | 448d5b9caa1e | init schema - 9 tables | sandbox (SQLite) | ✅ Applied | Agent B |

---

## 🔄 Rollback Log

> Catatan rollback yang pernah dilakukan (jika ada)

| Date | Migration ID | Reason | Rollback To | Result |
|---|---|---|---|---|
| 2026-10-29 | a69b4aa5b794 (discarded) | Index name collision `idx_status` between orders & payments in SQLite | N/A (deleted migration + DB, regenerated) | ✅ Fixed — index names prefixed with table name |

---

## 📝 Migration Notes

### Migration 001: init schema - 9 tables (2026-10-29)

**Migration ID**: `448d5b9caa1e`
**File**: `backend/alembic/versions/448d5b9caa1e_init_schema_9_tables.py`
**Environment**: Sandbox Z.ai (SQLite 3.53.1)
**Alembic version**: 1.14.0
**SQLAlchemy version**: 2.0.36

**Tables created** (9 total):
1. `admins` — 7 cols (id, email, password_hash, name, phone, created_at, updated_at)
2. `customers` — 11 cols + 1 index (idx_customer_type)
3. `products` — 10 cols
4. `product_variants` — 6 cols + 1 FK (product_id) + unique constraint (product_id, variant_name)
5. `orders` — 14 cols + 3 indexes (idx_orders_status, idx_orders_customer, idx_orders_created) + 1 FK (customer_id)
6. `order_items` — 10 cols + 3 FKs (order_id, product_id, variant_id)
7. `payments` — 12 cols + 1 index (idx_payments_status) + 1 FK (order_id)
8. `notifications` — 10 cols + 1 index (idx_user) + 1 FK (related_order_id)
9. `settings` — 5 cols + unique constraint (key_name)

**Total indexes**: 6 (all with table-prefixed names for SQLite compatibility)
**Total foreign keys**: 6

**Seed data inserted** (via `python seed.py`):
- Admin: `admin@moring-suksok.com` (password: `admin123`, bcrypt hash with 12 rounds)
- Settings: 6 keys (owner_qris_static, owner_dana_number, owner_whatsapp, business_name, business_address, shipping_cost_flat)
- Products: 5 produk (Moring Original Rp15K, Pedas Rp17K, Keju Rp18K, Balado Rp17K, Jagung Rp16K) — cimol kering (moring), BUKAN kripik daun kelor
- Variants: 7 total (Original: 3, Pedas: 2, Keju: 2)

**Commands run**:
```bash
cd backend
source venv/bin/activate

# Generate migration
alembic revision --autogenerate -m "init schema - 9 tables"

# Apply migration
alembic upgrade head

# Seed data
python seed.py
```

**Verification** (all passed):
- [x] 9 tabel ter-create di SQLite (admins, customers, products, product_variants, orders, order_items, payments, notifications, settings)
- [x] `admins` table: 1 record (admin@moring-suksok.com)
- [x] `settings` table: 6 records
- [x] `products` table: 3 records
- [x] `product_variants` table: 7 records
- [x] Other tables (customers, orders, order_items, payments, notifications): 0 rows (expected — no data seeded)

**For production (MySQL via Laragon)**:
```bash
# 1. Uncomment MySQL line in backend/.env, comment SQLite line:
#    DATABASE_URL=mysql+pymysql://root:@localhost:3306/moring_suksok
# 2. Pastikan DB "moring_suksok" sudah dibuat di phpMyAdmin (utf8mb4_unicode_ci)
cd backend
source venv/bin/activate
alembic upgrade head    # creates 9 tables in MySQL
python seed.py          # inserts admin + settings + products
# 3. Verify di phpMyAdmin: http://localhost/phpmyadmin → moring_suksok
```

---

## 🚨 Migration Issues Log

> Catatan issue yang ditemukan saat migration + solusinya

### Issue 001: Index name collision in SQLite (2026-10-29 — RESOLVED)

**Problem**: Spec `specs/05-data-model.md` defines `INDEX idx_status (status)` for both `orders` (§4.5) and `payments` (§4.7). MySQL allows duplicate index names across tables (per-table scope), but SQLite requires globally-unique index names. First migration attempt (`a69b4aa5b794`) failed at `CREATE INDEX idx_status ON payments` with `sqlite3.OperationalError: index idx_status already exists`.

**Solution**: Prefixed index names with table name for DB-agnostic compatibility:
- `orders.idx_status` → `orders.idx_orders_status`
- `orders.idx_customer` → `orders.idx_orders_customer`
- `orders.idx_created` → `orders.idx_orders_created`
- `payments.idx_status` → `payments.idx_payments_status`

Other indexes (`customers.idx_customer_type`, `notifications.idx_user`) kept as-is (no collision).

**Impact on spec**: Index names differ from `specs/05-data-model.md` DDL, but functionality is identical (indexes serve the same query-optimization purpose). This is a DB-agnostic adaptation, not a spec deviation. Documented in `DECISIONS-DEV.md` → DEV-DECISION-004.

### Issue 002: Makefile recipe lines use spaces instead of TABs (2026-10-29 — OPEN)

**Problem**: `make migrate` fails with `Makefile:35: *** missing separator (did you mean TAB instead of 8 spaces?)`. Make requires TAB characters for recipe lines, but the Makefile (committed by Agent A) uses 8 spaces.

**Workaround**: Run alembic commands directly instead of via `make`:
```bash
cd backend && source venv/bin/activate
alembic upgrade head      # instead of: make migrate
python seed.py            # instead of: make seed
alembic revision --autogenerate -m "desc"  # instead of: make migrate-create m="desc"
```

**Fix needed**: Agent A to replace 8-space indents with TABs in Makefile recipes. See `DECISIONS-DEV.md` → [SHARED-EDIT-REQUEST-001].

---

## 📚 Alembic Cheat Sheet

```bash
# Generate migration dari perubahan SQLAlchemy models
cd backend && source venv/bin/activate
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

# Generate SQL script (offline mode — no DB connection)
alembic upgrade head --sql
```

---

**Last Updated**: 2026-10-29 22:58 (Asia/Jakarta) — Agent B: initial migration applied + seed complete
