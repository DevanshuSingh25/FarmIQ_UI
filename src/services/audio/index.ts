/**
 * Audio Guidance System - Main Export
 * Import everything you need from here
 */

// Core Engine
export { audioEngine, speakText, stopSpeech, pauseSpeech, resumeSpeech, isSpeechSupported } from './audioEngine';
export type { Language, AudioPriority, AudioConfig, QueuedAudio } from './audioEngine';

// Message Generators
export {
    generateMessage,
    generateWeatherMessage,
    generateSoilMessage,
    generateMarketMessage,
    generateFertilizerMessage,
    generateCropHealthMessage,
    generateSensorMessage,
    generateErrorMessage
} from './messageGenerator';

export type {
    WeatherData,
    SoilData,
    MarketData,
    FertilizerData,
    CropHealthData,
    SensorData
} from './messageGenerator';

// Language Templates
export { getStrings, getGreeting } from './languageTemplates';
export type { LanguageStrings } from './languageTemplates';
