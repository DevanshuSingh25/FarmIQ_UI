import { FarmIQNavbar } from '@/components/farmiq/FarmIQNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, MapPin, Phone, Star } from 'lucide-react';
import { useState } from 'react';

export default function SoilLabs() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-background">
            <FarmIQNavbar
                theme={theme}
                language={language}
                onThemeToggle={toggleTheme}
                onLanguageChange={setLanguage}
            />

            <main className="pt-20 pb-4 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
                            🧪 Soil Lab Integration
                        </h1>
                        <p className="text-2xl text-muted-foreground">Professional soil testing services</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <FlaskConical className="h-8 w-8 text-orange-600 mb-2" />
                                <CardTitle>Lab Testing</CardTitle>
                                <CardDescription>N-P-K, pH, organic matter analysis</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Find Labs</CardTitle>
                                <CardDescription>Nearby certified soil testing labs</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Star className="h-8 w-8 text-yellow-600 mb-2" />
                                <CardTitle>Lab Reviews</CardTitle>
                                <CardDescription>Ratings and recommendations</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                        <CardContent className="p-8 text-center">
                            <FlaskConical className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Premium Feature: Soil Labs</h3>
                            <p className="text-muted-foreground">
                                Connect with professional soil testing labs and track your soil health.
                                Full implementation coming soon!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
