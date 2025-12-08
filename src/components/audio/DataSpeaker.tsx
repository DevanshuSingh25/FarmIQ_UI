/**
 * DataSpeaker Component
 * Large speaker button that auto-generates and speaks data
 */

import React from 'react';
import { Volume2, VolumeX, Pause, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioGuidance, UseAudioGuidanceOptions } from '@/hooks/useAudioGuidance';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface DataSpeakerProps extends Omit<UseAudioGuidanceOptions, 'autoPlay'> {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'outline' | 'ghost';
    showLabel?: boolean;
    disabled?: boolean;
}

export const DataSpeaker: React.FC<DataSpeakerProps> = ({
    data,
    type,
    language = 'en-IN',
    priority = 'normal',
    enabled = true,
    className,
    size = 'lg',
    variant = 'default',
    showLabel = false,
    disabled = false
}) => {
    const { speak, stop, isPlaying, message, error } = useAudioGuidance({
        data,
        type,
        language,
        priority,
        enabled,
        autoPlay: false
    });

    const { toast } = useToast();

    const handleClick = () => {
        if (disabled || !message) {
            toast({
                title: 'No Data',
                description: 'No information available to speak',
                variant: 'destructive'
            });
            return;
        }

        if (error) {
            toast({
                title: 'Error',
                description: 'Unable to generate audio message',
                variant: 'destructive'
            });
            return;
        }

        if (isPlaying) {
            stop();
        } else {
            speak();
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-10 w-10';
            case 'md':
                return 'h-14 w-14';
            case 'lg':
                return 'h-20 w-20';
            case 'xl':
                return 'h-28 w-28';
            default:
                return 'h-20 w-20';
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'sm':
                return 'h-5 w-5';
            case 'md':
                return 'h-7 w-7';
            case 'lg':
                return 'h-10 w-10';
            case 'xl':
                return 'h-14 w-14';
            default:
                return 'h-10 w-10';
        }
    };

    const getIcon = () => {
        if (disabled || !message) {
            return <VolumeX className={getIconSize()} />;
        }
        if (isPlaying) {
            return <Pause className={getIconSize()} />;
        }
        return <Volume2 className={getIconSize()} />;
    };

    const getLabel = () => {
        if (disabled || !message) return 'No audio';
        if (isPlaying) return 'Playing...';
        return 'Listen';
    };

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleClick();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                disabled={disabled || !message}
                variant={variant}
                className={cn(
                    getSizeClasses(),
                    'rounded-full p-0 transition-all',
                    isPlaying && 'animate-pulse bg-primary',
                    !disabled && !isPlaying && 'hover:scale-110 active:scale-95'
                )}
                title={getLabel()}
                aria-label={getLabel()}
            >
                {getIcon()}
            </Button>

            {showLabel && (
                <span className="text-sm font-medium text-muted-foreground">
                    {getLabel()}
                </span>
            )}
        </div>
    );
};
