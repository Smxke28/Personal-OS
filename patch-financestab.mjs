import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

tsx = tsx.replace(
  "function FinancesTab({ transactions, computedCategories, renderIcon, onAdd, onDelete, onAddCategory, periodFilter, setPeriodFilter }: any) {",
  "function FinancesTab({ transactions, computedCategories, renderIcon, onAdd, onDelete, onAddCategory, periodFilter, setPeriodFilter, recurringItems, setRecurringItems }: any) {\n  const [financesTab, setFinancesTab] = useState<'transactions' | 'fixed'>('transactions');\n  const [recType, setRecType] = useState<'income' | 'expense'>('income');\n  const [recDesc, setRecDesc] = useState('');\n  const [recAmount, setRecAmount] = useState('');\n  const [recCategory, setRecCategory] = useState('food');\n  const [recDay, setRecDay] = useState('');"
);

tsx = tsx.replace(
  "<FinancesTab \n                  transactions={filteredTransactions} \n                  computedCategories={computedCategories}\n                  renderIcon={renderIcon}\n                  onAdd={handleRegisterTransaction}\n                  onDelete={handleDeleteTransaction}\n                  onAddCategory={handleAddCategory}\n                  periodFilter={periodFilter}\n                  setPeriodFilter={setPeriodFilter}\n                />",
  "<FinancesTab \n                  transactions={filteredTransactions} \n                  computedCategories={computedCategories}\n                  renderIcon={renderIcon}\n                  onAdd={handleRegisterTransaction}\n                  onDelete={handleDeleteTransaction}\n                  onAddCategory={handleAddCategory}\n                  periodFilter={periodFilter}\n                  setPeriodFilter={setPeriodFilter}\n                  recurringItems={recurringItems}\n                  setRecurringItems={setRecurringItems}\n                />"
);

fs.writeFileSync('src/App.tsx', tsx);
console.log('App.tsx FinancesTab patched');
