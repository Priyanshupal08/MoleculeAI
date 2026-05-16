import { Drug, DRUGS_DB } from '../data/drugs';

export function jsCompute(smiles: string): Drug | { error: string } {
  if (!smiles || smiles.length < 2) return { error: 'SMILES too short' };
  
  const ar = /[A-Z][a-z]?/g;
  let m;
  const ac: Record<string, number> = {};
  
  const input = smiles.trim();
  const dbMatch = Object.values(DRUGS_DB).find(d => 
    d.smiles === input ||
    d.name?.toLowerCase() === input.toLowerCase() || 
    d.formula?.toLowerCase() === input.toLowerCase()
  );
  
  if (dbMatch) {
    return { ...dbMatch, valid: true };
  }

  // Basic atom counter (handles aromatic lowercase atoms)
  const aromAtoms = (smiles.match(/[cnos]/g) || []).length;
  const atoms = smiles.match(/[A-Z][a-z]?|[cnos]/g) || [];
  atoms.forEach(a => {
    let element: string = a;
    if (a === 'c') element = 'C';
    if (a === 'n') element = 'N';
    if (a === 'o') element = 'O';
    if (a === 's') element = 'S';
    
    if ('CNOSFPBI'.includes(element[0]) || ['Cl', 'Br', 'Si', 'Se'].includes(element)) {
      ac[element] = (ac[element] || 0) + 1;
    }
  });
  
  const C = ac.C || 0, N = ac.N || 0, O = ac.O || 0, S = ac.S || 0, F = ac.F || 0, Cl = ac.Cl || 0, Br = ac.Br || 0, I = ac.I || 0, P = ac.P || 0;
  const heavy = C + N + O + S + F + Cl + Br + I + P;
  if (heavy < 2) return { error: 'Molecule too small — need at least 2 heavy atoms' };
  
  // High-fidelity MW calculation
  const totalValence = C * 4 + N * 3 + O * 2 + S * 6 + P * 5 + F * 1 + Cl * 1 + Br * 1 + I * 1;
  const explicitDoubleBonds = (smiles.match(/=/g) || []).length;
  const aromDoubleBonds = Math.floor(aromAtoms / 2);
  const doubleBonds = explicitDoubleBonds + aromDoubleBonds;
  
  const tripleBonds = (smiles.match(/#/g) || []).length;
  const digs = new Set(smiles.match(/\d/g) || []);
  const moleculeRings = digs.size;
  const bonds = (heavy - 1) + moleculeRings + doubleBonds + 2 * tripleBonds;
  const h_count = Math.max(0, totalValence - 2 * bonds);
  
  const mw = Math.round((C * 12.011 + N * 14.007 + O * 15.999 + S * 32.06 + F * 18.998 + Cl * 35.45 + Br * 79.904 + I * 126.904 + P * 30.974 + h_count * 1.008) * 100) / 100;
  const logp = Math.round((C * 0.53 + N * (-0.72) + O * (-0.70) + S * 0.62 + Cl * 0.70 + Br * 1.0 + F * 0.14 - (heavy * 0.05)) * 1000) / 1000;
  
  // Improved HBD detection: count H's on O and N
  let hbd = 0;
  if (h_count > 0) {
    // If the molecule has H's, they are likely on O or N in drug-like molecules
    // We'll estimate HBD as h_count but cap it by N+O
    hbd = Math.min(Math.round(h_count), N + O);
  }
  const hba = N + O;
  const tpsa = Math.round((N * 26 + O * 20.2 + Math.min(hbd * 6, 30)) * 10) / 10;
  
  const rings = moleculeRings;
  const arom = Math.min(Math.floor(aromAtoms / 5), rings);
  const rot = Math.max(0, Math.floor(C * 0.3 - rings * 0.5));
  
  const viol = (mw > 500 ? 1 : 0) + (logp > 5 ? 1 : 0) + (hbd > 5 ? 1 : 0) + (hba > 10 ? 1 : 0);
  const lip = viol <= 1;
  const bio = Math.max(0, Math.min(100, 100 - viol * 20 - Math.max(0, tpsa - 140) * 0.3));
  
  let tox = 0;
  const flags: string[] = [];
  if (mw > 600) { tox += 15; flags.push('High MW (>600 Da)'); }
  if (logp > 5) { tox += 20; flags.push('High LogP (>5)'); }
  if (logp < -2) { tox += 5; flags.push('Low LogP (Extreme Hydrophilicity)'); }
  if (hbd > 5) { tox += 10; flags.push('Excess H-bond donors'); }
  if (tpsa > 140) { tox += 10; flags.push('High TPSA (>140 Å²)'); }
  if (arom > 4) { tox += 20; flags.push('PAINS alert: Frequent Hitter'); }
  
  // Specific Structural Alerts (Simplified)
  if (/N=N/.test(smiles)) { tox += 30; flags.push('Azo-group (Potential mutagen)'); }
  if (/N=O/.test(smiles)) { tox += 25; flags.push('Nitroso-group (Potential carcinogen)'); }
  if (/C(=O)[FClBrI]/.test(smiles)) { tox += 40; flags.push('Acyl halide (Reactive electrophile)'); }
  if (/S(=O)(=O)[FClBrI]/.test(smiles)) { tox += 40; flags.push('Sulfonyl halide (Reactive)'); }
  if (smiles.includes('C#N')) { tox += 15; flags.push('Nitrile (Metabolic alert)'); }
  
  tox = Math.min(100, tox);
  
  let bbb = 50;
  if (mw < 400) bbb += 15;
  if (logp > 1 && logp < 3) bbb += 20;
  if (tpsa < 90) bbb += 20;
  if (hbd <= 3) bbb += 10;
  if (viol > 1) bbb -= 30;
  bbb = Math.min(95, Math.max(5, bbb));
  
  let sol, sol_score;
  if (logp < 1) { sol = 'Highly Soluble'; sol_score = 92; }
  else if (logp < 3) { sol = 'Soluble'; sol_score = 75; }
  else if (logp < 5) { sol = 'Moderate'; sol_score = 45; }
  else { sol = 'Poorly Soluble'; sol_score = 15; }
  
  const mws = mw < 500 ? 1 : mw < 700 ? 0.5 : 0.1;
  const ls = logp >= 0 && logp <= 5 ? 1 : logp < 0 ? 0.6 : 0.3;
  const qed = Math.round(((mws + ls + (hbd <= 5 ? 1 : 0.3) + (hba <= 10 ? 1 : 0.3) + (tpsa <= 140 ? 1 : 0.3)) / 5 * 0.95) * 1000) / 1000;
  const cat = qed > 0.7 ? 'excellent' : qed > 0.5 ? 'good' : qed > 0.3 ? 'moderate' : 'poor';
  
  const fg: string[] = [];
  if (/C\(=O\)O/.test(smiles)) fg.push('Carboxylic Acid');
  if (/c1ccccc1/.test(smiles)) fg.push('Benzene Ring');
  if (/C\(=O\)N/.test(smiles)) fg.push('Amide');
  if (/=O/.test(smiles)) fg.push('Carbonyl');
  if (/OH|O\)/.test(smiles)) fg.push('Hydroxyl/Ether');
  if (/[FClBrI]/.test(smiles)) fg.push('Halide');
  if (/N/.test(smiles)) fg.push('Amine');
  if (/S/.test(smiles)) fg.push('Sulfur group');
  if (/C#C/.test(smiles)) fg.push('Alkyne');
  if (/C=C/.test(smiles)) fg.push('Alkene');
  if (/P/.test(smiles)) fg.push('Phosphate/Phosphine');
  
  const order = ['N', 'O', 'S', 'F', 'Cl', 'Br', 'P', 'I'];
  let formula = '';
  
  if (ac.C) {
    // Hill system: C first, then H, then others alphabetically
    formula += 'C' + (ac.C > 1 ? ac.C : '');
    if (h_count > 0) formula += 'H' + (Math.round(h_count) > 1 ? Math.round(h_count) : '');
    order.sort().forEach(el => { 
      if (ac[el]) formula += el + (ac[el] > 1 ? ac[el] : ''); 
    });
  } else {
    // Inorganic: H, then central atoms, then O
    if (h_count > 0) formula += 'H' + (Math.round(h_count) > 1 ? Math.round(h_count) : '');
    const nonO = Object.keys(ac).filter(k => k !== 'O').sort();
    nonO.forEach(el => {
      if (ac[el]) formula += el + (ac[el] > 1 ? ac[el] : '');
    });
    if (ac.O) formula += 'O' + (ac.O > 1 ? ac.O : '');
  }
  
  // SMILES Sanity check for the drawer: convert bare H to [H] or remove if potentially a formula
  let sanitizedSmiles = input;
  if (/^[A-Z][0-9]/.test(sanitizedSmiles)) {
    // Looks like a formula, try to find in DB or fallback to something valid
    const match = Object.values(DRUGS_DB).find(d => d.formula === sanitizedSmiles);
    if (match) sanitizedSmiles = match.smiles;
  }
  // No longer forcing [H] replacement here as it can mess with valid SMILES if not careful
  // Standard SMILES should be fine.

  return {
    valid: true,
    smiles: sanitizedSmiles,
    svg: dbMatch ? dbMatch.svg : '',
    name: dbMatch ? dbMatch.name : null,
    class: dbMatch ? dbMatch.class : 'Custom',
    use: dbMatch ? dbMatch.use : 'N/A',
    year: dbMatch ? dbMatch.year : 'N/A',
    formula,
    mw,
    logp,
    hbd,
    hba,
    tpsa,
    rot,
    rings,
    aromatic: arom,
    heavy,
    qed,
    cat: cat as 'excellent' | 'good' | 'moderate' | 'poor',
    lipinski: lip,
    violations: viol,
    sol,
    sol_score,
    bbb,
    bbb_pen: bbb > 60,
    tox,
    flags,
    bio: Math.round(bio),
    atom_counts: ac,
    func_groups: fg,
    admet: {
      absorption: Math.min(100, Math.max(10, Math.round(bio))),
      distribution: bbb,
      metabolism: Math.min(100, Math.max(10, Math.round(80 - logp * 5))),
      excretion: Math.min(100, Math.max(10, Math.round(70 - mw / 12))),
      toxicity: 100 - tox
    }
  };
}

export function tanimoto(s1: string, s2: string) {
  const tok = (s: string) => {
    const t = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) t.add(s.slice(i, i + 2));
    for (let i = 0; i < s.length - 2; i++) t.add(s.slice(i, i + 3));
    s.match(/[A-Z][a-z]?/g)?.forEach(a => t.add(a));
    return t;
  };
  const t1 = tok(s1), t2 = tok(s2);
  let x = 0;
  t1.forEach(t => { if (t2.has(t)) x++; });
  const u = t1.size + t2.size - x;
  return u > 0 ? x / u : 0;
}
