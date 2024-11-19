import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  className?: string;
  words?: string[];
}

export const Background: React.FC<BackgroundProps> = ({ 
  className = '', 
  words = ['ocean', 'wave', 'deep', 'blue', 'swim', 'dive', 'float', 'sea']
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating words
    const createWord = () => {
      const word = document.createElement('div');
      word.className = 'floating-word';
      word.textContent = words[Math.floor(Math.random() * words.length)];
      word.style.left = `${Math.random() * 100}%`;
      word.style.setProperty('--rotate', `${Math.random() * 360}deg`);
      container.appendChild(word);

      word.addEventListener('animationend', () => {
        word.remove();
      });
    };

    // Create bubbles
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 30 + 10;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.setProperty('--x-offset', `${(Math.random() - 0.5) * 100}px`);
      bubble.style.animationDuration = `${Math.random() * 3 + 4}s`;
      
      container.appendChild(bubble);

      bubble.addEventListener('animationend', () => {
        bubble.remove();
      });
    };

    // Start animations
    const wordInterval = setInterval(createWord, 3000);
    const bubbleInterval = setInterval(createBubble, 500);

    return () => {
      clearInterval(wordInterval);
      clearInterval(bubbleInterval);
    };
  }, [words]);

  return (
    <div ref={containerRef} className={`floating-words ${className}`} />
  );
};