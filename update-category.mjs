import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

// Update handleAddCategory to take type
tsx = tsx.replace(
  "const handleAddCategory = (name: string, limit?: number) => {",
  "const handleAddCategory = (name: string, limit?: number, type: 'income' | 'expense' = 'expense') => {"
);
tsx = tsx.replace(
  "const newCat = { name: slug, label: name, color, iconName: 'Activity', limit };",
  "const newCat = { name: slug, label: name, color, iconName: 'Activity', limit, type };"
);

// Add rec new category state to FinancesTab
tsx = tsx.replace(
  "const [showNewCat, setShowNewCat] = useState(false);",
  "const [showNewCat, setShowNewCat] = useState(false);\n  const [showNewRecCat, setShowNewRecCat] = useState(false);\n  const [newRecCatName, setNewRecCatName] = useState('');"
);

// Add handleCreateRecCategory to FinancesTab
tsx = tsx.replace(
  "const handleCreateCategory = (e: React.FormEvent) => {",
  `const handleCreateRecCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecCatName.trim()) return;
    onAddCategory(newRecCatName.trim(), undefined, recType);
    setRecCategory(newRecCatName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'));
    setShowNewRecCat(false);
    setNewRecCatName('');
  };

  const handleCreateCategory = (e: React.FormEvent) => {`
);

// Update the fixed item select
const oldRecSelect = `<select value={recCategory} onChange={(e: any) => setRecCategory(e.target.value)} className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none">
                  {computedCategories.filter((c: any) => (recType === 'income' ? c.type === 'income' : c.type !== 'income')).map((c: any) => (
                    <option key={c.name} value={c.name} className="bg-[#0a0e17]">{c.label}</option>
                  ))}
                </select>`;

const newRecSelect = `<div className="flex-[2] flex flex-col gap-2">
                  <select 
                    value={showNewRecCat ? 'new' : recCategory} 
                    onChange={(e: any) => {
                      if (e.target.value === 'new') {
                        setShowNewRecCat(true);
                        setRecCategory('');
                      } else {
                        setShowNewRecCat(false);
                        setRecCategory(e.target.value);
                      }
                    }} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none"
                  >
                    {computedCategories.filter((c: any) => (recType === 'income' ? c.type === 'income' : c.type !== 'income')).map((c: any) => (
                      <option key={c.name} value={c.name} className="bg-[#0a0e17]">{c.label}</option>
                    ))}
                    <option value="new" className="bg-[#0a0e17] text-accent">+ Nova Categoria</option>
                  </select>
                  
                  {showNewRecCat && (
                    <div className="flex gap-2">
                      <input type="text" placeholder="Nome" value={newRecCatName} onChange={(e) => setNewRecCatName(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-accent" />
                      <button type="button" onClick={handleCreateRecCategory} className="bg-accent/20 text-accent px-3 rounded-lg text-xs font-bold hover:bg-accent/30">CRIAR</button>
                      <button type="button" onClick={() => { setShowNewRecCat(false); setRecCategory(recType === 'income' ? 'salary' : 'food'); }} className="text-gray-500 hover:text-white px-2">X</button>
                    </div>
                  )}
                </div>`;

tsx = tsx.replace(oldRecSelect, newRecSelect);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Categories updated!');
