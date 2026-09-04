export interface WordComparisonToken {
  word: string;
  status: 'correct' | 'approximate' | 'missing' | 'extra';
  originalWord?: string;
  expectedWord?: string;
}

export interface RecitalEvaluation {
  score: number; // 0 - 100
  rating: 'Perfect Recital' | 'Excellent' | 'Good Progress' | 'Needs Practice';
  ratingColor: string;
  matchedCount: number;
  totalTargetCount: number;
  targetTokens: { word: string; matched: boolean; approximate: boolean }[];
  userTokens: { word: string; status: 'correct' | 'approximate' | 'extra' }[];
  feedback: string;
  canMarkMastered: boolean;
}

// Levenshtein distance for fuzzy typo tolerance (local heuristic)
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  return dp[m][n];
}

// Strip leading ellipsis, punctuation, accents where appropriate, and lowercase
export function cleanTextForComparison(text: string): string[] {
  return text
    .replace(/^(\.\.\.|\.\s+)+/, '') // remove leading dots/ellipsis
    .replace(/(\.\.\.|\.)+$/, '') // remove trailing dots
    .toLowerCase()
    .replace(/[,\.;:!?"“”‘’()[\]{}—\-–]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function evaluateRecital(userInput: string, targetResponse: string): RecitalEvaluation {
  const userWords = cleanTextForComparison(userInput);
  const targetWords = cleanTextForComparison(targetResponse);

  if (targetWords.length === 0) {
    return {
      score: 100,
      rating: 'Perfect Recital',
      ratingColor: 'text-emerald-400',
      matchedCount: 0,
      totalTargetCount: 0,
      targetTokens: [],
      userTokens: [],
      feedback: 'Target text was empty.',
      canMarkMastered: true
    };
  }

  if (userWords.length === 0) {
    return {
      score: 0,
      rating: 'Needs Practice',
      ratingColor: 'text-rose-400',
      matchedCount: 0,
      totalTargetCount: targetWords.length,
      targetTokens: targetWords.map(w => ({ word: w, matched: false, approximate: false })),
      userTokens: [],
      feedback: 'Type or recite your response continuation to test your recall.',
      canMarkMastered: false
    };
  }

  const targetMatched = new Array(targetWords.length).fill(false);
  const targetApprox = new Array(targetWords.length).fill(false);

  const userTokens: { word: string; status: 'correct' | 'approximate' | 'extra' }[] = [];
  let directMatches = 0;
  let approxMatches = 0;

  // Pass 1: exact matches
  const usedTargetIndices = new Set<number>();
  const userMatchIndex: (number | null)[] = new Array(userWords.length).fill(null);

  for (let i = 0; i < userWords.length; i++) {
    const uWord = userWords[i];
    // Look for exact match near expected index
    let bestMatchIdx = -1;
    let minDistance = Infinity;

    for (let j = 0; j < targetWords.length; j++) {
      if (!usedTargetIndices.has(j) && targetWords[j] === uWord) {
        const dist = Math.abs(i - j);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatchIdx = j;
        }
      }
    }

    if (bestMatchIdx !== -1) {
      usedTargetIndices.add(bestMatchIdx);
      targetMatched[bestMatchIdx] = true;
      userMatchIndex[i] = bestMatchIdx;
      directMatches++;
    }
  }

  // Pass 2: approximate matches (1-2 typo allowance for long words)
  for (let i = 0; i < userWords.length; i++) {
    if (userMatchIndex[i] !== null) continue;
    const uWord = userWords[i];
    if (uWord.length < 3) continue;

    let bestApproxIdx = -1;
    let lowestLev = Infinity;

    for (let j = 0; j < targetWords.length; j++) {
      if (!usedTargetIndices.has(j)) {
        const tWord = targetWords[j];
        const maxAllowed = tWord.length > 6 ? 2 : 1;
        const lev = levenshtein(uWord, tWord);
        if (lev <= maxAllowed && lev < lowestLev) {
          lowestLev = lev;
          bestApproxIdx = j;
        }
      }
    }

    if (bestApproxIdx !== -1) {
      usedTargetIndices.add(bestApproxIdx);
      targetApprox[bestApproxIdx] = true;
      userMatchIndex[i] = bestApproxIdx;
      approxMatches++;
    }
  }

  for (let i = 0; i < userWords.length; i++) {
    const matchedIdx = userMatchIndex[i];
    if (matchedIdx !== null) {
      if (targetApprox[matchedIdx]) {
        userTokens.push({ word: userWords[i], status: 'approximate' });
      } else {
        userTokens.push({ word: userWords[i], status: 'correct' });
      }
    } else {
      userTokens.push({ word: userWords[i], status: 'extra' });
    }
  }

  const targetTokens = targetWords.map((word, idx) => ({
    word,
    matched: targetMatched[idx],
    approximate: targetApprox[idx]
  }));

  // Score calculation: exact match = 1, approx = 0.8, penalty for excessive extra words
  const rawScore = (directMatches + approxMatches * 0.85) / targetWords.length;
  // Penalty if user typed too many wrong words
  const extraWordsCount = userWords.length - (directMatches + approxMatches);
  const extraPenalty = Math.min(0.2, (extraWordsCount > 0 ? (extraWordsCount * 0.05) : 0));
  const finalScore = Math.max(0, Math.min(100, Math.round((rawScore - extraPenalty) * 100)));

  let rating: RecitalEvaluation['rating'] = 'Needs Practice';
  let ratingColor = 'text-rose-400';
  let feedback = '';

  if (finalScore === 100) {
    rating = 'Perfect Recital';
    ratingColor = 'text-emerald-400';
    feedback = 'Flawless recall! Every single word matches the liturgical text perfectly.';
  } else if (finalScore >= 88) {
    rating = 'Excellent';
    ratingColor = 'text-amber-400';
    feedback = 'Superb accuracy! Only minor word order or slight spelling variances detected.';
  } else if (finalScore >= 60) {
    rating = 'Good Progress';
    ratingColor = 'text-sky-400';
    feedback = 'Good foundation! Review the highlighted missed words to lock in the exact phrasing.';
  } else {
    rating = 'Needs Practice';
    ratingColor = 'text-amber-600';
    feedback = 'Keep building your cue-response connection. Try reading the response aloud first.';
  }

  return {
    score: finalScore,
    rating,
    ratingColor,
    matchedCount: directMatches + approxMatches,
    totalTargetCount: targetWords.length,
    targetTokens,
    userTokens,
    feedback,
    canMarkMastered: finalScore >= 90
  };
}
