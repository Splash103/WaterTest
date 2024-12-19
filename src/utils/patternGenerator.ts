const commonPrefixes = [
  // Single letters
  ...('abcdefghijklmnopqrstuvwxyz'.split('')),
  // Common two-letter combinations
  'bl', 'br', 'ch', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr',
  'pl', 'pr', 'sc', 'sh', 'sl', 'sm', 'sn', 'sp', 'st', 'sw',
  'th', 'tr', 'tw', 'wh', 'wr',
  // Common three-letter combinations
  'pre', 'pro', 'con', 'dis', 'mis', 'out', 'sub', 'tri', 'uni'
];

const getPatternComplexity = (pattern: string): number => {
  return Math.max(1, pattern.length - 1);
};

export const getNewPattern = (score: number): { pattern: string; description: string } => {
  // Higher scores increase the chance of getting longer patterns
  const complexityThreshold = Math.floor(score / 30);
  const eligiblePatterns = commonPrefixes.filter(pattern => 
    pattern.length <= Math.min(3, Math.max(1, Math.floor(complexityThreshold / 2) + 1))
  );
  
  const pattern = eligiblePatterns[Math.floor(Math.random() * eligiblePatterns.length)];
  
  return {
    pattern,
    description: `Words starting with ${pattern.toUpperCase()}`
  };
};