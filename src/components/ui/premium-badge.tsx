import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PremiumBadge() {
    return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none shadow-md hover:from-yellow-500 hover:to-orange-600">
            <Crown className="h-3 w-3 mr-1" fill="currentColor" />
            PREMIUM
        </Badge>
    );
}
