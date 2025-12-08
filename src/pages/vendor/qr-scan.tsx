import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    Menu,
    Globe,
    Moon,
    User,
    Leaf,
    Camera,
    Image as ImageIcon,
    LogOut,
    Info,
    UserCircle,
    LayoutDashboard,
    Search,
    BarChart3,
    ChevronRight,
    QrCode
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
import { useToast } from "@/hooks/use-toast";
import jsQR from 'jsqr';

export default function VendorQRScan() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
    const languages = ['English', 'Hindi', 'Punjabi'] as const;
    const [qrResult, setQrResult] = useState<string>('');
    const [scanning, setScanning] = useState(false);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const handleQRTextSubmit = async (text: string) => {
        try {
            setScanning(true);
            const response = await fetch('http://localhost:3001/api/qr/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ qr_text: text })
            });

            if (!response.ok) {
                throw new Error('Failed to parse QR code');
            }

            const data = await response.json();
            setQrResult(data.qr_text);

            toast({
                title: "QR Code Scanned",
                description: "Product information displayed",
            });
        } catch (error) {
            console.error('QR parse error:', error);
            toast({
                title: "Scan Failed",
                description: "Could not process QR code",
                variant: "destructive",
            });
        } finally {
            setScanning(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setScanning(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Create canvas to process image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    toast({
                        title: "Error",
                        description: "Could not process image",
                        variant: "destructive",
                    });
                    setScanning(false);
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Get image data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Decode QR code
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    // QR code found
                    handleQRTextSubmit(code.data);
                } else {
                    // No QR code found
                    setQrResult('QR not present');
                    toast({
                        title: "No QR Code",
                        description: "QR not present in the uploaded image",
                        variant: "destructive",
                    });
                    setScanning(false);
                }
            };

            img.onerror = () => {
                toast({
                    title: "Error",
                    description: "Could not load image",
                    variant: "destructive",
                });
                setScanning(false);
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            toast({
                title: "Error",
                description: "Could not read file",
                variant: "destructive",
            });
            setScanning(false);
        };

        reader.readAsDataURL(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleManualInput = () => {
        const text = prompt('Enter QR code text:');
        if (text) {
            handleQRTextSubmit(text);
        }
    };

    const formatQRResult = (text: string) => {
        try {
            const parsed = JSON.parse(text);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return text;
        }
    };

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

                                        <Link to="/vendor/farmer-search" className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 hover:bg-green-50 hover:text-green-900 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100">
                                            <div className="flex items-center gap-3">
                                                <Search className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                                                <span className="font-medium text-sm">Farmer Search</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-700 transition-colors" />
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
                            <Link to="/vendor/qr-scan" className="text-gray-900 font-medium border-b-2 border-green-500 px-1 py-5">
                                QR Scan
                            </Link>
                            <Link to="/vendor/market-prices" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
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

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">QR Code Scanner</h1>
                    <p className="text-xl text-muted-foreground">Verify product authenticity instantly</p>
                </div>

                {/* Two Main Sections Side-by-Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT CARD: Scan QR Code */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-[3px] border-green-500 overflow-hidden flex flex-col h-[600px]">
                        <div className="p-6 bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                <span>📱</span> Scan QR Code
                            </h2>
                        </div>

                        <div className="flex-1 p-8 flex flex-col items-center justify-center gap-8">

                            {!scanning ? (
                                <>
                                    <div className="w-full flex-1 border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-6 group">
                                        <div className="mb-6 opacity-30 group-hover:opacity-50 transition-opacity transform group-hover:scale-110 duration-300">
                                            <QrCode className="h-40 w-40 text-gray-900 dark:text-gray-100" />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-center text-xl font-medium max-w-sm">
                                            Point verify genuine products or check details
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                        <button
                                            onClick={handleManualInput}
                                            disabled={scanning}
                                            className="flex flex-col items-center justify-center gap-3 p-6 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
                                        >
                                            <span className="text-5xl drop-shadow-md">📸</span>
                                            <span className="font-bold text-xl">Use Camera</span>
                                        </button>

                                        <div className="relative group">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={scanning}
                                                className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
                                            >
                                                <span className="text-5xl drop-shadow-md">🖼️</span>
                                                <span className="font-bold text-xl">Upload Image</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full animation-pulse">
                                    <div className="animate-spin mb-8">
                                        <span className="text-8xl">⏳</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300">Scanning...</h3>
                                    <p className="text-gray-500 mt-4 text-xl">Please wait a moment</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT CARD: Product Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-[3px] border-blue-500 overflow-hidden flex flex-col h-[600px]">
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                <span>📦</span> Product Details
                            </h2>
                        </div>

                        <div className="flex-1 p-0 overflow-hidden relative bg-gray-50 dark:bg-gray-900/50">
                            {qrResult ? (
                                <div className="p-8 h-full overflow-auto custom-scrollbar">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                                            <span className="text-5xl bg-green-100 dark:bg-green-900/30 p-3 rounded-full">✅</span>
                                            <div>
                                                <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Verified Product</h3>
                                                <p className="text-muted-foreground">Successfully scanned</p>
                                            </div>
                                        </div>
                                        <pre className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            {formatQRResult(qrResult)}
                                        </pre>
                                    </div>
                                    <button
                                        onClick={() => setQrResult('')}
                                        className="mt-6 w-full py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-lg transition-colors"
                                    >
                                        Scan Another Code
                                    </button>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800">
                                    <div className="mb-8 opacity-20 transform scale-150">
                                        <QrCode className="h-32 w-32 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-400 mb-2">No Data Yet</h3>
                                    <p className="text-gray-400 text-xl max-w-xs mx-auto">
                                        Scan a QR code to see product details here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
