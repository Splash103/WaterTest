import React, { useState } from 'react';
import { Users, User, Trophy, Settings } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ProfileModal } from './ProfileModal';
import { Background } from './Background';

export const MainMenu: React.FC = () => {
  const { setGameMode } = useGameStore();
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="ocean-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      <Background />
      
      <div className="relative z-10 max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Word<span className="text-blue-300">Flood</span>
          </h1>
          <p className="text-lg text-blue-200">Dive into an ocean of words</p>
        </div>

        <div className="menu-card rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGameMode('single')}
              className="menu-button flex flex-col items-center gap-2 p-4 rounded-lg text-white"
            >
              <User className="h-6 w-6 text-blue-300" />
              <span className="font-semibold">Single Player</span>
            </button>

            <button
              onClick={() => setGameMode('multi')}
              className="menu-button flex flex-col items-center gap-2 p-4 rounded-lg text-white"
            >
              <Users className="h-6 w-6 text-blue-300" />
              <span className="font-semibold">Multiplayer</span>
            </button>

            <button
              onClick={() => setGameMode('leaderboard')}
              className="menu-button flex flex-col items-center gap-2 p-4 rounded-lg text-white"
            >
              <Trophy className="h-6 w-6 text-blue-300" />
              <span className="font-semibold">Leaderboard</span>
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="menu-button flex flex-col items-center gap-2 p-4 rounded-lg text-white"
            >
              <Settings className="h-6 w-6 text-blue-300" />
              <span className="font-semibold">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};