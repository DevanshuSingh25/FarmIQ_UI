const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://farmiq-ui-backend.onrender.com/api';

export interface PremiumStatus {
    is_premium: boolean;
    activated_at?: string | null;
    expires_at?: string | null;
}

class PremiumService {
    async getStatus(): Promise<PremiumStatus> {
        const res = await fetch(`${API_BASE_URL}/premium/status`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) throw new Error('Failed to get premium status');
        return res.json();
    }

    async activate(): Promise<{ success: boolean; message: string }> {
        const res = await fetch(`${API_BASE_URL}/premium/activate`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) throw new Error('Failed to activate premium');
        return res.json();
    }

    async deactivate(): Promise<{ success: boolean; message: string }> {
        const res = await fetch(`${API_BASE_URL}/premium/deactivate`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) throw new Error('Failed to deactivate premium');
        return res.json();
    }
}

export const premiumService = new PremiumService();
