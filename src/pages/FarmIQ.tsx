import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FarmIQNavbar } from "@/components/farmiq/FarmIQNavbar";
import { WeatherCard } from "@/components/farmiq/WeatherCard";
import { ActionButtons } from "@/components/farmiq/ActionButtons";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PremiumBadge } from "@/components/ui/premium-badge";
import { premiumService, PremiumStatus } from "@/services/premiumService";
import { Crown } from "lucide-react";

export default function FarmIQ() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const status = await premiumService.getStatus();
      setPremiumStatus(status);
    } catch (error) {
      console.error('Failed to load premium status:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
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
        <div className="container mx-auto max-w-7xl">
          {/* Header with Welcome and Premium */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
                🏡 My Farm
                {premiumStatus?.is_premium && <PremiumBadge />}
              </h1>
              <p className="text-2xl text-muted-foreground">Welcome back, Farmer!</p>
            </div>

            {!premiumStatus?.is_premium && (
              <Button
                onClick={() => navigate('/farmer/premium/payment')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold shadow-lg"
                size="lg"
              >
                <Crown className="h-4 w-4 mr-2" fill="currentColor" />
                Upgrade to Premium
              </Button>
            )}
          </div>

          {/* Action Buttons - Already transformed */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>
            <ActionButtons />
          </div>

          {/* Dashboard Stats - Huge visual cards */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">My Farm Stats</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Yield Card */}
              <Card className="border-[4px] border-success hover:shadow-lg transition-all">
                <CardContent className="p-10 text-center">
                  <div className="text-8xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold mb-3">This Month's Harvest</h3>
                  <div className="text-6xl font-bold text-success mb-3">2.5</div>
                  <p className="text-xl text-muted-foreground mb-4">Tons</p>
                  <div className="bg-success/10 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-success">↑ +15% Better</p>
                    <p className="text-sm text-muted-foreground">Than last month</p>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Card */}
              <Card className="border-[4px] border-orange-500 hover:shadow-lg transition-all">
                <CardContent className="p-10 text-center">
                  <div className="text-8xl mb-4">💰</div>
                  <h3 className="text-2xl font-bold mb-3">This Month's Income</h3>
                  <div className="text-5xl font-bold text-orange-600 mb-3">₹1,25,000</div>
                  <p className="text-xl text-muted-foreground mb-4">Rupees</p>
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-orange-700">↑ +8% More</p>
                    <p className="text-sm text-muted-foreground">Than last month</p>
                  </div>
                </CardContent>
              </Card>

              {/* Active Crops Card */}
              <Card className="border-[4px] border-primary hover:shadow-lg transition-all">
                <CardContent className="p-10 text-center">
                  <div className="text-8xl mb-4">🌱</div>
                  <h3 className="text-2xl font-bold mb-3">Crops Growing</h3>
                  <div className="text-6xl font-bold text-primary mb-3">5</div>
                  <p className="text-xl text-muted-foreground mb-4">Different types</p>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-base font-semibold">Rice, Wheat, Corn</p>
                    <p className="text-base font-semibold">Tomato, Onion</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activities - Simplified */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Recent Activity</h2>
            <Card className="border-[4px]">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
                    <span className="text-6xl">✅</span>
                    <div className="flex-1">
                      <p className="text-2xl font-semibold">Soil Test Done</p>
                      <p className="text-lg text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
                    <span className="text-6xl">📸</span>
                    <div className="flex-1">
                      <p className="text-2xl font-semibold">Crop Photo Taken</p>
                      <p className="text-lg text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
                    <span className="text-6xl">💰</span>
                    <div className="flex-1">
                      <p className="text-2xl font-semibold">Checked Market Prices</p>
                      <p className="text-lg text-muted-foreground">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
                    <span className="text-6xl">🏛️</span>
                    <div className="flex-1">
                      <p className="text-2xl font-semibold">Viewed Government Schemes</p>
                      <p className="text-lg text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}