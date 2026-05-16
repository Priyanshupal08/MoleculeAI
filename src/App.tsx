import React, { useState } from 'react';
import { Header } from './components/Header';
import { MoleculeAnalyzer } from './components/MoleculeAnalyzer';
import { SynthesisLab } from './components/SynthesisLab';
import { ChemicalAssistant } from './components/ChemicalAssistant';
import { HowItWorks } from './components/HowItWorks';
import { ModelTrainingLab } from './components/ModelTrainingLab';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer');

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#bef264]/30 selection:text-[#bef264] overflow-x-hidden">
      {/* Background Decor */}
      <div className="bg-mesh" />
      <div className="bg-lines" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#bef264]/3 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-500/2 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="relative z-10 pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'analyzer' && (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <MoleculeAnalyzer />
            </motion.div>
          )}

          {activeTab === 'lab' && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <SynthesisLab />
            </motion.div>
          )}

          {activeTab === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChemicalAssistant />
            </motion.div>
          )}

          {activeTab === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <ModelTrainingLab />
            </motion.div>
          )}

          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <HowItWorks />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-24 mt-20 px-10 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
            <div className="md:col-span-5 space-y-10">
             <div className="space-y-3">
                <div className="font-display font-black text-4xl tracking-tighter text-white uppercase italic">
                  Molecule<span className="text-[#bef264]">AI</span>
                </div>
                <div className="h-1 w-16 bg-[#bef264]" />
             </div>
             <p className="text-slate-500 text-base leading-relaxed font-light max-w-md">
               The global authority in molecular intelligence. 
               We bridge the gap between experimental chemistry and neural compute 
               to unlock a new era of human longevity and health.
             </p>
             <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#bef264]/50 hover:bg-[#bef264]/5 transition-all cursor-pointer group">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#bef264] transition-colors" />
                  </div>
                ))}
             </div>
           </div>
           
           <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
             <div className="space-y-6">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Platform</h4>
               <ul className="space-y-4 text-slate-400 text-sm font-medium">
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Molecular Analyzer</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Synthesis Laboratory</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Neural R&D Agent</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Quantum Pipeline</a></li>
               </ul>
             </div>
             <div className="space-y-6">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Resources</h4>
               <ul className="space-y-4 text-slate-400 text-sm font-medium">
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Case Studies</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Research API</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Documentation</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Whitepapers</a></li>
               </ul>
             </div>
             <div className="space-y-6">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Legal</h4>
               <ul className="space-y-4 text-slate-400 text-sm font-medium">
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Terms of Service</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Biosafety Protocol</a></li>
                 <li><a href="#" className="hover:text-[#bef264] transition-colors">Bioethics</a></li>
               </ul>
             </div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">
            <p>© 2026 MOLECULEAI QUANTUM TECHNOLOGIES AG. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4 items-center">
              <span className="w-2 h-2 bg-[#bef264] rounded-full animate-pulse shadow-[0_0_10px_rgba(190,242,100,0.5)]" />
              SYSTEM STATUS: NOMINAL
            </div>
        </div>
      </footer>
    </div>
  );
}

