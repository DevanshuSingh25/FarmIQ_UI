import { FarmIQNavbar } from '@/components/farmiq/FarmIQNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, LineChart, PieChart } from 'lucide-react';
import { useState } from 'react';

export default function Analytics() {
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
                            📊 Analytics Dashboard
                        </h1>
                        <p className="text-2xl text-muted-foreground">Advanced insights for your farm</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                                <CardTitle>Yield Trends</CardTitle>
                                <CardDescription>Track your production over time</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Revenue Analysis</CardTitle>
                                <CardDescription>Monitor income and expenses</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <LineChart className="h-8 w-8 text-purple-600 mb-2" />
                                <CardTitle>Market Insights</CardTitle>
                                <CardDescription>Price predictions and trends</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
                        <CardContent className="p-8 text-center">
                            <PieChart className="h-16 w-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Premium Feature: Analytics</h3>
                            <p className="text-muted-foreground">
                                This feature provides detailed insights and analysis of your farm data.
                                Full implementation coming soon!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
