import React, { useState, useEffect } from 'react';
import { Plus, HeartPulse, ShieldAlert, Beaker, Search, Trash2, Microscope, Info, Activity, FlaskConical, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Drug, DRUGS_DB } from '../data/drugs';
import { tanimoto, jsCompute } from '../lib/chem';
import { cn } from '../lib/utils';
import { geminiService, SynthesisInsight } from '../services/geminiService';
import { MoleculeStructure } from './MoleculeStructure';

export const SynthesisLab: React.FC = () => {
  const [molA, setSlotA] = useState<Drug | null>(null);
  const [molB, setSlotB] = useState<Drug | null>(null);
  const [smilesA, setSmilesA] = useState('');
  const [smilesB, setSmilesB] = useState('');
  const [identifyingA, setIdentifyingA] = useState(false);
  const [identifyingB, setIdentifyingB] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [interactionResult, setInteractionResult] = useState<{
    similarity: number;
    score: number;
    risk: string;
    verdict: string;
    detailedAnalysis?: string;
    interactions: { type: string; sev: string; desc: string }[];
    resultant?: {
      smiles: string;
      name: string;
      properties?: { mw: number; logp: number; tpsa: number };
    };
  } | null>(null);

  // Auto-identification of manual SMILES input with debouncing
  useEffect(() => {
    if (!smilesA.trim()) return;
    const timer = setTimeout(() => {
      if (!molA || molA.smiles !== smilesA) {
        handleManualInput('A', smilesA);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [smilesA]);

  useEffect(() => {
    if (!smilesB.trim()) return;
    const timer = setTimeout(() => {
      if (!molB || molB.smiles !== smilesB) {
        handleManualInput('B', smilesB);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [smilesB]);

  const handleManualInput = async (slot: 'A' | 'B', s: string) => {
    if (!s.trim()) return;
    const res = jsCompute(s);
    if (!('error' in res)) {
      if (slot === 'A') {
        setSlotA(res);
        setSmilesA(s);
        setIdentifyingA(true);
        try {
          const insight = await geminiService.identifyMolecule(s);
          if (insight) {
            setSlotA(prev => prev ? ({ ...prev, name: insight.name, class: insight.category }) : null);
          }
        } finally {
          setIdentifyingA(false);
        }
      } else {
        setSlotB(res);
        setSmilesB(s);
        setIdentifyingB(true);
        try {
          const insight = await geminiService.identifyMolecule(s);
          if (insight) {
            setSlotB(prev => prev ? ({ ...prev, name: insight.name, class: insight.category }) : null);
          }
        } finally {
          setIdentifyingB(false);
        }
      }
    }
  };

  const handleSynthesize = async () => {
    if (!molA || !molB) return;
    setAnalyzing(true);
    setInteractionResult(null);
    
    // Physical Similarity
    const similarity = tanimoto(molA.smiles, molB.smiles);
    
    // AI Synthesis Prediction
    try {
      const insight = await geminiService.predictSynthesis(molA.smiles, molB.smiles);
      if (insight) {
        setInteractionResult({
          similarity,
          score: insight.score,
          risk: insight.risk,
          verdict: insight.verdict,
          detailedAnalysis: insight.detailedAnalysis,
          interactions: insight.potentialInteractions.map(i => ({
            type: i.type,
            sev: i.severity,
            desc: i.description
          })),
          resultant: insight.resultantSmiles ? {
            smiles: insight.resultantSmiles,
            name: insight.resultantName || 'Resultant Derivative',
            properties: insight.resultantProperties
          } : undefined
        });
      }
    } catch (e) {
      console.error("Synthesis AI failed:", e);
      setInteractionResult({
        similarity,
        score: 50,
        risk: 'Moderate',
        verdict: 'Unable to perform deep AI analysis. Basic cheminformatic similarity calculated.',
        interactions: []
      });
    }
    
    setAnalyzing(false);
  };

  const MolecularSlot = ({ slot, mol, setMol, curSmiles, setCurSmiles, identifying }: any) => (
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-center group/labheader px-2">
        <div className="flex items-center gap-4">
           <div className={cn("w-3 h-3 rotate-45 border border-current", slot === 'A' ? "bg-[#bef264]" : "bg-white")} />
           <h3 className={cn("text-[11px] font-black uppercase tracking-[0.5em]", slot === 'A' ? "text-[#bef264]" : "text-white")}>
            Node.0{slot === 'A' ? '1' : '2'} [{slot === 'A' ? 'Scaffold' : 'Reagent'}]
          </h3>
          {identifying && <div className="w-2 h-2 rounded-full bg-[#bef264] animate-ping" />}
        </div>
        {mol && (
          <button onClick={() => { setMol(null); setCurSmiles(''); }} className="text-slate-800 hover:text-rose-500 transition-all p-2 bg-white/5 border border-white/10 hover:border-rose-500/50">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className={cn(
        "min-h-[400px] glass-card p-10 flex flex-col justify-center transition-all relative overflow-hidden group mb-8 border",
        mol ? "bg-black border-white/20" : "bg-black/40 border-dashed border-white/10 hover:border-[#bef264]/30"
      )}>
        {mol ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="w-full aspect-square bg-[#050505] border border-white/10 p-8 flex items-center justify-center relative group/mol shadow-inner">
               <div className="absolute inset-0 bg-[#bef264]/5 opacity-0 group-hover/mol:opacity-100 transition-opacity" />
               <MoleculeStructure smiles={mol.smiles} className="w-full h-full scale-100 drop-shadow-[0_0_30px_rgba(190,242,100,0.1)] group-hover/mol:scale-110 transition-transform duration-700" />
            </div>
            <div className="text-center px-4 space-y-4">
              <div className={cn(
                "text-xl md:text-2xl font-display font-black leading-none break-words uppercase italic tracking-tighter",
                identifying ? "text-[#bef264] animate-pulse" : "text-white"
              )}>
                {identifying ? 'Processing...' : (mol.name || 'Synthetic Scaffold')}
              </div>
              <div className="text-[10px] font-mono text-slate-700 break-all leading-relaxed uppercase tracking-widest">{mol.smiles}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden">
              <div className="bg-black p-4 text-center">
                <p className="text-[9px] uppercase text-slate-800 font-bold tracking-widest mb-1">Atomic Mass</p>
                <p className="text-md font-black font-mono text-white tracking-tighter">{mol.mw.toFixed(1)} DA</p>
              </div>
              <div className="bg-black p-4 text-center">
                <p className="text-[9px] uppercase text-slate-800 font-bold tracking-widest mb-1">Hydrophobicity</p>
                <p className="text-md font-black font-mono text-[#bef264] tracking-tighter">{mol.logp.toFixed(2)} LP</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8 py-12">
            <div className="text-center space-y-6 opacity-30 group-hover:opacity-100 transition-all">
              <div className="w-20 h-20 mx-auto border-2 border-dashed border-white/10 flex items-center justify-center group-hover:border-[#bef264]/50 group-hover:rotate-45 transition-all">
                <Microscope className="w-10 h-10 group-hover:-rotate-45 transition-all" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.5em]">Input.Required</p>
            </div>
            <div className="flex flex-col gap-4">
              <input 
                type="text"
                placeholder="Molecular Sequence (SMILES)..."
                value={curSmiles}
                onChange={(e) => setCurSmiles(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualInput(slot, curSmiles)}
                className="w-full bg-black border border-white/10 px-6 py-4 text-[13px] font-mono focus:outline-none focus:border-[#bef264] transition-all text-[#bef264] placeholder:text-slate-900 placeholder:font-black tracking-widest italic"
              />
              <button 
                onClick={() => handleManualInput(slot, curSmiles)}
                className="bg-white text-black font-black uppercase tracking-[0.4em] py-4 text-[10px] hover:bg-[#bef264] transition-all disabled:opacity-30"
                disabled={identifying}
              >
                Scan Sequence
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1500px] mx-auto space-y-20 py-8 px-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out pb-20">
      <section className="text-left space-y-12 pt-16 md:pt-24 relative">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#bef264]/5 to-transparent pointer-events-none -z-10" />
        
        <div className="space-y-8">
           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
           >
             <div className="w-12 h-[2px] bg-[#bef264]" />
             <span className="text-[11px] font-black uppercase tracking-[0.8em] text-[#bef264]">Simulation.Grid</span>
           </motion.div>

           <h2 className="text-[7vw] md:text-[9vw] font-display font-black tracking-[-0.08em] uppercase leading-[0.75]">
             Atomic <br />
             <span className="text-transparent border-t-2 border-b-2 border-white/10 hover:border-[#bef264] transition-colors inline-block mt-4 [-webkit-text-stroke:1px_white]">
               Fusion
             </span>
           </h2>
        </div>
        
        <p className="text-slate-400 max-w-3xl text-xl font-light tracking-tight italic border-l-2 border-white/5 pl-10 mt-12">
          "Predicting emergent pharmacophores through simulated atomic collisions. High-fidelity molecular fusion at the sub-nano scale."
        </p>
      </section>

      <div className="flex flex-col xl:flex-row gap-8 items-stretch max-w-full mx-auto w-full relative">
        {/* Left Side: Precursors */}
        <div className="xl:w-1/3 flex flex-col gap-12">
          {[
            { label: 'Primary Scaffold', icon: FlaskConical, drug: molA, setMol: setSlotA, setSmiles: setSmilesA, smiles: smilesA, identifying: identifyingA, color: 'text-[#bef264]', bg: 'bg-[#bef264]/5' },
            { label: 'Functional Reagent', icon: Microscope, drug: molB, setMol: setSlotB, setSmiles: setSmilesB, smiles: smilesB, identifying: identifyingB, color: 'text-white', bg: 'bg-white/5' }
          ].map((slot, i) => (
            <div key={i} className="glass-card p-0 flex flex-col border-white/5 group overflow-hidden">
               <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                     <div className={cn("w-10 h-10 flex items-center justify-center", slot.bg)}>
                        <slot.icon className={cn("w-5 h-5", slot.color)} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">{slot.label}</span>
                  </div>
               </div>
               
               <div className="p-6 space-y-6 bg-black/40">
                  <div className="aspect-square bg-black border border-white/5 relative flex items-center justify-center group-hover:border-[#bef264]/30 transition-colors">
                     {slot.drug ? (
                        <MoleculeStructure smiles={slot.drug.smiles} className="w-full h-full p-8 scale-90" />
                     ) : (
                        <div className="text-center space-y-4 opacity-30">
                           <Activity className="w-12 h-12 mx-auto stroke-[0.5]" />
                           <p className="text-[9px] font-black uppercase tracking-widest px-8 text-white/40">Awaiting sequence mapping...</p>
                        </div>
                     )}
                     <div className="absolute top-4 right-4 flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 shadow-[0_0_8px_#bef264]", slot.drug ? "bg-[#bef264]" : "bg-white/10")} />
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{slot.drug ? 'Mapped' : 'Unbound'}</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex flex-wrap gap-2">
                        {['aspirin', 'caffeine', 'ibuprofen'].map(s => (
                           <button
                             key={s}
                             onClick={() => {
                                const d = DRUGS_DB[s];
                                slot.setMol(d);
                                slot.setSmiles(d.smiles);
                             }}
                             className={cn(
                               "px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all",
                               slot.drug?.smiles === DRUGS_DB[s].smiles 
                                 ? "bg-[#bef264] border-[#bef264] text-black" 
                                 : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                             )}
                           >
                              {DRUGS_DB[s].name}
                           </button>
                        ))}
                     </div>
                     <input 
                       type="text"
                       value={slot.smiles}
                       placeholder="SMILES SEARCH..."
                       className="w-full bg-[#111] border border-white/5 py-4 px-6 text-[11px] font-mono focus:outline-none focus:border-[#bef264] transition-all text-[#bef264] placeholder:text-white/10 placeholder:font-black tracking-widest"
                       onChange={(e) => slot.setSmiles(e.target.value)}
                     />
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Center: Fusion Matrix */}
        <div className="flex-1 glass-card p-0 flex flex-col border-white/5 relative overflow-hidden min-h-[800px] bg-black/80">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
          
          <div className="flex items-center justify-between p-12 border-b border-white/5 bg-black">
             <div className="flex items-center gap-6">
                <LayoutGrid className="w-8 h-8 text-[#bef264]" />
                <h3 className="text-[14px] font-black uppercase tracking-[0.5em] text-white">Fusion Matrix</h3>
             </div>
             <button 
                onClick={handleSynthesize}
                disabled={analyzing || !molA || !molB}
                className="btn-primary min-w-[300px]"
             >
                {analyzing ? 'Synthesizing...' : 'Run Simulation'}
             </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center p-20">
             {analyzing ? (
                <div className="space-y-12 text-center">
                   <div className="relative w-64 h-64 mx-auto">
                      <div className="absolute inset-0 border-2 border-dashed border-[#bef264]/20 rounded-none animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-8 border border-white/5 rounded-none animate-[spin_15s_linear_infinite_reverse]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-12 h-12 bg-[#bef264] animate-ping" />
                      </div>
                   </div>
                   <div className="space-y-6">
                      <p className="text-[16px] font-black uppercase tracking-[1em] text-[#bef264] animate-pulse">Collision.Active</p>
                      <p className="text-[11px] font-mono text-slate-800 uppercase tracking-widest">Recalculating node gradients in latent space...</p>
                   </div>
                </div>
             ) : interactionResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-24"
                >
                   <div className="relative group/res">
                      <div className="absolute -top-10 -left-10 text-[12px] font-black text-[#bef264] tracking-[0.6em] opacity-40 group-hover/res:opacity-100 transition-opacity">FUSION_PRODUCT</div>
                      <div className="aspect-square bg-black border border-white/5 p-4 group-hover:border-[#bef264]/30 transition-all flex items-center justify-center relative backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,1)]">
                         {interactionResult.resultant ? (
                            <MoleculeStructure smiles={interactionResult.resultant.smiles || ''} className="w-full h-full drop-shadow-[0_0_80px_rgba(190,242,100,0.2)]" />
                         ) : (
                            <div className="text-[#bef264] font-mono text-center space-y-6">
                               <ShieldAlert className="w-16 h-16 mx-auto" />
                               <p className="text-xl uppercase tracking-widest font-black leading-tight">Simulation <br /> Failed</p>
                               <p className="text-[10px] opacity-40">Molecular geometry clash <br /> detected in simulation</p>
                            </div>
                         )}
                      </div>
                      <div className="mt-8 p-6 bg-black/40 border border-white/5 backdrop-blur-3xl">
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">Molecular Sequence (SMILES)</p>
                        <p className="text-[11px] font-mono text-[#bef264]/80 break-all leading-relaxed">{interactionResult.resultant?.smiles || 'NONE'}</p>
                      </div>
                   </div>
                   
               <div className="space-y-6">
                 <h4 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.8] italic">
                    {interactionResult.resultant?.name || 'Insolvable'} <br /> <span className="text-[#bef264]">Derivative</span>
                 </h4>
                 <p className="text-slate-300 text-lg font-light leading-snug tracking-tight italic border-l-2 border-[#bef264] pl-8">
                    {interactionResult.verdict}
                 </p>
              </div>
              
              <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-16">
                 <div className="space-y-4">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Similarity Indx</span>
                    <p className="text-3xl font-black text-white font-mono tracking-tighter">{(interactionResult.similarity * 100).toFixed(1)}%</p>
                 </div>
                 <div className="space-y-4">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Potency Score</span>
                    <p className={cn("text-3xl font-black font-mono tracking-tighter", interactionResult.score > 70 ? 'text-[#bef264]' : 'text-orange-500')}>
                       {interactionResult.score}%
                    </p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em] mb-4">Interactions:</p>
                 <div className="space-y-4">
                    {interactionResult.interactions.slice(0, 2).map((int, i) => (
                       <div key={i} className="p-6 bg-white/[0.02] border-l-4 border-white/10 group-hover:border-[#bef264] transition-colors">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[11px] font-black uppercase text-white tracking-widest">{int.type}</span>
                             <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{int.sev}</span>
                          </div>
                          <p className="text-xs text-slate-300 font-light tracking-tight italic">"{int.desc}"</p>
                       </div>
                    ))}
                 </div>
              </div>
                </motion.div>
             ) : (
          <div className="flex flex-col items-center gap-8 max-w-xl text-center">
             <div className="w-32 h-32 border-2 border-dashed border-white/10 flex items-center justify-center">
                <FlaskConical className="w-12 h-12 text-slate-500" />
             </div>
             <div className="space-y-4">
                <h4 className="text-2xl font-black text-white uppercase tracking-[0.3em] leading-none">Matrix Awaiting</h4>
                <p className="text-slate-400 text-sm font-light tracking-tight px-8 italic border-l-2 border-white/10 mx-auto">
                   Initialize primary scaffold and reagent node to start the fusion simulation pipeline.
                </p>
             </div>
          </div>
             )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!interactionResult && !analyzing && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-16 pt-32 border-t border-white/5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-[#bef264]" />
                  <h2 className="text-[12px] font-black uppercase tracking-[1em] text-white">Molecule.Inventory</h2>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-16">Standardized scaffolds for simulation</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-1 bg-white/5 border border-white/5">
              {Object.keys(DRUGS_DB).map(key => (
                <button
                  key={key}
                  disabled={molA?.smiles === DRUGS_DB[key].smiles || molB?.smiles === DRUGS_DB[key].smiles}
                  onClick={() => !molA ? (setSlotA(DRUGS_DB[key]), setSmilesA(DRUGS_DB[key].smiles)) : (setSlotB(DRUGS_DB[key]), setSmilesB(DRUGS_DB[key].smiles))}
                  className="bg-black p-8 text-left group h-40 flex flex-col justify-between hover:bg-[#bef264] transition-all relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="relative z-10 space-y-2">
                    <div className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-black/60 transition-colors">Class: {DRUGS_DB[key].class.substring(0,12)}</div>
                    <div className="text-lg font-black text-white group-hover:text-black transition-colors truncate tracking-tighter uppercase italic">{DRUGS_DB[key].name}</div>
                  </div>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] text-slate-400 font-mono uppercase group-hover:text-black/40">{DRUGS_DB[key].mw.toFixed(0)} DA</span>
                    <Plus className="w-4 h-4 text-[#bef264] group-hover:text-black" />
                  </div>
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
