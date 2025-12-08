import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Loader2, Plus } from 'lucide-react';
import { getAPIBaseURL } from '@/utils/api';

interface Scheme {
    id: number;
    name: string;
    ministry: string;
    deadline: string;
    location: string;
    contact_number: string;
    no_of_docs_required: number;
    status: string;
    benefit_text: string;
    eligibility_text: string;
}

export default function SchemeManagement() {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editScheme, setEditScheme] = useState<Scheme | null>(null);
    const [deleteScheme, setDeleteScheme] = useState<Scheme | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();
    const API_BASE_URL = getAPIBaseURL();

    useEffect(() => {
        fetchSchemes();
    }, []);

    useEffect(() => {
        let filtered = schemes.filter(
            (s) =>
                s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.ministry?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (statusFilter !== 'all') {
            filtered = filtered.filter((s) => s.status === statusFilter);
        }
        setFilteredSchemes(filtered);
    }, [schemes, searchTerm, statusFilter]);

    const fetchSchemes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/schemes`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch schemes');
            const data = await response.json();
            setSchemes(data);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load schemes', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editScheme) return;
        setSubmitting(true);
        try {
            const url = isNew ? `${API_BASE_URL}/admin/schemes` : `${API_BASE_URL}/admin/schemes/${editScheme.id}`;
            const response = await fetch(url, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editScheme),
            });
            if (!response.ok) throw new Error('Failed to save scheme');
            toast({ title: 'Success', description: `Scheme ${isNew ? 'created' : 'updated'} successfully` });
            setEditScheme(null);
            setIsNew(false);
            fetchSchemes();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save scheme', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteScheme) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/schemes/${deleteScheme.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete scheme');
            toast({ title: 'Success', description: 'Scheme deleted successfully' });
            setDeleteScheme(null);
            fetchSchemes();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete scheme', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleNew = () => {
        setEditScheme({
            id: 0,
            name: '',
            ministry: '',
            deadline: '',
            location: '',
            contact_number: '',
            no_of_docs_required: 0,
            status: 'active',
            benefit_text: '',
            eligibility_text: '',
        });
        setIsNew(true);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <span className="text-5xl">📜</span> Scheme Management
                </h2>
                <p className="text-xl text-gray-500">Manage government schemes and programs</p>
            </div>

            <Card className="shadow-md border-0 bg-white">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <span>🔍</span> Search & Filter
                        </CardTitle>
                        <Button onClick={handleNew} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all flex items-center gap-2">
                            <Plus className="h-5 w-5" /> Add Scheme
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-6 p-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                        <Input
                            placeholder="Search schemes by name or ministry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-14 h-14 text-lg rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-64 h-14 text-lg bg-gray-50 border-gray-200 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-lg py-3">All Status</SelectItem>
                            <SelectItem value="active" className="text-lg py-3">Active</SelectItem>
                            <SelectItem value="inactive" className="text-lg py-3">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white overflow-hidden rounded-2xl">
                <CardHeader className="bg-gray-50/50 border-b pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-800">Schemes ({filteredSchemes.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="py-5 pl-6 text-lg font-semibold w-[80px]">ID</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Name</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Ministry</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Deadline</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Location</TableHead>
                                <TableHead className="py-5 text-lg font-semibold">Status</TableHead>
                                <TableHead className="py-5 pr-6 text-lg font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSchemes.map((scheme) => (
                                <TableRow key={scheme.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
                                    <TableCell className="py-4 pl-6 font-medium text-gray-600">#{scheme.id}</TableCell>
                                    <TableCell className="py-4 font-bold text-gray-800 text-lg">{scheme.name}</TableCell>
                                    <TableCell className="py-4 text-gray-600 max-w-[200px] truncate" title={scheme.ministry}>{scheme.ministry}</TableCell>
                                    <TableCell className="py-4 font-mono text-sm">{scheme.deadline}</TableCell>
                                    <TableCell className="py-4 text-gray-600">{scheme.location}</TableCell>
                                    <TableCell className="py-4">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm uppercase tracking-wide ${scheme.status === 'active'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}>
                                            {scheme.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 pr-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="outline" className="h-10 w-10 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700" onClick={() => { setEditScheme(scheme); setIsNew(false); }} title="Edit Scheme">
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                            <Button size="icon" variant="destructive" className="h-10 w-10 shadow-sm" onClick={() => setDeleteScheme(scheme)} title="Delete Scheme">
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

            <Dialog open={!!editScheme} onOpenChange={() => { setEditScheme(null); setIsNew(false); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isNew ? 'Add New Scheme' : 'Edit Scheme'}</DialogTitle>
                    </DialogHeader>
                    {editScheme && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2"><Label>Scheme Name</Label><Input value={editScheme.name} onChange={(e) => setEditScheme({ ...editScheme, name: e.target.value })} /></div>
                            <div><Label>Ministry</Label><Input value={editScheme.ministry} onChange={(e) => setEditScheme({ ...editScheme, ministry: e.target.value })} /></div>
                            <div><Label>Deadline</Label><Input type="date" value={editScheme.deadline} onChange={(e) => setEditScheme({ ...editScheme, deadline: e.target.value })} /></div>
                            <div><Label>Location</Label><Input value={editScheme.location} onChange={(e) => setEditScheme({ ...editScheme, location: e.target.value })} /></div>
                            <div><Label>Contact Number</Label><Input value={editScheme.contact_number} onChange={(e) => setEditScheme({ ...editScheme, contact_number: e.target.value })} /></div>
                            <div><Label>Documents Required</Label><Input type="number" value={editScheme.no_of_docs_required} onChange={(e) => setEditScheme({ ...editScheme, no_of_docs_required: parseInt(e.target.value) })} /></div>
                            <div>
                                <Label>Status</Label>
                                <Select value={editScheme.status} onValueChange={(value) => setEditScheme({ ...editScheme, status: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2"><Label>Benefits</Label><Textarea value={editScheme.benefit_text} onChange={(e) => setEditScheme({ ...editScheme, benefit_text: e.target.value })} rows={3} /></div>
                            <div className="col-span-2"><Label>Eligibility</Label><Textarea value={editScheme.eligibility_text} onChange={(e) => setEditScheme({ ...editScheme, eligibility_text: e.target.value })} rows={3} /></div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setEditScheme(null); setIsNew(false); }}>Cancel</Button>
                        <Button onClick={handleSave} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteScheme} onOpenChange={() => setDeleteScheme(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Scheme</DialogTitle>
                        <DialogDescription>Are you sure you want to delete {deleteScheme?.name}?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteScheme(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
