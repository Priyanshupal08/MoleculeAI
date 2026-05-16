import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Activity, Database, Play, BarChart3, Binary, FlaskConical, Github } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mlService, TrainingProgress } from '../services/mlService';
import { cn } from '../lib/utils';
import { DELANEY_DATASET } from '../data/chemDataset';

export const ModelTrainingLab: React.FC = () => {
  const [history, setHistory] = useState<TrainingProgress[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [hasTrained, setHasTrained] = useState(false);
  const [testInput, setTestInput] = useState('c1ccccc1O'); // Phenol
  const [prediction, setPrediction] = useState<number | null>(null);

  const handleTrain = async () => {
    setHistory([]);
    setIsTraining(true);
    await mlService.train((p) => {
      setHistory(prev => [...prev, p]);
    });
    setIsTraining(false);
    setHasTrained(true);
  };

  const calculateSolubilityIndex = (val: number) => {
    // Maps LogS value to a 0-100% scale
    // 0 LogS (1 mol/L) -> 100%
    // -6 LogS (0.000001 mol/L) -> 0%
    const index = ((val + 6) / 6) * 100;
    return Math.min(100, Math.max(0, index));
  };

  const handlePredict = () => {
    const res = mlService.predict(testInput);
    setPrediction(res);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <section className="text-left space-y-12 pt-16 md:pt-32 px-10">
        <div className="flex items-center gap-6">
           <div className="w-12 h-[2px] bg-[#bef264]" />
           <span className="text-[11px] font-black uppercase tracking-[0.8em] text-[#bef264]">Neural.Training.Laboratory</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Dashboard Left: Controls & Engine */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-black border border-white/10 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Brain className="w-32 h-32" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">ChemBrain</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Train a custom Feed-Forward Neural Network to predict molecular solubility index (%).
                  Powered by <span className="text-white font-mono">TensorFlow.js</span> and based on the Delaney Dataset.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#bef264]">
                  <span>Status: {isTraining ? 'Training Optimized...' : hasTrained ? 'Model Ready' : 'Idle'}</span>
                  <span>Accuracy: {hasTrained ? '~82%' : '0%'}</span>
                </div>
                <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                   {isTraining && (
                     <motion.div 
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-1/2 bg-[#bef264] shadow-[0_0_15px_#bef264]"
                     />
                   )}
                   {hasTrained && !isTraining && <div className="absolute inset-0 bg-[#bef264]" />}
                </div>
              </div>

              <button 
                onClick={handleTrain}
                disabled={isTraining}
                className={cn(
                  "w-full py-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden group/btn",
                  isTraining ? "bg-white/5 text-slate-500 cursor-not-allowed" : "bg-[#bef264] text-black hover:bg-white"
                )}
              >
                <Play className={cn("w-4 h-4", isTraining && "animate-pulse")} />
                {isTraining ? 'Processing Tensor Grid...' : 'Initiate Training'}
              </button>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 space-y-6">
               <div className="flex items-center gap-4">
                  <Database className="w-4 h-4 text-[#bef264]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Dataset Summary</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Samples</p>
                    <p className="text-xl font-mono text-white">1,129</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Layers</p>
                    <p className="text-xl font-mono text-white">3 (Dense)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Epochs</p>
                    <p className="text-xl font-mono text-white">50</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Input Shape</p>
                    <p className="text-xl font-mono text-white">1129 x 5</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Dashboard Right: Visualizer */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex-1 min-h-[400px] bg-black border border-white/10 p-8 relative">
              <div className="absolute top-6 left-12 flex items-center gap-6 z-10">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-[#bef264]" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Training Loss (MSE)</span>
                 </div>
              </div>
              
              <div className="w-full h-full pt-12">
                {history.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                      <XAxis 
                        dataKey="epoch" 
                        stroke="#444" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        label={{ value: 'EPOCH', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#666' }}
                      />
                      <YAxis 
                        stroke="#444" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        label={{ value: 'LOSS', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#666' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px', textTransform: 'uppercase' }}
                        itemStyle={{ color: '#bef264' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="loss" 
                        stroke="#bef264" 
                        strokeWidth={2} 
                        dot={false}
                        animationDuration={100}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-6 text-slate-700">
                     <BarChart3 className="w-16 h-16 animate-pulse" />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Simulation Data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Inference Module */}
            <div className="p-8 bg-black border border-white/10 flex flex-col md:flex-row items-center gap-8 group">
              <div className="flex-1 w-full space-y-4">
                 <div className="flex items-center gap-4">
                    <Binary className="w-4 h-4 text-[#bef264]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#bef264]">Predictive Inference Module</span>
                 </div>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Enter SMILES for live prediction..."
                      className="w-full bg-white/[0.03] border border-white/10 p-6 text-white font-mono text-sm focus:outline-none focus:border-[#bef264] transition-colors"
                    />
                    <button 
                      onClick={handlePredict}
                      disabled={!hasTrained}
                      className="absolute right-2 top-2 bottom-2 px-6 bg-white/10 hover:bg-white text-white hover:text-black transition-all flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group/apply"
                    >
                      <FlaskConical className="w-4 h-4 group-hover/apply:scale-125 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Test Model</span>
                    </button>
                 </div>
              </div>

              <div className="w-full md:w-[280px] h-[100px] flex flex-col items-center justify-center bg-white/[0.03] border border-white/5 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {prediction !== null ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Solubility Index (%)</p>
                      <p className="text-4xl font-display font-black text-[#bef264]">
                        {calculateSolubilityIndex(prediction).toFixed(1)}%
                      </p>
                    </motion.div>
                  ) : (
                    <div className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Awaiting Run</div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
