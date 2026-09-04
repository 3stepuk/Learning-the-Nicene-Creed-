import React, { useState, useRef, useEffect } from 'react';
import { 
  PenTool, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Trophy,
  Eye,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { CreedCard, MasteryStatus } from '../types';
import { evaluateRecital, RecitalEvaluation } from '../utils/scoring';
import { PHASES } from '../data/creed';

interface QuizRecitalProps {
  cards: CreedCard[];
  masteryData: Record<number, MasteryStatus>;
  onUpdateMastery: (cardId: number, status: MasteryStatus) => void;
  isDark: boolean;
}

export const QuizRecital: React.FC<QuizRecitalProps> = ({
  cards,
  masteryData,
  onUpdateMastery,
  isDark
}) => {
  const [activePhase, setActivePhase] = useState<number | 'all'>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [evaluation, setEvaluation] = useState<RecitalEvaluation | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [marathonMode, setMarathonMode] = useState(false);
  const [marathonScores, setMarathonScores] = useState<Record<number, number>>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredCards = activePhase === 'all'
    ? cards
    : cards.filter(c => c.phaseNumber === activePhase);

  const currentCard = filteredCards[cardIndex] || filteredCards[0];

  useEffect(() => {
    setUserInput('');
    setEvaluation(null);
    setRevealed(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [cardIndex, activePhase]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || !currentCard) return;

    const result = evaluateRecital(userInput, currentCard.response);
    setEvaluation(result);

    if (marathonMode) {
      setMarathonScores(prev => ({ ...prev, [currentCard.id]: result.score }));
    }

    // If score is high, optionally auto-suggest/set learning or mastered
    if (result.score >= 90) {
      onUpdateMastery(currentCard.id, 'mastered');
    } else if (result.score >= 60 && masteryData[currentCard.id] !== 'mastered') {
      onUpdateMastery(currentCard.id, 'learning');
    } else if (result.score < 60 && masteryData[currentCard.id] === 'not_started') {
      onUpdateMastery(currentCard.id, 'struggling');
    }
  };

  const handleNextCard = () => {
    if (cardIndex < filteredCards.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      // Loop or end
      setCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
    if (!evaluation) {
      setEvaluation(evaluateRecital(userInput, currentCard.response));
    }
  };

  // Marathon cumulative average calculation
  const marathonScoreValues = Object.values(marathonScores) as number[];
  const completedMarathonCount = marathonScoreValues.length;
  const marathonAverage = completedMarathonCount > 0
    ? Math.round(marathonScoreValues.reduce((a: number, b: number) => a + b, 0) / completedMarathonCount)
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6" id="quiz-recital-view">
      {/* Mode & Phase Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <PenTool className="w-4 h-4" />
            </span>
            <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-amber-400">
              Creed Recital & Quiz
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Read the liturgical cue, recite the continuation from memory, and test local word-match accuracy.
          </p>
        </div>

        {/* Marathon Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMarathonMode(prev => !prev);
              setMarathonScores({});
              setCardIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              marathonMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm font-semibold'
                : isDark ? 'bg-[#121418] border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-600'
            }`}
            id="toggle-marathon-mode-btn"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Full Creed Marathon</span>
          </button>
        </div>
      </div>

      {/* Marathon stats banner if enabled */}
      {marathonMode && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
        }`}>
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-0.5">
              Marathon Progress
            </span>
            <span className="text-sm font-medium text-slate-300">
              {completedMarathonCount} of {filteredCards.length} Cards Recited
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block mb-0.5">Cumulative Accuracy</span>
            <span className="text-xl font-bold font-serif-title text-amber-400">
              {marathonAverage}%
            </span>
          </div>
        </div>
      )}

      {/* Phase selection bar (when not in marathon mode) */}
      {!marathonMode && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4">
          <button
            onClick={() => { setActivePhase('all'); setCardIndex(0); }}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
              activePhase === 'all'
                ? isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-amber-600 text-white'
                : isDark ? 'bg-slate-900/60 text-slate-400 border border-slate-800' : 'bg-white text-slate-600 border border-slate-200'
            }`}
            id="quiz-filter-all"
          >
            All 13 Cards
          </button>
          {PHASES.map(p => (
            <button
              key={p.number}
              onClick={() => { setActivePhase(p.number); setCardIndex(0); }}
              id={`quiz-filter-phase-${p.number}`}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                activePhase === p.number
                  ? isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-amber-600 text-white'
                  : isDark ? 'bg-slate-900/60 text-slate-400 border border-slate-800' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Phase {p.number}
            </button>
          ))}
        </div>
      )}

      {/* Recital Card Container */}
      <div className={`rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all ${
        isDark 
          ? 'bg-[#111318] border-white/10 text-slate-300' 
          : 'bg-white border-amber-900/15 text-slate-900'
      }`}>
        {/* Card Header metadata */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center font-serif-title font-bold text-xs bg-amber-600/20 text-amber-400 border border-amber-600/30">
              {currentCard.id}
            </span>
            <span className="font-semibold text-slate-300">{currentCard.phaseName}</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Card {cardIndex + 1} of {filteredCards.length}</span>
        </div>

        {/* Cue Prompt */}
        <div className="mt-5">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">
            Prompt Cue
          </span>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-black/30 border-white/5' : 'bg-amber-50/50 border-amber-100'
          }`}>
            <h3 className="font-serif text-xl sm:text-2xl text-slate-100 italic leading-relaxed">
              "{currentCard.cue}"
            </h3>
            <p className="mt-2 text-xs text-slate-500 italic">
              Theme: {currentCard.themeHint}
            </p>
          </div>
        </div>

        {/* User Input Area */}
        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="recital-textarea" className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
            Type the response continuation:
          </label>
          <textarea
            id="recital-textarea"
            ref={textareaRef}
            rows={4}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your recital here... (e.g. the Father almighty, maker of heaven and earth...)"
            className={`w-full p-4 rounded-xl border text-base font-serif-text leading-relaxed outline-none transition-all resize-none ${
              isDark
                ? 'bg-black/40 border-white/10 focus:border-amber-600/60 text-slate-100 placeholder-slate-600'
                : 'bg-white border-slate-300 focus:border-amber-600 text-slate-900 placeholder-slate-400'
            }`}
          />

          {/* Action Buttons */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">Ctrl+Enter</kbd> to submit
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReveal}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  isDark ? 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
                id="reveal-creed-answer-btn"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal Answer</span>
              </button>

              <button
                type="submit"
                disabled={!userInput.trim()}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-md ${
                  userInput.trim()
                    ? 'bg-amber-600 hover:bg-amber-500 text-[#0A0B0D] shadow-amber-900/20'
                    : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                }`}
                id="submit-recital-btn"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Evaluate Recital</span>
              </button>
            </div>
          </div>
        </form>

        {/* Evaluation Feedback Panel */}
        {(evaluation || revealed) && (
          <div className={`mt-6 p-5 sm:p-6 rounded-xl border transition-all animate-fade-in ${
            isDark ? 'bg-[#0F1115] border-white/10' : 'bg-slate-50 border-amber-900/10'
          }`} id="recital-evaluation-panel">
            {/* Header with Score */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                  Recital Performance
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl sm:text-3xl font-mono font-bold ${evaluation ? evaluation.ratingColor : 'text-amber-500'}`}>
                    {evaluation ? `${evaluation.score}% Match` : 'Canonical Text Revealed'}
                  </span>
                  {evaluation && (
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                      evaluation.score >= 90 ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' :
                      evaluation.score >= 60 ? 'bg-blue-950 text-blue-400 border border-blue-900/50' :
                      'bg-orange-950 text-orange-400 border border-orange-900/50'
                    }`}>
                      {evaluation.rating}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Mastery Promotion Button */}
              {evaluation && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateMastery(currentCard.id, evaluation.score >= 90 ? 'mastered' : 'learning')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-900/50 hover:bg-emerald-900/50 transition-colors"
                    id="promote-mastery-btn"
                  >
                    ✓ Save to {evaluation.score >= 90 ? 'Mastered' : 'Learning'}
                  </button>
                </div>
              )}
            </div>

            {/* Local Heuristic Feedback Note */}
            {evaluation && (
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                {evaluation.feedback}
              </p>
            )}

            {/* Target Canonical Text Comparison */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block mb-1.5">
                Canonical Response Text:
              </span>
              <p className="font-serif italic text-base sm:text-lg text-slate-200 leading-relaxed p-3.5 rounded-lg bg-black/30 border border-white/5">
                "{currentCard.response}"
              </p>
            </div>

            {/* Word Breakdown if user typed anything */}
            {evaluation && evaluation.targetTokens.length > 0 && (
              <div className="mt-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">
                  Word Accuracy Breakdown:
                </span>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-black/40 border border-white/5">
                  {evaluation.targetTokens.map((t, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                        t.matched
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-900/60'
                          : t.approximate
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-900/60'
                            : 'bg-white/5 text-slate-600 border border-white/5 line-through decoration-rose-500'
                      }`}
                      title={t.matched ? 'Exact match' : t.approximate ? 'Approximate match / typo' : 'Missed word'}
                    >
                      {t.word}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Matched
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Near match / typo
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Missed word
                  </span>
                </div>
              </div>
            )}

            {/* Card Doctrinal Note */}
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-400">
              <strong className="text-amber-500">Theological Note:</strong> {currentCard.note}
            </div>

            {/* Next Card Button */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={handleNextCard}
                className="px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-500 text-[#0A0B0D] flex items-center gap-2 transition-all shadow-lg shadow-amber-900/20"
                id="next-quiz-card-btn"
              >
                <span>Proceed to Next Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Pagination controls */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={handlePrevCard}
            disabled={cardIndex === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              cardIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-600 border-white/5'
                : isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
            id="quiz-prev-btn"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {cardIndex + 1} / {filteredCards.length}
          </span>

          <button
            onClick={handleNextCard}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
            id="quiz-next-btn"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
