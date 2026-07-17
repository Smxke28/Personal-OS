import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

tsx = tsx.replace(
  "  const computedCategories = allCategories.map(cat => {",
  `  const computedCategories = allCategories.map(cat => {
    const recurringAmount = recurringItems
      .filter(r => r.type === 'expense' && r.category.toLowerCase() === cat.name.toLowerCase())
      .reduce((sum, r) => sum + r.amount, 0);`
);

tsx = tsx.replace(
  "      .reduce((sum, t) => sum + t.amount, 0);",
  "      .reduce((sum, t) => sum + t.amount, 0) + recurringAmount;"
);

tsx = tsx.replace(
  "  const totalExpenses = computedCategories.reduce((sum, c) => sum + c.amount, 0);",
  "  const totalIncome = recurringItems.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);\n  const totalExpenses = computedCategories.reduce((sum, c) => sum + c.amount, 0);\n  const balance = totalIncome - totalExpenses;"
);

tsx = tsx.replace(
  "totalExpenses={totalExpenses}",
  "totalExpenses={totalExpenses} totalIncome={totalIncome} balance={balance}"
);

tsx = tsx.replace(
  "function HomeTab({ totalExpenses, focusHours, streak, transactions, baseCategories }: any)",
  "function HomeTab({ totalExpenses, totalIncome, balance, focusHours, streak, transactions, baseCategories }: any)"
);

const homeReplacement = `        <div className="bg-gradient-to-br from-accent/20 to-transparent border border-accent/30 p-4 rounded-2xl col-span-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-accent mb-1 tracking-widest">SALDO DO MÊS</p>
            <p className="text-3xl font-display font-bold text-white shadow-sm">\${balance.toFixed(2)}</p>
            {totalIncome > 0 && <p className="text-[10px] text-gray-400 font-mono mt-1">Entradas: \${totalIncome.toFixed(2)} | Despesas: \${totalExpenses.toFixed(2)}</p>}
          </div>
          <DollarSign className="w-10 h-10 text-accent opacity-50" />
        </div>`;
        
tsx = tsx.replace(
  /<div className="bg-gradient-to-br from-accent\/20 to-transparent border border-accent\/30 p-4 rounded-2xl col-span-2 flex items-center justify-between">[\s\S]*?<\/div>\s*<\/div>/,
  homeReplacement + "\n      </div>"
);

fs.writeFileSync('src/App.tsx', tsx);
console.log('App.tsx derived data patched');
