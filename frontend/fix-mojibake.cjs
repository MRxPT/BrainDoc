const fs = require('fs');
const path = require('path');

const replacements = {
  'â†’': '→',
  'Ã¢â‚¬â€': '—',
  'Ã¢â‚¬â€\x8D': '—',
  'Ã¢Å“â€œ': '✓',
  'Ã¢â€ â‚¬': '─',
  'Ã¢â€¢Â': '═',
  'â€”': '—',
  'â€œ': '“',
  'â€\x9D': '”',
  'â€˜': '‘',
  'â€™': '’',
  'â€¢': '•',
  'â€“': '–',
  'Â·': '·',
  'Â©': '©',
  'Â°': '°',
  'Ã—': '×'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.match(/\.(jsx|js|ts|tsx)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const [bad, good] of Object.entries(replacements)) {
        if (content.includes(bad)) {
          content = content.split(bad).join(good);
          modified = true;
        }
      }
      
      // Also catch weird single unmapped ones that look like broken ascii
      if (content.includes('â')) {
          // let's do a regex replace for the remaining broken unicode sequences
          // Usually 'â€"' or 'â€' something
          const prev = content;
          content = content.replace(/â\x80\x94/g, '—');
          content = content.replace(/â\x86\x92/g, '→');
          if (content !== prev) modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('src');
console.log('Done.');
