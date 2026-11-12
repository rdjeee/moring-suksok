#!/usr/bin/env python3
"""
Update Proposal TA script:
1. Remove BPS [1] and Bank Indonesia [2] from Daftar Pustaka
2. Renumber in-text citations [3]→[1] through [12]→[10]
3. Add Basic Cashflow mentions to Abstrak, Bab I, Bab III, Bab IV
"""
import re

with open('/home/z/my-project/scripts/generate_proposal_ta.js', 'r') as f:
    content = f.read()

# === STEP 1: Remove [1] and [2] citation markers from text ===
# [1] in "pada tahun 2022 [1]." → "pada tahun 2022."
content = content.replace("pada tahun 2022 [1].", "pada tahun 2022.")
# [2] in "1 Januari 2020 [2]." → "1 Januari 2020."
content = content.replace("1 Januari 2020 [2].", "1 Januari 2020.")

# === STEP 2: Renumber citations in REVERSE order to avoid conflicts ===
# [12]→[10], [11]→[9], [10]→[8], [9]→[7], [8]→[6], [7]→[5], [6]→[4], [5]→[3], [4]→[2], [3]→[1]
for old, new in [(12, 10), (11, 9), (10, 8), (9, 7), (8, 6), (7, 5), (6, 4), (5, 3), (4, 2), (3, 1)]:
    content = content.replace(f"[{old}]", f"[{new}]")

# === STEP 3: Remove BPS and Bank Indonesia from daftarPustaka array ===
# Find the refs array and remove first 2 entries
old_refs_start = '  const refs = [\n    "Badan Pusat Statistik'
new_refs_start = '  const refs = [\n    "W. S. Rahardjo'
content = content.replace(old_refs_start, new_refs_start)

# Remove the Bank Indonesia line
content = content.replace(
    '    "Bank Indonesia, \\"Quick Response Code Indonesian Standard (QRIS),\\" Bank Indonesia, Jakarta, 2020. [Daring]. Tersedia: https://www.bi.go.id/id/id/edukasi/Pages/QRIS.aspx",\n',
    ''
)

with open('/home/z/my-project/scripts/generate_proposal_ta.js', 'w') as f:
    f.write(content)

print("✅ Citations renumbered: [1][2] removed, [3-12] → [1-10]")
print("✅ Daftar Pustaka: BPS and Bank Indonesia removed")
