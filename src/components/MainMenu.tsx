import React from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, Settings, Zap, Shield, Infinity, AlertTriangle, Skull } from 'lucide-react';
import { GameMode, GameStatus } from '../types';
import { MODE_CONFIGS, SNAKE_COLORS } from '../constants';
import { DuoToneIcon } from './DuoToneIcon';

interface MainMenuProps {
  onStart: (mode: GameMode) => void;
  selectedMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  highScore: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  onStart, 
  selectedMode, 
  onModeChange, 
  currentColor,
  onColorChange,
  highScore
}) => {
  const modes = [
    { type: GameMode.CLASSIC, icon: Zap, color: '#4ADE80' },
    { type: GameMode.ARCADE, icon: Zap, color: '#FACC15' },
    { type: GameMode.SURVIVAL, icon: Shield, color: '#F87171' },
    { type: GameMode.INFINITE, icon: Infinity, color: '#60A5FA' },
    { type: GameMode.HARDCORE, icon: Skull, color: '#A78BFA' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white text-slate-900 font-sans overflow-hidden">
      {/* Left Decoration / Info */}
      <aside className="hidden lg:flex w-80 border-r border-slate-100 p-10 flex-col justify-between">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-10">Neon Snake OS v4.0</h2>
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Global Record</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light italic tabular-nums">{highScore}</span>
                <Trophy size={16} className="text-yellow-500" />
              </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
               <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">System Health</p>
               <div className="h-1 bg-white rounded-full overflow-hidden border border-slate-200">
                 <div className="h-full bg-emerald-400 w-full animate-pulse" />
               </div>
               <p className="text-[10px] text-emerald-500 font-bold mt-2 uppercase tracking-tighter">Stability: 99.9%</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-300 uppercase tracking-[0.2em] leading-relaxed">
          Designed for precision movement.<br />
          Optimized for high-fidelity response.<br />
          © 2026 NEON RESEARCH LABS.
        </div>
      </aside>

      {/* Main Selection Area */}
      <main className="flex-1 bg-[#FAFAFA] flex flex-col items-center justify-center p-8 relative overflow-y-auto scrollbar-hide">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl z-10"
        >
          <header className="text-center mb-16">
             <h1 className="text-7xl font-black tracking-tighter text-slate-900 mb-2 uppercase">
              Neon<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Snake</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.5em] uppercase">High Precision Arcade Interface</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {modes.map((mode, index) => (
              <motion.button
                key={mode.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onModeChange(mode.type)}
                className={`flex items-center p-4 rounded-2xl border transition-all ${
                  selectedMode === mode.type 
                    ? 'border-slate-900 bg-white shadow-xl shadow-slate-200 ring-1 ring-slate-900' 
                    : 'border-slate-100 bg-white/50 hover:bg-white hover:border-slate-200 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-lg mr-4 ${selectedMode === mode.type ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}`}>
                  <mode.icon size={16} />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${selectedMode === mode.type ? 'text-slate-900' : 'text-slate-400'}`}>{mode.type}</h3>
                  <p className="text-[10px] opacity-60 line-clamp-1 uppercase tracking-tighter">{MODE_CONFIGS[mode.type].description}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-12">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">Visual Customization</h3>
            <div className="flex justify-between max-w-sm mx-auto">
              {SNAKE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className={`w-10 h-10 rounded-full transition-all active:scale-95 ${
                    currentColor === color ? 'ring-2 ring-slate-900 ring-offset-4 scale-110' : 'opacity-40 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart(selectedMode)}
            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl tracking-tighter flex items-center justify-center shadow-2xl shadow-slate-300 hover:shadow-emerald-200/50 transition-all transition-shadow group"
          >
            <Play fill="currentColor" size={24} className="mr-3 group-hover:text-emerald-400 transition-colors" />
            INITIALIZE MISSION
          </motion.button>
        </motion.div>
      </main>

      {/* Right Decor Area */}
      <aside className="hidden xl:flex w-72 border-l border-slate-100 p-10 flex-col">
        <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-6">Version Control</h2>
        <div className="space-y-4">
           {['Rendering: WebGL 2.0', 'Input: Adaptive Swipe', 'Frames: 60Hz', 'Network: Local Only'].map(text => (
             <div key={text} className="flex items-center text-[10px] text-slate-400 uppercase tracking-tighter">
               <div className="w-1 h-1 rounded-full bg-slate-200 mr-3" />
               {text}
             </div>
           ))}
        </div>
      </aside>
    </div>
  );
};
