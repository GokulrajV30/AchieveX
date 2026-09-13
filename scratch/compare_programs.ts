import { MASTER_INPUTS } from './build_programs';
import { PROGRAMS } from '../src/data/programs';

const masterNames = new Set(MASTER_INPUTS.map(m => m.displayName.toLowerCase()));
const extra = PROGRAMS.filter(p => !masterNames.has(p.displayName.toLowerCase()));
console.log('Master count:', MASTER_INPUTS.length);
console.log('Extra in current programs:', extra.length);
for (const e of extra) {
  console.log('  -', e.displayName);
}
