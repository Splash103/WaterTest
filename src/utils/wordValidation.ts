import words from 'an-array-of-english-words';
import nlp from 'compromise';

// Create an extended dictionary with common words
const dictionary = new Set([
  ...words,
  // Add common proper nouns and names
  'john', 'mary', 'james', 'robert', 'michael', 'david', 'richard',
  'charles', 'joseph', 'thomas', 'christopher', 'daniel', 'paul',
  'mark', 'donald', 'george', 'kenneth', 'steven', 'edward', 'brian',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december',
  'america', 'europe', 'asia', 'africa', 'australia',
  'london', 'paris', 'tokyo', 'berlin', 'rome', 'madrid'
]);

export const isValidWord = (word: string, score: number = 0): boolean => {
  const normalizedWord = word.toLowerCase().trim();
  const minLength = score >= 1000 ? 4 : 3;
  
  // Check minimum word length based on score
  if (normalizedWord.length < minLength) {
    return false;
  }

  // Check if it's in our dictionary
  if (dictionary.has(normalizedWord)) {
    return true;
  }

  // Use compromise to check if it's a recognized term
  const doc = nlp(word);
  return doc.has('#ProperNoun') || doc.has('#Place') || doc.has('#Person');
};