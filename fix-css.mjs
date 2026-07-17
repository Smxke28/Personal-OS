import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace(':root {\n  --color-accent: var(--color-accent);\n}', ':root[data-theme="cyan"] {\n  --color-accent: #00f2fe;\n}\n:root {\n  --color-accent: #00f2fe;\n}');
fs.writeFileSync('src/index.css', css);
console.log('index.css fixed');
