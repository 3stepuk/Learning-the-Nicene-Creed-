import React, { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  BookMarked,
  Scroll,
  Info
} from 'lucide-react';
import { CreedCard, GlossaryTerm } from '../types';
import { CREED_CARDS, PHASES } from '../data/creed';
import { GLOSSARY_TERMS } from '../data/glossary';

interface StudyGuideProps {
  onOpenExplain: (card: CreedCard) => void;
  isDark: boolean;
}

export const StudyGuide: React.FC<StudyGuideProps> = ({ onOpenExplain, isDark }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLatin, setShowLatin] = useState(false);
  const [selectedGlossaryKey, setSelectedGlossaryKey] = useState<string | null>(null);

  // Filter glossary items
  const filteredGlossary = GLOSSARY_TERMS.filter(item => {
    const q = searchTerm.toLowerCase();
    return (
      item.term.toLowerCase().includes(q) ||
      item.originalWord.toLowerCase().includes(q) ||
      item.shortDefinition.toLowerCase().includes(q) ||
      item.theologyNote.toLowerCase().includes(q)
    );
  });

  const fullEnglishCreed = CREED_CARDS.map(c => `${c.cue} ${c.response.replace(/^\.\.\./, '')}`).join('\n\n');

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullEnglishCreed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-10" id="study-guide-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded flex items-center justify-center bg-amber-600/20 text-amber-400 border border-amber-600/30">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-slate-100">
              The Nicene Creed Study Guide
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            A continuous doctrinal exposition of the Symbol of Faith promulgated at Nicaea (325 AD) and Constantinople (381 AD).
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setShowLatin(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              showLatin
                ? 'bg-amber-600/20 text-amber-400 border-amber-600/40'
                : isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-700'
            }`}
            id="guide-toggle-latin-btn"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>{showLatin ? 'Latin Parallel ON' : 'Show Latin'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:text-amber-400' : 'bg-white border-slate-200 text-slate-700'
            }`}
            id="copy-creed-btn"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Full Creed' : 'Copy Creed'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Assembled Continuous Creed Phase by Phase */}
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Scroll className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif italic font-medium text-xl text-slate-100">
            Canonical Liturgical Text (4 Phases)
          </h3>
        </div>

        {PHASES.map((phase) => {
          const phaseCards = CREED_CARDS.filter(c => c.phaseNumber === phase.number);

          return (
            <div 
              key={phase.number}
              className={`rounded-2xl p-6 sm:p-8 border shadow-xl transition-all ${
                isDark 
                  ? 'bg-[#111318] border-white/10' 
                  : 'bg-white border-amber-900/15'
              }`}
              id={`guide-phase-${phase.number}`}
            >
              {/* Phase Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                    Phase {phase.number}
                  </span>
                  <h4 className="font-serif italic text-lg sm:text-xl font-medium text-slate-100 mt-0.5">
                    {phase.shortTitle}
                  </h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-white/5 text-amber-400 border border-white/10 font-medium">
                  {phase.count} {phase.count === 1 ? 'Card' : 'Cards'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 mb-6 italic">
                {phase.description}
              </p>

              {/* Cards within this phase */}
              <div className="space-y-4">
                {phaseCards.map((card) => (
                  <div 
                    key={card.id}
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isDark ? 'bg-black/30 border-white/5 hover:border-amber-600/30' : 'bg-slate-50 border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-600/20 text-amber-400 border border-amber-600/30">
                          {card.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {card.phaseSection}
                        </span>
                      </div>
                      <button
                        onClick={() => onOpenExplain(card)}
                        className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Explain</span>
                      </button>
                    </div>

                    <p className="font-serif text-base sm:text-lg text-slate-100 leading-relaxed italic">
                      <strong className="text-amber-400 font-medium">{card.cue}</strong>{' '}
                      <span className="text-slate-200">{card.response.replace(/^\.\.\./, '')}</span>
                    </p>

                    {showLatin && card.latinCue && card.latinResponse && (
                      <p className="mt-2 font-serif italic text-xs sm:text-sm text-amber-200/60 pt-2 border-t border-white/5">
                        {card.latinCue} {card.latinResponse.replace(/^\.\.\./, '')}
                      </p>
                    )}

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-start gap-2 text-xs text-slate-500">
                      <Info className="w-3.5 h-3.5 mt-0.5 text-amber-600 shrink-0" />
                      <span>{card.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: THEOLOGICAL GLOSSARY */}
      <div className="pt-6 border-t border-white/10 space-y-6" id="theological-glossary-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-serif text-xl sm:text-2xl text-slate-100 font-medium">
                Theological Glossary (7 Key Terms)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              The foundational Greek, Latin, and Hebrew doctrinal formulations defined at the Ecumenical Councils.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter theological terms..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border outline-none transition-colors ${
                isDark 
                  ? 'bg-[#111318] border-white/10 focus:border-amber-600/60 text-slate-200' 
                  : 'bg-white border-slate-300 focus:border-amber-600 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* Glossary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-5 border transition-all ${
                selectedGlossaryKey === item.term
                  ? 'border-amber-600/60 ring-2 ring-amber-600/20'
                  : isDark ? 'bg-[#111318] border-white/10 hover:border-amber-600/40' : 'bg-white border-amber-900/15 hover:border-amber-400 shadow-sm'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <h4 className="font-serif font-bold text-base text-amber-400">
                  {item.term}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                  {item.language}
                </span>
              </div>

              <div className="text-xs font-serif italic text-slate-400 mb-3">
                Original text: {item.originalWord}
              </div>

              <div className="text-xs sm:text-sm text-slate-300 mb-2.5 leading-relaxed">
                <strong className="text-slate-100">Definition:</strong> {item.shortDefinition}
              </div>

              <div className="text-xs text-slate-400 leading-relaxed mb-3">
                <strong className="text-slate-300">Theological Significance:</strong> {item.theologyNote}
              </div>

              <div className="pt-2.5 border-t border-white/5 text-[11px] text-slate-500 flex flex-col gap-1">
                <div>
                  <span className="text-amber-500 font-medium">Scriptural Roots: </span>
                  {item.biblicalBasis}
                </div>
                <div>
                  <span className="text-amber-500 font-medium">Historical Context: </span>
                  {item.historicalContext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
