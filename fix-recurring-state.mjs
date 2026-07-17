import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

tsx = tsx.replace(
  "const [transactions, setTransactions] = useState<Transaction[]>([]);",
  "const [transactions, setTransactions] = useState<Transaction[]>([]);\n  const [recurringItems, setRecurringItems] = useState<RecurringItem[]>([]);"
);

tsx = tsx.replace(
  "    const savedTx = localStorage.getItem('pos-transactions');",
  "    const savedRecurring = localStorage.getItem('pos-recurringItems');\n    if (savedRecurring) {\n      try {\n        setRecurringItems(JSON.parse(savedRecurring));\n      } catch (e) {}\n    }\n    const savedTx = localStorage.getItem('pos-transactions');"
);

tsx = tsx.replace(
  "    localStorage.setItem('pos-transactions', JSON.stringify(transactions));",
  "    localStorage.setItem('pos-transactions', JSON.stringify(transactions));\n    localStorage.setItem('pos-recurringItems', JSON.stringify(recurringItems));"
);

tsx = tsx.replace(
  "  }, [transactions, calendarBlocks, customCategories, exercises, workoutSessions, themeColor, isLoaded]);",
  "  }, [transactions, calendarBlocks, customCategories, exercises, workoutSessions, themeColor, recurringItems, isLoaded]);"
);

// Import RecurringItem
tsx = tsx.replace(
  "import { Transaction, CalendarBlock, CategoryData, Exercise, WorkoutSession, WorkoutSet } from './types';",
  "import { Transaction, CalendarBlock, CategoryData, Exercise, WorkoutSession, WorkoutSet, RecurringItem } from './types';"
);

fs.writeFileSync('src/App.tsx', tsx);
console.log('App.tsx updated');
