const fs = require('fs');

function fixMojibake(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const prev = content;
  content = content.split('Ã¢â€ â‚¬').join('─');
  content = content.split('Ã¢Å“â€œ').join('✓');
  content = content.split('Ã¢â‚¬â€').join('—');
  content = content.split('Ã¢â€¢Â').join('═');
  content = content.split('â†’').join('→');
  if (content !== prev) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

fixMojibake('src/pages/HomePage.jsx');
fixMojibake('src/components/SplineHero.jsx');
console.log('Done.');
