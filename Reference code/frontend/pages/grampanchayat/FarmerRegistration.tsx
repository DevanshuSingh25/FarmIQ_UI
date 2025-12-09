import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, UserPlus, Users, Baby, Shield } from 'lucide-react';

// Form validation schema
const farmerRegistrationSchema = z.object({
    // Base farmer fields
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    language_pref: z.string().optional(),
    location: z.string().min(2, 'Location is required'),
    crops_grown: z.string().optional(),

    // Marital Information
    marital_status: z.enum(['Married', 'Unmarried', 'Widowed', 'Divorced']),
    spouse_name: z.string().optional(),
    spouse_age: z.string().optional(),
    spouse_aadhaar: z.string().optional(),
    spouse_occupation: z.string().optional(),
    caste_category: z.string().optional(),
    household_income: z.string().optional(),
    has_bank_account: z.boolean().optional(),
    disability_status: z.string().optional(),

    // Children Details
    number_of_children: z.string().optional(),

    // Service Eligibility
    has_service: z.boolean().optional(),
    relation_to_serviceperson: z.string().optional(),
    service_type: z.string().optional(),
    service_certificate_number: z.string().optional(),
    service_id_number: z.string().optional(),
    issuing_authority: z.string().optional(),
    year_of_service: z.string().optional(),
    discharge_date: z.string().optional(),
});

type FarmerRegistrationData = z.infer<typeof farmerRegistrationSchema>;

interface ChildDetail {
    child_number: number;
    age: string;
    gender: string;
    in_school: boolean;
    disability_status: string;
}

export default function FarmerRegistration() {
    const navigate = useNavigate();
    const [children, setChildren] = useState<ChildDetail[]>([]);
    const [showSpouseFields, setShowSpouseFields] = useState(false);
    const [showServiceFields, setShowServiceFields] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FarmerRegistrationData>({
        resolver: zodResolver(farmerRegistrationSchema),
        defaultValues: {
            has_bank_account: false,
            has_service: false,
        },
    });

    const maritalStatus = watch('marital_status');
    const numberOfChildren = watch('number_of_children');
    const hasService = watch('has_service');

    // Update spouse fields visibility
    const handleMaritalStatusChange = (value: string) => {
        setValue('marital_status', value as any);
        setShowSpouseFields(value === 'Married');
    };

    // Update children array when number changes
    const handleChildrenCountChange = (value: string) => {
        setValue('number_of_children', value);
        const count = parseInt(value) || 0;
        const newChildren: ChildDetail[] = [];
        for (let i = 0; i < count; i++) {
            newChildren.push({
                child_number: i + 1,
                age: children[i]?.age || '',
                gender: children[i]?.gender || 'Male',
                in_school: children[i]?.in_school || false,
                disability_status: children[i]?.disability_status || 'None',
            });
        }
        setChildren(newChildren);
    };

    const updateChild = (index: number, field: keyof ChildDetail, value: any) => {
        const updated = [...children];
        updated[index] = { ...updated[index], [field]: value };
        setChildren(updated);
    };

    const onSubmit = async (data: FarmerRegistrationData) => {
        try {
            console.log('Submitting farmer registration:', {
                ...data,
                children_details: children,
                role: 'farmer', // Always farmer
            });

            // TODO: Call API to create farmer with extended data
            alert('Farmer registration successful! (API integration pending)');
            navigate('/grampanchayat/farmers');
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/grampanchayat/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Farmer Profile</h1>
                        <p className="text-gray-500">Register a new farmer with extended details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Section 1: Basic Farmer Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-green-600" />
                                <CardTitle>Basic Information</CardTitle>
                            </div>
                            <CardDescription>Essential farmer details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="full_name">Full Name *</Label>
                                    <Input
                                        id="full_name"
                                        {...register('full_name')}
                                        placeholder="Enter full name"
                                    />
                                    {errors.full_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        placeholder="farmer@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        {...register('phone')}
                                        placeholder="10-digit number"
                                        maxLength={10}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register('password')}
                                        placeholder="Min 6 characters"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        {...register('location')}
                                        placeholder="Village, District"
                                    />
                                    {errors.location && (
                                        <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="crops_grown">Crops Grown</Label>
                                    <Input
                                        id="crops_grown"
                                        {...register('crops_grown')}
                                        placeholder="e.g., Wheat, Rice"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 2: Marital Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <CardTitle>Marital Information</CardTitle>
                            </div>
                            <CardDescription>Family and household details (text-based only)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="marital_status">Marital Status *</Label>
                                <Select onValueChange={handleMaritalStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select marital status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Married">Married</SelectItem>
                                        <SelectItem value="Unmarried">Unmarried</SelectItem>
                                        <SelectItem value="Widowed">Widowed</SelectItem>
                                        <SelectItem value="Divorced">Divorced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {showSpouseFields && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="spouse_name">Spouse Name</Label>
                                        <Input
                                            id="spouse_name"
                                            {...register('spouse_name')}
                                            placeholder="Spouse's full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="spouse_age">Spouse Age</Label>
                                        <Input
                                            id="spouse_age"
                                            type="number"
                                            {...register('spouse_age')}
                                            placeholder="Age"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="spouse_aadhaar">Spouse Aadhaar Number</Label>
                                        <Input
                                            id="spouse_aadhaar"
                                            {...register('spouse_aadhaar')}
                                            placeholder="12-digit Aadhaar"
                                            maxLength={12}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="spouse_occupation">Spouse Occupation</Label>
                                        <Select onValueChange={(value) => setValue('spouse_occupation', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select occupation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Housewife">Housewife</SelectItem>
                                                <SelectItem value="Farmer Woman">Farmer Woman</SelectItem>
                                                <SelectItem value="Service">Service</SelectItem>
                                                <SelectItem value="Business">Business</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="caste_category">Caste Category</Label>
                                    <Select onValueChange={(value) => setValue('caste_category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="General">General</SelectItem>
                                            <SelectItem value="OBC">OBC</SelectItem>
                                            <SelectItem value="SC">SC</SelectItem>
                                            <SelectItem value="ST">ST</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="household_income">Annual Household Income (₹)</Label>
                                    <Input
                                        id="household_income"
                                        {...register('household_income')}
                                        placeholder="e.g., 200000"
                                        type="number"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="has_bank_account"
                                        onCheckedChange={(checked) => setValue('has_bank_account', checked as boolean)}
                                    />
                                    <Label htmlFor="has_bank_account" className="cursor-pointer">
                                        Has Bank Account
                                    </Label>
                                </div>
                                <div>
                                    <Label htmlFor="disability_status">Disability Status (Family)</Label>
                                    <Input
                                        id="disability_status"
                                        {...register('disability_status')}
                                        placeholder="e.g., None, or specify disability"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 3: Children Details */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Baby className="h-5 w-5 text-purple-600" />
                                <CardTitle>Children Details</CardTitle>
                            </div>
                            <CardDescription>Information about children (for welfare schemes)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-w-xs">
                                <Label htmlFor="number_of_children">Number of Children</Label>
                                <Select onValueChange={handleChildrenCountChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">0 (No children)</SelectItem>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="6">6+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {children.length > 0 && (
                                <div className="space-y-4">
                                    {children.map((child, index) => (
                                        <div key={index} className="p-4 bg-purple-50 rounded-lg space-y-3">
                                            <h4 className="font-medium text-purple-900">Child {child.child_number}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <Label>Age</Label>
                                                    <Input
                                                        type="number"
                                                        value={child.age}
                                                        onChange={(e) => updateChild(index, 'age', e.target.value)}
                                                        placeholder="Age"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Gender</Label>
                                                    <Select
                                                        value={child.gender}
                                                        onValueChange={(value) => updateChild(index, 'gender', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`in_school_${index}`}
                                                        checked={child.in_school}
                                                        onCheckedChange={(checked) => updateChild(index, 'in_school', checked)}
                                                    />
                                                    <Label htmlFor={`in_school_${index}`} className="cursor-pointer">
                                                        In School
                                                    </Label>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <Label>Disability Status</Label>
                                                    <Input
                                                        value={child.disability_status}
                                                        onChange={(e) => updateChild(index, 'disability_status', e.target.value)}
                                                        placeholder="None or specify"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Section 4: National Service Eligibility */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-orange-600" />
                                <CardTitle>National Service Eligibility</CardTitle>
                            </div>
                            <CardDescription>Ex-servicemen details (TEXT ONLY - no document uploads)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="has_service"
                                    onCheckedChange={(checked) => {
                                        setValue('has_service', checked as boolean);
                                        setShowServiceFields(checked as boolean);
                                    }}
                                />
                                <Label htmlFor="has_service" className="cursor-pointer font-medium">
                                    Family member has served in national service (Army/Navy/Air Force/CAPF/Paramilitary)
                                </Label>
                            </div>

                            {showServiceFields && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="relation_to_serviceperson">Relation to Serviceperson</Label>
                                        <Select onValueChange={(value) => setValue('relation_to_serviceperson', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select relation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Self">Self</SelectItem>
                                                <SelectItem value="Father">Father</SelectItem>
                                                <SelectItem value="Mother">Mother</SelectItem>
                                                <SelectItem value="Spouse">Spouse</SelectItem>
                                                <SelectItem value="Child">Child</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="service_type">Service Type</Label>
                                        <Select onValueChange={(value) => setValue('service_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Army">Army</SelectItem>
                                                <SelectItem value="Navy">Navy</SelectItem>
                                                <SelectItem value="Air Force">Air Force</SelectItem>
                                                <SelectItem value="CAPF">CAPF</SelectItem>
                                                <SelectItem value="Paramilitary">Paramilitary</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="service_certificate_number">Service Certificate Number</Label>
                                        <Input
                                            id="service_certificate_number"
                                            {...register('service_certificate_number')}
                                            placeholder="Certificate number"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="service_id_number">Service ID Number</Label>
                                        <Input
                                            id="service_id_number"
                                            {...register('service_id_number')}
                                            placeholder="Service ID"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="issuing_authority">Issuing Authority</Label>
                                        <Input
                                            id="issuing_authority"
                                            {...register('issuing_authority')}
                                            placeholder="e.g., Indian Army HQ"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="year_of_service">Year of Service</Label>
                                        <Input
                                            id="year_of_service"
                                            type="number"
                                            {...register('year_of_service')}
                                            placeholder="e.g., 2010"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="discharge_date">Discharge Date</Label>
                                        <Input
                                            id="discharge_date"
                                            type="date"
                                            {...register('discharge_date')}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/grampanchayat/dashboard')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Create Farmer Profile
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
