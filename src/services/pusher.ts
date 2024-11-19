import PusherClient from 'pusher-js';

// Initialize Pusher client
export const pusher = new PusherClient('4f01dcaa6c0557231477', {
  cluster: 'us2',
});

export const subscribeToRoom = (roomId: string, callbacks: {
  onPlayerJoined?: (player: any) => void;
  onGameStart?: () => void;
  onWordSubmitted?: (data: any) => void;
}) => {
  const channel = pusher.subscribe(`room-${roomId}`);
  
  if (callbacks.onPlayerJoined) {
    channel.bind('player-joined', callbacks.onPlayerJoined);
  }
  
  if (callbacks.onGameStart) {
    channel.bind('game-start', callbacks.onGameStart);
  }
  
  if (callbacks.onWordSubmitted) {
    channel.bind('word-submitted', callbacks.onWordSubmitted);
  }

  return () => {
    channel.unbind_all();
    pusher.unsubscribe(`room-${roomId}`);
  };
};