import { supabase } from './supabase';
import type { ChatMessage } from '../types/chat';

export const sendMessage = async (
  roomId: string,
  playerId: string,
  message: string,
  type: 'chat' | 'system' | 'game' = 'chat'
): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      player_id: playerId,
      message,
      message_type: type
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRoomMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      player:player_id (
        name,
        avatar
      )
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) throw error;
  return data || [];
};

export const subscribeToRoomMessages = (
  roomId: string,
  onMessage: (message: ChatMessage) => void
) => {
  return supabase
    .channel(`room-${roomId}-chat`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => onMessage(payload.new as ChatMessage)
    )
    .subscribe();
};