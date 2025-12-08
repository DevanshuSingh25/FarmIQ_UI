import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { FarmIQNavbar } from "@/components/farmiq/FarmIQNavbar";
import { Search, Building2, Calendar, MapPin, ExternalLink, Phone, FileText, Loader2, Filter, ChevronRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { filterEligibleSchemes, type NgoScheme, type EligibilityFilters } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// List of Indian states
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CATEGORIES = [
  { value: "SC", label: "SC", emoji: "📋" },
  { value: "ST", label: "ST", emoji: "📝" },
  { value: "OBC", label: "OBC", emoji: "📄" },
  { value: "GEN", label: "General", emoji: "👤" }
];

interface NGOScheme {
  id: string;
  title: string;
  organization: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationDeadline: string;
  location: string;
  category: string;
  contactPhone: string;
  documentsRequired: string[];
  status: 'Active' | 'Upcoming' | 'Closed';
  schemeType?: string;
  officialLink?: string;
  minLand?: number;
  maxLand?: number;
  requiredCategory?: string;
}

// Map DB schema to UI schema
function mapDBSchemeToUI(dbScheme: NgoScheme): NGOScheme {
  return {
    id: dbScheme.id.toString(),
    title: dbScheme.name || 'Untitled Scheme',
    organization: dbScheme.ministry || 'Government',
    description: dbScheme.benefit_text || 'No description available',
    eligibility: dbScheme.eligibility_text ? [dbScheme.eligibility_text] : [],
    benefits: dbScheme.benefit_text ? [dbScheme.benefit_text] : [],
    applicationDeadline: dbScheme.deadline || new Date().toISOString().split('T')[0],
    location: dbScheme.location || dbScheme.required_state || 'India',
    category: dbScheme.scheme_type === 'government' ? 'Government Scheme' : 'NGO Scheme',
    contactPhone: dbScheme.contact_number || 'Not available',
    documentsRequired: Array(dbScheme.no_of_docs_required || 0).fill('Document required'),
    status: (dbScheme.status === 'active' ? 'Active' : dbScheme.status === 'upcoming' ? 'Upcoming' : 'Closed') as 'Active' | 'Upcoming' | 'Closed',
    schemeType: dbScheme.required_state === 'ALL' ? 'Central' : dbScheme.required_state || 'Central',
    officialLink: dbScheme.official_link,
    minLand: dbScheme.min_land,
    maxLand: dbScheme.max_land,
    requiredCategory: dbScheme.required_category
  };
}

const NGOSchemes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [currentStep, setCurrentStep] = useState(1); // 1: Category, 2: Details, 3: Results
  const [state, setState] = useState<string>('');
  const [landSize, setLandSize] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [age, setAge] = useState<string>('');

  // Results and UI state
  const [schemes, setSchemes] = useState<NGOScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchemeType, setSelectedSchemeType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const handleCategorySelect = (catValue: string) => {
    setCategory(catValue);
    setCurrentStep(2);
  };

  const handleFindSchemes = async () => {
    // Validate input
    if (!state && !landSize && !category && !age) {
      toast({
        title: 'Input Required',
        description: 'Please fill at least one criteria to find eligible schemes',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const filters: EligibilityFilters = {
        state: state || undefined,
        land: landSize ? parseFloat(landSize) : undefined,
        category: category || undefined,
        age: age ? parseInt(age) : undefined,
      };

      console.log('🔍 Submitting filters:', filters);

      const eligibleSchemes = await filterEligibleSchemes(filters);
      const uiSchemes = eligibleSchemes.map(mapDBSchemeToUI);

      setSchemes(uiSchemes);
      setCurrentStep(3);

      toast({
        title: 'Success',
        description: `Found ${uiSchemes.length} eligible schemes`,
      });
    } catch (error) {
      console.error('Error fetching eligible schemes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch eligible schemes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setCurrentStep(1);
    setSchemes([]);
    setCategory('');
    setState('');
    setLandSize('');
    setAge('');
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchemeType = selectedSchemeType === 'all' ||
      (selectedSchemeType === 'Central' && scheme.schemeType === 'Central') ||
      (selectedSchemeType !== 'Central' && scheme.schemeType === selectedSchemeType);
    const matchesStatus = selectedStatus === 'all' || scheme.status === selectedStatus;

    return matchesSearch && matchesSchemeType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Upcoming': return 'warning';
      case 'Closed': return 'destructive';
      default: return 'secondary';
    }
  };

  const schemeTypes = ['all', 'Central', 'Punjab'];
  const statuses = ['all', 'Active', 'Upcoming', 'Closed'];

  return (
    <div className="min-h-screen bg-background">
      <FarmIQNavbar
        theme={theme}
        language={language}
        onThemeToggle={toggleTheme}
        onLanguageChange={setLanguage}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              🏛️ Government Schemes
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Find benefits tailored for you in 3 simple steps
            </p>
          </div>
          <SectionSpeaker
            getText={() => "Government Schemes Checker. Step 1: Select your category. Step 2: Enter your details. Step 3: See eligible schemes."}
            sectionId="schemes-header"
            ariaLabel="Listen to instructions"
            alwaysVisible
          />
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12 gap-8">
          <div className={`text-center transition-opacity duration-300 ${currentStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 transition-all duration-300 ${currentStep === 1 ? 'bg-primary/20 ring-4 ring-primary scale-110' : 'bg-muted'}`}>
              📋
            </div>
            <p className="text-lg font-semibold">Category</p>
          </div>
          <div className="flex items-center">
            <div className={`w-16 h-1 transition-colors duration-300 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className={`text-center transition-opacity duration-300 ${currentStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 transition-all duration-300 ${currentStep === 2 ? 'bg-primary/20 ring-4 ring-primary scale-110' : 'bg-muted'}`}>
              📝
            </div>
            <p className="text-lg font-semibold">Details</p>
          </div>
          <div className="flex items-center">
            <div className={`w-16 h-1 transition-colors duration-300 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className={`text-center transition-opacity duration-300 ${currentStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-2 transition-all duration-300 ${currentStep === 3 ? 'bg-primary/20 ring-4 ring-primary scale-110' : 'bg-muted'}`}>
              🎁
            </div>
            <p className="text-lg font-semibold">Benifits</p>
          </div>
        </div>

        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-center mb-10">Select Your Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {CATEGORIES.map((cat) => (
                <Card
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  className="cursor-pointer hover:scale-105 active:scale-95 transition-all touch-target-large border-[3px] hover:border-primary group"
                >
                  <CardContent className="p-10 text-center">
                    <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                      {cat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Enter Details */}
        {currentStep === 2 && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <Badge variant="outline" className="text-lg py-1 px-4 mb-4">
                Selected: {CATEGORIES.find(c => c.value === category)?.label} {CATEGORIES.find(c => c.value === category)?.emoji}
              </Badge>
              <h2 className="text-3xl font-bold mb-2">Enter Your Details</h2>
              <p className="text-muted-foreground">We'll find the best schemes for you</p>
            </div>

            <Card className="border-[3px] border-primary/20 shadow-lg">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label className="text-xl font-semibold flex items-center gap-2">
                    📍 State
                  </Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger className="h-16 text-xl border-2">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="text-lg py-3">🇮🇳 All India</SelectItem>
                      {INDIAN_STATES.map(s => (
                        <SelectItem key={s} value={s} className="text-lg py-3">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold flex items-center gap-2">
                      🌾 Land Size (Hectares)
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 1.5"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      className="h-16 text-xl border-2"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xl font-semibold flex items-center gap-2">
                      🎂 Age (Years)
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 35"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="h-16 text-xl border-2"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 px-8 text-xl"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleFindSchemes}
                    className="flex-1 h-16 text-xl font-bold shadow-md hover:shadow-xl transition-all"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin mr-3" />
                        Finding Best Schemes...
                      </>
                    ) : (
                      <>
                        🚀 Find Eligible Schemes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-muted/30 p-6 rounded-2xl border-2">
              <div>
                <h2 className="text-2xl font-bold">🎯 Found {filteredSchemes.length} Schemes</h2>
                <p className="text-muted-foreground">Based on your profile</p>
              </div>
              <Button onClick={resetSearch} variant="outline" size="lg" className="gap-2">
                <RefreshCw className="h-5 w-5" />
                Start Over
              </Button>
            </div>

            {/* Results Grid */}
            <div className="grid gap-6">
              {filteredSchemes.map((scheme) => (
                <Card key={scheme.id} className="border-[3px] hover:border-primary transition-all hover:shadow-lg group">
                  <CardHeader className="bg-muted/10 pb-6 border-b">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl bg-white p-2 rounded-lg shadow-sm">📜</span>
                          <div>
                            <CardTitle className="text-2xl font-bold text-primary">
                              {scheme.title}
                            </CardTitle>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                              <Building2 className="h-4 w-4" /> {scheme.organization}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={getStatusColor(scheme.status) as any} className="text-sm px-3 py-1">
                            {scheme.status}
                          </Badge>
                          <Badge variant="outline" className="text-sm px-3 py-1 bg-background">
                            {scheme.schemeType}
                          </Badge>
                        </div>
                      </div>
                      <SectionSpeaker
                        getText={() => `${scheme.title}. ${scheme.description}`}
                        sectionId={`scheme-${scheme.id}`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {scheme.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900">
                        <h4 className="font-bold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                          ✅ Benefits
                        </h4>
                        <ul className="space-y-2">
                          {scheme.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                              <span className="mt-1 text-green-600">•</span> {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900">
                        <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-2">
                          📋 Eligibility
                        </h4>
                        <ul className="space-y-2">
                          {scheme.eligibility.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                              <span className="mt-1 text-blue-600">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm font-medium">
                        <Calendar className="h-4 w-4" />
                        Deadline: {new Date(scheme.applicationDeadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        {scheme.location}
                      </div>
                      {scheme.officialLink && (
                        <Button
                          className="ml-auto gap-2"
                          onClick={() => window.open(scheme.officialLink, '_blank')}
                        >
                          Visit Website <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredSchemes.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
                  <div className="text-8xl mb-6 grayscale opacity-50">🤷</div>
                  <h3 className="text-2xl font-bold mb-2">No schemes found</h3>
                  <p className="text-lg text-muted-foreground mb-8">
                    We couldn't find any schemes matching your criteria.
                  </p>
                  <Button onClick={() => setCurrentStep(2)} size="lg" variant="outline">
                    Modify Details
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOSchemes;