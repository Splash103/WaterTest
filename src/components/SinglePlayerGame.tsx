import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, Droplets, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { WaterRise } from './WaterRise';
import { GameOver } from './GameOver';
import { PatternDisplay } from './PatternDisplay';
import { PlayerBubbles } from './PlayerBubbles';
import { ExitConfirmation } from './ExitConfirmation';
import { useGameStore } from '../store/gameStore';
import { isValidWord } from '../utils/wordValidation';
import { getNewPattern } from '../utils/patternGenerator';
import { calculateWordScore } from '../utils/scoring';
import { DIFFICULTY_SETTINGS } from '../utils/difficulty';

const INITIAL_TIME = 30;

export const SinglePlayerGame: React.FC = () => {
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [waterLevel, setWaterLevel] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [pattern, setPattern] = useState(getNewPattern(0));
  const [combo, setCombo] = useState(0);
  const [bubbles, setBubbles] = useState(3);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Ref to track if a bubble has been removed in the current cycle
  const bubbleRemovedInCycle = useRef(false);

  const { difficulty, profile, setGameMode } = useGameStore();
  const settings = DIFFICULTY_SETTINGS[difficulty];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isGameOver && timeLeft > 0) {
      bubbleRemovedInCycle.current = false; // Reset at the start of each interval

      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 0.1;

          // Check if the time has reached zero and a bubble hasn't been removed in this cycle
          if (newTime <= 0 && !bubbleRemovedInCycle.current) {
            bubbleRemovedInCycle.current = true; // Set flag to true to prevent another bubble decrement in this cycle

            setBubbles((prev) => {
              const newBubbles = prev - 1;
              if (newBubbles <= 0) {
                setIsGameOver(true);
                return 0;
              }
              setTimeLeft(INITIAL_TIME);
              setWaterLevel(0);
              return newBubbles;
            });
            return 0;
          }
          return newTime;
        });

        setWaterLevel((prev) => {
          const progress = ((INITIAL_TIME - timeLeft) / INITIAL_TIME) * 100;
          return Math.min(progress, 100);
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [isGameOver, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = input.trim().toLowerCase();

    if (!word.startsWith(pattern.pattern)) {
      toast.error(`Word must start with "${pattern.pattern.toUpperCase()}"`);
      return;
    }

    if (word.length < 3) {
      toast.error('Word must be at least 3 letters long');
      return;
    }

    if (isValidWord(word, score)) {
      const { points, timeBonus } = calculateWordScore(word, settings.pointMultiplier, combo);
      setScore((prev) => prev + points);
      setTimeLeft((prev) => Math.min(prev + timeBonus, INITIAL_TIME));
      setWaterLevel((prev) => Math.max(prev - settings.waterReduction, 0));
      setCombo((prev) => prev + 1);
      setPattern(getNewPattern(score + points));
      toast.success(`+${points} points!`);
    } else {
      setCombo(0);
      toast.error('Invalid word!');
      if (settings.penaltyEnabled) {
        setTimeLeft((prev) => Math.max(prev - settings.timePenalty, 0));
      }
    }

    setInput('');
  };

  const handleExit = () => {
    if (score > 0) {
      setShowExitConfirmation(true);
    } else {
      setGameMode('menu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <WaterRise progress={waterLevel} />
      
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleExit}
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
              <span className="text-2xl font-bold">{score}</span>
            </div>
            <PlayerBubbles bubbles={bubbles} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <PatternDisplay pattern={pattern} score={score} />
            </div>
            <div className="flex items-center gap-4">
              {combo > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-yellow-600">{combo}x</span>
                </div>
              )}
              {profile && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{profile.avatar.emoji}</span>
                  <span className="font-semibold">{profile.name}</span>
                </div>
              )}
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
                       bg-white/90 backdrop-blur-sm"
              placeholder={`Type a word starting with "${pattern.pattern.toUpperCase()}"...`}
              autoFocus
              disabled={isGameOver}
            />
          </form>
        </div>
      </div>

      {isGameOver && (
        <GameOver 
          score={score}
          difficulty={difficulty}
          onRestart={() => window.location.reload()}
          hasProfile={!!profile}
        />
      )}

      {showExitConfirmation && (
        <ExitConfirmation
          onConfirm={() => setGameMode('menu')}
          onCancel={() => setShowExitConfirmation(false)}
          message="Are you sure you want to exit? Your current score will be lost!"
        />
      )}
    </div>
  );
};
