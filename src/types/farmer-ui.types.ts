/**
 * Type definitions for Farmer-Friendly UI components
 * Supports bilingual (Hindi/English) interfaces with emoji icons
 */

export interface BilingualText {
    hindi: string;
    english: string;
}

export interface FarmerAction {
    id: string;
    emoji: string;
    title: BilingualText;
    description: BilingualText;
    route: string;
    color: 'success' | 'destructive' | 'primary' | 'accent' | 'info';
    audioText?: string; // Optional audio narration text
}

export interface FarmerAudioConfig {
    language: 'hi-IN' | 'en-IN';
    rate: number; // Speech rate (0.1 to 10)
    pitch: number; // Voice pitch (0 to 2)
    volume: number; // Volume (0 to 1)
}

export type LanguageCode = 'Hindi' | 'English' | 'Punjabi';
