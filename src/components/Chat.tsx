import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { getRoomMessages, sendMessage, subscribeToRoomMessages } from '../services/chatService';
import type { ChatMessage } from '../types/chat';
import { useGameStore } from '../store/gameStore';

export const Chat: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useGameStore();

  useEffect(() => {
    const loadMessages = async () => {
      const roomMessages = await getRoomMessages(roomId);
      setMessages(roomMessages);
    };

    loadMessages();

    const subscription = subscribeToRoomMessages(roomId, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    try {
      await sendMessage(roomId, profile.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/10 backdrop-blur-sm rounded-lg">
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <MessageSquare className="text-blue-300" />
        <h3 className="font-semibold text-white">Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${
              msg.player_id === profile?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.message_type === 'system' ? (
              <div className="text-center text-blue-200 text-sm italic">
                {msg.message}
              </div>
            ) : (
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.player_id === profile?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                {msg.player_id !== profile?.id && (
                  <div className="text-xs text-blue-200 mb-1">
                    {msg.player?.name}
                  </div>
                )}
                <p>{msg.message}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 text-white placeholder-blue-200 rounded-lg px-4 py-2
                     border border-white/20 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};