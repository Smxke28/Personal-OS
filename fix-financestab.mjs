import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Signature of FinancesTab
tsx = tsx.replace(
  "function FinancesTab({ transactions, computedCategories, renderIcon, onAdd, onDelete, onAddCategory, periodFilter, setPeriodFilter }: any) {",
  "function FinancesTab({ transactions, computedCategories, renderIcon, onAdd, onDelete, onAddCategory, periodFilter, setPeriodFilter, recurringItems, setRecurringItems }: any) {\n  const [financesTab, setFinancesTab] = useState<'transactions' | 'fixed'>('transactions');\n  const [recType, setRecType] = useState<'income' | 'expense'>('income');\n  const [recDesc, setRecDesc] = useState('');\n  const [recAmount, setRecAmount] = useState('');\n  const [recCategory, setRecCategory] = useState('food');\n  const [recDay, setRecDay] = useState('');\n"
);

// 2. The usage of FinancesTab in App.tsx
tsx = tsx.replace(
  "<FinancesTab \n                  transactions={filteredTransactions} \n                  computedCategories={computedCategories}\n                  renderIcon={renderIcon}\n                  onAdd={handleRegisterTransaction}\n                  onDelete={handleDeleteTransaction}\n                  onAddCategory={handleAddCategory}\n                  periodFilter={periodFilter}\n                  setPeriodFilter={setPeriodFilter}\n                />",
  "<FinancesTab \n                  transactions={filteredTransactions} \n                  computedCategories={computedCategories}\n                  renderIcon={renderIcon}\n                  onAdd={handleRegisterTransaction}\n                  onDelete={handleDeleteTransaction}\n                  onAddCategory={handleAddCategory}\n                  periodFilter={periodFilter}\n                  setPeriodFilter={setPeriodFilter}\n                  recurringItems={recurringItems}\n                  setRecurringItems={setRecurringItems}\n                />"
);

const financesTabStartRegex = /function FinancesTab[\s\S]*?return \(\s*<div className="space-y-6">/;

const financesTabReplacementStart = `
  const handleAddRecurring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recAmount || isNaN(Number(recAmount))) return;
    const newItem: any = {
      id: \`rec-\${Date.now()}\`,
      description: recDesc || 'Item Fixo',
      amount: Number(recAmount),
      type: recType,
      category: recCategory,
      dayOfMonth: recDay ? Number(recDay) : undefined
    };
    setRecurringItems((prev: any) => [...prev, newItem]);
    setRecDesc('');
    setRecAmount('');
    setRecDay('');
  };

  const handleDeleteRecurring = (id: string) => {
    setRecurringItems((prev: any) => prev.filter((r: any) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-[#0a0e17] rounded-lg p-1 border border-white/10">
        <button onClick={() => setFinancesTab('transactions')} className={\`flex-1 text-xs py-2 rounded-md font-bold transition-colors \${financesTab === 'transactions' ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'}\`}>REGISTROS</button>
        <button onClick={() => setFinancesTab('fixed')} className={\`flex-1 text-xs py-2 rounded-md font-bold transition-colors \${financesTab === 'fixed' ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'}\`}>FIXOS</button>
      </div>
      
      {financesTab === 'transactions' && (
        <div className="space-y-6">`;

tsx = tsx.replace(financesTabStartRegex, (match) => {
  return match.replace(/return \(\s*<div className="space-y-6">/, financesTabReplacementStart);
});

// Now close the transactions tab and add the fixed tab logic
const financesTabEndRegex = /NENHUM REGISTRO NESTE PERÍODO<\/p>}\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}/;

const fixedContent = `NENHUM REGISTRO NESTE PERÍODO</p>}
        </div>
      </div>
      )}

      {financesTab === 'fixed' && (
        <div className="space-y-6">
          <div className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl shadow-lg">
            <h2 className="text-xs font-mono text-accent tracking-widest mb-4">ADICIONAR ITEM FIXO</h2>
            <form onSubmit={handleAddRecurring} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <select value={recType} onChange={(e: any) => setRecType(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none">
                  <option value="income" className="bg-[#0a0e17]">Entrada</option>
                  <option value="expense" className="bg-[#0a0e17]">Despesa</option>
                </select>
                <input type="number" step="0.01" placeholder="Valor ($)" value={recAmount} onChange={(e) => setRecAmount(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors" required />
              </div>
              <div className="flex gap-3">
                <select value={recCategory} onChange={(e) => setRecCategory(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none">
                  {computedCategories.map((c: any) => (
                    <option key={c.name} value={c.name} className="bg-[#0a0e17]">{c.label}</option>
                  ))}
                </select>
                <input type="number" placeholder="Dia (Opcional)" value={recDay} onChange={(e) => setRecDay(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" min="1" max="31" />
              </div>
              <input type="text" placeholder="Descrição (ex: Salário)" value={recDesc} onChange={(e) => setRecDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" required />
              <button type="submit" className="w-full bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> ADICIONAR ITEM FIXO
              </button>
            </form>
          </div>

          <div className="space-y-4">
             <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-1">Entradas Fixas</h3>
             <div className="space-y-2">
               {recurringItems.filter((r: any) => r.type === 'income').map((r: any) => {
                 const cat = computedCategories.find((c: any) => c.name === r.category);
                 return (
                   <div key={r.id} className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
                       {renderIcon(cat?.iconName || 'Activity', { className: 'w-4 h-4' })}
                     </div>
                     <div className="flex-1 overflow-hidden">
                       <p className="text-sm font-medium text-emerald-100 truncate">{r.description}</p>
                       <p className="text-[10px] font-mono text-emerald-500/70 uppercase">{cat?.label} {r.dayOfMonth ? \`• Dia \${r.dayOfMonth}\` : ''}</p>
                     </div>
                     <div className="flex items-center gap-3">
                       <p className="text-sm font-bold text-emerald-400">+\${r.amount.toFixed(2)}</p>
                       <button onClick={() => handleDeleteRecurring(r.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   </div>
                 );
               })}
               {recurringItems.filter((r: any) => r.type === 'income').length === 0 && <p className="text-xs text-gray-500 px-2 font-mono">Nenhuma entrada fixa.</p>}
             </div>

             <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-1 mt-6">Despesas Fixas</h3>
             <div className="space-y-2">
               {recurringItems.filter((r: any) => r.type === 'expense').map((r: any) => {
                 const cat = computedCategories.find((c: any) => c.name === r.category);
                 return (
                   <div key={r.id} className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                       {renderIcon(cat?.iconName || 'Activity', { className: 'w-4 h-4' })}
                     </div>
                     <div className="flex-1 overflow-hidden">
                       <p className="text-sm font-medium text-red-100 truncate">{r.description}</p>
                       <p className="text-[10px] font-mono text-red-500/70 uppercase">{cat?.label} {r.dayOfMonth ? \`• Dia \${r.dayOfMonth}\` : ''}</p>
                     </div>
                     <div className="flex items-center gap-3">
                       <p className="text-sm font-bold text-red-400">-\${r.amount.toFixed(2)}</p>
                       <button onClick={() => handleDeleteRecurring(r.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   </div>
                 );
               })}
               {recurringItems.filter((r: any) => r.type === 'expense').length === 0 && <p className="text-xs text-gray-500 px-2 font-mono">Nenhuma despesa fixa.</p>}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

tsx = tsx.replace(financesTabEndRegex, fixedContent);

fs.writeFileSync('src/App.tsx', tsx);
console.log('App.tsx finances UI fixed.');
