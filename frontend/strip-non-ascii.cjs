const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.match(/\.(jsx|js)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      const reps = {
        '→': '->',
        '—': '-',
        '✓': 'Done',
        '─': '-',
        '═': '=',
        'Ã¢â€ â‚¬': '-',
        'Ã¢Å“â€œ': 'Done',
        'Ã¢â‚¬â€': '-',
        'Ã¢â€¢Â': '=',
        'â†’': '->'
      };
      
      for (let k in reps) {
         if (content.includes(k)) {
             content = content.split(k).join(reps[k]);
             modified = true;
         }
      }
      
      // regex to remove ALL non-ascii characters EXCEPT some allowed ones
      // Allowed: standard ascii (0x00-0x7F)
      // We will replace all others with '' to completely eliminate any remaining mojibake
      // Wait, let's just replace them with space or nothing.
      const original = content;
      // Allow only ascii, space, newline. 
      content = content.replace(/[^\x00-\x7F]/g, '');
      if (content !== original) {
          modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}
processDir('src');
console.log('Done cleaning non-ascii.');
