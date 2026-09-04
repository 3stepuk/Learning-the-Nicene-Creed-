import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle,
  LayoutGrid,
  Maximize2,
  BookMarked,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { CreedCard, MasteryStatus } from '../types';
import { CREED_CARDS, PHASES } from '../data/creed';
import { GLOSSARY_TERMS } from '../data/glossary';

interface FlashcardDeckProps {
  cards: CreedCard[];
  masteryData: Record<number, MasteryStatus>;
  onUpdateMastery: (cardId: number, status: MasteryStatus) => void;
  onOpenExplain: (card: CreedCard) => void;
  isDark: boolean;
  onNavigateToHelp?: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  masteryData,
  onUpdateMastery,
  onOpenExplain,
  isDark,
  onNavigateToHelp
}) => {
  const [activePhase, setActivePhase] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [showLatin, setShowLatin] = useState(false);

  // Filter cards by selected phase
  const filteredCards = activePhase === 'all'
    ? cards
    : cards.filter(c => c.phaseNumber === activePhase);

  // Keep index within bounds
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activePhase]);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const currentStatus: MasteryStatus = (currentCard && masteryData[currentCard.id]) || 'not_started';

  // Highlighted glossary term for current card
  const currentGlossary = GLOSSARY_TERMS.find(t => 
    currentCard.glossaryTerms?.some(gt => t.term.toLowerCase().includes(gt.toLowerCase()) || gt.toLowerCase().includes(t.term.toLowerCase()))
  ) || GLOSSARY_TERMS[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1' && currentCard) {
        onUpdateMastery(currentCard.id, 'not_started');
      } else if (e.key === '2' && currentCard) {
        onUpdateMastery(currentCard.id, 'struggling');
      } else if (e.key === '3' && currentCard) {
        onUpdateMastery(currentCard.id, 'learning');
      } else if (e.key === '4' && currentCard) {
        onUpdateMastery(currentCard.id, 'mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredCards.length, currentCard, onUpdateMastery]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const statusBadge = (status: MasteryStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-900/50">
            Mastered
          </span>
        );
      case 'learning':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-900/50">
            Learning
          </span>
        );
      case 'struggling':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-950 text-orange-400 border border-orange-900/50">
            Struggling
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-800">
            Not Started
          </span>
        );
    }
  };

  // Phase statistics helper
  const getPhaseMastery = (phaseNum: number) => {
    const phaseCards = cards.filter(c => c.phaseNumber === phaseNum);
    const mastered = phaseCards.filter(c => masteryData[c.id] === 'mastered').length;
    const percentage = phaseCards.length > 0 ? Math.round((mastered / phaseCards.length) * 100) : 0;
    return { mastered, total: phaseCards.length, percentage };
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full" id="flashcard-view">
      {/* Left Sidebar: Progress Tracking & Theological Note */}
      <aside className={`w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r p-5 sm:p-6 flex flex-col gap-6 transition-colors ${
        isDark ? 'bg-[#0A0B0D] border-white/10' : 'bg-[#FAF8F5] border-amber-900/10'
      }`}>
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3 sm:mb-4 font-bold">
            The Four Phases
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
            {PHASES.map((p) => {
              const { mastered, total, percentage } = getPhaseMastery(p.number);
              const isSelected = activePhase === p.number;

              return (
                <div
                  key={p.number}
                  onClick={() => setActivePhase(isSelected ? 'all' : p.number)}
                  className={`p-3 rounded-lg border relative overflow-hidden cursor-pointer transition-all ${
                    isSelected
                      ? isDark 
                        ? 'bg-amber-600/10 border-amber-600/30' 
                        : 'bg-amber-100/70 border-amber-500'
                      : isDark
                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                        : 'bg-white border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600"></div>
                  )}
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-xs font-semibold truncate pr-1 ${
                      isSelected 
                        ? isDark ? 'text-amber-500' : 'text-amber-800'
                        : isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Phase {p.number}: {p.shortTitle}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {mastered}/{total}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-600 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Theological Note Box */}
        {currentCard && (
          <div className={`mt-auto p-4 rounded-xl border transition-colors hidden lg:block ${
            isDark ? 'bg-[#0F1115] border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
          }`}>
            <h3 className="text-xs font-serif italic text-amber-500 mb-2 font-medium">
              Theological Note • Card {currentCard.id}
            </h3>
            <p className="text-[11px] leading-relaxed">
              {currentCard.note}
            </p>
          </div>
        )}
      </aside>

      {/* Center Section: Flashcard View */}
      <section className={`flex-1 p-4 sm:p-8 lg:p-10 flex flex-col items-center justify-center transition-colors relative overflow-y-auto ${
        isDark ? 'bg-[radial-gradient(circle_at_center,_#14161B_0%,_#0A0B0D_100%)]' : 'bg-[#F9F8F5]'
      }`}>
        {/* Top Control Bar inside Center Section */}
        <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2 mb-6">
          {/* Phase Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1" id="phase-filter-tabs">
            <button
              onClick={() => setActivePhase('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activePhase === 'all'
                  ? isDark
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30 font-semibold'
                    : 'bg-amber-600 text-white font-semibold'
                  : isDark
                    ? 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
              id="filter-all-cards"
            >
              All Cards ({cards.length})
            </button>
            {PHASES.map(p => (
              <button
                key={p.number}
                onClick={() => setActivePhase(p.number)}
                id={`filter-phase-${p.number}`}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  activePhase === p.number
                    ? isDark
                      ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30 font-semibold'
                      : 'bg-amber-600 text-white font-semibold'
                    : isDark
                      ? 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                P{p.number}: {p.shortTitle}
              </button>
            ))}
          </div>

          {/* Latin & Grid toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLatin(prev => !prev)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                showLatin
                  ? 'bg-amber-600/20 text-amber-400 border-amber-600/40'
                  : isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-600'
              }`}
              title="Toggle Latin Text"
              id="toggle-latin-btn"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Latin</span>
            </button>

            <button
              onClick={() => setIsGridView(prev => !prev)}
              className={`p-1.5 rounded-md border transition-colors ${
                isGridView
                  ? 'bg-amber-600/20 text-amber-400 border-amber-600/40'
                  : isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-600'
              }`}
              title={isGridView ? 'Switch to Focused Carousel' : 'Switch to Grid Overview'}
              id="toggle-grid-view-btn"
            >
              {isGridView ? <Maximize2 className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Grid Overview or Single Card Mode */}
        {isGridView ? (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="cards-grid-container">
            {filteredCards.map((card) => {
              const cardStatus = masteryData[card.id] || 'not_started';
              return (
                <div
                  key={card.id}
                  onClick={() => {
                    const idx = filteredCards.findIndex(c => c.id === card.id);
                    if (idx !== -1) setCurrentIndex(idx);
                    setIsGridView(false);
                  }}
                  className={`group cursor-pointer rounded-2xl p-5 border transition-all hover:scale-[1.01] flex flex-col justify-between ${
                    isDark
                      ? 'bg-[#111318] border-white/10 hover:border-amber-600/50 hover:shadow-2xl'
                      : 'bg-white border-slate-200 hover:border-amber-600 hover:shadow-lg'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                        Card {card.id}
                      </span>
                      {statusBadge(cardStatus)}
                    </div>
                    <div className="text-xs text-slate-500 mb-1 font-medium">
                      {card.phaseName}
                    </div>
                    <h4 className="font-serif italic font-medium text-base text-slate-100 mb-2">
                      "{card.cue}"
                    </h4>
                    <p className="font-serif-text text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {card.response}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <span className="italic truncate pr-2">{card.themeHint}</span>
                    <span className="text-amber-500 group-hover:translate-x-0.5 transition-transform font-medium">Practice →</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Focused Flashcard View */
          <div className="w-full max-w-2xl flex flex-col items-center">
            {/* Card Wrapper with 3D Flip */}
            <div 
              className="w-full min-h-[360px] sm:min-h-[400px] perspective-1000 select-none relative"
              id="flashcard-3d-wrapper"
            >
              {/* Card Counter Badge - Top Floating Pill */}
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border z-20 shadow-md ${
                isDark ? 'bg-[#1A1C23] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                  Card {currentIndex + 1} of {filteredCards.length}
                </span>
              </div>

              <div 
                className={`w-full h-full transform-style-3d transition-transform duration-500 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT OF CARD (Cue) */}
                <div 
                  className={`w-full h-full backface-hidden rounded-2xl border shadow-2xl flex flex-col justify-between transition-colors ${
                    isDark
                      ? 'bg-[#111318] border-white/10 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  id="card-front-face"
                >
                  {/* Card Front Header */}
                  <div className="p-6 sm:p-8 pb-0 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      The Prompt • {currentCard.phaseSection}
                    </span>
                    {statusBadge(currentStatus)}
                  </div>

                  {/* Card Front Body */}
                  <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-14 text-center py-6">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-slate-100 italic leading-snug">
                      "{currentCard.cue}"
                    </h3>

                    {showLatin && currentCard.latinCue && (
                      <p className="mt-3 font-serif-text italic text-sm sm:text-base text-amber-200/60 max-w-lg">
                        "{currentCard.latinCue}"
                      </p>
                    )}

                    {/* Reveal Action Button */}
                    <div className="mt-8 pt-6 border-t border-white/5 w-full flex flex-col items-center">
                      <button 
                        onClick={() => setIsFlipped(true)}
                        className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-[#0A0B0D] font-bold rounded-lg shadow-lg shadow-amber-900/20 transition-all font-serif tracking-wide text-sm"
                        id="reveal-response-btn"
                      >
                        Reveal Response
                      </button>
                    </div>
                  </div>

                  {/* Card Front Footer Actions */}
                  <div className={`p-4 sm:p-6 border-t rounded-b-2xl flex justify-between items-center ${
                    isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Current Mastery:</span>
                      {statusBadge(currentStatus)}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handlePrev}
                        className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${
                          isDark ? 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Previous Card (←)"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleNext}
                        className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${
                          isDark ? 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Next Card (→)"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* BACK OF CARD (Response & Theological Exposition) */}
                <div 
                  className={`w-full h-full backface-hidden rotate-y-180 rounded-2xl border shadow-2xl flex flex-col justify-between absolute inset-0 transition-colors ${
                    isDark
                      ? 'bg-[#111318] border-white/10 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  id="card-back-face"
                >
                  {/* Card Back Header */}
                  <div className="p-6 sm:p-8 pb-0 flex items-center justify-between border-b border-white/5">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                      Canonical Response
                    </span>
                    <button
                      onClick={() => onOpenExplain(currentCard)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-colors ${
                        isDark ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10' : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                      id="explain-card-btn"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Theological Context</span>
                    </button>
                  </div>

                  {/* Card Back Body */}
                  <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 text-center py-6 overflow-y-auto">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-slate-100 italic leading-snug">
                      "{currentCard.response}"
                    </h3>

                    {showLatin && currentCard.latinResponse && (
                      <p className="mt-2 font-serif-text italic text-xs sm:text-sm text-amber-200/60 max-w-lg">
                        "{currentCard.latinResponse}"
                      </p>
                    )}

                    {/* Doctrinal note */}
                    <div className={`mt-4 p-3 rounded-lg border text-xs leading-relaxed max-w-lg text-left ${
                      isDark ? 'bg-black/30 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <span className="font-bold text-amber-500 block mb-0.5">Note:</span>
                      {currentCard.note}
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => setIsFlipped(false)}
                        className={`text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors`}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Return to Prompt (Front)</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Back Footer */}
                  <div className={`p-4 sm:p-6 border-t rounded-b-2xl flex justify-between items-center ${
                    isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Current Mastery:</span>
                      {statusBadge(currentStatus)}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handlePrev}
                        className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${
                          isDark ? 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Previous Card (←)"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleNext}
                        className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${
                          isDark ? 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Next Card (→)"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mastery Update Controls underneath card */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3" id="mastery-buttons-group">
              <button
                onClick={() => onUpdateMastery(currentCard.id, 'not_started')}
                className={`px-4 sm:px-5 py-2 rounded-lg border text-xs font-bold transition-colors ${
                  currentStatus === 'not_started'
                    ? 'bg-red-950 text-red-300 border-red-700'
                    : 'bg-red-950/30 border-red-900/40 text-red-400 hover:bg-red-900/40'
                }`}
                title="Mark as Forgot (Key: 1)"
                id="mastery-btn-forgot"
              >
                Forgot
              </button>

              <button
                onClick={() => onUpdateMastery(currentCard.id, 'struggling')}
                className={`px-4 sm:px-5 py-2 rounded-lg border text-xs font-bold transition-colors ${
                  currentStatus === 'struggling'
                    ? 'bg-orange-950 text-orange-300 border-orange-700'
                    : 'bg-orange-950/30 border-orange-900/40 text-orange-400 hover:bg-orange-900/40'
                }`}
                title="Mark as Struggled (Key: 2)"
                id="mastery-btn-struggled"
              >
                Struggled
              </button>

              <button
                onClick={() => onUpdateMastery(currentCard.id, 'learning')}
                className={`px-4 sm:px-5 py-2 rounded-lg border text-xs font-bold transition-colors ${
                  currentStatus === 'learning'
                    ? 'bg-blue-950 text-blue-300 border-blue-700'
                    : 'bg-blue-950/30 border-blue-900/40 text-blue-400 hover:bg-blue-900/40'
                }`}
                title="Mark as Learning (Key: 3)"
                id="mastery-btn-learning"
              >
                Learning
              </button>

              <button
                onClick={() => onUpdateMastery(currentCard.id, 'mastered')}
                className={`px-4 sm:px-5 py-2 rounded-lg border text-xs font-bold transition-colors ${
                  currentStatus === 'mastered'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-emerald-950/30 border-emerald-900/40 text-emerald-400 hover:bg-emerald-900/40'
                }`}
                title="Mark as Mastered (Key: 4)"
                id="mastery-btn-mastered"
              >
                Mastered
              </button>
            </div>

            {/* Keyboard shortcuts row */}
            <div className="mt-5 flex items-center gap-4 text-[11px] text-slate-500">
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">Space</kbd> Flip</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">→</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">1 - 4</kbd> Mastery</span>
            </div>
          </div>
        )}
      </section>

      {/* Right Sidebar: Glossary Highlight, Phase Outline & Memorisation Tips */}
      <aside className={`w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l p-5 sm:p-6 hidden xl:flex flex-col gap-6 transition-colors ${
        isDark ? 'bg-[#0A0B0D] border-white/10' : 'bg-[#FAF8F5] border-amber-900/10'
      }`}>
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Glossary Highlight */}
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3 font-bold">
              Glossary Highlight
            </h2>
            <div className={`p-4 rounded-xl border transition-colors ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className="text-xs font-bold text-amber-500 block">
                {currentGlossary.term}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                {currentGlossary.language}: {currentGlossary.originalWord}
              </p>
              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                {currentGlossary.shortDefinition}
              </p>
            </div>
          </div>

          {/* Phase Outline */}
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3 font-bold">
              Phase Outline
            </h2>
            <div className="space-y-4">
              {PHASES.map((ph, idx) => {
                const isCurrentPhase = currentCard.phaseNumber === ph.number;
                return (
                  <div key={ph.number} className="flex gap-3">
                    <div className="w-4 flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${
                        isCurrentPhase ? 'bg-amber-600' : 'border border-amber-600/50'
                      }`}></div>
                      {idx < PHASES.length - 1 && (
                        <div className="w-px h-full bg-white/10 mt-1 min-h-[20px]"></div>
                      )}
                    </div>
                    <div className="pb-1">
                      <span className={`text-[10px] block font-bold uppercase tracking-wider ${
                        isCurrentPhase ? 'text-amber-500' : 'text-slate-400'
                      }`}>
                        {ph.number}. {ph.shortTitle}
                      </span>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        {ph.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Memorisation Tips button */}
        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={onNavigateToHelp}
            className={`w-full py-3 px-4 rounded-lg border text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors ${
              isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
            id="sidebar-memorisation-tips-btn"
          >
            <QuestionIcon className="w-4 h-4" />
            <span>Memorisation Tips</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
