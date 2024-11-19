import React from 'react';

interface PlayerBubblesProps {
  bubbles: number;
  maxBubbles?: number;
}

export const PlayerBubbles: React.FC<PlayerBubblesProps> = ({ bubbles, maxBubbles = 3 }) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: maxBubbles }).map((_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-300 
            ${i < bubbles 
              ? 'border-blue-400 bg-blue-400/50 shadow-lg shadow-blue-400/30' 
              : 'border-gray-300 bg-gray-100'
            }`}
        >
          <div className={`
            w-2 h-2 rounded-full absolute transform translate-x-1 translate-y-0.5
            ${i < bubbles ? 'bg-white/50' : 'bg-transparent'}
          `} />
        </div>
      ))}
    </div>
  );
};