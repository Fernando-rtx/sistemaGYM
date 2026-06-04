const fs = require('fs');
const glob = require('glob');

const files = [
    'index.html',
    'src/styles/main.css',
    'src/js/app.js',
    'src/views/dashboard.js',
    'src/views/socios.js',
    'src/views/ventas.js'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace rgba variants
    content = content.replace(/rgba\(148,\s*255,\s*0,\s*0\.1\)/g, 'color-mix(in srgb, var(--color-primary) 10%, transparent)');
    content = content.replace(/rgba\(148,\s*255,\s*0,\s*0\.05\)/g, 'color-mix(in srgb, var(--color-primary) 5%, transparent)');
    content = content.replace(/rgba\(148,\s*255,\s*0,\s*0\.03\)/g, 'color-mix(in srgb, var(--color-primary) 3%, transparent)');
    content = content.replace(/rgba\(148,255,0,0\.2\)/g, 'color-mix(in srgb, var(--color-primary) 20%, transparent)');

    fs.writeFileSync(file, content, 'utf8');
}
