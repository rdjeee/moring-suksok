#!/usr/bin/env python3
"""
Bulk update spec files: correct product description from "daun kelor / kripik"
to "cimol kering (moring)" based on user clarification.

Files updated (Agent A owned):
- specs/00-vision.md
- specs/01-requirements.md
- specs/04-ui-guidelines.md
- specs/05-data-model.md
- specs/06-api-contracts.md
- specs/08-acceptance-criteria.md
- specs/decisions/ADR-002-qris-self-generated.md
- README.md (SHARED - critical correction, Agent A may fix)

Files NOT updated here (Agent B owned - inform via NOTIF-004):
- DECISIONS-DEV.md
- MIGRATION-NOTES.md
- public/manifest.json (frontend zone)
"""

import re
import os

# Define replacements (order matters - more specific first)
REPLACEMENTS = [
    # Product name corrections (most specific first)
    ("Kripik Moring Original 100gr", "Moring Original 100gr"),
    ("Kripik Moring Original 250gr", "Moring Original 250gr"),
    ("Kripik Moring Original 500gr", "Moring Original 500gr"),
    ("Kripik Moring Pedas 100gr", "Moring Pedas 100gr"),
    ("Kripik Moring Pedas 250gr", "Moring Pedas 250gr"),
    ("Kripik Moring Keju 100gr", "Moring Keju 100gr"),
    ("Kripik Moring Keju 250gr", "Moring Keju 250gr"),
    ("Kripik Moring Balado 100gr", "Moring Balado 100gr"),
    ("Kripik Moring Balado 250gr", "Moring Balado 250gr"),
    ("Kripik Moring Jagung 100gr", "Moring Jagung 100gr"),
    ("Kripik Moring Jagung 250gr", "Moring Jagung 250gr"),
    # Product names (general)
    ("Kripik Moring Original", "Moring Original"),
    ("Kripik Moring Pedas", "Moring Pedas"),
    ("Kripik Moring Keju", "Moring Keju"),
    ("Kripik Moring Balado", "Moring Balado"),
    ("Kripik Moring Jagung", "Moring Jagung"),
    ("Kripik Moring", "Moring"),
    # Product description (long form)
    ("snack/kripik moring", "cimol kering (moring)"),
    ("snack kripik moring", "cimol kering (moring)"),
    ("Snack/Kripik Moring", "Cimol Kering (Moring)"),
    # Plant reference removal (CRITICAL)
    ("olahan daun kelor (moringa)", "camilan cimol kering (moring)"),
    ("olahan daun kelor", "camilan cimol kering"),
    ("daun kelor (moringa)", "cimol kering (moring)"),
    ("daun kelor (moring)", "cimol kering (moring)"),
    ("daun kelor", "cimol kering"),
    ("moringa)", "moring)"),  # leftover "moringa)" → "moring)"
    # Color theme reference (don't mention "daun kelor" anymore)
    ("hijau daun kelor", "hijau natural"),
    ("Warna hijau daun kelor", "Warna hijau natural"),
    # Description expansion
    ("pengolahan produk berbahan dasar daun kelor (moringa)",
     "pengolahan camilan khas berupa cimol kering (moring)"),
    ("pengolahan produk berbahan dasar daun kelor",
     "pengolahan camilan khas berupa cimol kering (moring)"),
    # Tagline (in case exists)
    ("Snack Sehat dari Alam", "Snack Khas Suksok"),
    # Seed data product examples - update to new 5 products
    ("'Kripik Moring Original'", "'Moring Original'"),
    ("'Kripik Moring Pedas'", "'Moring Pedas'"),
    ("'Kripik Moring Keju'", "'Moring Keju'"),
    ("'kripik-moring-original'", "'moring-original'"),
    ("'kripik-moring-pedas'", "'moring-pedas'"),
    ("'kripik-moring-keju'", "'moring-keju'"),
    # Description in seed example
    ("Kripik daun kelor original dengan rasa gurih dan renyah. Kaya nutrisi dan antioksidan.",
     "Cimol kering (moring) dengan rasa original, gurih, renyah, dan tahan lama."),
    ("Kripik daun kelor dengan tambahan bumbu pedas untuk pecinta pedas.",
     "Cimol kering (moring) dengan bumbu pedas untuk pecinta pedas."),
    ("Kripik daun kelor dengan topping keju untuk rasa yang lebih creamy.",
     "Cimol kering (moring) dengan topping keju untuk rasa yang lebih creamy."),
    # Product description in spec
    ("produk olahan daun kelor (snack/kripik moring)",
     "camilan cimol kering (moring)"),
    ("produk olahan daun kelor", "camilan cimol kering (moring)"),
    # UI Guidelines reference
    ("hijau alami (moringa leaf)", "hijau natural (brand Moring Suksok)"),
    ("hijau alami", "hijau natural"),
]

# Files to update (Agent A owned + SHARED README.md)
FILES_TO_UPDATE = [
    "specs/00-vision.md",
    "specs/01-requirements.md",
    "specs/04-ui-guidelines.md",
    "specs/05-data-model.md",
    "specs/06-api-contracts.md",
    "specs/08-acceptance-criteria.md",
    "specs/decisions/ADR-002-qris-self-generated.md",
    "README.md",
]

def update_file(filepath, replacements):
    """Apply all replacements to a file. Returns (count_before, count_after, changes_made)."""
    if not os.path.exists(filepath):
        return 0, 0, 0

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes_made = 0

    for old, new in replacements:
        old_count = content.count(old)
        if old_count > 0:
            content = content.replace(old, new)
            changes_made += old_count

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    return len(original_content), len(content), changes_made


def main():
    print("=" * 70)
    print("BULK UPDATE: Correct product description (daun kelor → cimol kering)")
    print("=" * 70)
    print()

    total_changes = 0

    for filepath in FILES_TO_UPDATE:
        before, after, changes = update_file(filepath, REPLACEMENTS)
        if changes > 0:
            print(f"  ✅ {filepath}: {changes} replacements ({before} → {after} chars)")
            total_changes += changes
        else:
            print(f"  ⚠️  {filepath}: no changes needed")

    print()
    print(f"📊 TOTAL: {total_changes} replacements across {len(FILES_TO_UPDATE)} files")

    # Verify no more "daun kelor" or "kripik moring" remains in updated files
    print()
    print("=" * 70)
    print("VERIFICATION: Searching for leftover problematic terms...")
    print("=" * 70)

    leftover_terms = [
        "daun kelor",
        "olahan daun kelor",
        "kripik moring",
        "Kripik Moring",
        "snack/kripik moring",
        "moringa",
    ]

    for filepath in FILES_TO_UPDATE:
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read().lower()
        for term in leftover_terms:
            if term.lower() in content:
                count = content.count(term.lower())
                print(f"  ⚠️  {filepath}: still contains '{term}' ({count} occurrences)")

    print()
    print("✅ Verification complete (any leftovers shown above)")


if __name__ == "__main__":
    main()
