/**
 * Enhanced Audio Engine
 * Production-ready TTS system with queue management, priority handling, and auto-stop
 */

export type Language = 'en-IN' | 'hi-IN' | 'pa-IN' | 'mr-IN';
export type AudioPriority = 'low' | 'normal' | 'high' | 'critical';

export interface AudioConfig {
    language: Language;
    rate: number;
    pitch: number;
    volume: number;
    priority?: AudioPriority;
}

export interface QueuedAudio {
    id: string;
    text: string;
    config: AudioConfig;
    priority: AudioPriority;
    timestamp: number;
}

class EnhancedAudioEngine {
    private static instance: EnhancedAudioEngine;
    private queue: QueuedAudio[] = [];
    private isPlaying: boolean = false;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private listeners: Map<string, (state: 'playing' | 'paused' | 'stopped' | 'error') => void> = new Map();

    private constructor() {
        // Initialize on first use
        if ('speechSynthesis' in window) {
            // Ensure voices are loaded
            window.speechSynthesis.getVoices();
        }
    }

    static getInstance(): EnhancedAudioEngine {
        if (!EnhancedAudioEngine.instance) {
            EnhancedAudioEngine.instance = new EnhancedAudioEngine();
        }
        return EnhancedAudioEngine.instance;
    }

    /**
     * Main speak function with queue management
     */
    async speak(text: string, config: Partial<AudioConfig> = {}): Promise<void> {
        if (!this.isSupported()) {
            console.warn('Speech synthesis not supported');
            return Promise.reject(new Error('Speech synthesis not supported'));
        }

        const fullConfig: AudioConfig = {
            language: config.language || 'en-IN',
            rate: config.rate || 0.85,
            pitch: config.pitch || 1,
            volume: config.volume || 1,
            priority: config.priority || 'normal'
        };

        const queuedAudio: QueuedAudio = {
            id: Date.now().toString() + Math.random(),
            text,
            config: fullConfig,
            priority: fullConfig.priority,
            timestamp: Date.now()
        };

        // Critical priority: stop current and play immediately
        if (fullConfig.priority === 'critical') {
            this.stopAll();
            this.queue = [queuedAudio];
            return this.processQueue();
        }

        // High priority: add to front of queue
        if (fullConfig.priority === 'high') {
            this.queue.unshift(queuedAudio);
        } else {
            this.queue.push(queuedAudio);
        }

        // Start processing if not already playing
        if (!this.isPlaying) {
            return this.processQueue();
        }

        return Promise.resolve();
    }

    /**
     * Process audio queue
     */
    private async processQueue(): Promise<void> {
        if (this.queue.length === 0) {
            this.isPlaying = false;
            return Promise.resolve();
        }

        const next = this.queue.shift();
        if (!next) return Promise.resolve();

        this.isPlaying = true;
        return this.playUtterance(next);
    }

    /**
     * Play a single utterance
     */
    private playUtterance(audio: QueuedAudio): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const utterance = new SpeechSynthesisUtterance(audio.text);
                utterance.lang = audio.config.language;
                utterance.rate = audio.config.rate;
                utterance.pitch = audio.config.pitch;
                utterance.volume = audio.config.volume;

                utterance.onend = () => {
                    this.notifyListeners('stopped');
                    this.currentUtterance = null;
                    this.processQueue(); // Process next in queue
                    resolve();
                };

                utterance.onerror = (event) => {
                    console.error('Speech error:', event);
                    this.notifyListeners('error');
                    this.currentUtterance = null;
                    this.isPlaying = false;
                    reject(event);
                };

                utterance.onstart = () => {
                    this.notifyListeners('playing');
                };

                utterance.onpause = () => {
                    this.notifyListeners('paused');
                };

                this.currentUtterance = utterance;
                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Failed to create utterance:', error);
                this.isPlaying = false;
                reject(error);
            }
        });
    }

    /**
     * Stop all audio immediately
     */
    stopAll(): void {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        this.queue = [];
        this.isPlaying = false;
        this.currentUtterance = null;
        this.notifyListeners('stopped');
    }

    /**
     * Pause current audio
     */
    pause(): void {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.pause();
        }
    }

    /**
     * Resume paused audio
     */
    resume(): void {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.resume();
        }
    }

    /**
     * Check if speech synthesis is supported
     */
    isSupported(): boolean {
        return 'speechSynthesis' in window;
    }

    /**
     * Get available voices for a language
     */
    getVoicesForLanguage(language: Language): SpeechSynthesisVoice[] {
        if (!this.isSupported()) return [];
        const voices = window.speechSynthesis.getVoices();
        return voices.filter(voice => voice.lang.startsWith(language.split('-')[0]));
    }

    /**
     * Subscribe to state changes
     */
    subscribe(id: string, callback: (state: 'playing' | 'paused' | 'stopped' | 'error') => void): void {
        this.listeners.set(id, callback);
    }

    /**
     * Unsubscribe from state changes
     */
    unsubscribe(id: string): void {
        this.listeners.delete(id);
    }

    /**
     * Notify all listeners of state change
     */
    private notifyListeners(state: 'playing' | 'paused' | 'stopped' | 'error'): void {
        this.listeners.forEach(callback => callback(state));
    }

    /**
     * Clear the queue without stopping current playback
     */
    clearQueue(): void {
        this.queue = [];
    }

    /**
     * Get queue length
     */
    getQueueLength(): number {
        return this.queue.length;
    }
}

// Export singleton instance
export const audioEngine = EnhancedAudioEngine.getInstance();

// Convenience functions
export const speakText = (text: string, config?: Partial<AudioConfig>) => audioEngine.speak(text, config);
export const stopSpeech = () => audioEngine.stopAll();
export const pauseSpeech = () => audioEngine.pause();
export const resumeSpeech = () => audioEngine.resume();
export const isSpeechSupported = () => audioEngine.isSupported();
