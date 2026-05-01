import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Language, translations, Translations } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider = React.memo(function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>(() => {
        // Try to get language from localStorage with defensive error handling
        try {
            const saved = localStorage.getItem('farmiq_language');
            return (saved as Language) || 'en';
        } catch (error) {
            console.error('Failed to load language preference:', error);
            return 'en'; // Fallback to English on error
        }
    });

    const setLanguage = (lang: Language) => {
        /*
         * ## Phase 2: Language Context Enhancement
         * - [x] Update `src/i18n/LanguageContext.tsx` with localStorage persistence
         * - [x] Add error handling for localStorage access
         * - [x] Implement memoization for performance
         * - [x] Verify `src/i18n/translations.ts` exist
         */
        setLanguageState(lang);
        // Persist language selection to localStorage with error handling
        try {
            localStorage.setItem('farmiq_language', lang);
        } catch (error) {
            console.error('Failed to save language preference:', error);
        }
    };

    const t = (key: keyof Translations): string => {
        return translations[language][key];
    };

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        language,
        setLanguage,
        t
    }), [language]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
});

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
