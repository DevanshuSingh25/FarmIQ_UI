import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { FarmIQNavbar } from "@/components/farmiq/FarmIQNavbar";
import { Upload, Phone, MapPin, Clock, CheckCircle, Camera, FileText, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getSoilLabs, type SoilLab } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const SoilAnalysis = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [analysisMethod, setAnalysisMethod] = useState<"lab" | "self" | null>(null);
  const [labOption, setLabOption] = useState<"pickup" | "delivery" | null>(null);
  const [labs, setLabs] = useState<SoilLab[]>([]);
  const [labsLoading, setLabsLoading] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

  // Fetch labs when lab method is selected
  useEffect(() => {
    if (analysisMethod === 'lab') {
      fetchLabs();
    }
  }, [analysisMethod]);

  const fetchLabs = async () => {
    try {
      setLabsLoading(true);
      const data = await getSoilLabs();
      setLabs(data);
    } catch (error) {
      console.error('Error fetching soil labs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load soil labs',
        variant: 'destructive',
      });
    } finally {
      setLabsLoading(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };
  const [soilImage, setSoilImage] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [soilResult, setSoilResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    cropType: "",
    soilType: "",
    issues: "",
    previousCrops: "",
    irrigation: "",
    fertilizers: ""
  });

  // Labs data now fetched from API

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSoilImage(file);
    }
  };

  const handleSelfAnalysis = async () => {
    if (!soilImage) {
      toast({
        title: "Image Required",
        description: "Please upload a soil image first",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", soilImage);

      const response = await fetch("http://localhost:8000/soil-predict", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setSoilResult(result);

      toast({
        title: "Analysis Complete!",
        description: `Detected: ${result.soil_type}`,
      });
    } catch (error) {
      console.error("Soil analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze soil. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (analysisMethod === null) {
    const getText = () => "Soil Testing options: Choose Lab Testing for professional analysis starting from 250 rupees, or Self Analysis for free instant results using your smartphone camera";

    return (
      <div className="min-h-screen bg-background">
        <FarmIQNavbar
          theme={theme}
          language={language}
          onThemeToggle={toggleTheme}
          onLanguageChange={setLanguage}
        />

        <div className="container mx-auto max-w-6xl p-4 pt-24">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-bold">🌱 Check Your Soil</h1>
            <SectionSpeaker
              getText={getText}
              sectionId="soil-analysis-options"
              ariaLabel="Listen to soil testing options"
              alwaysVisible
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Lab Testing Card */}
            <Card
              className="cursor-pointer hover:scale-105 active:scale-95 transition-all border-[4px] hover:border-primary touch-target-large"
              onClick={() => setAnalysisMethod("lab")}
            >
              <CardContent className="p-12 text-center">
                {/* Large Emoji Icon */}
                <div className="text-9xl mb-6">🔬</div>

                {/* Title */}
                <h2 className="text-4xl font-bold mb-4">Lab Testing</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Send soil to laboratory
                </p>

                {/* Key Features - Visual */}
                <div className="space-y-4 mb-8">
                  <div className="bg-success/10 p-4 rounded-lg">
                    <p className="text-lg font-semibold">✅ Very Accurate</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-lg font-semibold">🚚 Home Pickup</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-lg font-semibold">📋 Detailed Report</p>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-warning/20 p-6 rounded-xl border-4 border-warning">
                  <p className="text-3xl font-bold">₹250</p>
                  <p className="text-lg text-muted-foreground">Starting price</p>
                </div>
              </CardContent>
            </Card>

            {/* Self Analysis Card */}
            <Card
              className="cursor-pointer hover:scale-105 active:scale-95 transition-all border-[4px] hover:border-success touch-target-large"
              onClick={() => setAnalysisMethod("self")}
            >
              <CardContent className="p-12 text-center">
                {/* Large Emoji Icon */}
                <div className="text-9xl mb-6">📸</div>

                {/* Title */}
                <h2 className="text-4xl font-bold mb-4">Camera Check</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Take photo with phone
                </p>

                {/* Key Features - Visual */}
                <div className="space-y-4 mb-8">
                  <div className="bg-success/10 p-4 rounded-lg">
                    <p className="text-lg font-semibold">⚡ Instant Results</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-lg font-semibold">📱 Use Your Phone</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-lg font-semibold">🕐 24/7 Available</p>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-success/20 p-6 rounded-xl border-4 border-success">
                  <p className="text-3xl font-bold text-success">FREE</p>
                  <p className="text-lg text-muted-foreground">No cost</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help text */}
          <div className="text-center mt-12 max-w-3xl mx-auto">
            <div className="bg-muted p-8 rounded-xl">
              <p className="text-2xl font-semibold mb-4">Which one should I choose?</p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <p className="text-lg font-bold mb-2">🔬 Choose Lab Testing if:</p>
                  <ul className="text-base space-y-2">
                    <li>• You want very accurate results</li>
                    <li>• You need detailed report</li>
                    <li>• You can wait 2-3 days</li>
                  </ul>
                </div>
                <div>
                  <p className="text-lg font-bold mb-2">📸 Choose Camera Check if:</p>
                  <ul className="text-base space-y-2">
                    <li>• You want quick answer</li>
                    <li>• You have smartphone</li>
                    <li>• You want to try for free</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisMethod === "lab") {
    const getText = () => "Lab Testing Service: Choose from certified laboratories. Call them to book soil testing and home pickup service";

    return (
      <div className="min-h-screen bg-background">
        <FarmIQNavbar
          theme={theme}
          language={language}
          onThemeToggle={toggleTheme}
          onLanguageChange={setLanguage}
        />

        <div className="container mx-auto max-w-5xl p-4 pt-24">
          <div className="flex items-center gap-4 mb-12">
            <Button variant="ghost" size="lg" onClick={() => setAnalysisMethod(null)}>
              <ArrowLeft className="h-6 w-6 mr-2" />
              <span className="text-xl">Back</span>
            </Button>
            <h1 className="text-4xl font-bold">🔬 Lab Testing</h1>
            <SectionSpeaker
              getText={getText}
              sectionId="lab-testing-service"
              ariaLabel="Listen to lab testing information"
              alwaysVisible
            />
          </div>

          <h2 className="text-3xl font-bold text-center mb-8">Choose a Lab</h2>

          {labsLoading ? (
            <div className="text-center py-20">
              <Loader2 className="h-16 w-16 mx-auto animate-spin mb-4 text-primary" />
              <p className="text-2xl">Loading labs...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {labs.map((lab) => (
                <Card key={lab.id} className="border-[4px] hover:border-primary transition-all touch-target-large">
                  <CardContent className="p-10">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      {/* Lab Info */}
                      <div className="md:col-span-2">
                        <h3 className="text-3xl font-bold mb-3">{lab.name}</h3>
                        <div className="flex items-center gap-3 text-xl mb-4">
                          <MapPin className="h-6 w-6 text-primary" />
                          <span>{lab.location}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <Phone className="h-6 w-6 text-primary" />
                          <span className="text-2xl font-semibold">{lab.contact_number}</span>
                        </div>
                        {lab.rating && (
                          <div className="text-xl">
                            <span className="text-2xl">⭐</span>
                            <span className="font-semibold ml-2">{lab.rating}/5</span>
                          </div>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div className="text-center space-y-6">
                        <div className="bg-warning/20 p-6 rounded-xl border-4 border-warning">
                          <p className="text-5xl font-bold text-orange-900 dark:text-orange-100">₹{lab.price}</p>
                          <p className="text-lg text-muted-foreground mt-2">Lab testing</p>
                        </div>
                        <a href={`tel:${lab.contact_number}`}>
                          <Button size="lg" className="w-full h-20 text-2xl font-bold">
                            <Phone className="h-8 w-8 mr-3" />
                            Call Lab
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Sample Collection Form */}
          <Card className="mt-12 border-[4px] border-primary">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-bold">📋 Sample Collection Details</CardTitle>
              <CardDescription className="text-xl mt-2">
                Fill in your details for soil sample collection
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Name and Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xl font-semibold">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-16 text-xl border-2"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-xl font-semibold">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-16 text-xl border-2"
                  />
                </div>
              </div>

              {/* Farm Address */}
              <div className="space-y-3">
                <Label htmlFor="address" className="text-xl font-semibold">Farm Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete farm address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="min-h-32 text-xl border-2"
                />
              </div>

              {/* Current Crop and Soil Type */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="cropType" className="text-xl font-semibold">Current Crop</Label>
                  <Input
                    id="cropType"
                    placeholder="e.g., Wheat, Rice"
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    className="h-16 text-xl border-2"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="soilType" className="text-xl font-semibold">Soil Type (if known)</Label>
                  <Input
                    id="soilType"
                    placeholder="e.g., Clay, Sandy"
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="h-16 text-xl border-2"
                  />
                </div>
              </div>

              {/* Current Soil Issues */}
              <div className="space-y-3">
                <Label htmlFor="issues" className="text-xl font-semibold">Current Soil Issues</Label>
                <Textarea
                  id="issues"
                  placeholder="Describe any problems you're facing"
                  value={formData.issues}
                  onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                  className="min-h-32 text-xl border-2"
                />
              </div>

              {/* Collection Method */}
              <div className="space-y-4">
                <Label className="text-xl font-semibold">Collection Method</Label>
                <RadioGroup value={labOption || ""} onValueChange={(value) => setLabOption(value as "pickup" | "delivery")}>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-4 p-6 border-2 rounded-lg cursor-pointer hover:bg-accent transition-colors">
                      <RadioGroupItem value="pickup" id="pickup" className="h-6 w-6" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Clock className="h-6 w-6 text-primary" />
                          <span className="text-xl font-semibold">Door Pickup Service (+₹50)</span>
                        </div>
                        <p className="text-base text-muted-foreground mt-1 ml-9">We'll collect from your farm</p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-4 p-6 border-2 rounded-lg cursor-pointer hover:bg-accent transition-colors">
                      <RadioGroupItem value="delivery" id="delivery" className="h-6 w-6" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-6 w-6 text-success" />
                          <span className="text-xl font-semibold">Self Delivery to Lab</span>
                        </div>
                        <p className="text-base text-muted-foreground mt-1 ml-9">Drop sample at lab yourself</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Book Button */}
              <Button
                size="lg"
                className="w-full h-20 text-2xl font-bold bg-success hover:bg-success/90"
                disabled={!formData.name || !formData.phone || !labOption}
                onClick={() => {
                  toast({
                    title: "Booking Confirmed!",
                    description: `Your soil testing has been booked. Total: ₹${labOption === 'pickup' ? '300' : '250'}`,
                  });
                }}
              >
                📞 Book Soil Testing - ₹{labOption === 'pickup' ? '300' : '250'}
              </Button>
            </CardContent>
          </Card>


          {/* Pickup Info */}
          <Card className="mt-12 bg-muted">
            <CardContent className="p-8 text-center">
              <div className="text-7xl mb-6">🚚</div>
              <h3 className="text-2xl font-bold mb-4">Home Pickup Available</h3>
              <p className="text-xl">Most labs offer pickup from your farm</p>
              <p className="text-lg text-muted-foreground mt-2">Ask when you call</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Self Analysis Flow
  const selfAnalysisGetText = () => "Self Soil Analysis: Take a clear photo of your soil and get instant AI-powered analysis and recommendations";

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <FarmIQNavbar
        theme={theme}
        language={language}
        onThemeToggle={toggleTheme}
        onLanguageChange={setLanguage}
      />

      <div className="container mx-auto max-w-4xl p-4 pt-24">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="lg" onClick={() => setAnalysisMethod(null)}>
            <ArrowLeft className="h-6 w-6 mr-2" />
            <span className="text-xl">Back</span>
          </Button>
          <h1 className="text-4xl font-bold">📸 Camera Check</h1>
          <SectionSpeaker
            getText={selfAnalysisGetText}
            sectionId="self-analysis-form"
            ariaLabel="Listen to instructions"
            alwaysVisible
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Upload Section - HUGE */}
          {!soilImage ? (
            <Card className="border-[4px] border-dashed border-primary">
              <CardContent className="p-16 text-center">
                <input
                  id="soil-image-camera"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <input
                  id="soil-image-gallery"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="text-9xl mb-8">📸</div>

                <h2 className="text-3xl font-bold mb-4">Take Soil Photo</h2>
                <p className="text-xl text-muted-foreground mb-12">
                  Choose an option below
                </p>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full h-32 text-3xl font-bold touch-target-large"
                    onClick={() => document.getElementById('soil-image-camera')?.click()}
                  >
                    <Camera className="h-12 w-12 mr-4" />
                    Open Camera
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-32 text-3xl font-bold touch-target-large"
                    onClick={() => document.getElementById('soil-image-gallery')?.click()}
                  >
                    <Upload className="h-12 w-12 mr-4" />
                    Upload from Gallery
                  </Button>
                </div>

                <div className="mt-8 bg-muted p-6 rounded-lg">
                  <p className="text-lg font-semibold mb-3">📝 Tips:</p>
                  <ul className="text-base space-y-2 text-left">
                    <li>• Good lighting needed</li>
                    <li>• Remove stones and debris</li>
                    <li>• Show soil texture clearly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Show uploaded image */}
              <Card className="border-[4px] border-success">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-4">✅ Photo Ready!</h3>
                    <img
                      src={URL.createObjectURL(soilImage)}
                      alt="Soil sample"
                      className="mx-auto max-w-full rounded-lg border-4 border-primary"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-20 text-xl"
                    onClick={() => {
                      setSoilImage(null);
                      setSoilResult(null);
                    }}
                  >
                    🔄 Take New Photo
                  </Button>
                </CardContent>
              </Card>

              {/* Results or Analyze Button */}
              {soilResult ? (
                <Card className="border-[4px] border-success bg-success/5">
                  <CardContent className="p-10">
                    <div className="text-center mb-8">
                      <div className="text-8xl mb-4">✅</div>
                      <h2 className="text-3xl font-bold mb-4">Soil Type Found</h2>
                      <div className="bg-primary/20 p-6 rounded-xl mb-6">
                        <p className="text-4xl font-bold text-primary">{soilResult.soil_type}</p>
                        <p className="text-xl text-muted-foreground mt-2">
                          {(soilResult.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {soilResult.recommendations?.best_crops && soilResult.recommendations.best_crops.length > 0 && (
                      <div className="bg-success/10 p-6 rounded-lg mb-6">
                        <p className="text-2xl font-bold mb-4">🌾 Best Crops:</p>
                        <div className="flex flex-wrap gap-3">
                          {soilResult.recommendations.best_crops.slice(0, 5).map((crop: string, idx: number) => (
                            <div key={idx} className="bg-success/20 px-6 py-3 rounded-lg border-2 border-success">
                              <p className="text-xl font-semibold">{crop}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {soilResult.recommendations?.fertilizer && (
                      <div className="bg-primary/10 p-6 rounded-lg mb-6">
                        <p className="text-2xl font-bold mb-4">💊 Fertilizer:</p>
                        <ul className="text-lg space-y-2">
                          {soilResult.recommendations.fertilizer.slice(0, 3).map((item: string, idx: number) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full h-20 text-2xl font-bold"
                      onClick={() => {
                        setSoilResult(null);
                        setSoilImage(null);
                      }}
                    >
                      🔄 Check Another Soil
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  size="lg"
                  className="w-full h-32 text-3xl font-bold touch-target-large"
                  onClick={handleSelfAnalysis}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-12 w-12 mr-4 animate-spin" />
                      Checking Soil...
                    </>
                  ) : (
                    <>
                      <span className="text-5xl mr-4">🔬</span>
                      Analyze My Soil
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;