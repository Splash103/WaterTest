import { pusher } from './pusher';
import { supabase } from './supabase';

interface WordSubmission {
  word: string;
  playerId: string;
  score: number;
  nextPlayerId: string;
}

interface GameEventCallbacks {
  onWordSubmitted?: (data: any) => void;
  onGameOver?: () => void;
}

export const submitWord = async (roomId: string, submission: WordSubmission) => {
  try {
    const response = await fetch('/.netlify/functions/submit-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId,
        ...submission
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit word');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting word:', error);
    throw error;
  }
};

export const subscribeToGameEvents = (
  roomId: string,
  callbacks: GameEventCallbacks
) => {
  const channel = pusher.subscribe(`game-${roomId}`);

  if (callbacks.onWordSubmitted) {
    channel.bind('word-submitted', callbacks.onWordSubmitted);
  }

  if (callbacks.onGameOver) {
    channel.bind('game-over', callbacks.onGameOver);
  }

  return () => {
    channel.unbind_all();
    pusher.unsubscribe(`game-${roomId}`);
  };
};