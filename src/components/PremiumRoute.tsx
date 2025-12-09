import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { premiumService } from '@/services/premiumService';
import { Loader2 } from 'lucide-react';

interface PremiumRouteProps {
    children: ReactNode;
}

export function PremiumRoute({ children }: PremiumRouteProps) {
    const [isPremium, setIsPremium] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkPremiumStatus();
    }, []);

    const checkPremiumStatus = async () => {
        try {
            const status = await premiumService.getStatus();
            setIsPremium(status.is_premium);
        } catch (error) {
            console.error('Premium check failed:', error);
            setIsPremium(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isPremium) {
        return <Navigate to="/farmer/premium/upgrade" replace />;
    }

    return <>{children}</>;
}
