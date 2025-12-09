import { FarmIQNavbar } from '@/components/farmiq/FarmIQNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Shield, Lock, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function BlockchainQR() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const handleOpenBlockchainQR = () => {
        window.open('https://index-myzi.onrender.com/', '_blank');
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
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
                            🔗 Blockchain QR System
                        </h1>
                        <p className="text-2xl text-muted-foreground">Secure, tamper-proof QR verification</p>
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <Shield className="h-8 w-8 text-green-600 mb-2" />
                                <CardTitle>Blockchain Security</CardTitle>
                                <CardDescription>Immutable product verification</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Lock className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Tamper-Proof</CardTitle>
                                <CardDescription>Cannot be duplicated or forged</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <QrCode className="h-8 w-8 text-purple-600 mb-2" />
                                <CardTitle>Smart Traceability</CardTitle>
                                <CardDescription>Full product journey tracking</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Main CTA Card */}
                    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
                        <CardContent className="p-12 text-center">
                            <div className="inline-flex p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
                                <QrCode className="h-12 w-12 text-white" />
                            </div>

                            <h3 className="text-3xl font-bold mb-4">Premium Blockchain QR System</h3>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Access our advanced blockchain-based QR code generation system.
                                Create secure, verifiable QR codes for your farm products with complete traceability.
                            </p>

                            <Button
                                onClick={handleOpenBlockchainQR}
                                size="lg"
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-6 rounded-full shadow-lg text-lg"
                            >
                                <ExternalLink className="h-5 w-5 mr-2" />
                                Open Blockchain QR System
                            </Button>

                            <p className="text-sm text-muted-foreground mt-4">
                                This will open in a new tab • Powered by blockchain technology
                            </p>
                        </CardContent>
                    </Card>

                    {/* Information Section */}
                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>What is Blockchain QR?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Each QR code is recorded on blockchain for permanent verification</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Customers can verify product authenticity instantly</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Complete supply chain transparency from farm to consumer</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Prevents counterfeiting and fraud</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Premium Feature Benefits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-1">⭐</span>
                                        <span>Build trust with verified product information</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-1">⭐</span>
                                        <span>Premium pricing for blockchain-verified products</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-1">⭐</span>
                                        <span>Export certification ready</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-1">⭐</span>
                                        <span>Enhanced brand reputation</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
