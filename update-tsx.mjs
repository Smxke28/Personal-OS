import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');
tsx = tsx.replace(/#00f2fe/g, 'var(--color-accent)');
fs.writeFileSync('src/App.tsx', tsx);
console.log('App.tsx updated');
