import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, ArrowRight, TrendingUp } from 'lucide-react';

interface AdPlan {
    id: number;
    name: string;
    price: number;
    duration: string;
    image: string;
    features: string[];
    popular?: boolean;
}

export default function AdvertisementPlans() {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<AdPlan | null>(null);

    const plans: AdPlan[] = [
        {
            id: 1,
            name: 'Basic Plan',
            price: 200,
            duration: '5 seconds',
            image: '/ad-preview-1.png',
            features: [
                '5 second display duration',
                'Shown to all farmers',
                'Static image advertisement',
                'Basic placement'
            ]
        },
        {
            id: 2,
            name: 'Standard Plan',
            price: 500,
            duration: '10 seconds',
            image: '/ad-preview-2.png',
            features: [
                '10 second display duration',
                'Priority placement',
                'Shown to all farmers',
                'Higher visibility'
            ],
            popular: true
        },
        {
            id: 3,
            name: 'Premium Plan',
            price: 1000,
            duration: '15 seconds',
            image: '/ad-preview-3.png',
            features: [
                '15 second display duration',
                'Top priority placement',
                'Maximum visibility',
                'Featured advertisement'
            ]
        }
    ];

    const handleProceedToPayment = (plan: AdPlan) => {
        navigate('/advertisement/payment', { state: { plan } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Advertise in FarmIQ App</h1>
                    <p className="text-xl text-muted-foreground mb-2">
                        Reach thousands of farmers across India
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Choose the perfect plan for your business
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative transition-all hover:shadow-xl ${selectedPlan?.id === plan.id ? 'ring-4 ring-blue-500 scale-105' : ''
                                } ${plan.popular ? 'border-blue-500 border-2' : ''}`}
                            onClick={() => setSelectedPlan(plan)}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-blue-500 text-white px-4 py-1 text-sm">
                                        MOST POPULAR
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                                <div className="text-5xl font-bold text-blue-600 mb-2">
                                    ₹{plan.price}
                                </div>
                                <CardDescription className="flex items-center justify-center gap-2 text-lg">
                                    <Clock className="h-5 w-5" />
                                    {plan.duration}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {/* Features List */}
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPlan(plan);
                                    }}
                                    variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                                    className="w-full"
                                >
                                    {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Preview Section */}
                {selectedPlan && (
                    <Card className="border-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20 mb-8">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center">Advertisement Preview</CardTitle>
                            <CardDescription className="text-center text-lg">
                                See how your ad will appear to farmers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
                                    <img
                                        src={selectedPlan.image}
                                        alt={`${selectedPlan.name} preview`}
                                        className="w-full h-auto rounded-lg"
                                    />
                                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Display: {selectedPlan.duration}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            {selectedPlan.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Button
                                        onClick={() => handleProceedToPayment(selectedPlan)}
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-12 py-6 text-lg"
                                    >
                                        Proceed to Payment
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <p className="text-sm text-muted-foreground mt-4">
                                        You'll be able to upload your advertisement file on the next page
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Section */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                            <p className="text-muted-foreground">Active Farmers</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
                            <p className="text-muted-foreground">Monthly Views</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
                            <p className="text-muted-foreground">Happy Advertisers</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
