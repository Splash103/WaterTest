import React from 'react';
import { Users, User } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const GameModeSelect: React.FC = () => {
  const setGameMode = useGameStore(state => state.setGameMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Word Flood</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => setGameMode('single')}
            className="w-full flex items-center justify-between px-6 py-4 rounded-lg 
                     bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
                     hover:to-blue-700 text-white transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <span className="font-semibold">Single Player</span>
            </div>
          </button>

          <button
            onClick={() => setGameMode('multi')}
            className="w-full flex items-center justify-between px-6 py-4 rounded-lg 
                     bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 
                     hover:to-purple-700 text-white transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Multiplayer</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};