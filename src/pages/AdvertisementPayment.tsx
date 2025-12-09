import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Upload, Copy, Check, Clock, IndianRupee } from 'lucide-react';

interface AdPlan {
    id: number;
    name: string;
    price: number;
    duration: string;
    image: string;
}

export default function AdvertisementPayment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const plan = location.state?.plan as AdPlan;

    const [copied, setCopied] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const upiId = "farmiq-ads@upi";

    if (!plan) {
        navigate('/advertisement/plans');
        return null;
    }

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        toast({
            title: 'Copied!',
            description: 'UPI ID copied to clipboard',
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type (images only)
            if (!file.type.startsWith('image/')) {
                toast({
                    title: 'Invalid File',
                    description: 'Please upload an image file',
                    variant: 'destructive',
                });
                return;
            }

            setUploadedFile(file);
            toast({
                title: 'File Selected',
                description: `${file.name} ready to upload`,
            });
        }
    };

    const handleCompletePayment = async () => {
        if (!uploadedFile) {
            toast({
                title: 'Upload Required',
                description: 'Please upload your advertisement file',
                variant: 'destructive',
            });
            return;
        }

        try {
            setUploading(true);

            // Simulate upload and payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast({
                title: 'Advertisement Submitted! 🎉',
                description: 'Your ad will be reviewed and activated within 24 hours',
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            toast({
                title: 'Submission Failed',
                description: 'Please try again',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-3">Complete Your Advertisement Payment</h1>
                    <p className="text-xl text-muted-foreground">
                        {plan.name} - ₹{plan.price} ({plan.duration})
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Payment Section */}
                    <Card className="border-2 border-blue-300">
                        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                            <CardTitle className="text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    ₹{plan.price}
                                </div>
                                <p className="text-sm text-muted-foreground">Payment Required</p>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* QR Code Placeholder */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-4 border-dashed border-gray-300 mb-6">
                                <div className="aspect-square max-w-[240px] mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-5xl mb-2">📱</div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Scan with UPI app</p>
                                        <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                                    </div>
                                </div>
                            </div>

                            {/* UPI ID */}
                            <div className="mb-6">
                                <Label className="text-sm font-medium mb-2 block">Or pay using UPI ID:</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-300">
                                        <code className="text-sm font-mono font-bold">{upiId}</code>
                                    </div>
                                    <Button
                                        onClick={handleCopyUPI}
                                        variant="outline"
                                        size="icon"
                                        className="h-12 w-12"
                                    >
                                        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Plan Duration:</span>
                                    <span className="flex items-center gap-1 font-bold">
                                        <Clock className="h-4 w-4" />
                                        {plan.duration}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Amount:</span>
                                    <span className="flex items-center gap-1 text-lg font-bold text-blue-600">
                                        <IndianRupee className="h-5 w-5" />
                                        {plan.price}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upload Section */}
                    <Card className="border-2 border-green-300">
                        <CardHeader className="bg-green-50 dark:bg-green-900/20">
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-6 w-6" />
                                Upload Advertisement
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6">
                            <div className="mb-6">
                                <Label htmlFor="ad-file" className="text-sm font-medium mb-3 block">
                                    Upload your advertisement image:
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <Input
                                        id="ad-file"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <Label htmlFor="ad-file" className="cursor-pointer">
                                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                                            Click to upload
                                        </span>
                                        <span className="text-sm text-muted-foreground block mt-1">
                                            or drag and drop
                                        </span>
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        PNG, JPG up to 10MB
                                    </p>
                                </div>

                                {uploadedFile && (
                                    <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{uploadedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Instructions */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
                                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Advertisement Guidelines:
                                </h4>
                                <ul className="text-xs space-y-1 text-muted-foreground ml-6">
                                    <li>• Image should be clear and high quality</li>
                                    <li>• Include contact details in the image</li>
                                    <li>• Farm-related products/services only</li>
                                    <li>• No inappropriate content</li>
                                </ul>
                            </div>

                            <Button
                                onClick={handleCompletePayment}
                                disabled={!uploadedFile || uploading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-6"
                                size="lg"
                            >
                                {uploading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-5 w-5" />
                                        Submit Advertisement
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Section */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-blue-200">
                    <CardContent className="p-6">
                        <h4 className="font-bold mb-3 text-center">What happens next?</h4>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-center">
                            <div>
                                <div className="text-3xl mb-2">💳</div>
                                <p className="font-medium">1. Complete Payment</p>
                                <p className="text-muted-foreground text-xs">Pay via UPI</p>
                            </div>
                            <div>
                                <div className="text-3xl mb-2">📤</div>
                                <p className="font-medium">2. Upload Ad File</p>
                                <p className="text-muted-foreground text-xs">Submit your image</p>
                            </div>
                            <div>
                                <div className="text-3xl mb-2">✅</div>
                                <p className="font-medium">3. Go Live</p>
                                <p className="text-muted-foreground text-xs">Within 24 hours</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
