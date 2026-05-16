import React from 'react';
import { Beaker, Brain, Microscope, Activity, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'analyzer', label: 'Analyzer', icon: Microscope, tag: '01' },
    { id: 'lab', label: 'Synthesis Lab', icon: Beaker, tag: '02' },
    { id: 'assistant', label: 'AI Assistant', icon: Activity, tag: '03' },
    { id: 'training', label: 'Neural Lab', icon: Cpu, tag: '04' },
    { id: 'learn', label: 'Documentation', icon: Brain, tag: '05' },
  ];

  return (
    <header className="sticky top-0 z-50 px-0 h-24 pointer-events-none mb-12">
      <div className="max-w-full mx-auto flex items-center justify-between gap-0 h-full bg-black/80 backdrop-blur-3xl border-b border-white/5 px-10 pointer-events-auto">
        <div 
          className="flex items-center gap-6 cursor-pointer group/header"
          onClick={() => onTabChange('analyzer')}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-[#bef264] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(190,242,100,0.3)] group-hover/header:bg-white transition-all duration-500">
              <Beaker className="w-6 h-6 text-black" />
            </div>
            <div className="absolute top-1 left-1 w-12 h-12 border border-[#bef264] -z-10 group-hover/header:translate-x-1 group-hover/header:translate-y-1 transition-transform" />
          </div>
          <div className="flex flex-col -space-y-1.5 hidden md:flex">
            <span className="font-display font-black text-3xl tracking-tighter text-white uppercase leading-none">
              Molecule<span className="text-[#bef264]">AI</span>
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.8em] font-bold">Research.Archive</span>
          </div>
        </div>

        <nav className="flex h-full gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "h-full flex items-center gap-4 px-10 text-[11px] font-black uppercase tracking-[0.5em] transition-all relative group/nav overflow-hidden border-r border-white/5",
                activeTab === tab.id 
                  ? "text-black bg-[#bef264]" 
                  : "text-slate-300 hover:text-white hover:bg-white/[0.08]"
              )}
            >
              <span className={cn("font-mono text-[9px] px-1", activeTab === tab.id ? "text-black bg-black/10" : "text-slate-500 bg-white/5")}>{tab.tag}</span>
              <span className="hidden lg:inline">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute top-0 left-0 w-full h-1 bg-black/40" />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-8 h-full border-l border-white/5 pl-12 font-mono">
          <div className="flex flex-col items-end -space-y-1.5 opacity-40">
             <span className="text-[9px] font-black text-white tracking-widest uppercase">Encryption</span>
             <span className="text-[10px] text-white tracking-widest leading-none">Active</span>
          </div>
          <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center animate-spin [animation-duration:10s]">
             <div className="w-2 h-2 bg-[#bef264]" />
          </div>
        </div>
      </div>
    </header>
  );
};
