import { FarmIQNavbar } from '@/components/farmiq/FarmIQNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Droplets, Sprout, Bug } from 'lucide-react';
import { useState } from 'react';

export default function Automation() {
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
                            🤖 Smart Automation
                        </h1>
                        <p className="text-2xl text-muted-foreground">AI-powered farm management</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <Droplets className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Auto Irrigation</CardTitle>
                                <CardDescription>Smart water scheduling</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Sprout className="h-8 w-8 text-green-600 mb-2" />
                                <CardTitle>Fertilizer Alerts</CardTitle>
                                <CardDescription>Optimized nutrient application</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Bug className="h-8 w-8 text-red-600 mb-2" />
                                <CardTitle>Pest Control</CardTitle>
                                <CardDescription>Early warning system</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                        <CardContent className="p-8 text-center">
                            <Zap className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Premium Feature: Automation</h3>
                            <p className="text-muted-foreground">
                                Automate routine farm tasks with AI recommendations.
                                Full implementation coming soon!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
