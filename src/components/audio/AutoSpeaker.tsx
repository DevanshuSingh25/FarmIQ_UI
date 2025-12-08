/**
 * AutoSpeaker Component
 * Wrapper that auto-plays audio on data load
 */

import React, { ReactNode, useEffect } from 'react';
import { useAudioGuidance, UseAudioGuidanceOptions } from '@/hooks/useAudioGuidance';

export interface AutoSpeakerProps extends UseAudioGuidanceOptions {
    children: ReactNode;
    onSpeakStart?: () => void;
    onSpeakEnd?: () => void;
    onError?: (error: Error) => void;
}

export const AutoSpeaker: React.FC<AutoSpeakerProps> = ({
    children,
    data,
    type,
    language = 'en-IN',
    priority = 'normal',
    enabled = true,
    onSpeakStart,
    onSpeakEnd,
    onError
}) => {
    const { speak, isPlaying, error } = useAudioGuidance({
        data,
        type,
        language,
        priority,
        enabled,
        autoPlay: true
    });

    // Notify parent of state changes
    useEffect(() => {
        if (isPlaying && onSpeakStart) {
            onSpeakStart();
        } else if (!isPlaying && onSpeakEnd) {
            onSpeakEnd();
        }
    }, [isPlaying, onSpeakStart, onSpeakEnd]);

    useEffect(() => {
        if (error && onError) {
            onError(error);
        }
    }, [error, onError]);

    return <>{children}</>;
};
