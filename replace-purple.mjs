import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

tsx = tsx.replace(/#a855f7/g, (match, offset, string) => {
    // Check if it's inside the colors array
    const before = string.slice(Math.max(0, offset - 30), offset);
    if (before.includes("id: 'purple'")) return match;
    if (before.includes("name: 'tech'")) return match; // Tech category
    return 'var(--color-accent)';
});

fs.writeFileSync('src/App.tsx', tsx);
console.log('App.tsx updated');
