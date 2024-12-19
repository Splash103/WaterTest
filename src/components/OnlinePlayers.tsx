import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import type { Player } from '../services/players';
import { getOnlinePlayers } from '../services/players';

export const OnlinePlayers: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getOnlinePlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
    const interval = setInterval(fetchPlayers, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white/5 rounded-lg p-4">
        <div className="h-6 w-24 bg-white/10 rounded mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-blue-300" />
        <h3 className="text-lg font-semibold text-white">
          Online Players ({players.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
          >
            <div className="w-8 h-8 flex items-center justify-center text-xl">
              {player.avatar.emoji}
            </div>
            <div>
              <p className="font-medium text-white">{player.name}</p>
              <p className="text-xs text-white/70">
                {player.status === 'in_game' ? 'In Game' : 'Online'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};