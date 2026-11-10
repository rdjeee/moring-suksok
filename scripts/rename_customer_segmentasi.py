#!/usr/bin/env python3
"""
Bulk update: Rename customer segmentasi from Ritel/Masyarakat to Mitra Kerjasama/Konsumen Akhir
Also rename enum values retail/public to partner/consumer
"""

import os

REPLACEMENTS = [
    # Customer role names
    ("Customer Ritel", "Mitra Kerjasama"),
    ("Customer Masyarakat", "Konsumen Akhir"),
    ("customer Ritel", "Mitra Kerjasama"),
    ("customer Masyarakat", "Konsumen Akhir"),
    ("Ritel (toko/agen", "Mitra Kerjasama (toko/agen"),
    ("Ritel dan Masyarakat", "Mitra Kerjasama dan Konsumen Akhir"),
    ("Ritel vs Masyarakat", "Mitra Kerjasama vs Konsumen Akhir"),
    ("Ritel/Masyarakat", "Mitra Kerjasama/Konsumen Akhir"),
    ("Ritel & Masyarakat", "Mitra Kerjasama & Konsumen Akhir"),
    ("Ritel (toko/agen/reseller)", "Mitra Kerjasama (institusi/organisasi)"),
    ("Ritel (toko/agen yang membeli untuk dijual ulang)", "Mitra Kerjasama (institusi/organisasi seperti Ritel, Alfamart, Indomaret, Kantin Sekolah, Organisasi Kampus, Koperasi)"),
    ("Masyarakat (konsumen akhir yang membeli untuk konsumsi pribadi)", "Konsumen Akhir (masyarakat/individu)"),
    ("Masyarakat (konsumen akhir)", "Konsumen Akhir (masyarakat/individu)"),
    ("retail dan Masyarakat", "Mitra Kerjasama dan Konsumen Akhir"),
    # Enum values in text (not in SQL DDL - that's already updated)
    ("'retail', 'public'", "'partner', 'consumer'"),
    ("retail or public", "partner or consumer"),
    ("customer_type = 'retail'", "customer_type = 'partner'"),
    ("customer_type = 'public'", "customer_type = 'consumer'"),
    # Form/registration references
    ("Segmen (Ritel/Masyarakat)", "Tipe (Mitra Kerjasama/Konsumen Akhir)"),
    ("segmen customer (Ritel/Masyarakat)", "tipe customer (Mitra Kerjasama/Konsumen Akhir)"),
    ("segmen (Ritel/Masyarakat)", "tipe (Mitra Kerjasama/Konsumen Akhir)"),
    # AC references
    ("customer_type.*retail", "customer_type.*partner"),
    ("customer_type.*public", "customer_type.*consumer"),
]

FILES_TO_UPDATE = [
    "specs/00-vision.md",
    "specs/01-requirements.md",
    "specs/03-features.json",
    "specs/06-api-contracts.md",
    "specs/07-user-flows.md",
    "specs/08-acceptance-criteria.md",
    "README.md",
    "OWNERSHIP.md",
]

def update_file(filepath, replacements):
    if not os.path.exists(filepath):
        return 0
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    changes = 0
    for old, new in replacements:
        count = content.count(old)
        if count > 0:
            content = content.replace(old, new)
            changes += count
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    return changes

total = 0
for f in FILES_TO_UPDATE:
    n = update_file(f, REPLACEMENTS)
    if n > 0:
        print(f"  ✅ {f}: {n} replacements")
        total += n
    else:
        print(f"  ⚠️  {f}: no changes")
print(f"\n📊 TOTAL: {total} replacements across {len(FILES_TO_UPDATE)} files")
