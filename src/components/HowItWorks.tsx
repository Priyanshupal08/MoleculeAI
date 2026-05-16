import React from 'react';
import { Microscope, Code2, BrainCircuit, Binary, Database as DatabaseIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Graph Topology',
      desc: 'Molecules are converted into mathematical graphs where atoms are nodes and bonds are edges. This preserves structural topology and electronic influence.',
      icon: Binary,
      color: 'text-[#bef264]',
      tag: 'Step 01'
    },
    {
      title: 'GNN Processing',
      desc: 'Our Graph Neural Network runs message passing across the molecular graph, learning chemical context through iterative node updates.',
      icon: BrainCircuit,
      color: 'text-white',
      tag: 'Step 02'
    },
    {
      title: 'Cheminformatics',
      desc: 'Using validated RDKit engines, we compute Lipinski rules, TPSA, and Crippen LogP to verify "drug-likeness" standards.',
      icon: Microscope,
      color: 'text-slate-500',
      tag: 'Step 03'
    },
    {
      title: 'Property Prediction',
      desc: 'The learned embeddings are passed to task-specific heads to predict solubility, toxicity, and metabolic stability.',
      icon: Code2,
      color: 'text-[#bef264]',
      tag: 'Step 04'
    }
  ];

  return (
    <div className="max-w-[1500px] mx-auto py-12 px-10 space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out pb-32">
      <section className="text-left space-y-12 pt-16 md:pt-32">
        <div className="flex items-center gap-6">
           <div className="w-12 h-[2px] bg-[#bef264]" />
           <span className="text-[11px] font-black uppercase tracking-[8px] text-[#bef264] px-4 py-1 bg-[#bef264]/5">Infrastructure.Architecture</span>
        </div>
        <div className="space-y-8">
          <h2 className="text-[6vw] md:text-[8vw] font-display font-black tracking-[-0.08em] uppercase leading-[0.75]">
            The <br />
            <span className="text-transparent border-t-2 border-b-2 border-white/10 hover:border-[#bef264] transition-colors inline-block mt-4 [-webkit-text-stroke:1px_white]">
              Pipeline
            </span>
          </h2>
          <p className="text-slate-400 max-w-4xl text-xl font-light leading-relaxed italic border-l-2 border-white/5 pl-10 mt-12">
            "The biggest bottleneck in drug discovery isn't synthesis—it's safety and property prediction. Our neural architecture bridges that gap through bilateral atomic alignment."
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-1 relative border-t border-b border-white/5 bg-white/5">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="group relative overflow-hidden bg-black p-8 hover:bg-[#111] transition-all min-h-[400px] flex flex-col justify-between"
          >
            <div className="space-y-10 relative z-10">
               <div className="flex items-center justify-between">
                  <div className={cn("w-10 h-10 flex items-center justify-center shrink-0 border border-white/5 bg-white/5 transition-all duration-700", i % 2 === 0 ? "text-[#bef264]" : "text-white")}>
                     <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{step.tag}</span>
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-[#bef264] transition-colors italic">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-light tracking-tight">{step.desc}</p>
               </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 group-hover:bg-[#bef264] transition-colors" />
          </motion.div>
        ))}
      </div>

      <section className="glass-card p-0 relative overflow-hidden bg-black border-white/5">
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#bef264]/5 to-transparent pointer-events-none" />
          <DatabaseIcon className="absolute top-1/2 right-20 -translate-y-1/2 w-80 h-80 text-white/5 pointer-events-none hidden lg:block opacity-20" />
          
          <div className="grid grid-cols-1 md:grid-cols-12">
             <div className="md:col-span-12 p-8 md:p-16 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-6 h-6 rounded-none border border-[#bef264] flex items-center justify-center text-[#bef264]">
                        <div className="w-1.5 h-1.5 bg-[#bef264] animate-pulse" />
                     </div>
                     <span className="text-[10px] font-black tracking-[6px] uppercase text-[#bef264]">Hashed Security Matrix</span>
                  </div>
                  <h3 className="text-4xl md:text-[6vw] font-display font-black text-white uppercase tracking-tighter leading-[0.8] italic">Atomic <br /> Lookup Index</h3>
                </div>
                
                <p className="text-slate-300 text-xl leading-relaxed font-light max-w-4xl border-l border-white/10 pl-10">
                  We leverage IUPAC's InChIKey algorithm to synthesize a unique  digital signature for every molecular graph. 
                  This permits instantaneous cross-referencing with global pharmaceutical repositories.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-white/5 border border-white/5">
                  <div className="p-8 bg-black space-y-4">
                    <span className="text-[9px] font-black text-[#bef264] uppercase tracking-[0.4em]">Input SEQUENCE</span>
                    <div className="font-mono text-white text-base break-all leading-tight border-l-2 border-[#bef264] pl-4 py-2">CC(=O)Oc1ccccc1C(=O)O</div>
                  </div>
                  <div className="p-8 bg-black space-y-4">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Hashed InChIKey</span>
                    <div className="font-mono text-slate-400 text-base break-all leading-tight border-l-2 border-white/10 pl-4 py-2">BSYNRYMUTXBXSQ-UHFFFAOYSA-N</div>
                  </div>
                </div>
             </div>
          </div>
      </section>

      <div className="flex flex-col items-center gap-12 py-20 border-t border-white/5">
         <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 bg-[#bef264]" />
            <div className="w-1.5 h-1.5 bg-[#bef264]/50" />
            <div className="w-1.5 h-1.5 bg-[#bef264]/20" />
         </div>
         <p className="text-[12px] font-black uppercase tracking-[1.5em] text-slate-500 border-b border-slate-700 pb-2">END_OF_PROTOCOL</p>
      </div>
    </div>
  );
};
