"""
Moring Suksok — Database seed script.

Inserts initial data into the database:
  1. Admin default (admin@moring-suksok.com / admin123)
  2. 6 settings (business info, owner QRIS/DANA/WA, shipping cost)
  3. 3 sample products with 7 variants total

Idempotent: safe to run multiple times — skips data that already exists.

Usage::

    cd backend
    source venv/bin/activate
    python seed.py

    # Or via Makefile (NOTE: Makefile currently has tabs issue, see DECISIONS-DEV.md):
    # make seed

Spec reference: specs/05-data-model.md §6 (Seed Data).
"""
import sys

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.admin import Admin
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.setting import Setting


# ---------------------------------------------------------------------------
# Seed data (per specs/05-data-model.md §6)
# ---------------------------------------------------------------------------
ADMIN_DATA = {
    "email": "admin@moring-suksok.com",
    "password": "admin123",  # ⚠️ CHANGE IMMEDIATELY after first login!
    "name": "Owner Moring Suksok",
    "phone": "0812-0000-0000",
}

SETTINGS_DATA = [
    {
        "key_name": "owner_qris_static",
        "value": "",
        "description": "QRIS statis owner (raw string payload)",
    },
    {
        "key_name": "owner_dana_number",
        "value": "",
        "description": "Nomor DANA owner",
    },
    {
        "key_name": "owner_whatsapp",
        "value": "62812xxxxxxx",
        "description": "Nomor WhatsApp owner untuk notifikasi",
    },
    {
        "key_name": "business_name",
        "value": "Moring Suksok",
        "description": "Nama bisnis",
    },
    {
        "key_name": "business_address",
        "value": "Jl. [Alamat Owner], [Kota]",
        "description": "Alamat bisnis",
    },
    {
        "key_name": "shipping_cost_flat",
        "value": "10000",
        "description": "Ongkir default (flat) dalam Rupiah",
    },
]

PRODUCTS_DATA = [
    {
        "name": "Kripik Moring Original",
        "slug": "kripik-moring-original",
        "description": "Kripik daun kelor original dengan rasa gurih dan renyah. Kaya nutrisi dan antioksidan.",
        "category": "snack",
        "base_price": 15000,
        "variants": [
            {"variant_name": "Original 100gr", "stock": 50},
            {"variant_name": "Original 250gr", "stock": 20},
            {"variant_name": "Original 500gr", "stock": 10},
        ],
    },
    {
        "name": "Kripik Moring Pedas",
        "slug": "kripik-moring-pedas",
        "description": "Kripik daun kelor dengan tambahan bumbu pedas untuk pecinta pedas.",
        "category": "snack",
        "base_price": 17000,
        "variants": [
            {"variant_name": "Pedas 100gr", "stock": 40},
            {"variant_name": "Pedas 250gr", "stock": 15},
        ],
    },
    {
        "name": "Kripik Moring Keju",
        "slug": "kripik-moring-keju",
        "description": "Kripik daun kelor dengan topping keju untuk rasa yang lebih creamy.",
        "category": "snack",
        "base_price": 18000,
        "variants": [
            {"variant_name": "Keju 100gr", "stock": 30},
            {"variant_name": "Keju 250gr", "stock": 12},
        ],
    },
]


def seed_admin(db: Session) -> bool:
    """Insert default admin if not exists. Returns True if inserted."""
    existing = db.query(Admin).filter(Admin.email == ADMIN_DATA["email"]).first()
    if existing:
        print(f"  ℹ️  Admin already exists: {ADMIN_DATA['email']} (skipped)")
        return False

    admin = Admin(
        email=ADMIN_DATA["email"],
        password_hash=hash_password(ADMIN_DATA["password"]),
        name=ADMIN_DATA["name"],
        phone=ADMIN_DATA["phone"],
    )
    db.add(admin)
    db.flush()  # get ID without full commit
    print(f"  ✅ Admin inserted: {admin.email} (id={admin.id})")
    print(f"     ⚠️  Password: {ADMIN_DATA['password']} — CHANGE IMMEDIATELY after first login!")
    return True


def seed_settings(db: Session) -> int:
    """Insert default settings. Returns count of inserted rows."""
    inserted = 0
    for data in SETTINGS_DATA:
        existing = db.query(Setting).filter(Setting.key_name == data["key_name"]).first()
        if existing:
            print(f"  ℹ️  Setting already exists: {data['key_name']} (skipped)")
            continue

        setting = Setting(**data)
        db.add(setting)
        inserted += 1
        print(f"  ✅ Setting inserted: {data['key_name']}")
    return inserted


def seed_products(db: Session) -> tuple[int, int]:
    """Insert sample products + variants. Returns (products_count, variants_count)."""
    products_inserted = 0
    variants_inserted = 0

    for prod_data in PRODUCTS_DATA:
        variants_data = prod_data.pop("variants")
        existing = db.query(Product).filter(Product.slug == prod_data["slug"]).first()
        if existing:
            print(f"  ℹ️  Product already exists: {prod_data['name']} (skipped)")
            continue

        product = Product(**prod_data)
        db.add(product)
        db.flush()  # get product.id

        for var_data in variants_data:
            variant = ProductVariant(product_id=product.id, **var_data)
            db.add(variant)
            variants_inserted += 1

        products_inserted += 1
        print(f"  ✅ Product inserted: {product.name} (id={product.id}, {len(variants_data)} variants)")

    return products_inserted, variants_inserted


def main() -> None:
    """Run the full seed sequence."""
    print("=" * 70)
    print("  🌿 Moring Suksok — Database Seed")
    print("=" * 70)
    print()

    db = SessionLocal()
    try:
        print("📋 Seeding admin...")
        seed_admin(db)
        print()

        print("📋 Seeding settings...")
        settings_count = seed_settings(db)
        print()

        print("📋 Seeding products + variants...")
        products_count, variants_count = seed_products(db)
        print()

        db.commit()
        print("─" * 70)
        print(f"  ✅ Seed complete!")
        print(f"     Admins inserted:     {1 if db.query(Admin).count() else 0}")
        print(f"     Settings total:      {db.query(Setting).count()}")
        print(f"     Products total:      {db.query(Product).count()}")
        print(f"     Variants total:      {db.query(ProductVariant).count()}")
        print()
        print("  🔑 Admin login:")
        print(f"     Email:    {ADMIN_DATA['email']}")
        print(f"     Password: {ADMIN_DATA['password']}")
        print(f"     ⚠️  CHANGE PASSWORD IMMEDIATELY after first login!")
        print("─" * 70)
    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}", file=sys.stderr)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
