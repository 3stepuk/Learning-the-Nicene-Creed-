import { MasteryStatus } from '../types';

const STORAGE_KEYS = {
  MASTERY: 'nicene_creed_mastery_v2',
  THEME: 'nicene_creed_theme_v2',
  ACTIVE_PHASE: 'nicene_creed_active_phase_v2',
  SHOW_LATIN: 'nicene_creed_show_latin_v2',
};

export function loadMasteryData(): Record<number, MasteryStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MASTERY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Unable to load mastery from localStorage', e);
    return {};
  }
}

export function saveMasteryData(data: Record<number, MasteryStatus>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MASTERY, JSON.stringify(data));
  } catch (e) {
    console.warn('Unable to save mastery to localStorage', e);
  }
}

export function setCardMastery(cardId: number, status: MasteryStatus): Record<number, MasteryStatus> {
  const current = loadMasteryData();
  const updated = { ...current, [cardId]: status };
  saveMasteryData(updated);
  return updated;
}

export function clearAllMastery(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.MASTERY);
  } catch (e) {
    console.warn('Unable to clear mastery from localStorage', e);
  }
}

export function loadThemePreference(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch (e) {
    // fallback
  }
  return 'dark'; // Default dark as requested
}

export function saveThemePreference(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.warn('Unable to save theme preference', e);
  }
}

export function loadLatinToggle(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.SHOW_LATIN) === 'true';
  } catch {
    return false;
  }
}

export function saveLatinToggle(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOW_LATIN, enabled ? 'true' : 'false');
  } catch {
    // ignore
  }
}
