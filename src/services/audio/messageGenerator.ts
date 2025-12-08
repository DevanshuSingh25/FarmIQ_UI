/**
 * Message Generator - Convert JSON data to spoken messages
 * Auto-generates contextual, actionable audio guidance for farmers
 */

import { Language } from './audioEngine';
import { getStrings, getGreeting } from './languageTemplates';

// ==================== DATA TYPES ====================

export interface WeatherData {
    temperature: number;
    rainProbability: number;
    humidity: number;
    windSpeed?: number;
    condition?: 'sunny' | 'cloudy' | 'rainy';
}

export interface SoilData {
    moisture: number; // 0-100 percentage
    ph?: number;
    temperature?: number;
    lastWatered?: Date;
}

export interface MarketData {
    crop: string;
    currentPrice: number;
    previousPrice?: number;
    trend?: 'up' | 'down' | 'stable';
    marketName?: string;
}

export interface FertilizerData {
    nitrogen: 'low' | 'medium' | 'high';
    phosphorus: 'low' | 'medium' | 'high';
    potassium: 'low' | 'medium' | 'high';
    recommendation?: string;
}

export interface CropHealthData {
    disease: string | null;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    treatment?: string;
}

export interface SensorData {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightLevel?: number;
}

// ==================== MESSAGE GENERATORS ====================

/**
 * Generate weather message with actionable advice
 */
export const generateWeatherMessage = (data: WeatherData, lang: Language = 'en-IN'): string => {
    const strings = getStrings(lang);
    const greeting = getGreeting(lang);

    let message = `${greeting} ${strings.common.farmer}. `;

    // Temperature
    message += `${strings.common.today} ${strings.common.temperature} ${data.temperature} ${strings.common.degrees}. `;

    // Rain probability and advice
    if (data.rainProbability > 70) {
        message += `${data.rainProbability}% ${strings.weather.rainChance}. ${strings.actions.dontWater}. `;
    } else if (data.rainProbability > 40) {
        message += `${data.rainProbability}% ${strings.weather.rainChance}. ${strings.actions.check}. `;
    } else {
        message += `${data.rainProbability}% ${strings.weather.rainChance}. ${strings.actions.water}. `;
    }

    // Humidity advice
    if (data.humidity > 80) {
        if (lang === 'en-IN') {
            message += 'Humidity is high. Watch for fungal diseases. ';
        } else if (lang === 'hi-IN') {
            message += 'Nami bahut jyada hai. Fungal bimari se savdhan rahein. ';
        }
    }

    return message.trim();
};

/**
 * Generate soil moisture message with urgency
 */
export const generateSoilMessage = (data: SoilData, lang: Language = 'en-IN'): string => {
    const strings = getStrings(lang);
    let message = '';

    // Determine moisture level
    if (data.moisture < 20) {
        message += `${strings.soil.moisture} ${strings.common.low}. ${strings.common.urgent}! `;
        message += `${strings.soil.needsWater}. `;

        if (lang === 'en-IN') {
            message += 'Please irrigate within 2 hours. ';
        } else if (lang === 'hi-IN') {
            message += '2 ghante ke andar seenchein. ';
        } else if (lang === 'pa-IN') {
            message += '2 ghante vich seencho. ';
        }
    } else if (data.moisture < 40) {
        message += `${strings.soil.moisture} ${strings.common.low}. `;

        if (lang === 'en-IN') {
            message += 'Irrigation needed today. ';
        } else if (lang === 'hi-IN') {
            message += 'Aaj seenchai jaruri hai. ';
        }
    } else if (data.moisture > 80) {
        message += `${strings.soil.moisture} ${strings.common.high}. ${strings.soil.wet}. `;
        message += `${strings.actions.dontWater}. `;
    } else {
        message += `${strings.soil.moisture} ${strings.common.good}. ${strings.soil.perfect}. `;
    }

    return message.trim();
};

/**
 * Generate market price message with sell/hold advice
 */
export const generateMarketMessage = (data: MarketData, lang: Language = 'en-IN'): string => {
    const strings = getStrings(lang);
    let message = '';

    message += `${strings.market.price} `;

    if (lang === 'en-IN') {
        message += `for ${data.crop} is `;
    } else if (lang === 'hi-IN') {
        message += `${data.crop} ke liye `;
    }

    message += `${strings.common.rupees} ${data.currentPrice} ${strings.common.perQuintal}. `;

    // Trend analysis
    if (data.previousPrice) {
        const difference = data.currentPrice - data.previousPrice;
        const percentChange = Math.abs((difference / data.previousPrice) * 100).toFixed(1);

        if (difference > 0) {
            message += `${strings.market.higher}. `;
            message += `${percentChange}% `;

            if (lang === 'en-IN') {
                message += 'increase. ';
            } else if (lang === 'hi-IN') {
                message += 'badha hai. ';
            }

            if (difference > data.previousPrice * 0.1) {
                message += `${strings.market.goodTime}. ${strings.actions.sell}. `;
            }
        } else if (difference < 0) {
            message += `${strings.market.lower}. `;

            if (lang === 'en-IN') {
                message += `${percentChange}% decrease. ${strings.actions.wait}. `;
            } else if (lang === 'hi-IN') {
                message += `${percentChange}% kam hua hai. ${strings.actions.wait}. `;
            }
        } else {
            message += `${strings.market.same}. `;
        }
    }

    if (data.marketName) {
        if (lang === 'en-IN') {
            message += `Best price at ${data.marketName} market. `;
        } else if (lang === 'hi-IN') {
            message += `${data.marketName} mandi mein sabse acchi kimat. `;
        }
    }

    return message.trim();
};

/**
 * Generate fertilizer message with application advice
 */
export const generateFertilizerMessage = (data: FertilizerData, lang: Language = 'en-IN'): string => {
    const strings = getStrings(lang);
    let message = '';

    const lowNutrients: string[] = [];

    if (data.nitrogen === 'low') lowNutrients.push(strings.fertilizer.nitrogen);
    if (data.phosphorus === 'low') lowNutrients.push(strings.fertilizer.phosphorus);
    if (data.potassium === 'low') lowNutrients.push(strings.fertilizer.potassium);

    if (lowNutrients.length > 0) {
        if (lang === 'en-IN') {
            message += `${lowNutrients.join(' and ')} level is low. `;
        } else if (lang === 'hi-IN') {
            message += `${lowNutrients.join(' aur ')} ki matra kam hai. `;
        }

        // Specific recommendations
        if (data.nitrogen === 'low') {
            if (lang === 'en-IN') {
                message += 'Apply Urea fertilizer. Use 50 kg per acre. ';
            } else if (lang === 'hi-IN') {
                message += 'Urea khad lagayein. 50 kg pratee acre. ';
            } else if (lang === 'pa-IN') {
                message += 'Urea khad lagao. 50 kg per acre. ';
            }
        }

        if (data.phosphorus === 'low') {
            if (lang === 'en-IN') {
                message += 'Apply DAP fertilizer. ';
            } else if (lang === 'hi-IN') {
                message += 'DAP khad lagayein. ';
            }
        }

        if (data.potassium === 'low') {
            if (lang === 'en-IN') {
                message += 'Apply Potash fertilizer. ';
            } else if (lang === 'hi-IN') {
                message += 'Potash khad lagayein. ';
            }
        }
    } else {
        if (lang === 'en-IN') {
            message += 'All nutrient levels are good. No fertilizer needed now. ';
        } else if (lang === 'hi-IN') {
            message += 'Sab nutrients sahi hain. Abhi khad ki jarurat nahi. ';
        } else if (lang === 'pa-IN') {
            message += 'Sare nutrients theek hain. Hun khad di lod nahi. ';
        }
    }

    if (data.recommendation) {
        message += data.recommendation + ' ';
    }

    return message.trim();
};

/**
 * Generate crop health message with treatment steps
 */
export const generateCropHealthMessage = (data: CropHealthData, lang: Language = 'en-IN'): string => {
    const strings = getStrings(lang);
    let message = '';

    if (!data.disease) {
        if (lang === 'en-IN') {
            message += `Your crop is healthy. No disease detected. Keep monitoring regularly. `;
        } else if (lang === 'hi-IN') {
            message += `Aapki phasal swasth hai. Koi bimari nahi mili. Niyamit jaanch karte rahein. `;
        } else if (lang === 'pa-IN') {
            message += `Tuhadi fasal tandurust hai. Koi bimari nahi mili. Regular check karde raho. `;
        }
        return message.trim();
    }

    // Disease detected
    const confidencePercent = Math.round(data.confidence * 100);

    if (lang === 'en-IN') {
        message += `Disease detected: ${data.disease}. `;
        message += `Confidence ${confidencePercent} percent. `;

        if (data.severity === 'high') {
            message += 'Severity is high. Urgent action needed. ';
        } else if (data.severity === 'medium') {
            message += 'Severity is medium. Take action soon. ';
        } else {
            message += 'Severity is low. Monitor closely. ';
        }
    } else if (lang === 'hi-IN') {
        message += `Bimari payi gayi: ${data.disease}. `;
        message += `${confidencePercent} percent vishwas. `;

        if (data.severity === 'high') {
            message += 'Gambhir sthiti. Turant karvai karein. ';
        } else if (data.severity === 'medium') {
            message += 'Madhyam sthiti. Jaldi karvai karein. `;
        } else {
            message += 'Halki sthiti. Dhyan se dekhein. ';
        }
    }

    if (data.treatment) {
        if (lang === 'en-IN') {
            message += `Treatment: ${data.treatment}. `;
        } else if (lang === 'hi-IN') {
            message += `Ilaaj: ${data.treatment}. `;
        }
    }

    if (lang === 'en-IN') {
        message += 'Contact agricultural expert for detailed guidance. ';
    } else if (lang === 'hi-IN') {
        message += 'Krishi visheshagya se sampark karein vistar se jankari ke liye. ';
    }

    return message.trim();
};

/**
 * Generate sensor data message
 */
export const generateSensorMessage = (data: SensorData, lang: Language = 'en-IN'): string => {
    const strings = getStrings(lang);
    let message = '';

    if (lang === 'en-IN') {
        message += 'Current sensor readings. ';
        message += `Temperature ${data.temperature} degrees. `;
        message += `Humidity ${data.humidity} percent. `;
        message += `Soil moisture ${data.soilMoisture} percent. `;
    } else if (lang === 'hi-IN') {
        message += 'Abhi ke sensor readings. ';
        message += `Tapman ${data.temperature} degree. `;
        message += `Nami ${data.humidity} percent. `;
        message += `Mitti mein nami ${data.soilMoisture} percent. `;
    } else if (lang === 'pa-IN') {
        message += 'Haale de sensor readings. ';
        message += `Temperature ${data.temperature} degree. `;
        message += `Nami ${data.humidity} percent. `;
        message += `Mitti vich nami ${data.soilMoisture} percent. `;
    }

    // Smart alerts
    if (data.temperature > 35) {
        if (lang === 'en-IN') {
            message += 'Temperature is very high. Ensure adequate watering. ';
        } else if (lang === 'hi-IN') {
            message += 'Tapman bahut jyada hai. Paani ki vyavastha karein. ';
        }
    }

    if (data.soilMoisture < 30) {
        message += generateSoilMessage({ moisture: data.soilMoisture }, lang);
    }

    return message.trim();
};

/**
 * Generate error message
 */
export const generateErrorMessage = (errorType: 'noData' | 'network' | 'generic', lang: Language = 'en-IN'): string => {
    const strings = getStrings(lang);

    switch (errorType) {
        case 'noData':
            return strings.errors.noData;
        case 'network':
            return strings.errors.networkIssue;
        default:
            return strings.errors.tryAgain;
    }
};

/**
 * Generic message generator - auto-detects data type
 */
export const generateMessage = (data: any, type: string, lang: Language = 'en-IN'): string => {
    try {
        switch (type.toLowerCase()) {
            case 'weather':
                return generateWeatherMessage(data, lang);
            case 'soil':
                return generateSoilMessage(data, lang);
            case 'market':
                return generateMarketMessage(data, lang);
            case 'fertilizer':
                return generateFertilizerMessage(data, lang);
            case 'crophealth':
            case 'disease':
                return generateCropHealthMessage(data, lang);
            case 'sensor':
            case 'iot':
                return generateSensorMessage(data, lang);
            default:
                return generateErrorMessage('noData', lang);
        }
    } catch (error) {
        console.error('Message generation error:', error);
        return generateErrorMessage('generic', lang);
    }
};
