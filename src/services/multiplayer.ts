import PusherClient from 'pusher-js';
export * from './roomService';

// Initialize Pusher with auth endpoint
export const pusher = new PusherClient('4f01dcaa6c0557231477', {
  cluster: 'us2',
  authEndpoint: '/.netlify/functions/pusher-auth'
});