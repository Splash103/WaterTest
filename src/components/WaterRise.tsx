import React from 'react';

interface WaterRiseProps {
  progress: number;
}

export const WaterRise: React.FC<WaterRiseProps> = ({ progress }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 bg-blue-400/40 backdrop-blur-sm"
        style={{
          height: `${progress}%`,
          transition: 'height 0.3s ease-in-out',
          background: 'linear-gradient(180deg, rgba(96, 165, 250, 0.4) 0%, rgba(37, 99, 235, 0.6) 100%)',
          boxShadow: '0 -8px 32px rgba(37, 99, 235, 0.3)',
        }}
      >
        {/* Wave effect overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)',
            animation: 'wave 10s linear infinite',
            opacity: 0.5,
          }}
        />
        
        {/* Top highlight */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </div>
  );
};