import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { MainMenu } from './components/MainMenu';
import { SinglePlayerGame } from './components/SinglePlayerGame';
import { MultiplayerGame } from './components/MultiplayerGame';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { Leaderboard } from './components/Leaderboard';
import { StartMenu } from './components/StartMenu';
import { useGameStore } from './store/gameStore';

function App() {
  const { gameMode, profile, initializeOnlineTracking, updateStatus } = useGameStore();

  useEffect(() => {
    if (profile) {
      initializeOnlineTracking();
    }
  }, [profile, initializeOnlineTracking]);

  useEffect(() => {
    if (profile) {
      updateStatus(gameMode === 'playing' ? 'in_game' : 'online');
    }
  }, [gameMode, profile, updateStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-center" />
      
      {gameMode === 'menu' && <MainMenu />}
      {gameMode === 'single' && <StartMenu onStart={(difficulty) => useGameStore.setState({ difficulty, gameMode: 'playing' })} />}
      {gameMode === 'playing' && (
        profile?.room ? <MultiplayerGame /> : <SinglePlayerGame />
      )}
      {gameMode === 'multi' && <MultiplayerLobby />}
      {gameMode === 'leaderboard' && <Leaderboard />}
    </div>
  );
}

export default App;