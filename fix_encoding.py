import os, glob

replacements = {
    'Â·': '·',
    'â€"': '—',
    'â€™': "'",
    'â€˜': "'",
    'â€¦': '…',
    'âœ"': '✓',
    'â"€': '─',
    'Ã©': 'é',
}

files = glob.glob('frontend/src/**/*.jsx', recursive=True)
fixed = 0
for fp in files:
    with open(fp, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    original = content
    for bad, good in replacements.items():
        content = content.replace(bad, good)
    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed: {fp}')
        fixed += 1

print(f'Done. Fixed {fixed} files.')
