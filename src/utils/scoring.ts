interface WordScore {
  points: number;
  timeBonus: number;
  comboMultiplier: number;
}

export const calculateWordScore = (word: string, difficulty: number, combo: number): WordScore => {
  // Base points per letter
  const basePoints = word.length * 5;
  let complexityMultiplier = 1;

  // Complexity bonuses
  if (word.length >= 6) complexityMultiplier += 0.2;
  if (word.length >= 8) complexityMultiplier += 0.3;

  // Bonus for uncommon letters
  const uncommonLetters = 'jkqxz';
  if ([...word].some(letter => uncommonLetters.includes(letter))) {
    complexityMultiplier += 0.2;
  }

  // Combo multiplier (increases with consecutive correct words)
  const comboMultiplier = Math.min(3, 1 + (combo * 0.1));

  // Calculate final points with all multipliers
  const points = Math.round(basePoints * complexityMultiplier * difficulty * comboMultiplier);

  // Time bonus based on word length and difficulty
  const timeBonus = Math.max(
    0.5,
    Math.min(2, word.length * 0.2 * difficulty)
  );

  return { points, timeBonus, comboMultiplier };
};