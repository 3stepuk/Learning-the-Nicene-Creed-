import React from 'react';
import { 
  Sun, 
  Moon, 
  RotateCcw, 
  BookOpen, 
  Layers, 
  PenTool, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { ViewMode, ThemeMode, MasteryStatus } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  masteryData: Record<number, MasteryStatus>;
  totalCards: number;
  onOpenResetModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  theme,
  onToggleTheme,
  masteryData,
  totalCards,
  onOpenResetModal
}) => {
  const isDark = theme === 'dark';

  const masteredCount = Object.values(masteryData).filter(s => s === 'mastered').length;
  const learningCount = Object.values(masteryData).filter(s => s === 'learning').length;
  const strugglingCount = Object.values(masteryData).filter(s => s === 'struggling').length;
  const masteryPercentage = Math.round((masteredCount / totalCards) * 100);

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'deck', label: 'Flashcards', icon: <Layers className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz & Recital', icon: <PenTool className="w-4 h-4" /> },
    { id: 'guide', label: 'Study Guide', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'help', label: 'Guidance & FAQ', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors backdrop-blur-md ${
      isDark 
        ? 'bg-[#0F1115] border-white/10 text-slate-300' 
        : 'bg-[#F9F8F5] border-amber-800/15 text-slate-900'
    }`}>
      {/* Top Banner with Brand, Mastery Metric, and Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold shrink-0 shadow-sm ${
              isDark 
                ? 'bg-amber-600 text-[#0A0B0D]' 
                : 'bg-amber-600 text-white'
            }`}>
              <span className="font-serif italic text-xl">N</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-base sm:text-lg font-serif tracking-wide font-medium ${
                  isDark ? 'text-amber-500' : 'text-amber-700'
                }`}>
                  Liturgical Memorizer
                </h1>
                <span className={`hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? 'bg-amber-600/15 text-amber-400 border border-amber-600/30' : 'bg-amber-100 text-amber-800'
                }`}>
                  Nicene Creed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span>13 Memorisable Cards</span>
                <span>•</span>
                <span>4 Liturgical Phases</span>
                <span>•</span>
                <span>Local Static</span>
              </p>
            </div>
          </div>

          {/* Center Navigation Bar (Desktop & responsive) */}
          <nav className={`flex items-center gap-1 p-1 rounded-lg border overflow-x-auto ${
            isDark ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`} id="main-navigation">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  id={`nav-tab-${item.id}`}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? isDark
                        ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30 shadow-sm'
                        : 'bg-amber-600 text-white shadow-sm'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Mastery Metric, Reset, Theme Toggle */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {/* Overall Mastery Counter */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Overall Mastery</span>
              <span className={`text-sm font-mono font-bold ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>
                {masteryPercentage}% <span className="text-xs font-normal text-slate-500">({masteredCount}/{totalCards})</span>
              </span>
            </div>

            {/* Reset Progress */}
            <button
              onClick={onOpenResetModal}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-colors ${
                isDark 
                  ? 'border-white/10 bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-white/10' 
                  : 'border-slate-200 bg-white text-slate-600 hover:text-rose-600 shadow-sm'
              }`}
              title="Reset Memorisation Progress"
              id="header-reset-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-colors ${
                isDark 
                  ? 'border-white/10 bg-white/5 text-slate-400 hover:text-amber-400 hover:bg-white/10' 
                  : 'border-slate-200 bg-white text-amber-700 hover:bg-slate-50 shadow-sm'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
              id="header-theme-toggle-btn"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
