export interface Pattern {
  pattern: string;
  description: string;
  pointsRequired: number;
}

export const patterns: Pattern[] = [
  { pattern: 'a', description: 'Words starting with A', pointsRequired: 0 },
  { pattern: 'b', description: 'Words starting with B', pointsRequired: 10 },
  { pattern: 'c', description: 'Words starting with C', pointsRequired: 20 },
  { pattern: 'tr', description: 'Words starting with TR', pointsRequired: 30 },
  { pattern: 'st', description: 'Words starting with ST', pointsRequired: 40 },
  { pattern: 'pre', description: 'Words starting with PRE', pointsRequired: 50 },
  { pattern: 'con', description: 'Words starting with CON', pointsRequired: 60 },
  { pattern: 'inter', description: 'Words starting with INTER', pointsRequired: 70 },
];

export const getCurrentPattern = (score: number): Pattern => {
  return [...patterns]
    .reverse()
    .find(pattern => score >= pattern.pointsRequired) || patterns[0];
};