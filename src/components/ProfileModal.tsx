import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { seaAnimals } from '../utils/seaAnimals';

export const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { profile, updateProfile } = useGameStore();
  const [name, setName] = useState(profile?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || seaAnimals[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, avatar: selectedAvatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Profile Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 
                       focus:border-blue-400 focus:ring focus:ring-blue-200"
              placeholder="Enter your name"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Sea Friend
            </label>
            <div className="grid grid-cols-4 gap-3">
              {seaAnimals.map((animal) => (
                <button
                  key={animal.name}
                  type="button"
                  onClick={() => setSelectedAvatar(animal)}
                  className={`aspect-square flex items-center justify-center text-2xl 
                           rounded-lg transition-all duration-200 ${
                    selectedAvatar.name === animal.name
                      ? `bg-${animal.color} scale-110 shadow-lg`
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {animal.emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};