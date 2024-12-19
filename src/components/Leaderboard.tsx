import React from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Background } from './Background';

export const Leaderboard: React.FC = () => {
  const { leaderboard, setGameMode } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center relative overflow-hidden px-4">
      <Background className="absolute inset-0" />
      
      <div className="relative z-10 max-w-2xl w-full mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-blue-300" />
              <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
            </div>
            <button
              onClick={() => setGameMode('menu')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-white">No scores yet. Start playing to set some records!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.date}
                  className="flex items-center gap-4 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-300">#{index + 1}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-white">{entry.name}</p>
                    <p className="text-sm text-blue-200">
                      {new Date(entry.date).toLocaleDateString()} • {entry.difficulty}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-white">{entry.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};