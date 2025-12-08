import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SectionSpeaker } from '@/components/ui/section-speaker';
import { FarmIQNavbar } from '@/components/farmiq/FarmIQNavbar';
import { Wifi, WifiOff, MapPin, Loader2, Search, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  DailyForecast,
  HourlyForecast,
  WeeklyAdvice as WeeklyAdviceType,
  WeatherAlert,
  WeatherFilters,
  NotificationSettings as NotificationSettingsType
} from '@/types/weather';

const OPENWEATHER_API_KEY = '2191c6793168af5d4899a607a940e6d9';

const PUNJAB_CITIES = [
  'Amritsar', 'Ludhiana', 'Patiala', 'Jalandhar', 'Bathinda',
  'Mohali', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga',
  'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar',
  'Barnala', 'Rajpura', 'Firozpur', 'Kapurthala', 'Zirakpur'
] as const;

const capitalize = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

// Map weather conditions to Emojis
const mapWeatherEmoji = (main?: string): string => {
  const key = (main || '').toLowerCase();
  if (key === 'clear') return '☀️';
  if (key === 'thunderstorm' || key === 'tornado') return '⛈️';
  if (key === 'drizzle' || key === 'rain') return '🌧️';
  if (key === 'snow') return '❄️';
  if (['mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash'].includes(key)) return '🌫️';
  if (key === 'squall') return '💨';
  if (key === 'clouds') return '☁️';
  return '⛅';
};

const degToCompass = (deg?: number): string => {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

const buildAlerts = (forecasts: DailyForecast[]): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];

  const heavyRainDays = forecasts.filter(day => day.precipChance >= 80);
  if (heavyRainDays.length) {
    alerts.push({
      code: 'heavy_rain',
      from: heavyRainDays[0].date,
      to: heavyRainDays[heavyRainDays.length - 1].date,
      severity: 'warning',
      message: '⚠️ Heavy Rain Alert: Prepare drainage!'
    });
  }

  const heatDays = forecasts.filter(day => day.tempMaxC >= 38);
  if (heatDays.length) {
    alerts.push({
      code: 'heat_wave',
      from: heatDays[0].date,
      to: heatDays[heatDays.length - 1].date,
      severity: 'danger',
      message: '🔥 Heat Wave: Irrigate crops!'
    });
  }

  return alerts;
};

type FetchWeatherOptions = {
  city?: string;
  coords?: { lat: number; lon: number };
  label?: string;
};

const Weather = () => {
  const { toast } = useToast();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

  const [filters, setFilters] = useState<WeatherFilters>({
    location: null,
    units: { temperature: 'C', wind: 'kph' }
  });

  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedCity, setSelectedCity] = useState('');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchWeatherData = async (options: FetchWeatherOptions = {}) => {
    const baseCity = options.city || selectedCity || filters.location?.district;

    if (!baseCity && !options.coords) {
      toast({ title: "Select a city", description: "Please choose a location first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      if (options.coords) {
        endpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${options.coords.lat}&lon=${options.coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      } else {
        endpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(baseCity || '')},IN&appid=${OPENWEATHER_API_KEY}&units=metric`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.cod !== '200') throw new Error('Could not fetch weather data');

      // Process daily data
      const dailyMap = new Map<string, any>();
      data.list.forEach((item: any) => {
        const dateKey = item.dt_txt.split(' ')[0];
        if (!dailyMap.has(dateKey)) dailyMap.set(dateKey, item);
      });

      const dailyData: DailyForecast[] = Array.from(dailyMap.entries()).slice(0, 5).map(([date, item]) => ({
        date,
        summary: capitalize(item.weather?.[0]?.description),
        icon: item.weather?.[0]?.main.toLowerCase(), // kept for internal type, but we use mapWeatherEmoji
        tempMinC: Math.round(item.main?.temp_min),
        tempMaxC: Math.round(item.main?.temp_max),
        precipChance: Math.round((item.pop || 0) * 100),
        windKph: Math.round((item.wind?.speed || 0) * 3.6),
        windDir: '',
        humidityPct: item.main?.humidity,
        confidence: 'High',
        alerts: []
      }));

      setDailyForecast(dailyData);
      setWeatherAlerts(buildAlerts(dailyData));

      if (options.label) setSelectedCity(options.label);
      if (options.coords && !options.label) setSelectedCity('Current Location');

    } catch (error) {
      toast({ title: "Error", description: "Failed to load weather data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const location = { lat: 0, lon: 0, name: `${city}, Punjab`, state: 'Punjab', district: city };
    setFilters(prev => ({ ...prev, location }));
    fetchWeatherData({ city, label: city });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const location = { lat: latitude, lon: longitude, name: 'Current Location', state: '', district: '' };
        setFilters(prev => ({ ...prev, location }));
        fetchWeatherData({ coords: { lat: latitude, lon: longitude }, label: 'Current Location' });
      },
      err => {
        setLoading(false);
        toast({ title: "Error", description: "Could not access location", variant: "destructive" });
      }
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate()
    };
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <FarmIQNavbar
        theme={theme}
        language={language}
        onThemeToggle={toggleTheme}
        onLanguageChange={setLanguage}
      />

      <div className="container mx-auto max-w-6xl px-4 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              ⛈️ Weather & Advice
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Check weather and get farming tips
            </p>
          </div>
          <SectionSpeaker
            getText={() => "Weather Page. Use the large buttons to check weather for your location or select a city."}
            sectionId="weather-header"
            ariaLabel="Listen"
            alwaysVisible
          />
        </div>

        {/* Location Selector Section */}
        <Card className="mb-10 border-[3px] border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <Button
                onClick={handleCurrentLocation}
                className="h-24 text-2xl font-bold rounded-2xl shadow-md hover:scale-105 transition-transform flex flex-col gap-2"
                variant="default"
              >
                <Navigation className="h-8 w-8" />
                📍 Use My Location
              </Button>

              <div className="space-y-3">
                <label className="text-xl font-semibold text-muted-foreground block text-center">
                  Or select a city manually
                </label>
                <Select value={selectedCity} onValueChange={handleCitySelect}>
                  <SelectTrigger className="h-20 text-2xl border-2 rounded-xl">
                    <SelectValue placeholder="🏙️ Choose City" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {PUNJAB_CITIES.map(city => (
                      <SelectItem key={city} value={city} className="text-xl py-3">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="h-20 w-20 animate-spin text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-muted-foreground">Fetching Weather... 📡</h2>
          </div>
        )}

        {/* Weather Content */}
        {!loading && dailyForecast.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Alerts Container */}
            {weatherAlerts.length > 0 && (
              <div className="mb-8 space-y-4">
                {weatherAlerts.map((alert, idx) => (
                  <Alert key={idx} variant={alert.severity === 'danger' ? 'destructive' : 'default'} className="border-2">
                    <AlertDescription className="text-xl font-bold flex items-center gap-3">
                      {alert.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Current Weather (First Day) */}
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <Card className="md:col-span-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-xl transform hover:scale-105 transition-transform">
                <CardContent className="p-8 text-center flex flex-col justify-center h-full">
                  <h3 className="text-3xl font-bold opacity-90 mb-2">Today</h3>
                  <div className="text-9xl mb-4 drop-shadow-md">
                    {mapWeatherEmoji(dailyForecast[0].summary)}
                  </div>
                  <div className="text-7xl font-bold mb-2">
                    {dailyForecast[0].tempMaxC}°
                  </div>
                  <p className="text-2xl font-medium opacity-90">{dailyForecast[0].summary}</p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-[3px]">
                <CardHeader>
                  <CardTitle className="text-2xl">🌱 Farming Advice for Today</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">💧</span>
                      <h4 className="text-xl font-bold">Rain Chance</h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {dailyForecast[0].precipChance}%
                    </p>
                    <p className="text-muted-foreground mt-2 text-lg">
                      {dailyForecast[0].precipChance > 50 ? "Don't water crops" : "Water if soil is dry"}
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">💨</span>
                      <h4 className="text-xl font-bold">Wind Speed</h4>
                    </div>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                      {dailyForecast[0].windKph} <span className="text-xl">km/h</span>
                    </p>
                    <p className="text-muted-foreground mt-2 text-lg">
                      {dailyForecast[0].windKph > 20 ? "Avoid spraying" : "Safe to spray"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 5 Day Forecast */}
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              📅 Next 4 Days
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dailyForecast.slice(1).map((day, idx) => {
                const { day: dayName, date } = formatDate(day.date);
                return (
                  <Card key={idx} className="border-2 hover:border-primary cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6 text-center">
                      <p className="text-xl font-bold text-muted-foreground mb-1">{dayName} {date}</p>
                      <div className="text-6xl my-4">
                        {mapWeatherEmoji(day.summary)}
                      </div>
                      <div className="flex justify-center gap-3 items-baseline">
                        <span className="text-3xl font-bold">{day.tempMaxC}°</span>
                        <span className="text-xl text-muted-foreground">{day.tempMinC}°</span>
                      </div>
                      <p className="text-lg font-medium mt-2 text-blue-600">
                        💧 {day.precipChance}%
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && dailyForecast.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <div className="text-9xl mb-4">🌍</div>
            <h2 className="text-3xl font-bold">Select a location to see weather</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;