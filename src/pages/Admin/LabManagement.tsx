import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Loader2, Plus } from 'lucide-react';
import { getAPIBaseURL } from '@/utils/api';

interface Lab {
    id: number;
    name: string;
    location: string;
    contact_number: string;
    price: number;
    rating: number;
    tag: string;
}

export default function LabManagement() {
    const [labs, setLabs] = useState<Lab[]>([]);
    const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editLab, setEditLab] = useState<Lab | null>(null);
    const [deleteLab, setDeleteLab] = useState<Lab | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();
    const API_BASE_URL = getAPIBaseURL();

    useEffect(() => {
        fetchLabs();
    }, []);

    useEffect(() => {
        const filtered = labs.filter(
            (lab) =>
                lab.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lab.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLabs(filtered);
    }, [labs, searchTerm]);

    const fetchLabs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/labs`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch labs');
            const data = await response.json();
            setLabs(data);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load labs', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editLab) return;
        setSubmitting(true);
        try {
            const url = isNew ? `${API_BASE_URL}/admin/labs` : `${API_BASE_URL}/admin/labs/${editLab.id}`;
            const response = await fetch(url, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editLab),
            });
            if (!response.ok) throw new Error('Failed to save lab');
            toast({ title: 'Success', description: `Lab ${isNew ? 'created' : 'updated'} successfully` });
            setEditLab(null);
            setIsNew(false);
            fetchLabs();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save lab', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteLab) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/labs/${deleteLab.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete lab');
            toast({ title: 'Success', description: 'Lab deleted successfully' });
            setDeleteLab(null);
            fetchLabs();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete lab', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleNew = () => {
        setEditLab({ id: 0, name: '', location: '', contact_number: '', price: 0, rating: 0, tag: '' });
        setIsNew(true);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <span className="text-5xl">🧪</span> Lab Management
                </h2>
                <p className="text-xl text-gray-500">Manage soil testing laboratories</p>
            </div>

            <Card className="shadow-md border-0 bg-white">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <span>🔍</span> Search Labs
                        </CardTitle>
                        <Button onClick={handleNew} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all flex items-center gap-2">
                            <Plus className="h-5 w-5" /> Add Lab
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                        <Input
                            placeholder="Search labs by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-14 h-14 text-lg rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white overflow-hidden rounded-2xl">
                <CardHeader className="bg-gray-50/50 border-b pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-800">Soil Labs ({filteredLabs.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="py-5 pl-6 text-lg font-semibold w-[80px]">ID</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Name</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Location</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Contact</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Price</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Rating</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Tag</TableHead>
                                <TableHead className="py-5 pr-6 text-lg font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLabs.map((lab) => (
                                <TableRow key={lab.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
                                    <TableCell className="py-4 pl-6 font-medium text-gray-600">#{lab.id}</TableCell>
                                    <TableCell className="py-4 font-bold text-gray-800 text-lg">{lab.name}</TableCell>
                                    <TableCell className="py-4 text-gray-600">{lab.location}</TableCell>
                                    <TableCell className="py-4 font-mono text-sm">{lab.contact_number}</TableCell>
                                    <TableCell className="py-4 font-bold text-green-700">₹{lab.price}</TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-gray-800">{lab.rating}</span>
                                            <span className="text-yellow-400 text-lg">⭐</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold shadow-sm border border-blue-200">
                                            {lab.tag}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 pr-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="outline" className="h-10 w-10 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700" onClick={() => { setEditLab(lab); setIsNew(false); }} title="Edit Lab">
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                            <Button size="icon" variant="destructive" className="h-10 w-10 shadow-sm" onClick={() => setDeleteLab(lab)} title="Delete Lab">
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!editLab} onOpenChange={() => { setEditLab(null); setIsNew(false); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isNew ? 'Add New Lab' : 'Edit Lab'}</DialogTitle>
                    </DialogHeader>
                    {editLab && (
                        <div className="grid gap-4">
                            <div><Label>Name</Label><Input value={editLab.name} onChange={(e) => setEditLab({ ...editLab, name: e.target.value })} /></div>
                            <div><Label>Location</Label><Input value={editLab.location} onChange={(e) => setEditLab({ ...editLab, location: e.target.value })} /></div>
                            <div><Label>Contact Number</Label><Input value={editLab.contact_number} onChange={(e) => setEditLab({ ...editLab, contact_number: e.target.value })} /></div>
                            <div><Label>Price</Label><Input type="number" value={editLab.price} onChange={(e) => setEditLab({ ...editLab, price: parseFloat(e.target.value) })} /></div>
                            <div><Label>Rating</Label><Input type="number" step="0.1" max="5" value={editLab.rating} onChange={(e) => setEditLab({ ...editLab, rating: parseFloat(e.target.value) })} /></div>
                            <div><Label>Tag</Label><Input value={editLab.tag} onChange={(e) => setEditLab({ ...editLab, tag: e.target.value })} /></div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setEditLab(null); setIsNew(false); }}>Cancel</Button>
                        <Button onClick={handleSave} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteLab} onOpenChange={() => setDeleteLab(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Lab</DialogTitle>
                        <DialogDescription>Are you sure you want to delete {deleteLab?.name}?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteLab(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
