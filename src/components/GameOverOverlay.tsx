import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Home, Trophy, Target } from 'lucide-react';

interface GameOverOverlayProps {
  score: number;
  highScore: number;
  mode: string;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ 
  score, 
  highScore, 
  mode, 
  onRestart, 
  onHome 
}) => {
  const isNewRecord = score >= highScore && score > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-white/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl border border-slate-100 text-center"
      >
        <header className="mb-10">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">Operation Result</p>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Session Terminated</h2>
        </header>

        <div className="mb-10">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{mode} Score</div>
          <div className="relative inline-block">
            <span className="text-8xl font-light tabular-nums text-slate-900 tracking-tighter">{score}</span>
            {isNewRecord && (
              <div className="absolute -top-2 -right-10 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter rotate-12">
                RECORD
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Re-Initialize
          </button>
          <button
            onClick={onHome}
            className="bg-slate-50 text-slate-400 py-4 rounded-2xl font-bold text-[10px] tracking-widest uppercase transition-all active:scale-95 border border-slate-100"
          >
            System Menu
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center opacity-40">
           <div className="text-left">
             <p className="text-[8px] font-bold uppercase text-slate-400">Best Performance</p>
             <p className="text-sm font-light italic">{highScore}</p>
           </div>
           <Trophy size={20} className={isNewRecord ? "text-emerald-500" : "text-slate-300"} />
        </div>
      </motion.div>
    </motion.div>
  );
};
