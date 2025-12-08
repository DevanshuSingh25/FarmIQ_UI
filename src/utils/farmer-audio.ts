/**
 * Farmer-Friendly Audio Utilities
 * Provides Hindi/English text-to-speech functionality using Web Speech API
 */

import type { FarmerAudioConfig } from '@/types/farmer-ui.types';

const defaultConfig: FarmerAudioConfig = {
    language: 'hi-IN',
    rate: 0.8, // Slower for better comprehension
    pitch: 1,
    volume: 1
};

/**
 * Play text-to-speech audio with Hindi support
 */
export const speakText = (
    text: string,
    config: Partial<FarmerAudioConfig> = {}
): void => {
    if (!('speechSynthesis' in window)) {
        console.warn('Text-to-speech not supported in this browser');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const mergedConfig = { ...defaultConfig, ...config };
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = mergedConfig.language;
    utterance.rate = mergedConfig.rate;
    utterance.pitch = mergedConfig.pitch;
    utterance.volume = mergedConfig.volume;

    window.speechSynthesis.speak(utterance);
};

/**
 * Stop any ongoing speech
 */
export const stopSpeech = (): void => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
};

/**
 * Check if text-to-speech is supported
 */
export const isSpeechSupported = (): boolean => {
    return 'speechSynthesis' in window;
};

/**
 * Get bilingual audio text (Hindi + English)
 */
export const getBilingualAudio = (hindi: string, english: string): string => {
    return `${hindi}. ${english}`;
};
