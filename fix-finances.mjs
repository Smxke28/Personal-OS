import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Update FinancesTab state
tsx = tsx.replace(
  "const [recType, setRecType] = useState<'income' | 'expense'>('income');",
  "const [recType, setRecType] = useState<'income' | 'expense'>('income');\n  const [recCategory, setRecCategory] = useState('salary'); // Default to salary for income"
);

tsx = tsx.replace(
  "const [recCategory, setRecCategory] = useState('food');\n",
  ""
);

// 2. Add an effect to change recCategory when recType changes
tsx = tsx.replace(
  "const handleAddRecurring = (e: React.FormEvent) => {",
  "React.useEffect(() => {\n    if (recType === 'income') {\n      setRecCategory('salary');\n    } else {\n      setRecCategory('food');\n    }\n  }, [recType]);\n\n  const handleAddRecurring = (e: React.FormEvent) => {"
);

// 3. Fix the form
const formRegex = /<form onSubmit=\{handleAddRecurring\} className="flex flex-col gap-3">[\s\S]*?<\/form>/;
const newForm = `<form onSubmit={handleAddRecurring} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <select value={recType} onChange={(e: any) => setRecType(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none">
                  <option value="income" className="bg-[#0a0e17]">Entrada</option>
                  <option value="expense" className="bg-[#0a0e17]">Despesa</option>
                </select>
                <input type="number" step="0.01" placeholder="Valor ($)" value={recAmount} onChange={(e: any) => setRecAmount(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors" required />
              </div>
              <div className="flex gap-3">
                <select value={recCategory} onChange={(e: any) => setRecCategory(e.target.value)} className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none">
                  {computedCategories.filter((c: any) => (recType === 'income' ? c.type === 'income' : c.type !== 'income')).map((c: any) => (
                    <option key={c.name} value={c.name} className="bg-[#0a0e17]">{c.label}</option>
                  ))}
                </select>
                <input type="number" placeholder="Dia (Opc)" value={recDay} onChange={(e: any) => setRecDay(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" min="1" max="31" />
              </div>
              <input type="text" placeholder="Descrição (ex: Salário)" value={recDesc} onChange={(e: any) => setRecDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" required />
              <button type="submit" className="w-full bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> ADICIONAR ITEM FIXO
              </button>
            </form>`;

tsx = tsx.replace(formRegex, newForm);

// Also apply the same filter to the normal transaction category select!
const txFormRegex = /<select value=\{category\} onChange=\{\(e: any\) => setCategory\(e\.target\.value\)\} className="flex-\[2\] bg-white\/5 border border-white\/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none">[\s\S]*?<\/select>/;
const newTxSelect = `<select value={category} onChange={(e: any) => setCategory(e.target.value)} className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none">
                  {computedCategories.filter((c: any) => c.type !== 'income').map((c: any) => (
                    <option key={c.name} value={c.name} className="bg-[#0a0e17]">{c.label}</option>
                  ))}
                </select>`;
tsx = tsx.replace(txFormRegex, newTxSelect);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Fixed Finances form!');
