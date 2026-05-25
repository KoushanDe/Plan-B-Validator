const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else if (filePath.endsWith('.tsx')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const files = getFiles('src');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Backgrounds
  content = content.replace(/bg-\[#0a0a0c\]/g, 'bg-app-base');
  content = content.replace(/bg-\[#0f0f12\]/g, 'bg-app-panel');
  content = content.replace(/bg-\[#08080a\]/g, 'bg-app-panel'); // close enough for dark
  content = content.replace(/bg-white\/\s*\[0\.01\]/g, 'bg-app-subtle');
  content = content.replace(/bg-white\/5/g, 'bg-app-subtle');
  content = content.replace(/bg-white\/10/g, 'bg-app-subtle-hover');
  
  // Text
  content = content.replace(/text-\[#e0e0e0\]/g, 'text-app-main');
  content = content.replace(/text-white\/95/g, 'text-app-main');
  content = content.replace(/text-white\/85/g, 'text-app-main');
  content = content.replace(/text-white\/80/g, 'text-app-main');
  content = content.replace(/text-white\/70/g, 'text-app-muted');
  content = content.replace(/text-white\/60/g, 'text-app-muted');
  content = content.replace(/text-white\/50/g, 'text-app-muted');
  content = content.replace(/text-white\/40/g, 'text-app-dim');
  content = content.replace(/text-white\/30/g, 'text-app-dim');
  content = content.replace(/text-white\/20/g, 'text-app-dim');
  content = content.replace(/text-white\[?[^a-zA-Z]/g, match => {
    return 'text-app-main' + match.slice(10);
  });
  content = content.replace(/text-white\b/g, 'text-app-main');
  
  // Custom fix for bg-white in forms (often inputs)
  content = content.replace(/bg-white\/\[0\.03\]/g, 'bg-app-input');
  content = content.replace(/bg-transparent/g, 'bg-transparent');

  // Borders
  content = content.replace(/border-white\/15/g, 'border-app-border-strong');
  content = content.replace(/border-white\/10/g, 'border-app-border');
  content = content.replace(/border-white\/5/g, 'border-app-border-light');
  content = content.replace(/border-white\/\[0\.05\]/g, 'border-app-border-light');

  // Greens
  content = content.replace(/text-emerald-400|text-emerald-500/g, 'text-app-success');
  content = content.replace(/bg-emerald-500\/10|bg-emerald-955\/15/g, 'bg-app-success-bg');
  content = content.replace(/border-emerald-500\/10/g, 'border-app-success-border');
  content = content.replace(/text-emerald-300|text-emerald-200/g, 'text-app-success-muted');

  // Reds
  content = content.replace(/text-red-400|text-red-500|text-rose-450|text-rose-400|text-rose-500/g, 'text-app-error');
  content = content.replace(/bg-red-500\/10|bg-red-950\/40|bg-rose-950\/10|bg-rose-955\/15/g, 'bg-app-error-bg');
  content = content.replace(/border-red-500\/20|border-red-500\/30|border-rose-500\/20|border-rose-500\/10/g, 'border-app-error-border');
  content = content.replace(/text-red-300|text-red-200|text-rose-300/g, 'text-app-error-muted');

  // Gold
  content = content.replace(/text-\[#d4af37\]/g, 'text-app-gold');
  content = content.replace(/bg-\[#d4af37\]/g, 'bg-app-gold');
  content = content.replace(/border-\[#d4af37\]/g, 'border-app-gold');

  fs.writeFileSync(f, content);
});
console.log('done.');
