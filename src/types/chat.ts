export interface ChatMessage {
  id: string;
  room_id: string;
  player_id: string;
  message: string;
  message_type: 'chat' | 'system' | 'game';
  created_at: string;
  player?: {
    name: string;
    avatar: {
      emoji: string;
      name: string;
    };
  };
}