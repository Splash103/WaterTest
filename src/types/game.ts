// Add to existing types
export interface GameSettings extends Record<string, any> {
  maxPlayers: number;
  difficulty: 'easy' | 'normal' | 'hard';
  turnTimeLimit: number;
  gameMode: 'head-to-head' | 'co-op';
}