import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

const migrationRegex = /\/\/ Migration:[\s\S]*?setRecurringItems\(parsed\);/;

const newMigration = `// Migration: fix old items that don't have a type, and fix categories
        parsed = parsed.map((item: any) => {
          let type = item.type;
          if (!type) {
            type = 'expense'; // default old items to expense
          }
          let category = item.category;
          if (type === 'income' && !['salary', 'freelance', 'internship', 'investments', 'others_income'].includes(category)) {
            category = 'salary';
          }
          return { ...item, type, category };
        });
        setRecurringItems(parsed);`;

tsx = tsx.replace(migrationRegex, newMigration);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Migration updated!');
