import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Menu,
    Globe,
    Moon,
    Sun,
    User,
    TrendingUp,
    Leaf,
    LogOut,
    Info,
    UserCircle,
    LayoutDashboard,
    ChevronRight,
    UserPlus,
    Users,
    CloudRain,
    FileText,
    Brain
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
import { setLanguage as setGoogleLanguage } from "@/lib/googleTranslate";

export default function GramPanchayatDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
    const languages = ['English', 'Hindi', 'Punjabi'] as const;

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            {/* Top Navigation Bar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
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
                                <SheetContent side="left" className="w-[300px] sm:w-[340px] p-6 bg-[#F8F9FA] dark:bg-gray-800">
                                    <SheetHeader className="mb-8 flex flex-row items-center justify-between space-y-0">
                                        <SheetTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Navigation</SheetTitle>
                                    </SheetHeader>
                                    <div className="space-y-3">
                                        <Link to="/grampanchayat/dashboard" className="flex items-center justify-between px-4 py-3 bg-[#1a5d1a] dark:bg-green-700 text-white rounded-full shadow-sm transition-all group">
                                            <div className="flex items-center gap-3">
                                                <LayoutDashboard className="h-5 w-5 stroke-[2.5]" />
                                                <span className="font-medium text-sm">Dashboard</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-white/80" />
                                        </Link>

                                        <Link to="/grampanchayat/farmers" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-900 dark:hover:text-green-100 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100 dark:hover:border-green-700">
                                            <div className="flex items-center gap-3">
                                                <Users className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                                                <span className="font-medium text-sm">Manage Farmers</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-700 transition-colors" />
                                        </Link>

                                        <Link to="/farmer/weather" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-900 dark:hover:text-blue-100 rounded-full transition-all group shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-blue-700">
                                            <div className="flex items-center gap-3">
                                                <CloudRain className="h-5 w-5 text-gray-500 group-hover:text-blue-700 transition-colors" />
                                                <span className="font-medium text-sm">Weather</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-700 transition-colors" />
                                        </Link>

                                        <Link to="/farmer/ngo-schemes" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-900 dark:hover:text-purple-100 rounded-full transition-all group shadow-sm border border-transparent hover:border-purple-100 dark:hover:border-purple-700">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-gray-500 group-hover:text-purple-700 transition-colors" />
                                                <span className="font-medium text-sm">Schemes</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-700 transition-colors" />
                                        </Link>

                                        <a href="https://translationchatbotfinal.onrender.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900 hover:text-orange-900 dark:hover:text-orange-100 rounded-full transition-all group shadow-sm border border-transparent hover:border-orange-100 dark:hover:border-orange-700">
                                            <div className="flex items-center gap-3">
                                                <Brain className="h-5 w-5 text-gray-500 group-hover:text-orange-700 transition-colors" />
                                                <span className="font-medium text-sm">EdgeAI</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-orange-700 transition-colors" />
                                        </a>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <div className="flex items-center gap-2">
                                <Leaf className="h-6 w-6 text-green-600" fill="currentColor" />
                                <span className="text-xl font-bold text-green-600 tracking-tight">FarmIQ</span>
                                <span className="text-gray-400 text-lg font-light">|</span>
                                <span className="text-gray-500 text-sm font-medium">Gram-Panchayat</span>
                            </div>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-2">
                            {/* Create for Farmer Button */}
                            <Button
                                onClick={() => navigate('/grampanchayat/create-farmer')}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span className="hidden sm:inline">Create for Farmer</span>
                            </Button>

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
                                            onClick={() => {
                                                setLanguage(lang);
                                                setGoogleLanguage(lang);
                                            }}
                                            className="cursor-pointer hover:bg-gray-50"
                                        >
                                            {lang}
                                            {language === lang && <span className="ml-2 text-green-600">✓</span>}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                onClick={toggleTheme}
                            >
                                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                        <User className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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

            {/* Main Dashboard Layout */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gram-Panchayat Dashboard</h1>
                    <p className="text-gray-500 mt-1">Create and manage farmer profiles for your village</p>
                </div>

                {/* Top 3 Feature Cards - Prominent */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Market Analysis */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-100" onClick={() => navigate('/market-prices')}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                            <CardTitle className="mt-4">Market Analysis</CardTitle>
                            <CardDescription>View real-time market prices and trends</CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Schemes */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-100" onClick={() => navigate('/grampanchayat/ngo-schemes')}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                            <CardTitle className="mt-4">Government Schemes</CardTitle>
                            <CardDescription>Browse welfare schemes for farmers</CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Weather */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-100" onClick={() => navigate('/grampanchayat/weather')}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <CloudRain className="h-6 w-6 text-blue-600" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                            <CardTitle className="mt-4">Weather Forecast</CardTitle>
                            <CardDescription>Check local weather predictions</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Farmers Created */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Farmers Registered</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">24</h3>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-green-600 font-medium flex items-center">
                                +5
                            </span>
                            <span className="text-gray-400 ml-1">this month</span>
                        </div>
                    </div>

                    {/* Extended Profiles */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Extended Profiles</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">18</h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <UserPlus className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-gray-400">With complete details</span>
                        </div>
                    </div>

                    {/* Scheme Eligible */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Scheme Eligible</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">15</h3>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-gray-400">Special category schemes</span>
                        </div>
                    </div>

                    {/* Active This Week */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Activity</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</h3>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-orange-500" />
                            </div>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-gray-400">Farmers active this week</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
