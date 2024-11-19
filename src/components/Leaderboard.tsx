import React from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const Leaderboard: React.FC = () => {
  const { leaderboard, setGameMode } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500 h-6 w-6" />
            <h2 className="text-2xl font-bold">Top Scores</h2>
          </div>
          <button
            onClick={() => setGameMode('menu')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No scores yet. Start playing to set some records!
            </p>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.date}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-2xl text-gray-400">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()} • {entry.difficulty}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {entry.score}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};