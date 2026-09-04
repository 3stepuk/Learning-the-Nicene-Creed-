export type MasteryStatus = 'not_started' | 'struggling' | 'learning' | 'mastered';

export interface CreedCard {
  id: number;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseName: string;
  phaseSection: string;
  cue: string;
  response: string;
  note: string;
  themeHint: string;
  latinCue?: string;
  latinResponse?: string;
  scriptureReferences?: string[];
  glossaryTerms?: string[];
}

export interface GlossaryTerm {
  term: string;
  originalWord: string;
  language: 'Greek' | 'Latin' | 'Hebrew';
  shortDefinition: string;
  theologyNote: string;
  biblicalBasis: string;
  historicalContext: string;
}

export interface FaqItem {
  id: string;
  category: 'theology' | 'history' | 'memorisation';
  question: string;
  answer: string;
  keyTerms?: string[];
}

export type ViewMode = 'deck' | 'quiz' | 'guide' | 'help';
export type ThemeMode = 'dark' | 'light';

export interface QuizResult {
  similarityScore: number; // 0 to 100
  matchedWordsCount: number;
  totalTargetWords: number;
  userWordsCount: number;
  tokens: {
    text: string;
    status: 'correct' | 'missing' | 'extra' | 'approximate';
  }[];
}
