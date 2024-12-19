import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  className?: string;
}

export const Background: React.FC<BackgroundProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleCountRef = useRef(0);
  const MAX_BUBBLES = 15; // Maximum concurrent bubbles

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create waves
    const waves = Array.from({ length: 3 }).map(() => {
      const wave = document.createElement('div');
      wave.className = 'wave';
      return wave;
    });
    waves.forEach(wave => container.appendChild(wave));

    // Create bubbles
    const createBubble = () => {
      if (bubbleCountRef.current >= MAX_BUBBLES) return;

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 30 + 10;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.setProperty('--x-offset', `${(Math.random() - 0.5) * 100}px`);
      bubble.style.animationDuration = `${Math.random() * 3 + 4}s`;
      
      container.appendChild(bubble);
      bubbleCountRef.current++;

      bubble.addEventListener('animationend', () => {
        bubble.remove();
        bubbleCountRef.current--;
      });
    };

    // Start animations with reduced frequency
    const bubbleInterval = setInterval(createBubble, 800); // Reduced from 500ms to 800ms

    return () => {
      clearInterval(bubbleInterval);
      waves.forEach(wave => wave.remove());
    };
  }, []);

  return (
    <div ref={containerRef} className={`floating-words ${className}`} />
  );
};