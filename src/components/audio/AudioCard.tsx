/**
 * AudioCard Component
 * Card wrapper with built-in audio guidance
 * Auto-speaks content and provides replay functionality
 */

import React, { ReactNode } from 'react';
import { Card, CardProps } from '@/components/ui/card';
import { DataSpeaker } from './DataSpeaker';
import { Language, AudioPriority } from '@/services/audio/audioEngine';
import { cn } from '@/lib/utils';

export interface AudioCardProps extends Omit<CardProps, 'children'> {
    children: ReactNode;
    data: any;
    type: 'weather' | 'soil' | 'market' | 'fertilizer' | 'crophealth' | 'sensor' | 'iot';
    language?: Language;
    autoPlay?: boolean;
    priority?: AudioPriority;
    speakerPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    speakerSize?: 'sm' | 'md' | 'lg' | 'xl';
    showSpeakerLabel?: boolean;
    audioEnabled?: boolean;
}

export const AudioCard: React.FC<AudioCardProps> = ({
    children,
    data,
    type,
    language = 'en-IN',
    autoPlay = false,
    priority = 'normal',
    speakerPosition = 'top-right',
    speakerSize = 'lg',
    showSpeakerLabel = false,
    audioEnabled = true,
    className,
    ...cardProps
}) => {
    const getPositionClasses = () => {
        switch (speakerPosition) {
            case 'top-right':
                return 'top-4 right-4';
            case 'top-left':
                return 'top-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            default:
                return 'top-4 right-4';
        }
    };

    return (
        <Card
            className={cn('relative', className)}
            {...cardProps}
        >
            {audioEnabled && (
                <div className={cn('absolute z-10', getPositionClasses())}>
                    <DataSpeaker
                        data={data}
                        type={type}
                        language={language}
                        priority={priority}
                        size={speakerSize}
                        showLabel={showSpeakerLabel}
                    />
                </div>
            )}

            {children}
        </Card>
    );
};
