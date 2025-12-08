/**
 * useAudioGuidance Hook
 * Reusable hook for adding audio guidance to any component
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { audioEngine, Language, AudioPriority } from '@/services/audio/audioEngine';
import { generateMessage } from '@/services/audio/messageGenerator';

export interface UseAudioGuidanceOptions {
    data: any;
    type: 'weather' | 'soil' | 'market' | 'fertilizer' | 'crophealth' | 'sensor' | 'iot';
    language?: Language;
    autoPlay?: boolean;
    priority?: AudioPriority;
    enabled?: boolean;
}

export interface UseAudioGuidanceReturn {
    speak: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    isPlaying: boolean;
    isPaused: boolean;
    message: string;
    error: Error | null;
}

export const useAudioGuidance = ({
    data,
    type,
    language = 'en-IN',
    autoPlay = false,
    priority = 'normal',
    enabled = true
}: UseAudioGuidanceOptions): UseAudioGuidanceReturn => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<Error | null>(null);
    const hasAutoPlayed = useRef(false);
    const subscriptionId = useRef(`audio-${Date.now()}`);

    // Generate message when data changes
    useEffect(() => {
        if (!data || !enabled) return;

        try {
            const generatedMessage = generateMessage(data, type, language);
            setMessage(generatedMessage);
            setError(null);
        } catch (err) {
            console.error('Failed to generate message:', err);
            setError(err as Error);
        }
    }, [data, type, language, enabled]);

    // Auto-play on mount if enabled
    useEffect(() => {
        if (autoPlay && message && !hasAutoPlayed.current && enabled) {
            hasAutoPlayed.current = true;
            speak();
        }
    }, [autoPlay, message, enabled]);

    // Subscribe to audio state changes
    useEffect(() => {
        const id = subscriptionId.current;

        audioEngine.subscribe(id, (state) => {
            setIsPlaying(state === 'playing');
            setIsPaused(state === 'paused');
        });

        return () => {
            audioEngine.unsubscribe(id);
            audioEngine.stopAll();
        };
    }, []);

    const speak = useCallback(() => {
        if (!message || !enabled) {
            console.warn('No message to speak or audio disabled');
            return;
        }

        setError(null);
        audioEngine
            .speak(message, { language, priority })
            .then(() => {
                setIsPlaying(false);
            })
            .catch((err) => {
                console.error('Speech error:', err);
                setError(err);
                setIsPlaying(false);
            });
    }, [message, language, priority, enabled]);

    const stop = useCallback(() => {
        audioEngine.stopAll();
        setIsPlaying(false);
        setIsPaused(false);
    }, []);

    const pause = useCallback(() => {
        audioEngine.pause();
        setIsPaused(true);
    }, []);

    const resume = useCallback(() => {
        audioEngine.resume();
        setIsPaused(false);
    }, []);

    return {
        speak,
        stop,
        pause,
        resume,
        isPlaying,
        isPaused,
        message,
        error
    };
};
