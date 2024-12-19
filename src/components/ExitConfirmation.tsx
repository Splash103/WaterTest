import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ExitConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

export const ExitConfirmation: React.FC<ExitConfirmationProps> = ({ 
  onConfirm, 
  onCancel,
  message = "Are you sure you want to exit?"
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Exit Game?</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
};