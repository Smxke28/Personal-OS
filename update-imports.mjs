import fs from 'fs';

let tsx = fs.readFileSync('src/App.tsx', 'utf-8');

tsx = tsx.replace(
  "Palette\n} from 'lucide-react';",
  "Palette,\n  Briefcase,\n  Code,\n  BookOpen,\n  TrendingUp,\n  PlusCircle\n} from 'lucide-react';"
);

// update renderIcon function
tsx = tsx.replace(
  "case 'HeartPulse': return <HeartPulse {...props} />;",
  "case 'HeartPulse': return <HeartPulse {...props} />;\n      case 'Briefcase': return <Briefcase {...props} />;\n      case 'Code': return <Code {...props} />;\n      case 'BookOpen': return <BookOpen {...props} />;\n      case 'TrendingUp': return <TrendingUp {...props} />;\n      case 'PlusCircle': return <PlusCircle {...props} />;"
);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Imports and renderIcon updated!');
