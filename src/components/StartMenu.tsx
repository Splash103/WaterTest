import React from 'react';
import { Play, Gauge, ArrowLeft } from 'lucide-react';
import { Difficulty, DIFFICULTY_SETTINGS } from '../utils/difficulty';
import { useGameStore } from '../store/gameStore';
import { Background } from './Background';

interface StartMenuProps {
  onStart: (difficulty: Difficulty) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
  const setGameMode = useGameStore((state) => state.setGameMode);

  return (
    <div className="ocean-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      <Background />
      
      <div className="relative z-10 max-w-md w-full px-4">
        <div className="menu-card rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Select Difficulty</h1>
            <button
              onClick={() => setGameMode('menu')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-blue-200 text-center mb-6">
              Type words matching the pattern before the water rises!
            </p>

            <div className="space-y-3">
              {(['easy', 'normal', 'hard'] as Difficulty[]).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => onStart(difficulty)}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-lg 
                           menu-button group hover:scale-102 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    {difficulty === 'easy' && <Play className="h-5 w-5 text-blue-300" />}
                    {difficulty === 'normal' && <Gauge className="h-5 w-5 text-blue-300" />}
                    {difficulty === 'hard' && (
                      <Gauge className="h-5 w-5 text-blue-300 transform rotate-90" />
                    )}
                    <span className="font-semibold capitalize text-white">{difficulty}</span>
                  </div>
                  <div className="text-sm text-blue-200">
                    {DIFFICULTY_SETTINGS[difficulty].description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};