import React from 'react';
import { Target } from 'lucide-react';

interface PatternDisplayProps {
  pattern: {
    pattern: string;
    description: string;
  };
  score: number;
}

export const PatternDisplay: React.FC<PatternDisplayProps> = ({ pattern }) => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Target className="text-blue-600" />
          <h3 className="font-semibold">Current Challenge</h3>
        </div>
        <p className="text-lg font-bold text-blue-600">
          "{pattern.pattern.toUpperCase()}"
        </p>
      </div>
    </div>
  );
};