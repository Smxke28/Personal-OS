import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  DollarSign, 
  Calendar as CalendarIcon, 
  Settings, 
  Plus, 
  Trash2, 
  Activity, 
  Download,
  Flame,
  CheckCircle2,
  Car,
  Utensils,
  Cpu,
  HeartPulse,
  LogOut,
  Sparkles,
  Dumbbell,
  Palette
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction, CalendarBlock, CategoryData, Exercise, WorkoutSession, WorkoutSet } from './types';

// Default initial data
const defaultExercises: Exercise[] = [
  { id: 'ex-1', name: 'Supino Reto', muscleGroup: 'Peito' },
  { id: 'ex-2', name: 'Agachamento Livre', muscleGroup: 'Pernas' },
  { id: 'ex-3', name: 'Desenvolvimento', muscleGroup: 'Ombros' }
];

const defaultTransactions = [
  { id: 'tx-1', amount: 45.00, category: 'food', description: 'Mercado Orgânico', timestamp: new Date(Date.now() - 3600000 * 24 * 3) },
  { id: 'tx-2', amount: 120.00, category: 'tech', description: 'Servidor Cloud', timestamp: new Date(Date.now() - 3600000 * 24 * 2) },
  { id: 'tx-3', amount: 35.00, category: 'transport', description: 'Passe de Metrô', timestamp: new Date(Date.now() - 3600000 * 12) }
];

const defaultBlocks = [
  { id: 'cal-1', time: '09:00 - 10:30', title: 'Foco Profundo: Arquitetura', category: 'work', durationMin: 90, completed: false },
  { id: 'cal-2', time: '11:00 - 12:00', title: 'Revisão de Sistema', category: 'personal', durationMin: 60, completed: false },
  { id: 'cal-3', time: '14:00 - 15:30', title: 'Mockups Interativos', category: 'work', durationMin: 90, completed: false },
  { id: 'cal-4', time: '16:00 - 17:00', title: 'Cardio', category: 'health', durationMin: 60, completed: false }
];

const baseCategories = [
  { name: 'food', label: 'Alimentação', color: 'var(--color-accent)', iconName: 'Utensils' },
  { name: 'transport', label: 'Transporte', color: '#38bdf8', iconName: 'Car' },
  { name: 'tech', label: 'Tecnologia', color: 'var(--color-accent)', iconName: 'Cpu' },
  { name: 'health', label: 'Saúde', color: '#10b981', iconName: 'HeartPulse' }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'finances' | 'calendar' | 'settings' | 'workouts'>('home');

  // States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [calendarBlocks, setCalendarBlocks] = useState<CalendarBlock[]>([]);
  const [customCategories, setCustomCategories] = useState<any[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [themeColor, setThemeColor] = useState<string>('cyan');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial Load
  useEffect(() => {
    const savedTheme = localStorage.getItem('pos-theme');
    if (savedTheme) {
      setThemeColor(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    const savedTx = localStorage.getItem('pos-transactions');
    if (savedTx) {
      try {
        const parsed = JSON.parse(savedTx).map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }));
        setTransactions(parsed);
      } catch (e) {}
    } else {
      setTransactions(defaultTransactions);
    }

    const savedBlocks = localStorage.getItem('pos-calendarBlocks');
    if (savedBlocks) {
      try { 
        const parsed = JSON.parse(savedBlocks).map((b: any) => ({ ...b, timestamp: b.timestamp ? new Date(b.timestamp) : new Date() }));
        setCalendarBlocks(parsed);
      } catch (e) {}
    } else {
      setCalendarBlocks(defaultBlocks.map(b => ({ ...b, timestamp: new Date() })) as CalendarBlock[]);
    }

    const savedCats = localStorage.getItem('pos-categories');
    if (savedCats) {
      try { setCustomCategories(JSON.parse(savedCats)); } catch (e) {}
    }

    const savedExercises = localStorage.getItem('pos-exercises');
    if (savedExercises) {
      try { setExercises(JSON.parse(savedExercises)); } catch (e) {}
    } else {
      setExercises(defaultExercises);
    }

    const savedWorkouts = localStorage.getItem('pos-workouts');
    if (savedWorkouts) {
      try {
        const parsed = JSON.parse(savedWorkouts).map((s: any) => ({ ...s, date: new Date(s.date) }));
        setWorkoutSessions(parsed);
      } catch (e) {}
    }

    setIsLoaded(true);
  }, []);

  // Save Effects
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('pos-transactions', JSON.stringify(transactions));
    localStorage.setItem('pos-calendarBlocks', JSON.stringify(calendarBlocks));
    localStorage.setItem('pos-categories', JSON.stringify(customCategories));
    localStorage.setItem('pos-exercises', JSON.stringify(exercises));
    localStorage.setItem('pos-workouts', JSON.stringify(workoutSessions));
    localStorage.setItem('pos-theme', themeColor);
  }, [transactions, calendarBlocks, customCategories, exercises, workoutSessions, themeColor, isLoaded]);

  const [periodFilter, setPeriodFilter] = useState<'current' | 'previous' | 'all'>('current');

  // Derived Data
  const allCategories = [...baseCategories, ...customCategories];
  
  const filteredTransactions = transactions.filter((t: any) => {
    if (periodFilter === 'all') return true;
    const date = new Date(t.timestamp);
    const now = new Date();
    if (periodFilter === 'current') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    if (periodFilter === 'previous') {
      const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    }
    return true;
  });

  const computedCategories = allCategories.map(cat => {
    const amount = filteredTransactions
      .filter(t => t.category.toLowerCase() === cat.name.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...cat, amount };
  });

  const totalExpenses = computedCategories.reduce((sum, c) => sum + c.amount, 0);

  const focusHours = useMemo(() => {
    const mins = calendarBlocks.filter(b => b.completed).reduce((acc, b) => acc + b.durationMin, 0);
    return parseFloat((mins / 60).toFixed(1));
  }, [calendarBlocks]);

  const streak = useMemo(() => {
    const completedBlocks = calendarBlocks.filter(b => b.completed && b.timestamp);
    if (completedBlocks.length === 0) return 0;

    const dates = completedBlocks.map(b => {
      const d = new Date(b.timestamp!);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });
    
    const uniqueDates = Array.from(new Set(dates)).sort((a: any, b: any) => b - a);
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = today.getTime();
    
    // Check if there's a streak starting today or yesterday
    if (!uniqueDates.includes(checkDate)) {
       const yesterday = new Date(today);
       yesterday.setDate(yesterday.getDate() - 1);
       checkDate = yesterday.getTime();
    }

    if (!uniqueDates.includes(checkDate)) return 0;
    
    for (let i = 0; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === checkDate) {
        currentStreak++;
        checkDate -= 86400000; // Subtract one day
      } else {
        break;
      }
    }
    
    return currentStreak;
  }, [calendarBlocks]);

  // Handlers
  const handleRegisterTransaction = (amount: number, category: string, description: string, id?: string) => {
    if (id) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, amount, category, description } : t));
    } else {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`, amount, category, description, timestamp: new Date()
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const handleAddCategory = (name: string, limit?: number) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (allCategories.some(c => c.name === slug)) return; // Prevent dupes
    // Generate distinct color using HSL
    const hue = Math.floor(Math.random() * 360);
    const color = `hsl(${hue}, 80%, 60%)`;
    const newCat = { name: slug, label: name, color, iconName: 'Activity', limit };
    setCustomCategories(prev => [...prev, newCat]);
  };

  const handleUpdateCategoryLimit = (name: string, limit: number) => {
    // If base category, we might need to store limits separately or just copy it to custom?
    // Let's store all limits in a map or just keep modified base in customCategories if possible.
    // For simplicity, we can store limits in a separate state, but let's just use customCategories for overrides too.
    setCustomCategories(prev => {
      const existing = prev.find(c => c.name === name);
      if (existing) return prev.map(c => c.name === name ? { ...c, limit } : c);
      const base = baseCategories.find(c => c.name === name);
      if (base) return [...prev, { ...base, limit }];
      return prev;
    });
  };

  const handleAddWorkoutSession = (session: WorkoutSession) => {
    setWorkoutSessions(prev => [session, ...prev]);
  };

  const handleAddExercise = (name: string, muscleGroup: string) => {
    const newEx: Exercise = {
      id: `ex-${Date.now()}`,
      name,
      muscleGroup
    };
    setExercises(prev => [...prev, newEx]);
    return newEx.id;
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddCalendarBlock = (title: string, category: string, durationMin: number, id?: string) => {
    if (id) {
      setCalendarBlocks(prev => prev.map(b => b.id === id ? { ...b, title, category: category as any, durationMin } : b));
    } else {
      const newBlock: CalendarBlock = {
        id: `cal-${Date.now()}`, time: 'Novo', title, category: category as any, durationMin, completed: false, timestamp: new Date()
      };
      setCalendarBlocks(prev => [...prev, newBlock]);
    }
  };

  const handleToggleCalendarBlock = (id: string) => {
    setCalendarBlocks(prev => prev.map(block => {
      if (block.id === id) {
        return { ...block, completed: !block.completed };
      }
      return block;
    }));
  };

  const handleDeleteCalendarBlock = (id: string) => {
    setCalendarBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleExportData = () => {
    const data = { transactions, calendarBlocks, exercises, workoutSessions, customCategories };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pos-data-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const renderIcon = (name: string, props: any) => {
    switch (name) {
      case 'Utensils': return <Utensils {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'HeartPulse': return <HeartPulse {...props} />;
      default: return <Activity {...props} />;
    }
  };

  const cycleTheme = () => {
    const colors = ['cyan', 'purple', 'emerald', 'rose', 'amber'];
    const currentIndex = colors.indexOf(themeColor);
    const nextTheme = colors[(currentIndex + 1) % colors.length];
    setThemeColor(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#05070c]" />;

  return (
    <div className="min-h-screen bg-[#05070c] text-white flex flex-col font-sans cyber-grid-fine relative">
      <header className="p-4 border-b border-white/10 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-black shadow-neon-cyan">
            P
          </div>
          <div>
            <h1 className="font-display font-bold tracking-widest text-sm text-white">PERSONAL OS</h1>
            <p className="text-[10px] text-accent font-mono tracking-widest">SISTEMA ATIVO</p>
          </div>
        </div>
        <button onClick={cycleTheme} className="p-2 bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 transition-all text-accent hover:shadow-neon-cyan" title="Mudar Tema">
          <Palette className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto w-full pb-24">
        <div className="max-w-xl mx-auto w-full h-full p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentTab === 'home' && (
                <HomeTab 
                  totalExpenses={totalExpenses} 
                  focusHours={focusHours} 
                  streak={streak} 
                  transactions={filteredTransactions} 
                  baseCategories={allCategories}
                />
              )}
              {currentTab === 'finances' && (
                <FinancesTab 
                  transactions={filteredTransactions} 
                  computedCategories={computedCategories}
                  renderIcon={renderIcon}
                  onAdd={handleRegisterTransaction}
                  onDelete={handleDeleteTransaction}
                  onAddCategory={handleAddCategory}
                  periodFilter={periodFilter}
                  setPeriodFilter={setPeriodFilter}
                />
              )}
              {currentTab === 'calendar' && (
                <CalendarTab 
                  calendarBlocks={calendarBlocks}
                  onToggle={handleToggleCalendarBlock}
                  onAdd={handleAddCalendarBlock}
                  onDelete={handleDeleteCalendarBlock}
                />
              )}
              {currentTab === 'workouts' && (
                <WorkoutsTab 
                  exercises={exercises}
                  workoutSessions={workoutSessions}
                  onAddSession={handleAddWorkoutSession}
                  onAddExercise={handleAddExercise}
                />
              )}
              {currentTab === 'settings' && (
                <SettingsTab 
                  onExport={handleExportData}
                  onClear={handleClearData}
                  themeColor={themeColor}
                  onChangeTheme={(color: string) => {
                    setThemeColor(color);
                    document.documentElement.setAttribute('data-theme', color);
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full bg-[#0a0e17]/90 backdrop-blur-xl border-t border-white/10 p-2 pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-xl mx-auto flex justify-between px-2 items-center">
          <NavButton icon={<Home className="w-5 h-5" />} label="Início" isActive={currentTab === 'home'} onClick={() => setCurrentTab('home')} />
          <NavButton icon={<DollarSign className="w-5 h-5" />} label="Finanças" isActive={currentTab === 'finances'} onClick={() => setCurrentTab('finances')} />
          <NavButton icon={<CalendarIcon className="w-5 h-5" />} label="Agenda" isActive={currentTab === 'calendar'} onClick={() => setCurrentTab('calendar')} />
          <NavButton icon={<Dumbbell className="w-5 h-5" />} label="Treinos" isActive={currentTab === 'workouts'} onClick={() => setCurrentTab('workouts')} />
          <NavButton icon={<Settings className="w-5 h-5" />} label="Ajustes" isActive={currentTab === 'settings'} onClick={() => setCurrentTab('settings')} />
        </div>
      </nav>
    </div>
  );
}

// --- Tabs Components ---

function HomeTab({ totalExpenses, focusHours, streak, transactions, baseCategories }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><Activity className="w-10 h-10 text-accent" /></div>
          <p className="text-[10px] font-mono text-gray-400 mb-1">HORAS DE FOCO</p>
          <p className="text-2xl font-display font-bold text-accent">{focusHours.toFixed(1)}<span className="text-sm text-gray-500">h</span></p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><Flame className="w-10 h-10 text-accent" /></div>
          <p className="text-[10px] font-mono text-gray-400 mb-1">SEQUÊNCIA DIÁRIA</p>
          <p className="text-2xl font-display font-bold text-accent">{streak}<span className="text-sm text-gray-500"> dias</span></p>
        </div>
        <div className="bg-gradient-to-br from-accent/20 to-transparent border border-accent/30 p-4 rounded-2xl col-span-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-accent mb-1 tracking-widest">DESPESAS DO MÊS</p>
            <p className="text-3xl font-display font-bold text-white shadow-sm">${totalExpenses.toFixed(2)}</p>
          </div>
          <DollarSign className="w-10 h-10 text-accent opacity-50" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
          <h2 className="text-sm font-display font-bold text-gray-200 tracking-wider">ATIVIDADE RECENTE</h2>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 3).map((t: any) => {
            const cat = baseCategories.find((c: any) => c.name === t.category);
            return (
              <div key={t.id} className="bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{t.description}</p>
                  <p className="text-[10px] font-mono text-gray-500 uppercase mt-0.5">{cat?.label || t.category}</p>
                </div>
                <p className="text-sm font-bold" style={{ color: cat?.color || 'var(--color-accent)' }}>
                  ${t.amount.toFixed(2)}
                </p>
              </div>
            );
          })}
          {transactions.length === 0 && <p className="text-xs text-center text-gray-500 font-mono py-4">NENHUMA ATIVIDADE REGISTRADA</p>}
        </div>
      </div>
    </div>
  );
}

function FinancesTab({ transactions, computedCategories, renderIcon, onAdd, onDelete, onAddCategory, periodFilter, setPeriodFilter }: any) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [desc, setDesc] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  // New Category States
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatLimit, setNewCatLimit] = useState('');

  const pieData = computedCategories.filter((c: any) => c.amount > 0).map((c: any) => ({
    name: c.label, value: c.amount, color: c.color
  }));

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    onAdd(Number(amount), category, desc || 'Registro Manual', editId);
    setAmount('');
    setDesc('');
    setEditId(null);
  };

  const handleEdit = (t: any) => {
    setEditId(t.id);
    setAmount(t.amount.toString());
    setCategory(t.category);
    setDesc(t.description);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), newCatLimit ? Number(newCatLimit) : undefined);
    setCategory(newCatName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'));
    setShowNewCat(false);
    setNewCatName('');
    setNewCatLimit('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-mono text-accent tracking-widest">{editId ? 'EDITAR DESPESA' : 'ADICIONAR DESPESA'}</h2>
          {editId && (
            <button onClick={() => { setEditId(null); setAmount(''); setDesc(''); }} className="text-[10px] text-gray-500 hover:text-white">CANCELAR EDIÇÃO</button>
          )}
        </div>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <input 
                type="number" step="0.01" placeholder="Valor ($)" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <div className="flex-1">
              <select 
                value={showNewCat ? 'new' : category} onChange={(e) => {
                  if (e.target.value === 'new') {
                    setShowNewCat(true);
                    setCategory('');
                  } else {
                    setShowNewCat(false);
                    setCategory(e.target.value);
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none"
              >
                {computedCategories.map((c: any) => (
                  <option key={c.name} value={c.name} className="bg-[#0a0e17]">{c.label}</option>
                ))}
                <option value="new" className="bg-[#0a0e17] text-accent">+ Nova Categoria</option>
              </select>
            </div>
          </div>
          <input 
            type="text" placeholder="Descrição" value={desc} onChange={(e) => setDesc(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
          />
          <button type="submit" className="w-full bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> {editId ? 'SALVAR EDIÇÃO' : 'REGISTRAR'}
          </button>
        </form>

        {showNewCat && (
          <form onSubmit={handleCreateCategory} className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
             <div className="flex justify-between items-center">
               <h3 className="text-[10px] font-mono text-gray-400">NOVA CATEGORIA</h3>
               <button type="button" onClick={() => { setShowNewCat(false); setCategory(''); }} className="text-[10px] text-gray-500 hover:text-white">CANCELAR</button>
             </div>
             <div className="flex gap-2">
                <input type="text" placeholder="Nome" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-accent" />
                <input type="number" placeholder="Limite (opcional)" value={newCatLimit} onChange={(e) => setNewCatLimit(e.target.value)} className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-accent" />
                <button type="submit" className="bg-accent/20 text-accent px-3 rounded-lg text-xs font-bold hover:bg-accent/30">CRIAR</button>
             </div>
          </form>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-1">Progresso & Limites</h2>
        <div className="space-y-3">
          {computedCategories.filter((c: any) => c.limit || c.amount > 0).map((c: any) => {
            const limit = c.limit || 0;
            const percentage = limit > 0 ? (c.amount / limit) * 100 : 0;
            const isOver = percentage > 100;
            const isWarning = percentage > 70 && !isOver;
            const barColor = isOver ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : isWarning ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
            
            return (
              <div key={c.name} className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-medium" style={{ color: c.color }}>{c.label}</span>
                  <span className="text-[10px] font-mono text-gray-400">${c.amount.toFixed(2)} {limit > 0 ? `/ $${limit}` : ''}</span>
                </div>
                {limit > 0 && (
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {pieData.length > 0 && (
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl h-60 flex flex-col items-center">
          <h2 className="text-[10px] font-mono text-gray-400 w-full mb-2 uppercase tracking-widest">Distribuição</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                {pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 5px ${entry.color}40)` }} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 14, 23, 0.9)', borderColor: 'var(--color-accent)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }} formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Histórico de Transações</h2>
          <select 
            value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value as any)}
            className="bg-transparent text-[10px] text-gray-400 font-mono focus:outline-none border-b border-white/20 pb-0.5"
          >
            <option value="current" className="bg-[#0a0e17]">Mês Atual</option>
            <option value="previous" className="bg-[#0a0e17]">Mês Anterior</option>
            <option value="all" className="bg-[#0a0e17]">Tudo</option>
          </select>
        </div>
        
        <div className="space-y-2">
          {transactions.map((t: any) => {
            const cat = computedCategories.find((c: any) => c.name === t.category);
            return (
              <div key={t.id} onClick={() => handleEdit(t)} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-white/5" style={{ color: cat?.color || 'var(--color-accent)' }}>
                  {renderIcon(cat?.iconName || 'Activity', { className: 'w-4 h-4' })}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{t.description}</p>
                  <p className="text-[10px] font-mono text-gray-500 uppercase">{cat?.label} • {new Date(t.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold" style={{ color: cat?.color || 'var(--color-accent)' }}>${t.amount.toFixed(2)}</p>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(t.id); }} className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {transactions.length === 0 && <p className="text-xs text-center text-gray-500 font-mono py-4">NENHUM REGISTRO NESTE PERÍODO</p>}
        </div>
      </div>
    </div>
  );
}

function CalendarTab({ calendarBlocks, onToggle, onAdd, onDelete }: any) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [duration, setDuration] = useState('60');
  const [editId, setEditId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && parseInt(duration) > 0) {
      onAdd(title, category, parseInt(duration), editId);
      setTitle('');
      setEditId(null);
    }
  };

  const handleEdit = (block: any) => {
    setEditId(block.id);
    setTitle(block.title);
    setCategory(block.category);
    setDuration(block.durationMin.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-mono text-accent tracking-widest">{editId ? 'EDITAR BLOCO' : 'NOVO BLOCO DE FOCO'}</h2>
          {editId && (
            <button onClick={() => { setEditId(null); setTitle(''); }} className="text-[10px] text-gray-500 hover:text-white">CANCELAR EDIÇÃO</button>
          )}
        </div>
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <input 
            type="text" placeholder="Ex: Estudar React" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            required
          />
          <div className="flex gap-3">
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent appearance-none"
            >
              <option value="work">Trabalho</option>
              <option value="personal">Pessoal</option>
              <option value="health">Saúde</option>
              <option value="admin">Administrativo</option>
            </select>
            <input 
              type="number" placeholder="Minutos" value={duration} onChange={(e) => setDuration(e.target.value)}
              className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              required min="1"
            />
          </div>
          <button type="submit" className="w-full bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> {editId ? 'SALVAR EDIÇÃO' : 'ADICIONAR'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {calendarBlocks.map((block: any) => (
          <div key={block.id} onClick={() => handleEdit(block)} className={`p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer hover:bg-white/10 ${block.completed ? 'bg-[#10b981]/5 border-[#10b981]/20 opacity-70' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggle(block.id); }}
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${block.completed ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-gray-500 text-transparent hover:border-accent'}`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <div className="flex-1 overflow-hidden">
              <h3 className={`text-sm font-bold truncate ${block.completed ? 'text-gray-400 line-through' : 'text-white'}`}>{block.title}</h3>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{block.time} • {block.durationMin}M • {block.category}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(block.id); }} className="p-2 text-gray-600 hover:text-red-400 rounded-md transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkoutsTab({ exercises, workoutSessions, onAddSession, onAddExercise }: any) {
  const [activeTab, setActiveTab] = useState<'record' | 'history' | 'evolution'>('record');
  
  // Record States
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [sets, setSets] = useState<{ reps: string; weight: string }[]>([{ reps: '', weight: '' }]);
  const [currentSessionExercises, setCurrentSessionExercises] = useState<{ exerciseId: string; sets: { reps: number; weightKg: number }[] }[]>([]);
  
  // New Exercise States
  const [showNewEx, setShowNewEx] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExGroup, setNewExGroup] = useState('Peito');

  // Chart States
  const [chartExerciseId, setChartExerciseId] = useState<string>('');

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;
    const newId = onAddExercise(newExName, newExGroup);
    setSelectedExerciseId(newId);
    setShowNewEx(false);
    setNewExName('');
  };

  const handleAddSetToSession = () => {
    if (!selectedExerciseId) return;
    const validSets = sets
      .filter(s => s.reps && s.weight)
      .map(s => ({ reps: Number(s.reps), weightKg: Number(s.weight) }));
      
    if (validSets.length === 0) return;

    setCurrentSessionExercises(prev => {
      const existing = prev.find(e => e.exerciseId === selectedExerciseId);
      if (existing) {
        return prev.map(e => e.exerciseId === selectedExerciseId ? { ...e, sets: [...e.sets, ...validSets] } : e);
      }
      return [...prev, { exerciseId: selectedExerciseId, sets: validSets }];
    });
    setSets([{ reps: '', weight: '' }]);
  };

  const handleFinishSession = () => {
    if (currentSessionExercises.length === 0) return;
    const session: WorkoutSession = {
      id: `ws-${Date.now()}`,
      date: new Date(),
      exercises: currentSessionExercises
    };
    onAddSession(session);
    setCurrentSessionExercises([]);
    setActiveTab('history');
  };

  // Chart Data Prep
  const chartData = [...workoutSessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(session => {
      const ex = session.exercises.find((e: any) => e.exerciseId === chartExerciseId);
      if (!ex) return null;
      const maxWeight = Math.max(...ex.sets.map((s: any) => s.weightKg));
      const heaviestSet = ex.sets.reduce((max: any, s: any) => s.weightKg > (max?.weightKg || 0) ? s : max, null);
      return {
        date: new Date(session.date).toLocaleDateString(),
        maxWeight,
        heaviestSet
      };
    })
    .filter(Boolean);

  const bestOverallSet = chartData.reduce((best: any, data: any) => {
    if (!best) return data.heaviestSet;
    return (data.heaviestSet?.weightKg || 0) > (best.weightKg || 0) ? data.heaviestSet : best;
  }, null);

  const estimated1RM = bestOverallSet ? Math.round(bestOverallSet.weightKg * (1 + bestOverallSet.reps / 30)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex bg-[#0a0e17] rounded-lg p-1 border border-white/10">
        <button onClick={() => setActiveTab('record')} className={`flex-1 text-xs py-2 rounded-md font-bold transition-colors ${activeTab === 'record' ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'}`}>REGISTRAR</button>
        <button onClick={() => setActiveTab('history')} className={`flex-1 text-xs py-2 rounded-md font-bold transition-colors ${activeTab === 'history' ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'}`}>HISTÓRICO</button>
        <button onClick={() => setActiveTab('evolution')} className={`flex-1 text-xs py-2 rounded-md font-bold transition-colors ${activeTab === 'evolution' ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'}`}>EVOLUÇÃO</button>
      </div>

      {activeTab === 'record' && (
        <div className="space-y-4">
          <div className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl shadow-lg">
            <h2 className="text-xs font-mono text-accent tracking-widest mb-4">ADICIONAR EXERCÍCIO</h2>
            
            <div className="mb-4">
              <select 
                value={showNewEx ? 'new' : selectedExerciseId} 
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setShowNewEx(true);
                    setSelectedExerciseId('');
                  } else {
                    setShowNewEx(false);
                    setSelectedExerciseId(e.target.value);
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              >
                <option value="" disabled className="bg-[#0a0e17] text-gray-500">Selecione o exercício...</option>
                {exercises.map((ex: any) => (
                  <option key={ex.id} value={ex.id} className="bg-[#0a0e17]">{ex.name} ({ex.muscleGroup})</option>
                ))}
                <option value="new" className="bg-[#0a0e17] text-accent">+ Criar Novo Exercício</option>
              </select>
            </div>

            {showNewEx && (
              <form onSubmit={handleCreateExercise} className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5 space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono text-gray-400">NOVO EXERCÍCIO</span>
                  <button type="button" onClick={() => { setShowNewEx(false); setSelectedExerciseId(''); }} className="text-[10px] text-gray-500 hover:text-white">CANCELAR</button>
                </div>
                <input type="text" placeholder="Nome do exercício" value={newExName} onChange={(e) => setNewExName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                <div className="flex gap-2">
                  <select value={newExGroup} onChange={(e) => setNewExGroup(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent">
                    <option value="Peito" className="bg-[#0a0e17]">Peito</option>
                    <option value="Costas" className="bg-[#0a0e17]">Costas</option>
                    <option value="Pernas" className="bg-[#0a0e17]">Pernas</option>
                    <option value="Ombros" className="bg-[#0a0e17]">Ombros</option>
                    <option value="Braços" className="bg-[#0a0e17]">Braços</option>
                    <option value="Core" className="bg-[#0a0e17]">Core</option>
                  </select>
                  <button type="submit" className="bg-accent/20 text-accent px-4 rounded-lg font-bold text-xs hover:bg-accent/30">CRIAR</button>
                </div>
              </form>
            )}

            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-[10px] font-mono text-gray-400 pl-1">Reps</span>
                <span className="text-[10px] font-mono text-gray-400 pl-1">Carga (kg)</span>
              </div>
              {sets.map((set, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <input type="number" value={set.reps} onChange={(e) => { const n = [...sets]; n[i].reps = e.target.value; setSets(n); }} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                  <input type="number" value={set.weight} onChange={(e) => { const n = [...sets]; n[i].weight = e.target.value; setSets(n); }} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                </div>
              ))}
              <button onClick={() => setSets([...sets, { reps: '', weight: '' }])} className="w-full text-xs text-accent py-2 bg-accent/5 rounded border border-dashed border-accent/30 hover:bg-accent/10">+ ADICIONAR SÉRIE</button>
            </div>

            <button onClick={handleAddSetToSession} disabled={!selectedExerciseId} className="w-full bg-[#0a0e17] border border-accent/40 text-accent hover:bg-accent/10 font-bold py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
              REGISTRAR EXERCÍCIO
            </button>
          </div>

          {currentSessionExercises.length > 0 && (
            <div className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl shadow-lg">
              <h3 className="text-[10px] font-mono text-gray-400 tracking-widest mb-3">SESSÃO ATUAL</h3>
              <div className="space-y-3 mb-4">
                {currentSessionExercises.map((e, i) => {
                  const ex = exercises.find((x: any) => x.id === e.exerciseId);
                  return (
                    <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="font-bold text-sm text-accent mb-1">{ex?.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {e.sets.map((s, j) => (
                          <span key={j} className="text-xs bg-black/40 px-2 py-1 rounded text-gray-300 font-mono">
                            {s.reps}x {s.weightKg}kg
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              <button onClick={handleFinishSession} className="w-full bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> FINALIZAR TREINO
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {workoutSessions.map((session: any) => (
            <div key={session.id} className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl">
              <h3 className="text-xs font-mono text-accent tracking-widest mb-3">{new Date(session.date).toLocaleDateString()}</h3>
              <div className="space-y-2">
                {session.exercises.map((e: any, i: number) => {
                  const ex = exercises.find((x: any) => x.id === e.exerciseId);
                  const volume = e.sets.reduce((sum: number, s: any) => sum + (s.reps * s.weightKg), 0);
                  return (
                    <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-gray-200">{ex?.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{e.sets.length} séries</p>
                      </div>
                      <p className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">Vol: {volume}kg</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {workoutSessions.length === 0 && <p className="text-xs text-center text-gray-500 font-mono py-8">NENHUM TREINO REGISTRADO</p>}
        </div>
      )}

      {activeTab === 'evolution' && (
        <div className="space-y-6">
          <div className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl">
            <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3">Selecione o Exercício</h2>
            <select 
              value={chartExerciseId} 
              onChange={(e) => setChartExerciseId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            >
              <option value="" disabled className="bg-[#0a0e17] text-gray-500">Escolha...</option>
              {exercises.map((ex: any) => (
                <option key={ex.id} value={ex.id} className="bg-[#0a0e17]">{ex.name}</option>
              ))}
            </select>
          </div>

          {chartExerciseId && chartData.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20"><Flame className="w-10 h-10 text-accent" /></div>
                  <p className="text-[10px] font-mono text-gray-400 mb-1">CARGA MÁXIMA</p>
                  <p className="text-2xl font-display font-bold text-accent">{bestOverallSet?.weightKg || 0}<span className="text-sm text-gray-500">kg</span></p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20"><Activity className="w-10 h-10 text-accent" /></div>
                  <p className="text-[10px] font-mono text-gray-400 mb-1">1RM ESTIMADO</p>
                  <p className="text-2xl font-display font-bold text-accent">{estimated1RM}<span className="text-sm text-gray-500">kg</span></p>
                </div>
              </div>

              <div className="bg-[#0a0e17] border border-white/10 p-4 rounded-2xl h-64">
                <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">Evolução de Carga (kg)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(10, 14, 23, 0.9)', borderColor: 'var(--color-accent)', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: 'var(--color-accent)' }}
                    />
                    <Line type="monotone" dataKey="maxWeight" stroke="var(--color-accent)" strokeWidth={3} dot={{ fill: '#0a0e17', stroke: 'var(--color-accent)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: 'var(--color-accent)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
          {chartExerciseId && chartData.length === 0 && (
            <p className="text-xs text-center text-gray-500 font-mono py-8">SEM DADOS PARA ESTE EXERCÍCIO</p>
          )}
        </div>
      )}
    </div>
  );
}

function SettingsTab({ onExport, onClear, themeColor, onChangeTheme }: any) {
  const colors = [
    { id: 'cyan', color: '#00f2fe' },
    { id: 'purple', color: '#a855f7' },
    { id: 'emerald', color: '#10b981' },
    { id: 'rose', color: '#f43f5e' },
    { id: 'amber', color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-6 border-b border-white/10">
        <div className="w-16 h-16 rounded-2xl bg-accent mx-auto mb-4 flex items-center justify-center font-display font-bold text-3xl text-black shadow-neon-cyan">
          P
        </div>
        <h2 className="text-xl font-display font-bold text-white tracking-widest">PERSONAL OS</h2>
        <p className="text-xs font-mono text-gray-400 mt-1">SISTEMA ATIVO V1.0</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-2 px-1">Aparência</h3>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <p className="text-sm font-bold text-white mb-3">Cor do Sistema</p>
          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => onChangeTheme(c.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${themeColor === c.id ? 'scale-110 ring-2 ring-white/50 ring-offset-2 ring-offset-[#0a0e17]' : 'hover:scale-110'}`}
                style={{ backgroundColor: c.color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-2 px-1">Dados & Exportação</h3>
        
        <button onClick={onExport} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg text-accent"><Download className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Exportar Dados</p>
              <p className="text-[10px] font-mono text-gray-400">Backup completo em JSON</p>
            </div>
          </div>
        </button>

        <button onClick={onClear} className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg text-red-400 group-hover:text-red-300 transition-colors"><LogOut className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="text-sm font-bold text-red-400 group-hover:text-red-300">Zerar Sistema</p>
              <p className="text-[10px] font-mono text-red-400/60 group-hover:text-red-400/80">Apagar todos os dados permanentemente</p>
            </div>
          </div>
        </button>
      </div>
      
      <div className="pt-8 text-center text-[9px] font-mono text-gray-600">
        <p>FEITO PARA PRODUTIVIDADE ISOLADA</p>
        <p className="mt-1">NENHUM DADO SAI DO SEU DISPOSITIVO</p>
      </div>
    </div>
  );
}

// --- Shared UI ---

function NavButton({ icon, label, isActive, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-14 gap-1 transition-all ${isActive ? 'text-accent -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}>
      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-accent/10 shadow-neon-cyan' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] font-mono font-medium tracking-wide truncate w-full text-center">{label}</span>
    </button>
  );
}
