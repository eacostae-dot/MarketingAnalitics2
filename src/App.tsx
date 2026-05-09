/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSnakeGame } from './lib/useSnakeGame';
import { GameMode, GameStatus } from './types';
import { SNAKE_COLORS } from './constants';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { StatusBar } from './components/StatusBar';
import { GameOverOverlay } from './components/GameOverOverlay';
import { SwipeControl } from './components/SwipeControl';
import { Pause, Play, Home } from 'lucide-react';

import { ParticleSystem } from './components/ParticleSystem';

export default function App() {
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.CLASSIC);
  const [snakeColor, setSnakeColor] = useState(SNAKE_COLORS[0]);
  const { state, startGame, pauseGame, resetGame, setDirection } = useSnakeGame(selectedMode);

  // Trigger particles when score increases
  const [lastScore, setLastScore] = useState(0);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (state.score > lastScore) {
      // Calculate approximate pixel position
      // Using grid size of 500x500
      const cellSize = 500 / 20;
      setParticlePos({
        x: state.snake[0].x * cellSize + cellSize / 2,
        y: state.snake[0].y * cellSize + cellSize / 2
      });
      setParticleTrigger(prev => prev + 1);
      setLastScore(state.score);
    }
  }, [state.score, lastScore, state.snake]);

  const handleStart = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
    startGame();
  }, [startGame]);

  if (state.status === GameStatus.IDLE) {
    return (
      <MainMenu 
        onStart={handleStart}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        currentColor={snakeColor}
        onColorChange={setSnakeColor}
        highScore={state.highScore}
      />
    );
  }

  return (
    <SwipeControl onSwipe={setDirection}>
      <div className="flex h-screen w-full bg-white text-slate-900 font-sans overflow-hidden">
        {/* Left Sidebar: Stats & Modes (Visible on desktop) */}
        <aside className="hidden lg:flex w-72 border-r border-slate-100 p-8 flex-col shadow-sm z-10 bg-white">
          <div className="mb-10">
            <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">Game Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-500">Current Score</span>
                <span className="text-2xl font-light italic tabular-nums">{state.score}</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (state.score % 1000) / 10)}%` }}
                  className="h-full bg-emerald-400"
                />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-500">Best Record</span>
                <span className="text-xs font-medium uppercase tracking-tighter text-emerald-500">{state.highScore}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">Active Mode</h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-tight">{state.mode}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest leading-none">
                {state.mode === GameMode.CLASSIC ? "Original experience" : "Special parameters active"}
              </p>
            </div>
            
            {state.combo > 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-orange-50 border border-orange-100"
              >
                <p className="text-[10px] uppercase tracking-widest text-orange-400 font-bold mb-1">Combo Active</p>
                <p className="text-xl font-black text-orange-500 tracking-tighter">x{state.combo}</p>
              </motion.div>
            )}
          </div>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <button 
              onClick={resetGame}
              className="flex items-center gap-3 w-full group transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold group-hover:bg-slate-700">
                <Home size={18} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Main Menu</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">Exit Mission</div>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content: Game Area */}
        <main className="flex-1 bg-[#FAFAFA] flex flex-col items-center justify-center relative p-6">
          {/* Decorative Background Grid */}
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

          {/* Mobile Header (Only on small screens) */}
          <div className="lg:hidden w-full max-w-[500px] flex items-center justify-between mb-8 z-20">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Score</p>
              <p className="text-2xl font-light tabular-nums">{state.score}</p>
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{state.mode}</span>
            </div>
            <button 
              onClick={pauseGame}
              className="p-3 rounded-2xl bg-slate-900 text-white shadow-lg active:scale-95 transition-transform"
            >
              {state.status === GameStatus.PAUSED ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
            </button>
          </div>

          {/* Game Board with "Phone View" styling on large screens */}
          <div className="relative z-10 w-full flex flex-col items-center">
             <div className="relative w-full max-w-[500px] bg-white p-2 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border-[6px] border-slate-900 overflow-hidden">
                <GameBoard state={state} color={snakeColor} />
                <ParticleSystem 
                  x={particlePos.x} 
                  y={particlePos.y} 
                  color="#FF0055" 
                  trigger={particleTrigger} 
                />
                
                <AnimatePresence>
                  {state.status === GameStatus.PAUSED && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-40 flex items-center justify-center glass-dark"
                    >
                      <div className="text-center">
                         <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6">System Paused</h2>
                         <button 
                          onClick={pauseGame}
                          className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold flex items-center mx-auto shadow-xl hover:scale-105 active:scale-95 transition-all"
                         >
                           <Play className="mr-2" fill="currentColor" size={20} />
                           RESUME
                         </button>
                      </div>
                    </motion.div>
                  )}

                  {state.status === GameStatus.GAME_OVER && (
                    <GameOverOverlay 
                      score={state.score}
                      highScore={state.highScore}
                      mode={state.mode}
                      onRestart={() => {
                        resetGame();
                        startGame();
                      }}
                      onHome={resetGame}
                    />
                  )}
                </AnimatePresence>
             </div>

             {/* Simple Desktop Controls indicator */}
             <div className="hidden lg:flex w-full max-w-[500px] justify-between mt-8">
               <div className="flex gap-2">
                 {['←', '↓', '→', '↑'].map(key => (
                   <div key={key} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shadow-sm capitalize">
                     {key === '↑' ? 'W' : key === '←' ? 'A' : key === '↓' ? 'S' : 'D'}
                   </div>
                 ))}
               </div>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={pauseGame}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    Space to Pause
                  </button>
               </div>
             </div>
          </div>
        </main>

        {/* Right Sidebar: Customization & Info (Visible on desktop) */}
        <aside className="hidden xl:flex w-80 border-l border-slate-100 p-8 flex-col shadow-sm bg-white">
          <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-6">Visual Profile</h2>
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/10 flex flex-col justify-between aspect-video">
              <div className="w-full h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mt-4">Current Snake Skin</span>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Color Palette</h3>
              <div className="grid grid-cols-3 gap-3">
                {SNAKE_COLORS.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSnakeColor(color)}
                    className={`h-8 rounded-lg border-2 transition-all ${snakeColor === color ? 'border-slate-900 scale-105 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">Mission Directives</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm font-bold text-xs italic">i</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tight">Movement</p>
                  <p className="text-[10px] text-blue-600 uppercase tracking-widest leading-none">Fluid 60FPS Response</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 flex items-center gap-4 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm text-xs italic">!</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tight">Difficulty</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">Dynamic Scaling On</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { resetGame(); startGame(); }}
            className="mt-auto py-5 bg-slate-900 text-white rounded-2xl font-bold text-xs tracking-[0.2em] uppercase shadow-xl hover:bg-slate-800 transition-all active:scale-95"
          >
            Restart Level
          </button>
        </aside>
      </div>
    </SwipeControl>
  );
}

