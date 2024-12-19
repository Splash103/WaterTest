import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Copy, ArrowLeft, RefreshCw, Settings } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { PlayerBubbles } from './PlayerBubbles';
import { RoomList } from './RoomList';
import { LobbySettings } from './LobbySettings';
import { toast } from 'react-hot-toast';
import { Background } from './Background';
import { ExitConfirmation } from './ExitConfirmation';
import { seaAnimals } from '../utils/seaAnimals';
import { getOnlinePlayers } from '../services/players';
import { updateRoomSettings } from '../services/multiplayer';

export const MultiplayerLobby: React.FC = () => {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  
  const gameStore = useGameStore();
  const { profile, room } = gameStore;

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/.netlify/functions/list-rooms');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch rooms');
      }

      setRooms(data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load room list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchOnlinePlayers = async () => {
      try {
        const players = await getOnlinePlayers();
        setOnlineCount(players.length);
      } catch (error) {
        console.error('Error fetching online players:', error);
      }
    };

    fetchOnlinePlayers();
    const interval = setInterval(fetchOnlinePlayers, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!profile?.name) {
      toast.error('Please set up your profile first!');
      gameStore.setGameMode('menu');
    } else if (!room) {
      fetchRooms();
      const interval = setInterval(fetchRooms, 10000);
      return () => clearInterval(interval);
    }
  }, [profile, room, gameStore]);

  const handleCreateRoom = async () => {
    if (!profile?.name) {
      toast.error('Please set up your profile first!');
      return;
    }

    try {
      await gameStore.createRoom(profile.name);
      toast.success('Room created! Share the code with your friends.');
    } catch (error: any) {
      if (error.message === 'DEVELOPMENT_MODE') {
        toast.error('Multiplayer is only available after deployment');
      } else {
        toast.error('Failed to create room');
      }
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!profile?.name) {
      toast.error('Please set up your profile first!');
      return;
    }

    try {
      await gameStore.joinRoom(roomId, profile.name);
      toast.success('Successfully joined room!');
    } catch (error: any) {
      if (error.message === 'DEVELOPMENT_MODE') {
        toast.error('Multiplayer is only available after deployment');
      } else if (error.message === 'Room not found') {
        toast.error('Room not found. Please check the code.');
      } else {
        toast.error('Failed to join room');
      }
    }
  };

  const handleLeaveRoom = () => {
    if (room && profile) {
      gameStore.leaveRoom(room.id, profile.id);
      gameStore.setGameMode('menu');
      toast.success('You have left the room');
    }
  };

  const handleUpdateSettings = async (settings: any) => {
    if (!room?.id) return;

    try {
      await updateRoomSettings(room.id, settings);
      toast.success('Room settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update room settings');
    }
  };

  const copyRoomCode = () => {
    if (room?.id) {
      navigator.clipboard.writeText(room.id);
      toast.success('Room code copied to clipboard!');
    }
  };

  const isHost = room?.host === profile?.id;
  const getDefaultAvatar = () => seaAnimals[0];

  if (!profile?.name) return null;

  return (
    <div className="ocean-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      <Background />
      
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8">
        <div className="menu-card rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-white">Multiplayer</h2>
              <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full">
                <Users size={14} className="text-blue-300" />
                <span className="text-sm text-white">{onlineCount} online</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {room && isHost && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <Settings className="h-5 w-5" />
                </button>
              )}
              {!room && (
                <button
                  onClick={fetchRooms}
                  disabled={isLoading}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white
                           disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button
                onClick={() => room ? setShowExitConfirmation(true) : gameStore.setGameMode('menu')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          {room ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={copyRoomCode}
                  className="flex items-center gap-2 px-4 py-2 menu-button rounded-lg
                           hover:scale-102 transition-all duration-200"
                >
                  <span className="font-mono font-bold text-white">{room.id}</span>
                  <Copy size={16} className="text-blue-300" />
                </button>
                <div className="text-white text-sm">
                  Players: {room.players.length}/{room.settings.maxPlayers}
                </div>
              </div>

              <div className="grid gap-4">
                {room.players.map((player: any) => (
                  <div key={player.id} className="menu-button p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center text-2xl">
                        {player.avatar?.emoji || getDefaultAvatar().emoji}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {player.name} {player.id === room.host && '(Host)'}
                        </p>
                        <PlayerBubbles bubbles={player.bubbles} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {room.players.length >= 2 && isHost && (
                <button
                  onClick={() => gameStore.setGameMode('playing')}
                  className="w-full menu-button py-3 rounded-lg hover:scale-102
                           transition-all duration-200 text-white font-semibold"
                >
                  Start Game
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <button
                  onClick={handleCreateRoom}
                  className="w-full menu-button flex items-center justify-center gap-2 py-3
                           rounded-lg hover:scale-102 transition-all duration-200"
                >
                  <UserPlus size={20} className="text-blue-300" />
                  <span className="text-white">Create Room</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/5 text-white/50">or join a room</span>
                  </div>
                </div>

                {showJoinForm ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleJoinRoom(joinCode.trim());
                  }} className="space-y-4">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Enter room code"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20
                               focus:border-blue-400 focus:ring focus:ring-blue-400/20 text-white
                               placeholder-blue-200"
                      maxLength={6}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowJoinForm(false)}
                        className="flex-1 menu-button py-3 rounded-lg hover:scale-102
                                 transition-all duration-200"
                      >
                        <span className="text-white">Back</span>
                      </button>
                      <button
                        type="submit"
                        className="flex-1 menu-button py-3 rounded-lg hover:scale-102
                                 transition-all duration-200"
                      >
                        <span className="text-white">Join Room</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showExitConfirmation && (
        <ExitConfirmation
          onConfirm={handleLeaveRoom}
          onCancel={() => setShowExitConfirmation(false)}
          message="Are you sure you want to leave this room?"
        />
      )}

      {showSettings && room && (
        <LobbySettings
          onClose={() => setShowSettings(false)}
          onSave={handleUpdateSettings}
          onAbandon={handleLeaveRoom}
          currentSettings={{
            maxPlayers: room.settings.maxPlayers,
            difficulty: room.settings.difficulty,
            turnTimeLimit: room.settings.turnTimeLimit || 30
          }}
        />
      )}
    </div>
  );
};