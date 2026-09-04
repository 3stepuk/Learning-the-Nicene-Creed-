import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  History, 
  Brain, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  Clock,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/faqData';
import { GLOSSARY_TERMS } from '../data/glossary';
import { CREED_CARDS } from '../data/creed';

interface GuidancePanelProps {
  isDark: boolean;
}

export const GuidancePanel: React.FC<GuidancePanelProps> = ({ isDark }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'theology' | 'history' | 'memorisation'>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('why-written');

  // Filter FAQs
  const filteredFaqs = FAQ_ITEMS.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.keyTerms?.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Also find any matching glossary or cards if user searches
  const matchingGlossary = searchQuery.trim() ? GLOSSARY_TERMS.filter(g => 
    g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.theologyNote.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const matchingCards = searchQuery.trim() ? CREED_CARDS.filter(c =>
    c.cue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.note.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8" id="guidance-panel-view">
      {/* Banner */}
      <div className="pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-8 h-8 rounded flex items-center justify-center bg-amber-600/20 text-amber-400 border border-amber-600/30">
            <HelpCircle className="w-4 h-4" />
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-slate-100">
            Liturgical Guidance & Static FAQ
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Instant offline answers to historical, doctrinal, and memorisation questions. No server or API connection needed.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search theological questions, terms (e.g. Homoousios, Filioque), or memorisation tips..."
          className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm sm:text-base outline-none transition-all shadow-sm ${
            isDark
              ? 'bg-[#111318] border-white/10 focus:border-amber-600/60 text-slate-100 placeholder-slate-500'
              : 'bg-white border-slate-300 focus:border-amber-600 text-slate-900 placeholder-slate-400'
          }`}
          id="guidance-search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" id="guidance-categories">
        {[
          { id: 'all', label: 'All Guidance', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'theology', label: 'Doctrinal Theology', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'history', label: 'Council History', icon: <History className="w-3.5 h-3.5" /> },
          { id: 'memorisation', label: 'Memorisation Methods', icon: <Brain className="w-3.5 h-3.5" /> }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? isDark ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30 font-semibold' : 'bg-amber-600 text-white font-semibold'
                : isDark ? 'bg-white/5 text-slate-400 border border-white/10 hover:text-slate-200' : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search results notice if search query is active */}
      {searchQuery.trim() && (
        <div className="text-xs text-amber-500 font-medium">
          Found {filteredFaqs.length} FAQs, {matchingGlossary.length} glossary terms, and {matchingCards.length} creed cards matching "{searchQuery}"
        </div>
      )}

      {/* SECTION: Memorisation Masterclass Banner (Shown when viewing memorisation or all) */}
      {(activeCategory === 'all' || activeCategory === 'memorisation') && !searchQuery.trim() && (
        <div className={`p-6 rounded-2xl border ${
          isDark ? 'bg-[#0F1115] border-white/10' : 'bg-gradient-to-br from-amber-50 to-white border-amber-200'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif italic font-medium text-lg text-slate-100">
              The 4 Pillars of Liturgical Memorisation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-black/30 border-white/5' : 'bg-white border-amber-100'
            }`}>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500 block mb-1">
                1. Cue & Response Chaining
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Notice how Card 3 ends with <em>"...consubstantial with the Father"</em> and Card 4 begins with that exact phrase. Every card is chained to the next so you never lose your place.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-black/30 border-white/5' : 'bg-white border-amber-100'
            }`}>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500 block mb-1">
                2. Phase Chunking
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Do not attempt all 13 cards simultaneously. Master Phase 1 (Father), then move to Phase 2 (Son), Phase 3 (Holy Spirit), and finally Phase 4 (Church & Hope).
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-black/30 border-white/5' : 'bg-white border-amber-100'
            }`}>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500 block mb-1">
                3. Audible Cadence
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                The Creed was written to be chanted and spoken in unison. Speak each response out loud to recruit articulatory muscles and auditory recall.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-black/30 border-white/5' : 'bg-white border-amber-100'
            }`}>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500 block mb-1">
                4. Recital Testing
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Passive reading creates an illusion of competence. Use the <strong>Quiz & Recital</strong> tab to force your brain to actively retrieve each clause.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search results: matching glossary terms */}
      {matchingGlossary.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-500">
            Matching Glossary Terms
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchingGlossary.map((g, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#111318] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-serif font-bold text-amber-400">{g.term}</span>
                  <span className="text-xs text-slate-400">{g.language}</span>
                </div>
                <p className="text-xs text-slate-300">{g.shortDefinition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        <h3 className="font-serif italic font-medium text-lg text-slate-200 mb-2">
          Frequently Asked Questions & Doctrinal Reference
        </h3>

        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No matching questions found for "{searchQuery}". Try searching "Nicaea", "Trinity", or "Filioque".
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? isDark ? 'bg-[#111318] border-amber-600/40' : 'bg-white border-amber-600 shadow-md'
                    : isDark ? 'bg-[#111318]/70 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4"
                  id={`faq-btn-${faq.id}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-slate-100">
                        {faq.question}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                          {faq.category}
                        </span>
                        {faq.keyTerms && (
                          <div className="hidden sm:flex items-center gap-1">
                            {faq.keyTerms.slice(0, 3).map((term, tIdx) => (
                              <span key={tIdx} className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                {term}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 mt-1">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Council Timeline summary */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'bg-[#111318] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <History className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif italic font-medium text-base sm:text-lg text-slate-100">
            Historical Councils Timeline
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <span className="font-bold text-amber-500 min-w-[70px] font-serif">325 AD</span>
            <div>
              <strong className="text-slate-100">First Council of Nicaea:</strong> Called by Emperor Constantine; defined Christ as <em>Homoousios</em> (consubstantial) with the Father, condemning Arius.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-amber-500 min-w-[70px] font-serif">381 AD</span>
            <div>
              <strong className="text-slate-100">First Council of Constantinople:</strong> Expanded the Creed to articulate the full divinity of the Holy Spirit (Lord, giver of life) and the Four Marks of the Church.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-amber-500 min-w-[70px] font-serif">589 AD</span>
            <div>
              <strong className="text-slate-100">Third Council of Toledo:</strong> Earliest prominent western addition of <em>Filioque</em> ("and the Son") to preserve orthodoxy against local Arian tribes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
