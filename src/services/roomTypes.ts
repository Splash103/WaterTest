import type { Difficulty } from '../utils/difficulty';

export interface LobbySettings {
  maxPlayers: number;
  difficulty: Difficulty;
  turnTimeLimit: number;
}

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
  isHost: boolean;
}

export interface Room {
  id: string;
  host: string;
  player_count: number;
  max_players: number;
  settings: LobbySettings;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_LOBBY_SETTINGS: LobbySettings = {
  maxPlayers: 4,
  difficulty: 'normal',
  turnTimeLimit: 30
};