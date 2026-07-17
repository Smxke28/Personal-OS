import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf-8');

// Replace hex usage
css = css.replace(/#00f2fe/g, 'var(--color-accent)');

// Replace rgba usage
css = css.replace(/rgba\(0,\s*242,\s*254,\s*([0-9.]+)\)/g, (match, opacity) => {
    return `color-mix(in srgb, var(--color-accent) ${Math.round(parseFloat(opacity) * 100)}%, transparent)`;
});

fs.writeFileSync('src/index.css', css);
console.log('CSS updated');
