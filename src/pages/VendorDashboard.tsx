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
  DollarSign,
  Box,
  Sprout,
  TrendingUp,
  Search,
  BarChart3,
  Leaf,
  LogOut,
  Info,
  UserCircle,
  LayoutDashboard,
  QrCode,
  ChevronRight,
  MessageCircle,
  Phone,
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

export default function VendorDashboard() {
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
                    <Link to="/vendor/dashboard" className="flex items-center justify-between px-4 py-3 bg-[#1a5d1a] dark:bg-green-700 text-white rounded-full shadow-sm transition-all group">
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="h-5 w-5 stroke-[2.5]" />
                        <span className="font-medium text-sm">Dashboard</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/80" />
                    </Link>

                    <Link to="/vendor/farmer-search" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-900 dark:hover:text-green-100 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100 dark:hover:border-green-700">
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                        <span className="font-medium text-sm">Farmer Search</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-700 transition-colors" />
                    </Link>

                    <Link to="/vendor/market-prices" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-yellow-50 dark:hover:bg-yellow-900 hover:text-yellow-900 dark:hover:text-yellow-100 rounded-full transition-all group shadow-sm border border-transparent hover:border-yellow-100 dark:hover:border-yellow-700">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-gray-500 group-hover:text-yellow-700 transition-colors" />
                        <span className="font-medium text-sm">Market Price</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-yellow-700 transition-colors" />
                    </Link>

                    <a href="https://translationchatbotfinal.onrender.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-900 dark:hover:text-purple-100 rounded-full transition-all group shadow-sm border border-transparent hover:border-purple-100 dark:hover:border-purple-700">
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-gray-500 group-hover:text-purple-700 transition-colors" />
                        <span className="font-medium text-sm">EdgeAI</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-700 transition-colors" />
                    </a>
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
              <Link to="/vendor/dashboard" className="text-gray-900 font-medium border-b-2 border-green-500 px-1 py-5">
                Dashboard
              </Link>
              <Link to="/vendor/qr-scan" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                QR Scan
              </Link>
              <Link to="/vendor/market-prices" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                Market Prices
              </Link>
              <Link to="/vendor/farmer-search" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                Farmer Search
              </Link>
              <a href="https://translationchatbotfinal.onrender.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                EdgeAI
              </a>
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
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard Overview</h1>
          <p className="text-xl text-muted-foreground">Welcome back, Vendor!</p>
        </div>

        {/* Stats Cards - Huge Visual Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total Purchases */}
          <Card className="border-[4px] border-green-500 hover:shadow-lg transition-all">
            <CardContent className="p-8 text-center">
              <div className="text-7xl mb-6">💰</div>
              <h3 className="text-xl font-bold mb-2">Total Purchases</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">₹2,45,000</div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg inline-block">
                <span className="text-green-700 dark:text-green-400 font-semibold">↑ +12% from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Orders */}
          <Card className="border-[4px] border-blue-500 hover:shadow-lg transition-all">
            <CardContent className="p-8 text-center">
              <div className="text-7xl mb-6">📦</div>
              <h3 className="text-xl font-bold mb-2">Active Orders</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">8</div>
              <p className="text-muted-foreground text-lg">3 pending verification</p>
            </CardContent>
          </Card>

          {/* Crops Available */}
          <Card className="border-[4px] border-emerald-500 hover:shadow-lg transition-all">
            <CardContent className="p-8 text-center">
              <div className="text-7xl mb-6">🌱</div>
              <h3 className="text-xl font-bold mb-2">Crops Available</h3>
              <div className="text-4xl font-bold text-emerald-600 mb-2">12</div>
              <p className="text-muted-foreground text-lg">5 new this week</p>
            </CardContent>
          </Card>

          {/* Growth Rate */}
          <Card className="border-[4px] border-orange-500 hover:shadow-lg transition-all">
            <CardContent className="p-8 text-center">
              <div className="text-7xl mb-6">📈</div>
              <h3 className="text-xl font-bold mb-2">Growth Rate</h3>
              <div className="text-4xl font-bold text-orange-600 mb-2">+18%</div>
              <p className="text-muted-foreground text-lg">Compared to last quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Quick Actions - New Circle Icon Style */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Scan QR */}
              <div onClick={() => navigate('/vendor/qr-scan')} className="cursor-pointer group h-full">
                <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:border-green-400 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="mb-6 rounded-full w-24 h-24 flex items-center justify-center bg-green-500 text-white shadow-sm">
                      <span className="text-5xl">📱</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Scan QR</h3>
                    <p className="text-muted-foreground mb-8 text-lg">Verify products instantly</p>
                    <div className="mt-auto w-full">
                      <div className="bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 font-bold py-3 px-6 rounded-full shadow-sm flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                        Scan Now <span className="text-xl">›</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Market Prices */}
              <div onClick={() => navigate('/vendor/market-prices')} className="cursor-pointer group h-full">
                <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="mb-6 rounded-full w-24 h-24 flex items-center justify-center bg-blue-500 text-white shadow-sm">
                      <span className="text-5xl">📊</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Market Prices</h3>
                    <p className="text-muted-foreground mb-8 text-lg">Check live agricultural rates</p>
                    <div className="mt-auto w-full">
                      <div className="bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-bold py-3 px-6 rounded-full shadow-sm flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                        Check Prices <span className="text-xl">›</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Farmer Search */}
              <div onClick={() => navigate('/vendor/farmer-search')} className="cursor-pointer group h-full">
                <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="mb-6 rounded-full w-24 h-24 flex items-center justify-center bg-emerald-500 text-white shadow-sm">
                      <span className="text-5xl">🔍</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Find Farmers</h3>
                    <p className="text-muted-foreground mb-8 text-lg">Search for crops nearby</p>
                    <div className="mt-auto w-full">
                      <div className="bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 font-bold py-3 px-6 rounded-full shadow-sm flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                        Search <span className="text-xl">›</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Support */}
              <div className="cursor-pointer group h-full">
                <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="mb-6 rounded-full w-24 h-24 flex items-center justify-center bg-yellow-500 text-white shadow-sm">
                      <span className="text-5xl">💬</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Support</h3>
                    <p className="text-muted-foreground mb-8 text-lg">Chat with our team 24/7</p>
                    <div className="mt-auto w-full">
                      <div className="bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-400 font-bold py-3 px-6 rounded-full shadow-sm flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                        Chat Now <span className="text-xl">›</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>

          {/* Recent Scans - Large List Style */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Recent Scans</h2>
            <div className="space-y-6">
              <Card className="hover:shadow-md transition-all cursor-pointer border-l-[8px] border-l-green-500 bg-white dark:bg-gray-800">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="text-6xl bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">🌾</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rice - Basmati</h3>
                    <p className="text-xl text-muted-foreground mt-1">2.5 tons</p>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-6 py-2 rounded-full text-lg font-bold">
                    Verified ✅
                  </span>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all cursor-pointer border-l-[8px] border-l-green-500 bg-white dark:bg-gray-800">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="text-6xl bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">🍞</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Wheat - Premium</h3>
                    <p className="text-xl text-muted-foreground mt-1">5 tons</p>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-6 py-2 rounded-full text-lg font-bold">
                    Verified ✅
                  </span>
                </CardContent>
              </Card>

              {/* Add a "View All" placeholder */}
              <div className="text-center pt-4">
                <button className="text-green-600 font-bold text-lg hover:underline">View All Scans ›</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
