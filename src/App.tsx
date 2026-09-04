import React, { useState, useEffect } from 'react';
import { ViewMode, ThemeMode, MasteryStatus, CreedCard } from './types';
import { CREED_CARDS } from './data/creed';
import { 
  loadMasteryData, 
  saveMasteryData, 
  setCardMastery, 
  clearAllMastery, 
  loadThemePreference, 
  saveThemePreference 
} from './utils/storage';
import { Header } from './components/Header';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizRecital } from './components/QuizRecital';
import { StudyGuide } from './components/StudyGuide';
import { GuidancePanel } from './components/GuidancePanel';
import { ExplainModal } from './components/ExplainModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('deck');
  const [theme, setTheme] = useState<ThemeMode>(loadThemePreference());
  const [masteryData, setMasteryData] = useState<Record<number, MasteryStatus>>({});
  const [explainCard, setExplainCard] = useState<CreedCard | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Initialize mastery from localStorage
  useEffect(() => {
    setMasteryData(loadMasteryData());
  }, []);

  // Synchronize dark class with html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveThemePreference(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleUpdateMastery = (cardId: number, status: MasteryStatus) => {
    const updated = setCardMastery(cardId, status);
    setMasteryData(updated);
  };

  const handleResetConfirm = () => {
    clearAllMastery();
    setMasteryData({});
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDark ? 'bg-[#0A0B0D] text-slate-300' : 'bg-[#F9F8F5] text-slate-900'
    }`} id="liturgical-memorizer-app">
      {/* Header with Navigation & Brand */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        masteryData={masteryData}
        totalCards={CREED_CARDS.length}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {currentView === 'deck' && (
          <FlashcardDeck
            cards={CREED_CARDS}
            masteryData={masteryData}
            onUpdateMastery={handleUpdateMastery}
            onOpenExplain={(card) => setExplainCard(card)}
            isDark={isDark}
            onNavigateToHelp={() => setCurrentView('help')}
          />
        )}

        {currentView === 'quiz' && (
          <QuizRecital
            cards={CREED_CARDS}
            masteryData={masteryData}
            onUpdateMastery={handleUpdateMastery}
            isDark={isDark}
          />
        )}

        {currentView === 'guide' && (
          <StudyGuide
            onOpenExplain={(card) => setExplainCard(card)}
            isDark={isDark}
          />
        )}

        {currentView === 'help' && (
          <GuidancePanel
            isDark={isDark}
          />
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className={`px-4 sm:px-8 py-2.5 border-t text-xs transition-colors flex flex-col sm:flex-row justify-between items-center gap-2 ${
        isDark ? 'border-white/10 bg-[#0F1115]' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Static Environment: Local Only</span>
          <div className="h-2 w-px bg-white/10 hidden sm:block"></div>
          <span className="text-[10px] text-amber-600 font-medium uppercase tracking-widest">3stepuk/Learning-the-Nicene-Creed</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Ready to Deploy</span>
          </div>
          <div className="h-2 w-px bg-white/10 hidden sm:block"></div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
            <button 
              onClick={() => setCurrentView('guide')} 
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              Glossary
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentView('help')} 
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              Memorisation Tips
            </button>
          </div>
        </div>
      </footer>

      {/* Theological Explain Modal (offline) */}
      <ExplainModal
        card={explainCard}
        onClose={() => setExplainCard(null)}
        isDark={isDark}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        isDark={isDark}
      />
    </div>
  );
}
