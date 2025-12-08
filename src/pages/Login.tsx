import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Globe, Moon, Sun } from 'lucide-react';
import { authService, LoginCredentials } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

type UserRole = 'farmer' | 'vendor' | 'admin';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const languageLabels: Record<Language, string> = {
    en: 'English',
    hi: 'हिन्दी',
    pa: 'ਪੰਜਾਬੀ',
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const credentials: LoginCredentials = {
        role: selectedRole,
        email: data.email,  // FIXED: use email instead of username
        password: data.password,
      };

      const response = await authService.login(credentials);

      if (response.success && response.user && response.redirectUrl) {
        // Update auth context
        login(response.user);

        toast({
          title: t('loginSuccess'),
          description: t('welcomeBack'),
        });
        navigate(response.redirectUrl);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    reset(); // Clear form when role changes
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    toast({
      title: 'Coming Soon',
      description: 'Google login will be available soon.',
    });
  };

  const handlePhoneLogin = () => {
    // TODO: Implement phone number login
    toast({
      title: 'Coming Soon',
      description: 'Phone number login will be available soon.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 flex items-center justify-center p-4">
      {/* Language and Theme switchers - top right */}
      <div className="fixed top-4 right-4 flex flex-col items-end gap-2 z-50">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-sm hover:shadow-md transition-all">
                <Globe className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {(Object.keys(languageLabels) as Language[]).map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => {
                    console.log('Changing language to:', lang);
                    setLanguage(lang);
                  }}
                  className="cursor-pointer text-lg py-3"
                >
                  {languageLabels[lang]}
                  {language === lang && <span className="ml-2 text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-sm hover:shadow-md transition-all" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </Button>
        </div>

        {/* Backup Language Toggle Buttons */}
        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              console.log('Switching to English');
              setLanguage('en');
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'en'
                ? 'bg-green-500 text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('Switching to Hindi');
              setLanguage('hi');
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'hi'
                ? 'bg-green-500 text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
          >
            हिं
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('Switching to Punjabi');
              setLanguage('pa');
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === 'pa'
                ? 'bg-green-500 text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
          >
            ਪੰ
          </button>
        </div>
      </div>

      <Card className="w-full max-w-lg shadow-xl border-[3px] border-border/50">
        <CardHeader className="space-y-4 text-center pb-8 pt-8">
          <div className="mx-auto bg-green-100 dark:bg-green-900/20 w-24 h-24 rounded-full flex items-center justify-center mb-2">
            <span className="text-6xl">🏡</span>
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100">{t('loginTitle')}</CardTitle>
          <CardDescription className="text-xl">
            {t('loginDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-10">
          {/* Role Selection - Huge Emoji Cards */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-muted-foreground ml-1">Select Role / भूमिका चुनें</Label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange('farmer')}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-2xl border-[3px] transition-all duration-200 gap-2
                  ${selectedRole === 'farmer'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 shadow-md scale-105 z-10'
                    : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }
                `}
              >
                <span className="text-4xl filter drop-shadow-sm">👨‍🌾</span>
                <span className={`font-bold ${selectedRole === 'farmer' ? 'text-green-700 dark:text-green-400' : 'text-gray-600'}`}>
                  {t('farmer')}
                </span>
                {selectedRole === 'farmer' && (
                  <div className="absolute top-2 right-2 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('vendor')}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-2xl border-[3px] transition-all duration-200 gap-2
                  ${selectedRole === 'vendor'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md scale-105 z-10'
                    : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }
                `}
              >
                <span className="text-4xl filter drop-shadow-sm">🏪</span>
                <span className={`font-bold ${selectedRole === 'vendor' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600'}`}>
                  {t('vendor')}
                </span>
                {selectedRole === 'vendor' && (
                  <div className="absolute top-2 right-2 h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-2xl border-[3px] transition-all duration-200 gap-2
                  ${selectedRole === 'admin'
                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-500 shadow-md scale-105 z-10'
                    : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }
                `}
              >
                <span className="text-4xl filter drop-shadow-sm">👮</span>
                <span className={`font-bold ${selectedRole === 'admin' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600'}`}>
                  {t('admin')}
                </span>
                {selectedRole === 'admin' && (
                  <div className="absolute top-2 right-2 h-3 w-3 bg-gray-500 rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertDescription className="text-lg font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-lg ml-1">{t('email')}</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="text"
                  placeholder="name@example.com"
                  {...register('email')}
                  className="h-14 px-4 text-lg rounded-xl border-2 focus-visible:ring-offset-0 focus-visible:ring-green-500/50"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive font-medium ml-1">🔴 {errors.email.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-lg ml-1">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="h-14 px-4 text-lg rounded-xl border-2 focus-visible:ring-offset-0 focus-visible:ring-green-500/50 pr-12"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-10 w-10 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive font-medium ml-1">🔴 {errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-16 text-xl font-bold rounded-full shadow-lg bg-green-600 hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <span className="mr-2 text-2xl">🚀</span>}
              {t('login')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-[#F8F9FA] dark:bg-gray-900 px-4 text-muted-foreground font-semibold">
                OR
              </span>
            </div>
          </div>

          {/* Social Login Buttons - Large Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-14 text-lg font-medium border-2 hover:bg-gray-50 flex items-center gap-2 rounded-xl"
              onClick={handleGoogleLogin}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-14 text-lg font-medium border-2 hover:bg-gray-50 flex items-center gap-2 rounded-xl"
              onClick={handlePhoneLogin}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Phone
            </Button>
          </div>

          {/* Register Link */}
          <div className="text-center pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-50 text-green-700 font-bold hover:bg-green-100 transition-colors"
            >
              <span>🌱</span>
              {t('dontHaveAccount')} {t('register')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
