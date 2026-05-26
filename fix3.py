import glob, os

# Map of garbled bytes -> correct text
# Using byte sequences to avoid encoding issues in the script itself
fixes = [
    (b'\xc2\xb7', b'\xc2\xb7'),  # already correct middle dot
    (b'\xc3\x82\xc2\xb7', b'\xc2\xb7'),   # Â· -> ·
    (b'\xc3\xa2\xc2\x80\xc2\x94', b'\xe2\x80\x94'),  # â€" -> —
    (b'\xc3\xa2\xc2\x80\xc2\x99', b'\xe2\x80\x99'),  # â€™ -> '
    (b'\xc3\xa2\xc2\x80\xc2\xa6', b'\xe2\x80\xa6'),  # â€¦ -> …
    (b'\xc3\xa2\xc2\x9c\xc2\x94', b'\xe2\x9c\x94'),  # âœ" -> ✔
    (b'\xc3\xa2\xc2\x86\xc2\x90', b'\xe2\x86\x90'),  # â† -> ←
    (b'\xc3\x83\xc2\xa2\xc3\xa2\xc2\xac\xc3\xa2\xc2\xac', b'\xe2\x80\x94'),  # Ã¢â¬â -> —
]

files = glob.glob('frontend/src/**/*.jsx', recursive=True)
total = 0
for fp in files:
    with open(fp, 'rb') as f:
        raw = f.read()
    orig = raw
    for bad, good in fixes:
        raw = raw.replace(bad, good)
    if raw != orig:
        with open(fp, 'wb') as f:
            f.write(raw)
        print('Fixed:', os.path.basename(fp))
        total += 1
print('Total:', total)
