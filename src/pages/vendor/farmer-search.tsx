import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    Menu,
    Globe,
    Moon,
    User,
    Leaf,
    Search,
    MapPin,
    Box,
    Phone,
    UserCircle,
    Info,
    LogOut,
    LayoutDashboard,
    BarChart3,
    ChevronRight,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Farmer {
    id: number;
    full_name: string;
    crops_grown: string | null;
    available_quantity: number | null;
    location: string | null;
    expected_price: string | null;
}

export default function VendorFarmerSearch() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState(true);

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
    const languages = ['English', 'Hindi', 'Punjabi'] as const;

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    // Fetch farmers from API
    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/profiles', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setFarmers(data);
                } else {
                    console.error('Failed to fetch farmers');
                }
            } catch (error) {
                console.error('Error fetching farmers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFarmers();
    }, []);

    const filteredFarmers = farmers.filter(farmer =>
        farmer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (farmer.location && farmer.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (farmer.crops_grown && farmer.crops_grown.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
            {/* Top Navigation Bar */}
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

                                        <Link to="/vendor/farmer-search" className="flex items-center justify-between px-4 py-3 bg-[#e0f2f1] text-[#004d40] rounded-full shadow-sm transition-all group border border-transparent">
                                            <div className="flex items-center gap-3">
                                                <Search className="h-5 w-5 stroke-[2.5]" />
                                                <span className="font-medium text-sm">Farmer Search</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-[#004d40]/80" />
                                        </Link>

                                        <Link to="/vendor/market-prices" className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 hover:bg-green-50 hover:text-green-900 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100">
                                            <div className="flex items-center gap-3">
                                                <BarChart3 className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                                                <span className="font-medium text-sm">Market Price</span>
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
                            <Link to="/vendor/market-prices" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                                Market Prices
                            </Link>
                            <Link to="/vendor/farmer-search" className="text-gray-900 font-medium border-b-2 border-green-500 px-1 py-5">
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

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Find Farmers</h1>
                    <p className="text-xl text-muted-foreground">Connect directly with local producers</p>
                </div>

                {/* Search Bar - Huge Visual Style */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-[3px] border-green-500 p-6 relative z-20">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl">
                                🔍
                            </div>
                            <input
                                type="text"
                                placeholder="Search by Name, Crop, or Location..."
                                className="w-full pl-20 pr-6 py-6 text-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-3">
                            <span>🚀</span> Search
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center gap-2 text-lg text-muted-foreground ml-2">
                    {loading ? (
                        <span className="flex items-center gap-2">⏳ Loading farmers...</span>
                    ) : (
                        <span>
                            🎯 Found <span className="font-bold text-gray-900 dark:text-gray-100">{filteredFarmers.length}</span> farmers
                            {searchQuery && ` matching "${searchQuery}"`}
                        </span>
                    )}
                </div>

                {/* Farmer Cards - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-50">
                            <div className="text-6xl mb-4 animate-bounce">🚜</div>
                            <h3 className="text-2xl font-bold">Fetching farmers nearby...</h3>
                        </div>
                    ) : filteredFarmers.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="text-6xl mb-6 opacity-30">🌾</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Farmers Found</h3>
                            <p className="text-muted-foreground text-lg">Try searching for a different crop or location</p>
                        </div>
                    ) : (
                        filteredFarmers.map((farmer) => (
                            <div key={farmer.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl border-2 border-transparent hover:border-green-500 transition-all group overflow-hidden flex flex-col">

                                {/* Header */}
                                <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10 border-b border-green-100 dark:border-green-800/50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-white dark:bg-green-800 rounded-full flex items-center justify-center text-4xl shadow-sm border-2 border-green-200 dark:border-green-700">
                                                👨‍🌾
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                                                    {farmer.full_name || 'Farmer'}
                                                </h3>
                                                <div className="flex items-center gap-1 text-green-700 dark:text-green-400 text-sm font-medium mt-1">
                                                    <span>📍</span> {farmer.location || 'Unknown Location'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 space-y-4 flex-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/50">
                                            <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold mb-1 tracking-wider">Crops</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">🌱</span>
                                                <span className="font-bold text-gray-900 dark:text-gray-100">{farmer.crops_grown || '-'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold mb-1 tracking-wider">Quantity</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">⚖️</span>
                                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                                    {farmer.available_quantity ? `${farmer.available_quantity}kg` : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/50 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-500 uppercase font-bold mb-1 tracking-wider">Expected Price</p>
                                            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                {farmer.expected_price || '-'}
                                            </div>
                                        </div>
                                        <span className="text-4xl">💰</span>
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="p-4 pt-0 mt-auto">
                                    <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group-hover:scale-[1.02] active:scale-[0.98]">
                                        <span className="text-2xl">📞</span> Connect Now
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
