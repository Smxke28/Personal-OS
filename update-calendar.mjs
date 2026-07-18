import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add lucide-react imports
if (!tsx.includes('ChevronLeft')) {
  tsx = tsx.replace(
    "import { \n  Home,",
    "import { \n  ChevronLeft,\n  ChevronRight,\n  Home,"
  );
}

// 2. Update handleAddCalendarBlock in App.tsx
const oldAddCal = `const handleAddCalendarBlock = (title: string, category: string, durationMin: number, id?: string) => {
    if (id) {
      setCalendarBlocks(prev => prev.map(b => b.id === id ? { ...b, title, category: category as any, durationMin } : b));
    } else {
      const newBlock: CalendarBlock = {
        id: \`cal-\${Date.now()}\`, time: 'Novo', title, category: category as any, durationMin, completed: false, timestamp: new Date()
      };
      setCalendarBlocks(prev => [...prev, newBlock]);
    }
  };`;

const newAddCal = `const handleAddCalendarBlock = (title: string, category: string, durationMin: number, timestamp: Date, id?: string) => {
    if (id) {
      setCalendarBlocks(prev => prev.map(b => b.id === id ? { ...b, title, category: category as any, durationMin, timestamp } : b));
    } else {
      const newBlock: CalendarBlock = {
        id: \`cal-\${Date.now()}\`, time: 'Novo', title, category: category as any, durationMin, completed: false, timestamp
      };
      setCalendarBlocks(prev => [...prev, newBlock]);
    }
  };`;
  
tsx = tsx.replace(oldAddCal, newAddCal);

// 3. Replace CalendarTab component entirely
const calTabRegex = /function CalendarTab\(\{[\s\S]*?\}\s*\{[\s\S]*?\n\}\n\nfunction WorkoutsTab/g;

const newCalendarTab = `function CalendarTab({ calendarBlocks, onToggle, onAdd, onDelete }: any) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [duration, setDuration] = useState('60');
  
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  });
  const [timeStr, setTimeStr] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('pt-BR', {hour12: false, hour: '2-digit', minute:'2-digit'});
  });
  
  const [editId, setEditId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [referenceDate, setReferenceDate] = useState(() => new Date());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && parseInt(duration) > 0) {
      // Assemble timestamp from dateStr and timeStr safely, handling local timezone
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      const timestamp = new Date(year, month - 1, day, hour, minute);
      
      onAdd(title, category, parseInt(duration), timestamp, editId);
      setTitle('');
      setEditId(null);
    }
  };

  const handleEdit = (block: any) => {
    setEditId(block.id);
    setTitle(block.title);
    setCategory(block.category);
    setDuration(block.durationMin.toString());
    const d = new Date(block.timestamp || Date.now());
    
    // adjust to local YYYY-MM-DD
    const localDateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    setDateStr(localDateStr);
    
    setTimeStr(d.toLocaleTimeString('pt-BR', {hour12: false, hour: '2-digit', minute:'2-digit'}));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Date Math
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0,0,0,0);
    return date;
  };
  
  const startOfWeek = getMonday(referenceDate);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const monthStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const monthEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Navigation
  const handlePrevWeek = () => {
    const newRef = new Date(referenceDate);
    if (viewMode === 'week') newRef.setDate(newRef.getDate() - 7);
    else newRef.setMonth(newRef.getMonth() - 1);
    setReferenceDate(newRef);
  };
  const handleNextWeek = () => {
    const newRef = new Date(referenceDate);
    if (viewMode === 'week') newRef.setDate(newRef.getDate() + 7);
    else newRef.setMonth(newRef.getMonth() + 1);
    setReferenceDate(newRef);
  };
  const handleToday = () => {
    setReferenceDate(new Date());
  };
  
  // Form Shortcuts
  const setFormDateToOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDateStr(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  };
  
  const setFormDateToDayOfWeek = (dayOffset: number) => {
    const monday = getMonday(new Date());
    monday.setDate(monday.getDate() + dayOffset);
    setDateStr(new Date(monday.getTime() - (monday.getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  };

  // Filters
  const weekBlocks = calendarBlocks.filter((block: any) => {
    const d = new Date(block.timestamp || Date.now());
    return d >= startOfWeek && d <= endOfWeek;
  });
  
  const monthBlocks = calendarBlocks.filter((block: any) => {
    const d = new Date(block.timestamp || Date.now());
    return d >= monthStart && d <= monthEnd;
  });

  const displayBlocks = viewMode === 'week' ? weekBlocks : monthBlocks;
  
  // Stats
  const totalMins = displayBlocks.reduce((acc: number, b: any) => acc + b.durationMin, 0);
  const totalHours = (totalMins / 60).toFixed(1);
  const completedCount = displayBlocks.filter((b: any) => b.completed).length;

  const daysOfWeek = [
    { label: 'Seg', date: new Date(startOfWeek) },
    { label: 'Ter', date: new Date(startOfWeek.getTime() + 86400000) },
    { label: 'Qua', date: new Date(startOfWeek.getTime() + 86400000 * 2) },
    { label: 'Qui', date: new Date(startOfWeek.getTime() + 86400000 * 3) },
    { label: 'Sex', date: new Date(startOfWeek.getTime() + 86400000 * 4) },
    { label: 'Sáb', date: new Date(startOfWeek.getTime() + 86400000 * 5) },
    { label: 'Dom', date: new Date(startOfWeek.getTime() + 86400000 * 6) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex bg-[#0a0e17] rounded-lg p-1 border border-white/10">
        <button onClick={() => setViewMode('week')} className={\`flex-1 text-xs py-2 rounded-md font-bold transition-colors \${viewMode === 'week' ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'}\`}>SEMANA</button>
        <button onClick={() => setViewMode('month')} className={\`flex-1 text-xs py-2 rounded-md font-bold transition-colors \${viewMode === 'month' ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'}\`}>MÊS</button>
      </div>

      <div className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-mono text-accent tracking-widest">{editId ? 'EDITAR BLOCO' : 'NOVO BLOCO DE FOCO'}</h2>
          {editId && (
            <button onClick={() => { setEditId(null); setTitle(''); }} className="text-[10px] text-gray-500 hover:text-white">CANCELAR EDIÇÃO</button>
          )}
        </div>
        
        {/* Form */}
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 mb-1">
             <button type="button" onClick={() => setFormDateToOffset(0)} className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-300">Hoje</button>
             <button type="button" onClick={() => setFormDateToOffset(1)} className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-300">Amanhã</button>
             <div className="w-px h-4 bg-white/20 mx-1 self-center"></div>
             {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d, i) => (
                <button key={d} type="button" onClick={() => setFormDateToDayOfWeek(i)} className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-300">{d}</button>
             ))}
          </div>
          
          <div className="flex gap-3">
             <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" required />
             <input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" required />
          </div>

          <input type="text" placeholder="Ex: Estudar React" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" required />
          <div className="flex gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none">
              <option value="work">Trabalho</option>
              <option value="personal">Pessoal</option>
              <option value="health">Saúde</option>
              <option value="admin">Administrativo</option>
            </select>
            <input type="number" placeholder="Minutos" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" required min="1" />
          </div>
          <button type="submit" className="w-full bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> {editId ? 'SALVAR EDIÇÃO' : 'ADICIONAR'}
          </button>
        </form>
      </div>

      {viewMode === 'week' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#0a0e17] rounded-xl p-2 border border-white/10 shadow-lg">
            <button onClick={handlePrevWeek} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <div className="text-center flex-1">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">{startOfWeek.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})} - {endOfWeek.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}</h3>
               <p className="text-[10px] font-mono text-gray-400">TOTAL: {totalHours}h • {completedCount}/{displayBlocks.length} CONCLUÍDOS</p>
            </div>
            <button onClick={handleNextWeek} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex justify-center mb-4">
            <button onClick={handleToday} className="text-[10px] font-mono tracking-wider bg-white/5 hover:bg-white/10 text-gray-300 py-1.5 px-4 rounded-lg border border-white/10 transition-colors uppercase">Hoje</button>
          </div>
          
          <div className="space-y-4">
            {daysOfWeek.map((day, idx) => {
              const isToday = new Date().toDateString() === day.date.toDateString();
              const dayBlocks = displayBlocks.filter((b: any) => new Date(b.timestamp || Date.now()).toDateString() === day.date.toDateString());
              
              // sort blocks by time
              dayBlocks.sort((a: any, b: any) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());

              return (
                <div key={idx} className={\`bg-[#0a0e17] rounded-xl overflow-hidden border transition-colors \${isToday ? 'border-accent shadow-[0_0_15px_rgba(0,0,0,0)]' : 'border-white/10'}\`} style={isToday ? { boxShadow: '0 0 10px var(--color-accent)20' } : {}}>
                   <div className={\`px-4 py-2 flex justify-between items-center border-b \${isToday ? 'bg-accent/10 border-accent/20' : 'bg-white/5 border-white/5'}\`}>
                      <h4 className={\`text-xs font-bold uppercase tracking-wider flex items-center gap-2 \${isToday ? 'text-accent' : 'text-gray-300'}\`}>
                        {day.label} <span className="text-gray-500 font-mono">{day.date.getDate()}</span>
                        {isToday && <span className="px-1.5 py-0.5 rounded text-[8px] bg-accent/20 text-accent ml-1">HOJE</span>}
                      </h4>
                      <div className={\`text-[10px] font-mono px-2 py-0.5 rounded-full \${dayBlocks.length > 0 ? 'bg-accent/20 text-accent' : 'bg-black/40 text-gray-500'}\`}>
                        {dayBlocks.length}
                      </div>
                   </div>
                   <div className="p-2 space-y-2">
                      {dayBlocks.length === 0 ? (
                        <div className="p-3 text-center text-xs font-mono text-gray-600 bg-white/5 rounded-lg border border-dashed border-white/5">Livre</div>
                      ) : (
                        dayBlocks.map((block: any) => (
                           <div key={block.id} onClick={() => handleEdit(block)} className={\`p-3 rounded-lg border transition-all flex items-center gap-3 cursor-pointer hover:bg-white/10 \${block.completed ? 'bg-[#10b981]/5 border-[#10b981]/20 opacity-70' : 'bg-white/5 border-white/10 hover:border-white/20'}\`}>
                             <button onClick={(e) => { e.stopPropagation(); onToggle(block.id); }} className={\`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all shrink-0 \${block.completed ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-gray-500 text-transparent hover:border-accent'}\`}>
                               <CheckCircle2 className="w-3 h-3" />
                             </button>
                             <div className="flex-1 overflow-hidden">
                               <h3 className={\`text-sm font-bold truncate \${block.completed ? 'text-gray-400 line-through' : 'text-white'}\`}>{block.title}</h3>
                               <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                                 {new Date(block.timestamp || Date.now()).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} • {block.durationMin}M • {block.category}
                               </p>
                             </div>
                             <button onClick={(e) => { e.stopPropagation(); onDelete(block.id); }} className="p-1.5 text-gray-600 hover:text-red-400 rounded-md transition-colors shrink-0">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                        ))
                      )}
                   </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
           <div className="flex justify-between items-center bg-[#0a0e17] rounded-xl p-2 border border-white/10 shadow-lg">
             <button onClick={handlePrevWeek} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
             <div className="text-center flex-1">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">{monthStart.toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'})}</h3>
               <p className="text-[10px] font-mono text-gray-400">TOTAL: {totalHours}h • {completedCount}/{displayBlocks.length} CONCLUÍDOS</p>
             </div>
             <button onClick={handleNextWeek} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
           </div>
           
           <div className="space-y-3">
             {displayBlocks.length === 0 && (
               <p className="text-xs text-center text-gray-500 font-mono py-4">NENHUM BLOCO NESTE PERÍODO</p>
             )}
             {displayBlocks.sort((a: any, b: any) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()).map((block: any) => (
               <div key={block.id} onClick={() => handleEdit(block)} className={\`p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer hover:bg-white/10 \${block.completed ? 'bg-[#10b981]/5 border-[#10b981]/20 opacity-70' : 'bg-white/5 border-white/10 hover:border-white/20'}\`}>
                 <button onClick={(e) => { e.stopPropagation(); onToggle(block.id); }} className={\`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shrink-0 \${block.completed ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-gray-500 text-transparent hover:border-accent'}\`}>
                   <CheckCircle2 className="w-4 h-4" />
                 </button>
                 <div className="flex-1 overflow-hidden">
                   <h3 className={\`text-sm font-bold truncate \${block.completed ? 'text-gray-400 line-through' : 'text-white'}\`}>{block.title}</h3>
                   <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                     {new Date(block.timestamp || Date.now()).toLocaleDateString('pt-BR')} {new Date(block.timestamp || Date.now()).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} • {block.durationMin}M • {block.category}
                   </p>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); onDelete(block.id); }} className="p-2 text-gray-600 hover:text-red-400 rounded-md transition-colors shrink-0">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}

function WorkoutsTab`;

tsx = tsx.replace(calTabRegex, newCalendarTab);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Update complete!');
