import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { FarmIQNavbar } from "@/components/farmiq/FarmIQNavbar";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { callInferenceApi } from "@/services/predictionService";
import { getDiseaseInfo } from "@/utils/predictionUtils";

interface Detection {
  id: string;
  crop: string;
  image: string;
  result: string;
  cause: string;
  remedies: string;
  date: string;
}

const CropDiseaseDetection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  // Form state
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<Detection | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Crop, 3: Analyze

  // Crop list with emojis
  const crops = [
    { name: "Tomato", emoji: "🍅" },
    { name: "Potato", emoji: "🥔" },
    { name: "Pepper", emoji: "🌶️" },
    { name: "Corn", emoji: "🌽" },
    { name: "Apple", emoji: "🍎" },
    { name: "Grape", emoji: "🍇" },
    { name: "Orange", emoji: "🍊" },
    { name: "Peach", emoji: "🍑" },
    { name: "Cherry", emoji: "🍒" },
    { name: "Strawberry", emoji: "🍓" },
    { name: "Blueberry", emoji: "🫐" },
    { name: "Raspberry", emoji: "🫐" },
    { name: "Soybean", emoji: "🫘" },
    { name: "Squash", emoji: "🎃" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image (JPG or PNG)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setCurrentStep(2); // Move to crop selection
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleCropSelect = (cropName: string) => {
    setSelectedCrop(cropName);
    setCurrentStep(3); // Move to analyze
  };

  const cleanDiseaseName = (name: string): string => {
    const parts = name.split('___');
    if (parts.length > 1) {
      return parts[1].replace(/_/g, ' ');
    }
    return name.replace(/_/g, ' ');
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedCrop) {
      toast({
        title: "Missing information",
        description: "Please upload image and select crop",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await callInferenceApi(selectedImage);
      const { class_name } = response;

      const info = getDiseaseInfo(class_name);
      const cleanedDiseaseName = cleanDiseaseName(class_name);

      const result: Detection = {
        id: `D${Date.now()}`,
        crop: selectedCrop,
        image: imagePreview || "",
        result: cleanedDiseaseName,
        cause: info.cause,
        remedies: info.treatment,
        date: new Date().toISOString().split('T')[0]
      };

      setCurrentResult(result);

      toast({
        title: "Analysis complete",
        description: `Disease detected: ${info.title}`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("fetch") || errorMessage.includes("Failed to fetch") || errorMessage.includes("CORS")) {
        toast({
          title: "Connection Error",
          description: "Cannot connect to prediction server. Please ensure the ML inference server is running.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis failed",
          description: errorMessage.includes("Prediction failed")
            ? errorMessage
            : "Unable to process image. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedCrop("");
    setCurrentResult(null);
    setCurrentStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          <h1 className="text-4xl font-bold">🔍 Plant Doctor</h1>
          <SectionSpeaker
            getText={() => "Plant Doctor. Upload a photo of your sick plant to identify the disease and get treatment suggestions"}
            sectionId="disease-detection-header"
            ariaLabel="Listen to instructions"
            alwaysVisible
          />
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12 gap-8">
          <div className={`text-center ${currentStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 ${currentStep === 1 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
              📸
            </div>
            <p className="text-lg font-semibold">Photo</p>
          </div>
          <div className="flex items-center">
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className={`text-center ${currentStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 ${currentStep === 2 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
              🌱
            </div>
            <p className="text-lg font-semibold">Crop</p>
          </div>
          <div className="flex items-center">
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className={`text-center ${currentStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 ${currentStep === 3 ? 'bg-primary/20 ring-4 ring-primary' : 'bg-muted'}`}>
              💊
            </div>
            <p className="text-lg font-semibold">Results</p>
          </div>
        </div>

        {/* Step 1: Upload Image */}
        {currentStep === 1 && !imagePreview && (
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-12">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="text-center space-y-8">
                <div className="text-8xl mb-6">📸</div>
                <h2 className="text-3xl font-bold">Take or Upload Plant Photo</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <Button
                    size="lg"
                    onClick={handleCameraCapture}
                    className="h-32 text-2xl font-bold flex-col gap-4 touch-target-large"
                  >
                    <span className="text-5xl">📷</span>
                    Take Photo
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 text-2xl font-bold flex-col gap-4 touch-target-large"
                  >
                    <span className="text-5xl">🖼️</span>
                    Choose from Gallery
                  </Button>
                </div>

                <p className="text-lg text-muted-foreground mt-8">
                  Take a clear photo of the sick leaf or plant part
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Crop (after image uploaded) */}
        {currentStep === 2 && imagePreview && !selectedCrop && (
          <div className="space-y-8">
            {/* Show uploaded image */}
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <img src={imagePreview} alt="Uploaded plant" className="w-full rounded-lg" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setCurrentStep(1);
                  }}
                  className="w-full mt-4"
                >
                  ↩️ Change Photo
                </Button>
              </CardContent>
            </Card>

            {/* Crop selection grid */}
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">What crop is this?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {crops.map((crop) => (
                  <Card
                    key={crop.name}
                    onClick={() => handleCropSelect(crop.name)}
                    className="cursor-pointer hover:scale-105 active:scale-95 transition-all touch-target-large border-[3px] hover:border-primary"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="text-6xl mb-3">{crop.emoji}</div>
                      <p className="text-xl font-semibold">{crop.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Analyze - Show image, selected crop, and analyze button */}
        {currentStep === 3 && imagePreview && selectedCrop && !currentResult && (
          <div className="max-w-3xl mx-auto space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-lg font-semibold mb-2">Your Photo:</p>
                    <img src={imagePreview} alt="Plant" className="w-full rounded-lg border-4 border-primary" />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-4">Selected Crop:</p>
                      <div className="text-8xl mb-4">
                        {crops.find(c => c.name === selectedCrop)?.emoji}
                      </div>
                      <p className="text-2xl font-bold">{selectedCrop}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="lg"
                  className="w-full h-24 text-3xl font-bold touch-target-large"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-8 w-8 mr-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span className="text-4xl mr-4">🔬</span>
                      Check for Disease
                    </>
                  )}
                </Button>

                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    ↩️ Change Crop
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      setCurrentStep(1);
                    }}
                    className="flex-1"
                  >
                    ↩️ Change Photo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Display */}
        {currentResult && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-4 border-success">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-8xl mb-4">✅</div>
                  <h2 className="text-3xl font-bold mb-2">Disease Found</h2>
                  <p className="text-2xl text-destructive font-semibold">{currentResult.result}</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-warning/10 p-6 rounded-lg border-[3px] border-warning">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">⚠️</span>
                      <div>
                        <p className="text-xl font-bold mb-2">Cause:</p>
                        <p className="text-lg">{currentResult.cause}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-success/10 p-6 rounded-lg border-[3px] border-success">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">💊</span>
                      <div>
                        <p className="text-xl font-bold mb-2">Treatment:</p>
                        <p className="text-lg">{currentResult.remedies}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={resetForm}
                  size="lg"
                  variant="outline"
                  className="w-full mt-8 h-20 text-2xl font-bold touch-target-large"
                >
                  <span className="text-3xl mr-4">🔄</span>
                  Check Another Plant
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropDiseaseDetection;