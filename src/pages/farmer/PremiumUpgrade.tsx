import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { premiumService } from '@/services/premiumService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Check, TrendingUp, Zap, Activity, FlaskConical, QrCode, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FarmIQNavbar } from '@/components/farmiq/FarmIQNavbar';

export default function PremiumUpgrade() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const handleActivatePremium = async () => {
        try {
            setLoading(true);
            const result = await premiumService.activate();

            toast({
                title: 'Premium Activated! 🎉',
                description: result.message,
            });

            // Redirect to dashboard after short delay
            setTimeout(() => {
                navigate('/farmer/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Premium activation failed:', error);
            toast({
                title: 'Activation Failed',
                description: 'Could not activate premium. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const premiumFeatures = [
        {
            icon: TrendingUp,
            title: 'Advanced Analytics',
            description: 'Get detailed insights into your farm performance, yield trends, and profit analysis with interactive charts and reports.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Zap,
            title: 'Smart Automation',
            description: 'Automate routine tasks and get AI-powered recommendations for irrigation, fertilization, and pest control.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Activity,
            title: 'IoT Sensor Dashboard',
            description: 'Real-time monitoring of soil moisture, temperature, and humidity from your farm sensors with alerts.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: FlaskConical,
            title: 'Soil Lab Integration',
            description: 'Direct access to professional soil testing labs, track results, and get personalized soil health recommendations.',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: QrCode,
            title: 'Blockchain QR System',
            description: 'Secure, tamper-proof QR code generation with blockchain verification for premium traceability.',
            color: 'from-yellow-500 to-amber-500'
        }
    ];

    const freeVsPremium = [
        { feature: 'Market Prices', free: true, premium: true },
        { feature: 'Government Schemes', free: true, premium: true },
        { feature: 'Weather Forecast', free: true, premium: true },
        { feature: 'Crop Disease Detection', free: true, premium: true },
        { feature: 'Expert Consultancy', free: true, premium: true },
        { feature: 'Basic QR Generation', free: true, premium: true },
        { feature: 'Advanced Analytics', free: false, premium: true },
        { feature: 'Smart Automation', free: false, premium: true },
        { feature: 'IoT Sensor Dashboard', free: false, premium: true },
        { feature: 'Soil Lab Integration', free: false, premium: true },
        { feature: 'Blockchain QR System', free: false, premium: true },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <FarmIQNavbar
                theme={theme}
                language={language}
                onThemeToggle={toggleTheme}
                onLanguageChange={setLanguage}
            />

            <main className="pt-20 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full mb-6">
                            <Crown className="h-5 w-5" fill="currentColor" />
                            <span className="font-bold">PREMIUM</span>
                        </div>

                        <h1 className="text-5xl font-bold mb-4">Upgrade to FarmIQ Premium</h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Unlock powerful features to grow your farm business faster
                        </p>

                        {/* Price Card */}
                        <Card className="inline-block border-4 border-yellow-400 shadow-2xl">
                            <CardContent className="p-8 text-center">
                                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-2">
                                    ₹500
                                </div>
                                <p className="text-lg text-muted-foreground mb-6">One-time payment</p>
                                <Button
                                    onClick={handleActivatePremium}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Activating...
                                        </>
                                    ) : (
                                        <>
                                            <Crown className="h-5 w-5 mr-2" fill="currentColor" />
                                            Activate Premium Now
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Feature Cards */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center mb-8">Premium Features</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {premiumFeatures.map((feature, idx) => (
                                <Card key={idx} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                                            <feature.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center mb-8">Free vs Premium</h2>
                        <Card>
                            <CardContent className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-4 font-bold">Feature</th>
                                                <th className="text-center p-4 font-bold">Free</th>
                                                <th className="text-center p-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
                                                    Premium
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {freeVsPremium.map((row, idx) => (
                                                <tr key={idx} className="border-b last:border-0 hover:bg-muted/50">
                                                    <td className="p-4">{row.feature}</td>
                                                    <td className="p-4 text-center">
                                                        {row.free ? (
                                                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                                                        ) : (
                                                            <Lock className="h-5 w-5 text-gray-400 mx-auto" />
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {row.premium ? (
                                                            <Check className="h-5 w-5 text-yellow-600 mx-auto" />
                                                        ) : (
                                                            <Lock className="h-5 w-5 text-gray-400 mx-auto" />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-yellow-200">
                            <CardContent className="p-8">
                                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="currentColor" />
                                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Farm?</h3>
                                <p className="text-muted-foreground mb-6">
                                    Join thousands of farmers already using FarmIQ Premium
                                </p>
                                <Button
                                    onClick={handleActivatePremium}
                                    disabled={loading}
                                    size="lg"
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-6 rounded-full shadow-lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Activating...
                                        </>
                                    ) : (
                                        <>
                                            <Crown className="h-5 w-5 mr-2" fill="currentColor" />
                                            Get Premium for ₹500
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
