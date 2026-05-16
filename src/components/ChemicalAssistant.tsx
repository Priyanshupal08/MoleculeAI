import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Eraser, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChemicalAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '### Neural Research Interface Initialized\nExpert system active and waiting for chemical queries. Please specify compounds, MOA, or pharmaceutical research parameters.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: "You are a professional pharmaceutical chemist and drug discovery expert. You provide accurate, scientific information about molecules, clinical trials, and pharmacology. Be structured and professional. Use markdown extensively: use headers (###) for sections, bullet points for properties, and bold text for importance. Always use proper chemical nomenclature. If providing a profile of a molecule, use a clear structured format with sections like 'Chemical Profile', 'Mechanism of Action', and 'Safety & Side Effects'.",
        },
        contents: [...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model' as any, parts: [{ text: m.content }] })), { role: 'user', parts: [{ text: userMessage }] }]
      });

      const responseText = response.text;
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseText || 'System error: No response received.' }]);
    } catch (error) {
      console.error('Gemini Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please ensure the API services are active.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-32px)] flex flex-col pt-2 pb-2 animate-in slide-in-from-bottom-8 duration-1000 ease-out px-10">
      <div className="glass-card flex-1 flex flex-col overflow-hidden relative border-white/5 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.9)] bg-black/80">
        {/* Dynamic Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
        
        {/* Chat Header */}
        <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black relative z-10 px-6">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-[#bef264]/5 border border-[#bef264]/20 flex items-center justify-center relative group">
                <Terminal className="w-4 h-4 text-[#bef264]" />
             </div>
             <div>
               <h3 className="text-lg font-black text-white tracking-tighter uppercase leading-none italic">Research.Assistant</h3>
               <div className="flex items-center gap-2 mt-1">
                 <div className="w-1 h-1 bg-[#bef264] shadow-[0_0_8px_#bef264]" />
                 <p className="text-[8px] text-slate-500 uppercase tracking-[0.5em] font-black">Neural Processor Active</p>
               </div>
             </div>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
            title="Purge Memory"
          >
            <Eraser className="w-5 h-5 group-hover:rotate-12" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar relative z-10">
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "flex gap-10 max-w-full",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-12 h-12 flex items-center justify-center shrink-0 border mt-2",
                m.role === 'user' 
                  ? "bg-white border-white text-black" 
                  : "bg-black border-white/10 text-[#bef264] shadow-[0_0_20px_rgba(190,242,100,0.1)]"
              )}>
                {m.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-6 tracking-tight relative border transition-all duration-500 shadow-2xl overflow-hidden",
                m.role === 'user' 
                  ? "bg-[#bef264] border-[#bef264] text-black font-black text-lg italic max-w-2xl shadow-[#bef264]/10" 
                  : "bg-white/[0.04] border-white/10 text-slate-200 max-w-[90%] md:max-w-none w-full text-sm flex-1"
              )}>
                {m.role === 'assistant' ? (
                  <div className="markdown-body prose prose-invert prose-lime max-w-none w-full">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
                
                {/* Visual Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-20" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-20" />
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-10 mr-auto animate-pulse">
               <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center shrink-0 text-[#bef264]">
                 <Loader2 className="w-6 h-6 animate-spin" />
               </div>
               <div className="p-10 bg-white/[0.02] border border-white/5 text-slate-400 flex items-center gap-6">
                 <span className="text-[12px] uppercase font-black tracking-[1em]">Deciphering...</span>
                 <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-[#bef264] animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[#bef264] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-[#bef264] animate-bounce [animation-delay:0.4s]" />
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-10 bg-black border-t border-white/5 relative z-10">
          <div className="relative group/input max-w-none mx-auto flex items-center gap-6">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query chemical properties..."
              className="flex-1 bg-[#111] border border-white/10 py-5 px-8 text-lg focus:outline-none focus:border-[#bef264] transition-all placeholder:text-slate-500 placeholder:font-black placeholder:uppercase placeholder:text-[9px] placeholder:tracking-[0.6em] font-medium text-white italic"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-16 h-16 bg-[#bef264] text-black flex items-center justify-center hover:bg-white active:scale-95 transition-all disabled:opacity-20 disabled:grayscale shadow-[0_20px_40px_rgba(190,242,100,0.2)]"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-6 flex justify-center">
             <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[1em]">System: Quantized Intelligence Layer Active @ 12.4 tps</p>
          </div>
        </div>
      </div>
    </div>
  );
};
