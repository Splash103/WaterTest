import React from 'react';
import { Users, Clock } from 'lucide-react';

interface Room {
  id: string;
  host: string;
  player_count: number;
  max_players: number;
  created_at: string;
}

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, onJoinRoom }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (rooms.length === 0) {
    return (
      <div className="text-center text-white/70 py-4">
        No active rooms found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onJoinRoom(room.id)}
          className="w-full menu-button p-4 rounded-lg hover:scale-102 
                   transition-all duration-200 text-left"
          disabled={room.player_count >= room.max_players}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-white mb-1">{room.host}'s Room</p>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{room.player_count}/{room.max_players}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatTime(room.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="text-sm font-mono text-white/70">
              {room.id}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};