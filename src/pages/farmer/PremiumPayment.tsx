import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { premiumService } from '@/services/premiumService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, CheckCircle2, Loader2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FarmIQNavbar } from '@/components/farmiq/FarmIQNavbar';

export default function PremiumPayment() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const upiId = "farmiq@upi";
    const amount = "500";

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        toast({
            title: 'Copied!',
            description: 'UPI ID copied to clipboard',
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePaymentComplete = async () => {
        try {
            setLoading(true);

            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Activate premium
            const result = await premiumService.activate();

            toast({
                title: 'Payment Successful! 🎉',
                description: result.message,
            });

            // Redirect to dashboard
            setTimeout(() => {
                navigate('/farmer/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Payment activation failed:', error);
            toast({
                title: 'Activation Failed',
                description: 'Could not activate premium. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <FarmIQNavbar
                theme={theme}
                language={language}
                onThemeToggle={toggleTheme}
                onLanguageChange={setLanguage}
            />

            <main className="pt-20 pb-12 px-4">
                <div className="container mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full mb-4">
                            <Crown className="h-5 w-5" fill="currentColor" />
                            <span className="font-bold">PREMIUM PAYMENT</span>
                        </div>

                        <h1 className="text-4xl font-bold mb-3">Complete Your Payment</h1>
                        <p className="text-xl text-muted-foreground">
                            Scan QR or pay via UPI to activate premium
                        </p>
                    </div>

                    <Card className="mb-6 border-2 border-yellow-300 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
                            <CardTitle className="text-center text-2xl">
                                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-2">
                                    ₹500
                                </div>
                                <p className="text-sm text-muted-foreground">One-time payment for lifetime access</p>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-8">
                            {/* QR Code Placeholder */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-4 border-dashed border-gray-300 mb-6">
                                <div className="aspect-square max-w-[280px] mx-auto bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-2">📱</div>
                                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Scan with any UPI app</p>
                                        <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                                    </div>
                                </div>
                            </div>

                            {/* UPI ID */}
                            <div className="mb-8">
                                <p className="text-sm font-medium text-muted-foreground mb-2 text-center">Or pay manually using UPI ID:</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600">
                                        <code className="text-lg font-mono font-bold">{upiId}</code>
                                    </div>
                                    <Button
                                        onClick={handleCopyUPI}
                                        variant="outline"
                                        className="h-12 px-4"
                                    >
                                        {copied ? (
                                            <Check className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <Copy className="h-5 w-5" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    Amount: ₹{amount}
                                </p>
                            </div>

                            {/* Payment Steps */}
                            <div className="space-y-3 mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    Payment Steps:
                                </h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                    <li>Scan the QR code or use the UPI ID above</li>
                                    <li>Enter amount ₹500 in your UPI app</li>
                                    <li>Complete the payment</li>
                                    <li>Click "I Have Paid" button below</li>
                                </ol>
                            </div>

                            {/* Confirm Payment Button */}
                            <Button
                                onClick={handlePaymentComplete}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-6 rounded-full shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Verifying Payment...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 mr-2" />
                                        I Have Paid ₹500
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Premium will be activated instantly after verification
                            </p>
                        </CardContent>
                    </Card>

                    {/* Features Reminder */}
                    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-yellow-200">
                        <CardContent className="p-6">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <Crown className="h-5 w-5 text-yellow-600" fill="currentColor" />
                                What you'll get:
                            </h4>
                            <ul className="grid md:grid-cols-2 gap-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Advanced Analytics</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Smart Automation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>IoT Sensor Dashboard</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Soil Lab Integration</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Blockchain QR System</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">✓</span>
                                    <span>Crop History Analytics</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
