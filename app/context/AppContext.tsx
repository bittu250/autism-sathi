import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'nepali' | 'english';
type TextSize = 'small' | 'medium' | 'large';

interface DailyProgress {
  [key: string]: boolean;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  dailyProgress: DailyProgress;
  toggleProgress: (key: string) => void;
  resetDailyProgress: () => void;
  getTextSizeMultiplier: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('nepali');
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({});

  const toggleProgress = (key: string) => {
    setDailyProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetDailyProgress = () => {
    setDailyProgress({});
  };

  const getTextSizeMultiplier = () => {
    switch (textSize) {
      case 'small': return 0.85;
      case 'large': return 1.2;
      default: return 1;
    }
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      textSize,
      setTextSize,
      soundEnabled,
      setSoundEnabled,
      dailyProgress,
      toggleProgress,
      resetDailyProgress,
      getTextSizeMultiplier,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
