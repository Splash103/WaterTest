export interface Player {
  id: string;
  name: string;
  avatar: {
    name: string;
    emoji: string;
    color: string;
  };
  score: number;
  bubbles: number;
}

export interface LobbySettings {
  maxPlayers: number;
  difficulty: 'easy' | 'normal' | 'hard';
  turnTimeLimit: number;
}

export interface Room {
  id: string;
  host: string;
  players: Player[];
  settings: LobbySettings;
  isPlaying: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type GameMode = 'menu' | 'single' | 'multi' | 'playing' | 'leaderboard';