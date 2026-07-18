import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

const oldRecurringLoad = `const savedRecurring = localStorage.getItem('pos-recurringItems');
    if (savedRecurring) {
      try {
        setRecurringItems(JSON.parse(savedRecurring));
      } catch (e) {}
    }`;

const newRecurringLoad = `const savedRecurring = localStorage.getItem('pos-recurringItems');
    if (savedRecurring) {
      try {
        let parsed = JSON.parse(savedRecurring);
        // Migration: if income item has a category that is not an income category (like 'food'), change to 'salary'
        parsed = parsed.map((item: any) => {
          if (item.type === 'income' && !['salary', 'freelance', 'internship', 'investments', 'others_income'].includes(item.category)) {
            return { ...item, category: 'salary' };
          }
          return item;
        });
        setRecurringItems(parsed);
      } catch (e) {}
    }`;

tsx = tsx.replace(oldRecurringLoad, newRecurringLoad);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Migration added!');
