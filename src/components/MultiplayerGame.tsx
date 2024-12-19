import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, Droplets, Crown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { WaterRise } from './WaterRise';
import { PatternDisplay } from './PatternDisplay';
import { PlayerBubbles } from './PlayerBubbles';
import { ExitConfirmation } from './ExitConfirmation';
import { useGameStore } from '../store/gameStore';
import { isValidWord } from '../utils/wordValidation';
import { getNewPattern } from '../utils/patternGenerator';
import { calculateWordScore } from '../utils/scoring';
import { subscribeToGameEvents, submitWord } from '../services/gameService';
import type { Player } from '../services/roomTypes';

const INITIAL_TIME = 30;

export const MultiplayerGame: React.FC = () => {
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [waterLevel, setWaterLevel] = useState(0);
  const [pattern, setPattern] = useState(getNewPattern(0));
  const [currentTurn, setCurrentTurn] = useState<string>('');
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { room, profile, setGameMode } = useGameStore();
  
  useEffect(() => {
    if (!room || !profile) {
      setGameMode('menu');
      return;
    }

    // Set initial turn to host
    setCurrentTurn(room.host);

    const unsubscribe = subscribeToGameEvents(room.id, {
      onWordSubmitted: (data) => {
        const { word, score, nextPlayer } = data;
        toast.success(`${word.toUpperCase()} (+${score} points)`);
        setPattern(getNewPattern(score));
        setCurrentTurn(nextPlayer);
        setWaterLevel((prev) => Math.max(0, prev - 10));
      },
      onGameOver: () => {
        toast.error('Game Over!');
        setGameMode('multi');
      }
    });

    return () => unsubscribe();
  }, [room, profile, setGameMode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (room && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 0.1;
          if (newTime <= 0) {
            toast.error('Time\'s up!');
            setGameMode('multi');
            return 0;
          }
          return newTime;
        });

        setWaterLevel((prev) => {
          const newLevel = prev + 0.3;
          if (newLevel >= 100) {
            toast.error('Water level too high!');
            setGameMode('multi');
            return 100;
          }
          return newLevel;
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [room, timeLeft, setGameMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !profile) return;

    const word = input.trim().toLowerCase();

    if (currentTurn !== profile.id) {
      toast.error('Not your turn!');
      return;
    }

    if (!word.startsWith(pattern.pattern)) {
      toast.error(`Word must start with "${pattern.pattern.toUpperCase()}"`);
      return;
    }

    if (word.length < 3) {
      toast.error('Word must be at least 3 letters long');
      return;
    }

    if (isValidWord(word)) {
      const { points } = calculateWordScore(word, 1, 0);
      const nextPlayerIndex = (room.players.findIndex(p => p.id === profile.id) + 1) % room.players.length;
      const nextPlayer = room.players[nextPlayerIndex];

      try {
        await submitWord(room.id, {
          word,
          playerId: profile.id,
          score: points,
          nextPlayerId: nextPlayer.id
        });
        
        setInput('');
      } catch (error) {
        console.error('Error submitting word:', error);
        toast.error('Failed to submit word');
      }
    } else {
      toast.error('Invalid word!');
    }
  };

  if (!room || !profile) return null;

  const isMyTurn = currentTurn === profile.id;
  const currentPlayer = room.players.find(p => p.id === currentTurn);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <WaterRise progress={waterLevel} />
      
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowExitConfirmation(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-black"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Timer className="text-blue-600" />
              <span className="text-2xl font-bold">{Math.ceil(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="text-blue-600" />
              <span className="text-2xl font-bold">{Math.round(waterLevel)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <PatternDisplay pattern={pattern} score={0} />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Current Turn:</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                {currentPlayer?.avatar.emoji}
                <span className="font-medium">{currentPlayer?.name}</span>
                {currentPlayer?.id === room.host && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-blue-200 
                       focus:border-blue-400 focus:ring focus:ring-blue-200 
                       bg-white/90 backdrop-blur-sm disabled:opacity-50
                       disabled:cursor-not-allowed"
              placeholder={isMyTurn 
                ? `Type a word starting with "${pattern.pattern.toUpperCase()}"...`
                : "Waiting for other player's turn..."
              }
              disabled={!isMyTurn}
              autoFocus
            />
          </form>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {room.players.map((player: Player) => (
            <div
              key={player.id}
              className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 
                       ${currentTurn === player.id ? 'ring-2 ring-blue-400' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{player.avatar.emoji}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{player.name}</span>
                    {player.id === room.host && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <PlayerBubbles bubbles={player.bubbles} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showExitConfirmation && (
        <ExitConfirmation
          onConfirm={() => setGameMode('multi')}
          onCancel={() => setShowExitConfirmation(false)}
          message="Are you sure you want to leave the game?"
        />
      )}
    </div>
  );
};