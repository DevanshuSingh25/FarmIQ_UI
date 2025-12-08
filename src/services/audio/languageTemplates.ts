/**
 * Language Templates for Audio Messages
 * Simple, farmer-friendly language for all supported languages
 */

import { Language } from './audioEngine';

export interface LanguageStrings {
    // Greetings
    greeting: {
        morning: string;
        afternoon: string;
        evening: string;
    };

    // Common phrases
    common: {
        farmer: string;
        today: string;
        temperature: string;
        degrees: string;
        rupees: string;
        perQuintal: string;
        high: string;
        low: string;
        medium: string;
        good: string;
        bad: string;
        urgent: string;
        normal: string;
    };

    // Actions
    actions: {
        water: string;
        dontWater: string;
        irrigate: string;
        apply: string;
        check: string;
        sell: string;
        wait: string;
        contact: string;
    };

    // Weather
    weather: {
        rainChance: string;
        humidity: string;
        wind: string;
        sunny: string;
        cloudy: string;
        rainy: string;
    };

    // Soil
    soil: {
        moisture: string;
        dry: string;
        wet: string;
        perfect: string;
        needsWater: string;
    };

    // Market
    market: {
        price: string;
        higher: string;
        lower: string;
        same: string;
        goodTime: string;
        waitForBetter: string;
    };

    // Fertilizer
    fertilizer: {
        nitrogen: string;
        phosphorus: string;
        potassium: string;
        apply: string;
        quantity: string;
    };

    // Errors
    errors: {
        noData: string;
        networkIssue: string;
        tryAgain: string;
        checkInternet: string;
    };
}

const englishStrings: LanguageStrings = {
    greeting: {
        morning: 'Good morning',
        afternoon: 'Good afternoon',
        evening: 'Good evening'
    },
    common: {
        farmer: 'farmer',
        today: 'Today',
        temperature: 'temperature',
        degrees: 'degrees',
        rupees: 'rupees',
        perQuintal: 'per quintal',
        high: 'high',
        low: 'low',
        medium: 'medium',
        good: 'good',
        bad: 'bad',
        urgent: 'urgent',
        normal: 'normal'
    },
    actions: {
        water: 'Please water your crops',
        dontWater: 'Do not water your crops today',
        irrigate: 'Irrigate your field',
        apply: 'Apply',
        check: 'Please check',
        sell: 'You can sell now',
        wait: 'Wait for better price',
        contact: 'Contact'
    },
    weather: {
        rainChance: 'chance of rain',
        humidity: 'humidity',
        wind: 'wind speed',
        sunny: 'sunny',
        cloudy: 'cloudy',
        rainy: 'rainy'
    },
    soil: {
        moisture: 'Soil moisture',
        dry: 'very dry',
        wet: 'too wet',
        perfect: 'perfect',
        needsWater: 'Your soil needs water'
    },
    market: {
        price: 'Market price',
        higher: 'higher than yesterday',
        lower: 'lower than yesterday',
        same: 'same as yesterday',
        goodTime: 'This is a good time to sell',
        waitForBetter: 'Wait for better prices'
    },
    fertilizer: {
        nitrogen: 'Nitrogen',
        phosphorus: 'Phosphorus',
        potassium: 'Potassium',
        apply: 'Apply fertilizer',
        quantity: 'quantity'
    },
    errors: {
        noData: 'Data is not available right now. Please try again later.',
        networkIssue: 'Internet connection is weak. Please check and try again.',
        tryAgain: 'Please try again in a few minutes.',
        checkInternet: 'Please check your internet connection.'
    }
};

const hindiStrings: LanguageStrings = {
    greeting: {
        morning: 'Namaste kisaan',
        afternoon: 'Namaste kisaan',
        evening: 'Namaste kisaan'
    },
    common: {
        farmer: 'kisaan',
        today: 'Aaj',
        temperature: 'tapman',
        degrees: 'degree',
        rupees: 'rupaye',
        perQuintal: 'pratee kwintal',
        high: 'jyada',
        low: 'kam',
        medium: 'madhyam',
        good: 'accha',
        bad: 'kharab',
        urgent: 'turant',
        normal: 'saamanya'
    },
    actions: {
        water: 'Kripa karke apne phasal ko paani dein',
        dontWater: 'Aaj phasal mein paani mat daalein',
        irrigate: 'Apne khet ko seenche',
        apply: 'Lagayein',
        check: 'Kripa karke check karein',
        sell: 'Aap ab bech sakte hain',
        wait: 'Behtar kimat ka intazaar karein',
        contact: 'Sampark karein'
    },
    weather: {
        rainChance: 'barish ki sambhavna',
        humidity: 'nami',
        wind: 'hawa ki gati',
        sunny: 'dhoop',
        cloudy: 'baadal',
        rainy: 'barish'
    },
    soil: {
        moisture: 'Mitti mein nami',
        dry: 'bahut sukhi',
        wet: 'bahut geeli',
        perfect: 'bilkul sahi',
        needsWater: 'Aapki mitti ko paani chahiye'
    },
    market: {
        price: 'Bazaar bhaav',
        higher: 'kal se jyada',
        lower: 'kal se kam',
        same: 'kal ke barabar',
        goodTime: 'Yeh bechne ka accha samay hai',
        waitForBetter: 'Behtar daam ka intazaar karein'
    },
    fertilizer: {
        nitrogen: 'Nitrogen',
        phosphorus: 'Phosphorus',
        potassium: 'Potassium',
        apply: 'Khad daalein',
        quantity: 'matra'
    },
    errors: {
        noData: 'Data abhi available nahi hai. Kripa karke baad mein try karein.',
        networkIssue: 'Internet kamzor hai. Check karke fir se try karein.',
        tryAgain: 'Kuch minute baad fir se try karein.',
        checkInternet: 'Apna internet connection check karein.'
    }
};

const punjabiStrings: LanguageStrings = {
    greeting: {
        morning: 'Sat sri akaal kisaan',
        afternoon: 'Sat sri akaal kisaan',
        evening: 'Sat sri akaal kisaan'
    },
    common: {
        farmer: 'kisaan',
        today: 'Aj',
        temperature: 'temperature',
        degrees: 'degree',
        rupees: 'rupaye',
        perQuintal: 'per quintal',
        high: 'jyada',
        low: 'ghat',
        medium: 'medium',
        good: 'changa',
        bad: 'mada',
        urgent: 'turant',
        normal: 'aam'
    },
    actions: {
        water: 'Apni fasal nu paani deo',
        dontWater: 'Aj fasal nu paani na pao',
        irrigate: 'Apne khet nu seencho',
        apply: 'Lagao',
        check: 'Check karo',
        sell: 'Tusi hun bech sakde ho',
        wait: 'Vadia kimat da wait karo',
        contact: 'Contact karo'
    },
    weather: {
        rainChance: 'barish di possibility',
        humidity: 'nami',
        wind: 'hawa di speed',
        sunny: 'dhoop',
        cloudy: 'badal',
        rainy: 'barish'
    },
    soil: {
        moisture: 'Mitti vich nami',
        dry: 'bahut sukhi',
        wet: 'bahut geeli',
        perfect: 'bilkul sahi',
        needsWater: 'Tuhadi mitti nu paani chahida hai'
    },
    market: {
        price: 'Market rate',
        higher: 'kal ton jyada',
        lower: 'kal ton ghat',
        same: 'kal de barabar',
        goodTime: 'Eh vechne da changa time hai',
        waitForBetter: 'Vadia rate da wait karo'
    },
    fertilizer: {
        nitrogen: 'Nitrogen',
        phosphorus: 'Phosphorus',
        potassium: 'Potassium',
        apply: 'Khad pao',
        quantity: 'matra'
    },
    errors: {
        noData: 'Data hun available nahi hai. Baad vich try karo.',
        networkIssue: 'Internet kamzor hai. Check karke firse try karo.',
        tryAgain: 'Kujh minute baad firse try karo.',
        checkInternet: 'Apna internet connection check karo.'
    }
};

const marathiStrings: LanguageStrings = {
    greeting: {
        morning: 'Namaskar shetkari',
        afternoon: 'Namaskar shetkari',
        evening: 'Namaskar shetkari'
    },
    common: {
        farmer: 'shetkari',
        today: 'Aaj',
        temperature: 'temperature',
        degrees: 'degree',
        rupees: 'rupaye',
        perQuintal: 'pratee kvintal',
        high: 'jast',
        low: 'kami',
        medium: 'madhyam',
        good: 'changle',
        bad: 'kharab',
        urgent: 'tatkaal',
        normal: 'samanya'
    },
    actions: {
        water: 'Kripa karoon pik la paani dya',
        dontWater: 'Aaj pik la paani deu naka',
        irrigate: 'Tumche shet sinchan kara',
        apply: 'Lavaa',
        check: 'Kripa check kara',
        sell: 'Tumhi aata vikoo shakta',
        wait: 'Changle muldyaची pratiksha kara',
        contact: 'Sampark saadha'
    },
    weather: {
        rainChance: 'paaus yanyaaची shakyta',
        humidity: 'aardrata',
        wind: 'varyaachaa veg',
        sunny: 'oodhaali',
        cloudy: 'dhmachhadalaana',
        rainy: 'paaus'
    },
    soil: {
        moisture: 'Maatit aardrataा',
        dry: 'khupa karodaa',
        wet: 'khupa olaa',
        perfect: 'ekdam barobर',
        needsWater: 'Tumchya maatila paani lagel'
    },
    market: {
        price: 'Bazaar bhaav',
        higher: 'kaalpekshaa jast',
        lower: 'kaalpekshaa kami',
        same: 'kaala saarkha',
        goodTime: 'Haa vikanyaachaa changle vel ahe',
        waitForBetter: 'Changle daama ची pratiksha kara'
    },
    fertilizer: {
        nitrogen: 'Nitrogen',
        phosphorus: 'Phosphorus',
        potassium: 'Potassium',
        apply: 'Khat ghaalaa',
        quantity: 'pramaaan'
    },
    errors: {
        noData: 'Data aata uplabdha naahi. Kripa nantar prayatna kara.',
        networkIssue: 'Internet kamzor ahe. Check karoon parat prayatna kara.',
        tryAgain: 'Kaahi minutaanantar parat prayatna kara.',
        checkInternet: 'Tumche internet connection check kara.'
    }
};

const languageMap: Record<Language, LanguageStrings> = {
    'en-IN': englishStrings,
    'hi-IN': hindiStrings,
    'pa-IN': punjabiStrings,
    'mr-IN': marathiStrings
};

/**
 * Get strings for a specific language
 */
export const getStrings = (lang: Language): LanguageStrings => {
    return languageMap[lang] || englishStrings;
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (lang: Language = 'en-IN'): string => {
    const hour = new Date().getHours();
    const strings = getStrings(lang);

    if (hour < 12) return strings.greeting.morning;
    if (hour < 17) return strings.greeting.afternoon;
    return strings.greeting.evening;
};
