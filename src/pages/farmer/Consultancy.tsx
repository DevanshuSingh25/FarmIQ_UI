import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, Star, Search, User, X, Send, PhoneOff, Award, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FarmIQNavbar } from "@/components/farmiq/FarmIQNavbar";

interface Expert {
    id: number;
    name: string;
    experience_years: number;
    specializations: string[];
    rating: number;
    consultation_count: number;
    phone_number: string;
}

const Consultancy = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('All');
    const [availableSpecializations, setAvailableSpecializations] = useState<string[]>([]);

    // Modal states
    const [chatExpert, setChatExpert] = useState<Expert | null>(null);
    const [callExpert, setCallExpert] = useState<Expert | null>(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'expert', text: string }[]>([]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const fetchExperts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('q', searchTerm);
            if (specializationFilter && specializationFilter !== 'All') params.append('specialization', specializationFilter);

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://farmiq-ui-backend.onrender.com/api';
            const res = await fetch(`${API_BASE_URL}/experts?${params.toString()}`, {
                credentials: 'include', // Include cookies for session
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error('Failed to load experts');
            const json = await res.json();
            setExperts(json.data);

            if (availableSpecializations.length === 0) {
                const specs = new Set<string>();
                json.data.forEach((e: Expert) => {
                    e.specializations.forEach(s => specs.add(s));
                });
                setAvailableSpecializations(Array.from(specs));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperts();
    }, [searchTerm, specializationFilter]);

    // Chat handlers
    const openChat = (expert: Expert) => {
        setChatExpert(expert);
        setChatHistory([{ sender: 'expert', text: `Namaste! I am ${expert.name}. How can I help you today?` }]);
        setChatMessage('');
    };

    const sendChatMessage = () => {
        if (!chatMessage.trim()) return;

        const newHistory = [...chatHistory, { sender: 'user' as const, text: chatMessage }];
        setChatHistory(newHistory);
        setChatMessage('');

        // Simulate expert response
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                sender: 'expert',
                text: 'Thank you for your query. Let me analyze that for you.'
            }]);
        }, 1000);
    };

    // Call handlers
    const openCall = (expert: Expert) => {
        setCallExpert(expert);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <FarmIQNavbar
                theme={theme}
                language={language}
                onThemeToggle={toggleTheme}
                onLanguageChange={setLanguage}
            />

            <div className="container mx-auto p-6 space-y-8 pt-20">
                <div className="space-y-4 mb-8">
                    <h1 className="text-5xl font-bold text-gray-800 flex items-center gap-4">
                        <span className="text-6xl">👨‍⚕️</span> Expert Help
                    </h1>
                    <p className="text-2xl text-muted-foreground">
                        Talk to agricultural experts for advice
                    </p>
                </div>

                <div className="flex flex-col gap-6 bg-muted/30 p-6 rounded-2xl border-2 border-muted">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-5 h-8 w-8 text-gray-400" />
                        <Input
                            placeholder="🔍 Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-20 h-16 text-xl rounded-xl bg-white border-2 border-gray-200 focus-visible:ring-primary"
                        />
                    </div>
                    <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                        <SelectTrigger className="w-full h-16 text-xl rounded-xl bg-white border-2 border-gray-200">
                            <SelectValue placeholder="All Expertise" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                            <SelectItem value="All" className="text-lg py-3">All Expertise</SelectItem>
                            {availableSpecializations.map(spec => (
                                <SelectItem key={spec} value={spec} className="text-lg py-3">{spec}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Available Experts</h2>
                    <p className="text-sm text-gray-500">Choose the right specialist for your farming needs.</p>

                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : experts.length === 0 ? (
                        <div className="text-center p-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                            No experts found matching your criteria.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {experts.map((expert) => (
                                <Card key={expert.id} className="border-4 border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-3xl overflow-hidden">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200">
                                                <span className="text-4xl font-bold text-green-700">
                                                    {expert.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-bold text-gray-800 mb-1">{expert.name}</h3>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-sm px-3 py-1">
                                                    {expert.experience_years}+ Years Experience
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {expert.specializations.map((spec, idx) => (
                                                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 text-lg px-4 py-2 rounded-lg font-normal">
                                                    {spec}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                className="h-16 text-xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg active:scale-95 transition-transform"
                                                onClick={() => openChat(expert)}
                                            >
                                                <span className="mr-2 text-2xl">💬</span> Chat
                                            </Button>
                                            <Button
                                                className="h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg active:scale-95 transition-transform"
                                                onClick={() => openCall(expert)}
                                            >
                                                <span className="mr-2 text-2xl">📞</span> Call
                                            </Button>
                                        </div>
                                    </CardContent>
                                    <div className="bg-slate-50 px-8 py-4 flex justify-between items-center text-muted-foreground font-medium">
                                        <span className="flex items-center gap-2">⭐ {expert.rating.toFixed(1)} Rating</span>
                                        <span className="flex items-center gap-2">👥 {expert.consultation_count}+ Helped</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat Modal */}
                <Dialog open={!!chatExpert} onOpenChange={(open) => !open && setChatExpert(null)}>
                    <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-3xl h-[80vh] flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-green-50">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-lg border-2 border-green-300">
                                    {chatExpert?.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl">{chatExpert?.name}</h4>
                                    <div className="flex items-center text-sm text-green-700 font-medium">
                                        <span className="h-2 w-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
                                        Online Now
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-xl" onClick={() => setChatExpert(null)}>✕</Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-3xl px-6 py-4 text-lg font-medium leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-green-100 text-green-900 rounded-tr-none'
                                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t bg-slate-50">
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Type a message..."
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                                    className="flex-1 h-14 text-lg rounded-2xl border-2 border-slate-200"
                                />
                                <Button size="icon" className="h-14 w-14 rounded-2xl bg-green-600 hover:bg-green-700" onClick={sendChatMessage}>
                                    <Send className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Call Modal */}
                <Dialog open={!!callExpert} onOpenChange={(open) => !open && setCallExpert(null)}>
                    <DialogContent className="sm:max-w-md text-center p-8 rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-center text-2xl font-bold">Connecting Call...</DialogTitle>
                        </DialogHeader>
                        <div className="py-8 flex flex-col items-center justify-center space-y-8">
                            <div className="relative">
                                <div className="h-40 w-40 rounded-full bg-green-100 flex items-center justify-center animate-pulse border-4 border-green-200">
                                    <div className="h-32 w-32 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                        <Phone className="h-16 w-16 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-medium text-gray-900">Calling {callExpert?.name}</h3>
                                <p className="text-green-600 font-medium">Use Farmer Helpline Number for free call</p>
                            </div>

                            <Button
                                className="w-full h-16 text-xl font-bold bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-lg"
                                onClick={() => setCallExpert(null)}
                            >
                                <PhoneOff className="h-6 w-6 mr-3" />
                                End Call
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Consultancy;
