import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { FarmIQNavbar } from "@/components/farmiq/FarmIQNavbar";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { marketPricesService, MarketPrice, MarketPriceFilters } from "@/services/marketPricesService";

const MarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
  const [filters, setFilters] = useState<MarketPriceFilters>({
    crop: "",
    state: "",
    district: ""
  });
  const [currentStep, setCurrentStep] = useState(1); // 1: Crop, 2: State, 3: District, 4: Prices
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  // Common crops with emojis - proper case for API
  const crops = [
    { name: "All Crops", emoji: "🌍", value: "all" },
    { name: "Rice", emoji: "🍚", value: "Rice" },
    { name: "Wheat", emoji: "🌾", value: "Wheat" },
    { name: "Onion", emoji: "🧅", value: "Onion" },
    { name: "Tomato", emoji: "🍅", value: "Tomato" },
    { name: "Potato", emoji: "🥔", value: "Potato" },
    { name: "Corn", emoji: "🌽", value: "Maize" },
    { name: "Cotton", emoji: "☁️", value: "Cotton" },
    { name: "Soybean", emoji: "🫘", value: "Soyabean" },
  ];

  // Indian states - proper case for API
  const states = [
    { name: "All States", emoji: "🌍", value: "all" },
    { name: "Punjab", emoji: "🗺️", value: "Punjab" },
    { name: "Haryana", emoji: "🗺️", value: "Haryana" },
    { name: "Uttar Pradesh", emoji: "🗺️", value: "Uttar Pradesh" },
    { name: "Maharashtra", emoji: "🗺️", value: "Maharashtra" },
    { name: "Karnataka", emoji: "🗺️", value: "Karnataka" },
    { name: "Tamil Nadu", emoji: "🗺️", value: "Tamil Nadu" },
    { name: "Gujarat", emoji: "🗺️", value: "Gujarat" },
    { name: "Rajasthan", emoji: "🗺️", value: "Rajasthan" },
  ];

  const fetchPrices = useCallback(async (currentFilters: MarketPriceFilters) => {
    console.log('🔍 Fetching prices with filters:', currentFilters);
    setLoading(true);
    try {
      const response = await marketPricesService.getPrices(
        currentFilters,
        1,
        100,
        "commodity:asc"
      );
      console.log('✅ Prices fetched successfully:', response);
      setPrices(response.data);

      if (response.data.length === 0) {
        toast({
          title: "No Results",
          description: "No price data found for your selection. Try different filters.",
          variant: "default"
        });
      }
    } catch (err) {
      console.error("❌ Error fetching prices:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Unable to fetch prices. Please try again.",
        variant: "destructive"
      });
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch districts when state is selected
  const fetchDistricts = useCallback(async (stateValue: string, cropValue: string) => {
    console.log('🔍 Fetching districts for state:', stateValue, 'crop:', cropValue);
    setLoading(true);
    try {
      // Fetch a sample to get available districts
      const response = await marketPricesService.getPrices(
        { crop: cropValue, state: stateValue, district: "all" },
        1,
        1000,
        "district:asc"
      );

      // Extract unique districts
      const districts = Array.from(new Set(
        response.data
          .map(item => item.district)
          .filter(d => d !== null && d !== undefined && d !== "")
      )) as string[];

      console.log('✅ Found districts:', districts);

      // If no districts found, skip directly to showing prices
      if (districts.length === 0) {
        console.log('⚠️ No districts found, skipping to prices directly');
        const newFilters = { crop: cropValue, state: stateValue, district: "all" };
        setFilters(newFilters);
        setCurrentStep(4);
        setPrices(response.data); // Use the data we already fetched

        if (response.data.length === 0) {
          toast({
            title: "No Results",
            description: "No price data found for your selection. Try different filters.",
            variant: "default"
          });
        }
      } else {
        setAvailableDistricts(districts);
      }
    } catch (err) {
      console.error("❌ Error fetching districts:", err);
      setAvailableDistricts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCropSelect = (cropValue: string) => {
    console.log('🌱 Crop selected:', cropValue);
    setFilters(prev => ({ ...prev, crop: cropValue }));
    setCurrentStep(2);
  };

  const handleStateSelect = (stateValue: string) => {
    console.log('📍 State selected:', stateValue);
    setFilters(prev => ({ ...prev, state: stateValue, district: "" }));
    setCurrentStep(3);
    // Fetch districts for this state and crop
    fetchDistricts(stateValue, filters.crop);
  };

  const handleDistrictSelect = (districtValue: string) => {
    console.log('🏘️ District selected:', districtValue);
    const newFilters = { ...filters, district: districtValue };
    setFilters(newFilters);
    setCurrentStep(4);
    fetchPrices(newFilters);
  };

  const resetSelection = () => {
    console.log('🔄 Resetting selection');
    setFilters({ crop: "", state: "", district: "" });
    setPrices([]);
    setAvailableDistricts([]);
    setCurrentStep(1);
  };

  // Format price to Indian currency
  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <FarmIQNavbar
        theme={theme}
        language={language}
        onThemeToggle={toggleTheme}
        onLanguageChange={setLanguage}
      />

      <div className="container mx-auto max-w-7xl p-4 pt-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">💰 Today's Prices</h1>
          <SectionSpeaker
            getText={() => "Market Prices. Check today's crop prices in your state. Select your crop, location, and mandi to see current rates"}
            sectionId="market-prices-header"
            ariaLabel="Listen to instructions"
            alwaysVisible
          />
        </div>

        {/* Progress Steps - 4 steps now */}
        <div className="flex justify-center mb-12 gap-4">
          <div className={`text-center ${currentStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-2 ${currentStep === 1 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
              🌱
            </div>
            <p className="text-sm font-semibold">Crop</p>
          </div>
          <div className="flex items-center">
            <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className={`text-center ${currentStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-2 ${currentStep === 2 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
              📍
            </div>
            <p className="text-sm font-semibold">State</p>
          </div>
          <div className="flex items-center">
            <div className={`w-12 h-1 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className={`text-center ${currentStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-2 ${currentStep === 3 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
              🏘️
            </div>
            <p className="text-sm font-semibold">Mandi</p>
          </div>
          <div className="flex items-center">
            <div className={`w-12 h-1 ${currentStep >= 4 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className={`text-center ${currentStep >= 4 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-2 ${currentStep === 4 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
              💵
            </div>
            <p className="text-sm font-semibold">Prices</p>
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

        {/* Step 3: Select District/Mandi */}
        {currentStep === 3 && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <p className="text-xl text-muted-foreground mb-2">Selected:</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">{crops.find(c => c.value === filters.crop)?.emoji}</span>
                <p className="text-2xl font-bold">{crops.find(c => c.value === filters.crop)?.name}</p>
                <span className="text-2xl">→</span>
                <span className="text-4xl">📍</span>
                <p className="text-2xl font-bold">{states.find(s => s.value === filters.state)?.name}</p>
              </div>
              <Button variant="ghost" onClick={() => setCurrentStep(2)} className="mt-4">
                ↩️ Change State
              </Button>
            </div>

            {loading && (
              <div className="text-center py-20">
                <Loader2 className="h-16 w-16 mx-auto animate-spin mb-4 text-primary" />
                <p className="text-2xl font-semibold">Loading mandis...</p>
              </div>
            )}

            {!loading && availableDistricts.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-center mb-8">Which mandi?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* All Districts option */}
                  <Card
                    onClick={() => handleDistrictSelect("all")}
                    className="cursor-pointer hover:scale-105 active:scale-95 transition-all touch-target-large border-[3px] hover:border-primary"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="text-6xl mb-4">🌍</div>
                      <p className="text-xl font-bold">All Mandis</p>
                    </CardContent>
                  </Card>

                  {/* Individual districts */}
                  {availableDistricts.slice(0, 20).map((district) => (
                    <Card
                      key={district}
                      onClick={() => handleDistrictSelect(district)}
                      className="cursor-pointer hover:scale-105 active:scale-95 transition-all touch-target-large border-[3px] hover:border-primary"
                    >
                      <CardContent className="p-8 text-center">
                        <div className="text-6xl mb-4">🏘️</div>
                        <p className="text-lg font-bold">{district}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {availableDistricts.length > 20 && (
                  <p className="text-center text-muted-foreground mt-4">
                    Showing 20 of {availableDistricts.length} mandis
                  </p>
                )}
              </>
            )}

            {!loading && availableDistricts.length === 0 && (
              <Card className="border-[3px]">
                <CardContent className="p-12 text-center">
                  <div className="text-8xl mb-6">📊</div>
                  <h3 className="text-2xl font-bold mb-4">No mandis found</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    No mandi data available for this combination
                  </p>
                  <Button onClick={() => setCurrentStep(2)} size="lg">
                    Try Different State
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 4: Show Prices */}
        {currentStep === 4 && (
          <div className="max-w-5xl mx-auto">
            {/* Selected filters display */}
            <div className="mb-8 bg-muted p-6 rounded-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Crop</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{crops.find(c => c.value === filters.crop)?.emoji}</span>
                      <p className="text-lg font-bold">{crops.find(c => c.value === filters.crop)?.name}</p>
                    </div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">State</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📍</span>
                      <p className="text-lg font-bold">{states.find(s => s.value === filters.state)?.name}</p>
                    </div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Mandi</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏘️</span>
                      <p className="text-lg font-bold">{filters.district === "all" ? "All Mandis" : filters.district}</p>
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
                {prices.slice(0, 20).map((price, index) => (
                  <Card key={index} className="border-[3px] hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Market info */}
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Market</p>
                          <p className="text-xl font-bold">{price.market || price.district}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            📍 {price.district}, {price.state}
                          </p>
                          {price.commodity && (
                            <p className="text-sm text-muted-foreground mt-1">
                              🌾 {price.commodity}
                            </p>
                          )}
                        </div>

                        {/* Price display */}
                        <div className="md:col-span-2">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center bg-success/10 p-4 rounded-lg border-2 border-success">
                              <p className="text-sm text-muted-foreground mb-1">Min Price</p>
                              <p className="text-2xl font-bold text-success">{formatPrice(price.min_price)}</p>
                            </div>
                            <div className="text-center bg-primary/10 p-4 rounded-lg border-2 border-primary">
                              <p className="text-sm text-muted-foreground mb-1">Modal Price</p>
                              <p className="text-3xl font-bold text-primary">{formatPrice(price.modal_price)}</p>
                            </div>
                            <div className="text-center bg-warning/10 p-4 rounded-lg border-2 border-warning">
                              <p className="text-sm text-muted-foreground mb-1">Max Price</p>
                              <p className="text-2xl font-bold text-warning">{formatPrice(price.max_price)}</p>
                            </div>
                          </div>
                          {price.variety && (
                            <p className="text-sm text-muted-foreground mt-3">
                              Variety: {price.variety}
                            </p>
                          )}
                          {price.arrival_date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Date: {price.arrival_date}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {prices.length > 20 && (
                  <p className="text-center text-lg text-muted-foreground py-4">
                    Showing top 20 of {prices.length} results
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
};

export default MarketPrices;