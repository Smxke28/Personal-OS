import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

tsx = tsx.replace(
  /const baseCategories = \[\s+\{ name: 'food', label: 'Alimentação', color: 'var\(--color-accent\)', iconName: 'Utensils' \},\s+\{ name: 'transport', label: 'Transporte', color: '#38bdf8', iconName: 'Car' \},\s+\{ name: 'tech', label: 'Tecnologia', color: 'var\(--color-accent\)', iconName: 'Cpu' \},\s+\{ name: 'health', label: 'Saúde', color: '#10b981', iconName: 'HeartPulse' \}\s+\];/g,
  `const baseCategories = [
  { name: 'food', label: 'Alimentação', color: 'var(--color-accent)', iconName: 'Utensils', type: 'expense' },
  { name: 'transport', label: 'Transporte', color: '#38bdf8', iconName: 'Car', type: 'expense' },
  { name: 'tech', label: 'Tecnologia', color: 'var(--color-accent)', iconName: 'Cpu', type: 'expense' },
  { name: 'health', label: 'Saúde', color: '#10b981', iconName: 'HeartPulse', type: 'expense' },
  { name: 'salary', label: 'Salário', color: '#10b981', iconName: 'Briefcase', type: 'income' },
  { name: 'freelance', label: 'Freelance', color: '#8b5cf6', iconName: 'Code', type: 'income' },
  { name: 'internship', label: 'Estágio', color: '#3b82f6', iconName: 'BookOpen', type: 'income' },
  { name: 'investments', label: 'Investimentos', color: '#f59e0b', iconName: 'TrendingUp', type: 'income' },
  { name: 'others_income', label: 'Outros', color: '#9ca3af', iconName: 'PlusCircle', type: 'income' }
];`
);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Categories updated!');
