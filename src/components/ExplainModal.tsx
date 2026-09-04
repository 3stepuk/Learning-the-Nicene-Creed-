import React from 'react';
import { X, BookOpen, Scroll, BookMarked, Sparkles } from 'lucide-react';
import { CreedCard } from '../types';
import { GLOSSARY_TERMS } from '../data/glossary';

interface ExplainModalProps {
  card: CreedCard | null;
  onClose: () => void;
  isDark: boolean;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ card, onClose, isDark }) => {
  if (!card) return null;

  const relatedTerms = GLOSSARY_TERMS.filter(term => 
    card.glossaryTerms?.some(gt => term.term.toLowerCase().includes(gt.toLowerCase()) || gt.toLowerCase().includes(term.term.toLowerCase()))
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      id="explain-modal-backdrop"
    >
      <div 
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 shadow-2xl border transition-all ${
          isDark 
            ? 'bg-[#111318] border-white/10 text-slate-300' 
            : 'bg-[#FCFCFA] border-amber-800/20 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
        id="explain-modal-content"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-amber-600/20 text-amber-400 border border-amber-600/30">
                Card {card.id} • {card.phaseName}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {card.themeHint}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-slate-100 italic font-medium">
              Theological Exposition
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400 hover:text-slate-100' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Close modal (Esc)"
            id="close-explain-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creed Text Review */}
        <div className="mt-5 space-y-4">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-black/30 border-white/5' : 'bg-amber-500/5 border-amber-900/10'
          }`}>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
              Full Liturgical Clause
            </span>
            <p className="font-serif text-lg sm:text-xl leading-relaxed text-slate-100 italic">
              <span className="text-amber-400 font-medium">{card.cue}</span>{' '}
              <span className="text-slate-200">{card.response.replace(/^\.\.\./, '')}</span>
            </p>

            {card.latinCue && card.latinResponse && (
              <div className="mt-3 pt-3 border-t border-white/5 text-xs sm:text-sm font-serif italic text-amber-200/60">
                <span className="not-italic uppercase font-sans text-[10px] text-slate-500 block mb-0.5 tracking-wider">Latin Vulgate / Liturgical Rite</span>
                {card.latinCue} {card.latinResponse.replace(/^\.\.\./, '')}
              </div>
            )}
          </div>

          {/* Doctrinal Note */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-amber-500 font-serif italic font-medium text-sm sm:text-base">
              <BookOpen className="w-4 h-4" />
              Doctrinal Note & Theological Meaning
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {card.note}
            </p>
          </div>

          {/* Biblical References */}
          {card.scriptureReferences && card.scriptureReferences.length > 0 && (
            <div className="p-4 rounded-xl border border-white/5 bg-black/20">
              <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <BookMarked className="w-3.5 h-3.5 text-amber-500" />
                Scriptural Foundations
              </div>
              <div className="flex flex-wrap gap-2">
                {card.scriptureReferences.map((ref, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded text-xs font-medium bg-white/5 text-amber-400 border border-white/10"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Glossary Terms */}
          {relatedTerms.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Key Theological Terms in this Article
              </div>
              <div className="space-y-3">
                {relatedTerms.map((term, i) => (
                  <div 
                    key={i}
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-amber-900/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h4 className="font-serif font-bold text-amber-400 text-base">
                        {term.term}
                      </h4>
                      <span className="text-xs font-serif italic text-slate-400">
                        ({term.originalWord})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
                      <strong className="text-slate-200">Definition:</strong> {term.shortDefinition}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Theology:</strong> {term.theologyNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memorisation Cue Tip */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <Scroll className="w-5 h-5 mt-0.5 text-emerald-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold block mb-0.5">Memorisation Anchor:</span>
              Remember the anchor word in the cue: <strong className="underline decoration-amber-400">{card.cue.split(' ').slice(-2).join(' ')}</strong> triggers the opening of the response.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-500 text-[#0A0B0D] transition-colors shadow-lg shadow-amber-900/20"
            id="done-explain-modal-btn"
          >
            Back to Practice
          </button>
        </div>
      </div>
    </div>
  );
};
