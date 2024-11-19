import React, { useState } from 'react';
import { RotateCcw, Home } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface GameOverProps {
  score: number;
  difficulty: string;
  onRestart: () => void;
  hasProfile: boolean;
}

export const GameOver: React.FC<GameOverProps> = ({ score, difficulty, onRestart, hasProfile }) => {
  const [playerName, setPlayerName] = useState('');
  const { addToLeaderboard, setGameMode } = useGameStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      addToLeaderboard({
        name: playerName.trim(),
        score,
        difficulty
      });
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <h2 className="text-3xl font-bold mb-4 text-red-600">Game Over!</h2>
        <p className="text-xl mb-6">Final Score: {score}</p>

        {!hasProfile && !submitted ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name for the leaderboard"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 
                       focus:border-blue-400 mb-4"
              maxLength={20}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                       py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Save Score
            </button>
          </form>
        ) : (
          <div className="flex gap-3 mb-6">
            <button
              onClick={onRestart}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                       py-3 px-6 rounded-lg transition-colors duration-200 flex items-center 
                       justify-center gap-2"
            >
              <RotateCcw size={20} />
              Play Again
            </button>
            <button
              onClick={() => setGameMode('menu')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold 
                       py-3 px-6 rounded-lg transition-colors duration-200 flex items-center 
                       justify-center gap-2"
            >
              <Home size={20} />
              Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};