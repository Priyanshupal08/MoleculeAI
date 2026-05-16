import React, { useEffect, useRef, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import SmilesDrawer from 'smiles-drawer';
import { cn } from '../lib/utils';

interface MoleculeStructureProps {
  smiles: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export const MoleculeStructure: React.FC<MoleculeStructureProps> = ({ 
  smiles, 
  className,
  theme = 'dark' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !smiles) return;
    setError(false);

    try {
      // Basic check: if it looks like a formula (e.g. starts with H and not [H] or has capital letters followed by numbers)
      // we might want to be careful, but smiles-drawer is the authority. 
      // Most SMILES with H should be bracketed. 
      const isLikelyFormula = /^[A-Z][0-9]/.test(smiles) || (smiles.includes('H') && !smiles.includes('[H]'));
      
      const options = {
        width: 600,
        height: 600,
        bondThickness: 2.0,
        bondLength: 30,
        fontSizeLarge: 14,
        fontSizeSmall: 12,
        padding: 20,
        compactDrawing: false,
        terminalCarbons: true,
        explicitHydrogens: false,
        fontFamily: 'JetBrains Mono, monospace',
      };

      const drawFunc = () => {
        const SD = (SmilesDrawer as any);
        // Safely resolve the Drawer constructor
        const DrawerClass = SD.Drawer || SD.SmiDrawer || (typeof SD === 'function' ? SD : SD.default?.Drawer || SD.default);
        
        if (!DrawerClass || typeof DrawerClass !== 'function') {
          throw new Error('SmilesDrawer constructor not found');
        }

        const smilesDrawer = new DrawerClass(options);

        // Try direct draw first (v2 API)
        if (typeof smilesDrawer.draw === 'function' && typeof smiles === 'string') {
          try {
            // In v2, theme can be an object or a string if pre-defined
            smilesDrawer.draw(smiles, canvasRef.current, 'dark');
            return;
          } catch (e) {
            console.warn('Direct draw failed, trying with parse fallback', e);
          }
        }

        // Fallback to parse then draw (v1 behavior)
        const parseMethod = SD.parse || SD.Parser?.parse || SD.default?.parse;
        if (parseMethod && typeof parseMethod === 'function') {
          parseMethod(smiles, (tree: any) => {
            smilesDrawer.draw(tree, canvasRef.current, 'dark');
          }, (err: any) => {
            console.error('Molecule draw parse error:', err);
            setError(true);
          });
        }
      };

      drawFunc();
    } catch (e) {
      console.error('Failed to init SmilesDrawer:', e);
      setError(true);
    }
  }, [smiles, theme]);

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-slate-800 bg-black border border-white/5 p-4", className)}>
        <FlaskConical className="w-12 h-12 opacity-10 mb-4 stroke-[1]" />
        <span className="text-[10px] font-mono opacity-20 uppercase tracking-[0.5em]">Structure.Obscured</span>
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center justify-center p-0", className)}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '800px' }}
        className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      />
    </div>
  );
};
