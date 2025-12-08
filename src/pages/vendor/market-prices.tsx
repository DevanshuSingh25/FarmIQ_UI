import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { useToast } from "@/hooks/use-toast";
import { Menu, Globe, Moon, User, Leaf, LogOut, Info, UserCircle, LayoutDashboard, Search as SearchIcon, BarChart3, ChevronRight, QrCode, Loader2 } from "lucide-react";
import { marketPricesService, MarketPrice, MarketPriceFilters } from "@/services/marketPricesService";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export default function VendorMarketPrices() {
    const [prices, setPrices] = useState<MarketPrice[]>([]);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
    const languages = ['English', 'Hindi', 'Punjabi'] as const;

    const [filters, setFilters] = useState<MarketPriceFilters>({
        crop: "",
        state: "",
        district: "all"
    });
    const [currentStep, setCurrentStep] = useState(1); // 1: Select crop, 2: Select state, 3: View prices
    const { toast } = useToast();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    // Common crops with emojis
    const crops = [
        { name: "Rice", emoji: "🍚", value: "rice" },
        { name: "Wheat", emoji: "🌾", value: "wheat" },
        { name: "Onion", emoji: "🧅", value: "onion" },
        { name: "Tomato", emoji: "🍅", value: "tomato" },
        { name: "Potato", emoji: "🥔", value: "potato" },
        { name: "Corn", emoji: "🌽", value: "corn" },
        { name: "Cotton", emoji: "☁️", value: "cotton" },
        { name: "Soybean", emoji: "🫘", value: "soybean" },
    ];

    // Indian states
    const states = [
        { name: "Punjab", emoji: "🗺️", value: "punjab" },
        { name: "Haryana", emoji: "🗺️", value: "haryana" },
        { name: "Uttar Pradesh", emoji: "🗺️", value: "uttar pradesh" },
        { name: "Maharashtra", emoji: "🗺️", value: "maharashtra" },
        { name: "Karnataka", emoji: "🗺️", value: "karnataka" },
        { name: "Tamil Nadu", emoji: "🗺️", value: "tamil nadu" },
        { name: "Gujarat", emoji: "🗺️", value: "gujarat" },
        { name: "Rajasthan", emoji: "🗺️", value: "rajasthan" },
    ];

    const fetchPrices = useCallback(async (currentFilters: MarketPriceFilters) => {
        setLoading(true);
        try {
            const response = await marketPricesService.getPrices(
                currentFilters,
                1,
                50,
                "commodity:asc"
            );
            setPrices(response.data);
        } catch (err) {
            console.error("Error fetching prices:", err);
            toast({
                title: "Error",
                description: "Unable to fetch prices. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleCropSelect = (cropValue: string) => {
        setFilters(prev => ({ ...prev, crop: cropValue }));
        setCurrentStep(2);
    };

    const handleStateSelect = (stateValue: string) => {
        const newFilters = { ...filters, state: stateValue, district: "all" };
        setFilters(newFilters);
        setCurrentStep(3);
        fetchPrices(newFilters);
    };

    const resetSelection = () => {
        setFilters({ crop: "", state: "", district: "all" });
        setPrices([]);
        setCurrentStep(1);
    };

    // Format price to Indian currency
    const formatPrice = (price: number | null) => {
        if (!price) return "N/A";
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
            {/* Vendor Dashboard Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                                        <Menu className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[340px] p-6 bg-[#F8F9FA]">
                                    <SheetHeader className="mb-8 flex flex-row items-center justify-between space-y-0">
                                        <SheetTitle className="text-xl font-bold text-gray-900">Navigation</SheetTitle>
                                    </SheetHeader>
                                    <div className="space-y-3">
                                        <Link to="/vendor/dashboard" className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 hover:bg-green-50 hover:text-green-900 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100">
                                            <div className="flex items-center gap-3">
                                                <LayoutDashboard className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                                                <span className="font-medium text-sm">Dashboard</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-700 transition-colors" />
                                        </Link>

                                        <Link to="/vendor/qr-scan" className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 hover:bg-green-50 hover:text-green-900 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100">
                                            <div className="flex items-center gap-3">
                                                <QrCode className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                                                <span className="font-medium text-sm">QR Scan</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-700 transition-colors" />
                                        </Link>

                                        <Link to="/vendor/market-prices" className="flex items-center justify-between px-4 py-3 bg-[#FFD700] text-[#5c4d00] rounded-full shadow-sm transition-all group">
                                            <div className="flex items-center gap-3">
                                                <BarChart3 className="h-5 w-5 stroke-[2.5]" />
                                                <span className="font-medium text-sm">Market Price</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-[#5c4d00]/80" />
                                        </Link>

                                        <Link to="/vendor/farmer-search" className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 hover:bg-green-50 hover:text-green-900 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100">
                                            <div className="flex items-center gap-3">
                                                <SearchIcon className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                                                <span className="font-medium text-sm">Farmer Search</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-700 transition-colors" />
                                        </Link>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <div className="flex items-center gap-2">
                                <Leaf className="h-6 w-6 text-green-600" fill="currentColor" />
                                <span className="text-xl font-bold text-green-600 tracking-tight">FarmIQ</span>
                                <span className="text-gray-400 text-lg font-light">|</span>
                                <span className="text-gray-500 text-sm font-medium">Vendor dashboard</span>
                            </div>
                        </div>

                        {/* Center Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/vendor/dashboard" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/vendor/qr-scan" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                                QR Scan
                            </Link>
                            <Link to="/vendor/market-prices" className="text-gray-900 font-medium border-b-2 border-green-500 px-1 py-5">
                                Market Prices
                            </Link>
                            <Link to="/vendor/farmer-search" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                                Farmer Search
                            </Link>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                        <Globe className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                                    {languages.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className="cursor-pointer hover:bg-gray-50"
                                        >
                                            {lang}
                                            {language === lang && <span className="ml-2 text-green-600">✓</span>}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                onClick={toggleTheme}
                            >
                                <Moon className="h-5 w-5" />
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                        <User className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => navigate('/profile')}
                                    >
                                        <UserCircle className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => navigate('/farmer/teaching')}
                                    >
                                        <Info className="mr-2 h-4 w-4" />
                                        <span>Know about the website</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                        onClick={() => {
                                            logout();
                                            navigate('/login');
                                        }}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto max-w-7xl p-4 pt-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">💰 Today's Prices</h1>
                    <SectionSpeaker
                        getText={() => "Market Prices. Check today's crop prices in your state. Select your crop and location to see current rates"}
                        sectionId="market-prices-header"
                        ariaLabel="Listen to instructions"
                        alwaysVisible
                    />
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-12 gap-8">
                    <div className={`text-center ${currentStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 ${currentStep === 1 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
                            🌱
                        </div>
                        <p className="text-lg font-semibold">Crop</p>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    </div>
                    <div className={`text-center ${currentStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 ${currentStep === 2 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
                            📍
                        </div>
                        <p className="text-lg font-semibold">Location</p>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                    </div>
                    <div className={`text-center ${currentStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 ${currentStep === 3 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
                            💵
                        </div>
                        <p className="text-lg font-semibold">Prices</p>
                    </div>
                </div>

                {/* Step 1: Select Crop */}
                {currentStep === 1 && (
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">What do you want to sell?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {crops.map((crop) => (
                                <Card
                                    key={crop.value}
                                    onClick={() => handleCropSelect(crop.value)}
                                    className="cursor-pointer hover:scale-105 active:scale-95 transition-all touch-target-large border-[3px] hover:border-primary"
                                >
                                    <CardContent className="p-10 text-center">
                                        <div className="text-7xl mb-4">{crop.emoji}</div>
                                        <p className="text-2xl font-bold">{crop.name}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Select State */}
                {currentStep === 2 && (
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-8 text-center">
                            <p className="text-xl text-muted-foreground mb-2">Selected Crop:</p>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-6xl">{crops.find(c => c.value === filters.crop)?.emoji}</span>
                                <p className="text-3xl font-bold">{crops.find(c => c.value === filters.crop)?.name}</p>
                            </div>
                            <Button variant="ghost" onClick={() => setCurrentStep(1)} className="mt-4">
                                ↩️ Change Crop
                            </Button>
                        </div>

                        <h2 className="text-3xl font-bold text-center mb-8">Where are you located?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {states.map((state) => (
                                <Card
                                    key={state.value}
                                    onClick={() => handleStateSelect(state.value)}
                                    className="cursor-pointer hover:scale-105 active:scale-95 transition-all touch-target-large border-[3px] hover:border-primary"
                                >
                                    <CardContent className="p-10 text-center">
                                        <div className="text-7xl mb-4">{state.emoji}</div>
                                        <p className="text-xl font-bold">{state.name}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Show Prices */}
                {currentStep === 3 && (
                    <div className="max-w-5xl mx-auto">
                        {/* Selected filters display */}
                        <div className="mb-8 bg-muted p-6 rounded-lg">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Crop</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl">{crops.find(c => c.value === filters.crop)?.emoji}</span>
                                            <p className="text-xl font-bold">{crops.find(c => c.value === filters.crop)?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-3xl">→</div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Location</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl">📍</span>
                                            <p className="text-xl font-bold">{states.find(s => s.value === filters.state)?.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={resetSelection} variant="outline" size="lg">
                                    🔄 Start Over
                                </Button>
                            </div>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="text-center py-20">
                                <Loader2 className="h-16 w-16 mx-auto animate-spin mb-4 text-primary" />
                                <p className="text-2xl font-semibold">Finding prices...</p>
                            </div>
                        )}

                        {/* Prices display */}
                        {!loading && prices.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold mb-6">Today's Market Rates</h2>
                                {prices.slice(0, 10).map((price, index) => (
                                    <Card key={index} className="border-[3px] hover:shadow-lg transition-shadow">
                                        <CardContent className="p-8">
                                            <div className="grid md:grid-cols-3 gap-6">
                                                {/* Market info */}
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Market</p>
                                                    <p className="text-xl font-bold">{price.market}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        📍 {price.district}, {price.state}
                                                    </p>
                                                </div>

                                                {/* Price display */}
                                                <div className="md:col-span-2">
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="text-center bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border-2 border-green-500">
                                                            <p className="text-sm text-muted-foreground mb-1">Min Price</p>
                                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(price.min_price)}</p>
                                                        </div>
                                                        <div className="text-center bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border-2 border-blue-500">
                                                            <p className="text-sm text-muted-foreground mb-1">Modal Price</p>
                                                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(price.modal_price)}</p>
                                                        </div>
                                                        <div className="text-center bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border-2 border-orange-500">
                                                            <p className="text-sm text-muted-foreground mb-1">Max Price</p>
                                                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatPrice(price.max_price)}</p>
                                                        </div>
                                                    </div>
                                                    {price.variety && (
                                                        <p className="text-sm text-muted-foreground mt-3">
                                                            Variety: {price.variety}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {prices.length > 10 && (
                                    <p className="text-center text-lg text-muted-foreground py-4">
                                        Showing top 10 of {prices.length} results
                                    </p>
                                )}
                            </div>
                        )}

                        {/* No results */}
                        {!loading && prices.length === 0 && (
                            <Card className="border-[3px]">
                                <CardContent className="p-12 text-center">
                                    <div className="text-8xl mb-6">📊</div>
                                    <h3 className="text-2xl font-bold mb-4">No prices found</h3>
                                    <p className="text-lg text-muted-foreground mb-6">
                                        No price data available for this crop in your selected location today
                                    </p>
                                    <Button onClick={resetSelection} size="lg">
                                        Try Different Selection
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
