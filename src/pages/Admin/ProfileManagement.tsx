import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Key, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { getAPIBaseURL } from '@/utils/api';

interface User {
    id: number;
    email: string;
    role: string;
    phone: string;
    full_name: string;
    phone_number: string;
    location: string;
    crops_grown: string;
    available_quantity: number;
    expected_price: string;
    created_at: string;
}

export default function ProfileManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();
    const API_BASE_URL = getAPIBaseURL();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load users', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;
        if (searchTerm) {
            filtered = filtered.filter(
                (u) =>
                    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (roleFilter !== 'all') {
            filtered = filtered.filter((u) => u.role === roleFilter);
        }
        setFilteredUsers(filtered);
    };

    const handleUpdate = async () => {
        if (!editUser) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${editUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editUser),
            });
            if (!response.ok) throw new Error('Failed to update user');
            toast({ title: 'Success', description: 'User updated successfully' });
            setEditUser(null);
            fetchUsers();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteUser) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${deleteUser.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete user');
            toast({ title: 'Success', description: 'User deleted successfully' });
            setDeleteUser(null);
            fetchUsers();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetPasswordUser || !newPassword) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${resetPasswordUser.id}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ newPassword }),
            });
            if (!response.ok) throw new Error('Failed to reset password');
            toast({ title: 'Success', description: 'Password reset successfully' });
            setResetPasswordUser(null);
            setNewPassword('');
            setShowPassword(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to reset password', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <span className="text-5xl">👥</span> Profile Management
                </h2>
                <p className="text-xl text-gray-500">Manage user accounts and profiles</p>
            </div>

            {/* Filters */}
            {/* Filters */}
            <Card className="shadow-md border-0 bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <span>🔍</span> Search & Filter
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-6 p-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-14 h-14 text-lg rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full sm:w-64 h-14 text-lg bg-gray-50 border-gray-200 rounded-xl">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-lg py-3">All Roles</SelectItem>
                            <SelectItem value="farmer" className="text-lg py-3">Farmers</SelectItem>
                            <SelectItem value="vendor" className="text-lg py-3">Vendors</SelectItem>
                            <SelectItem value="admin" className="text-lg py-3">Admins</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Users Table */}
            {/* Users Table */}
            <Card className="shadow-lg border-0 bg-white overflow-hidden rounded-2xl">
                <CardHeader className="bg-gray-50/50 border-b pb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-800">Users ({filteredUsers.length})</CardTitle>
                            <CardDescription className="text-lg">All registered users on the platform</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="py-5 pl-6 text-lg font-semibold w-[80px]">ID</TableHead>
                                    <TableHead className="py-5 text-lg font-semibold">Name</TableHead>
                                    <TableHead className="py-5 text-lg font-semibold">Email</TableHead>
                                    <TableHead className="py-5 text-lg font-semibold">Role</TableHead>
                                    <TableHead className="py-5 text-lg font-semibold">Phone</TableHead>
                                    <TableHead className="py-5 text-lg font-semibold">Location</TableHead>
                                    <TableHead className="py-5 pr-6 text-lg font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
                                        <TableCell className="py-4 pl-6 font-medium text-gray-600">#{user.id}</TableCell>
                                        <TableCell className="py-4 font-bold text-gray-800 text-lg">{user.full_name || 'Anonymous'}</TableCell>
                                        <TableCell className="py-4 text-gray-600">{user.email}</TableCell>
                                        <TableCell className="py-4">
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm uppercase tracking-wide ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                    : user.role === 'vendor'
                                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                        : 'bg-green-100 text-green-700 border border-green-200'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 font-mono text-sm">{user.phone_number || user.phone || '-'}</TableCell>
                                        <TableCell className="py-4 text-gray-600">{user.location || '-'}</TableCell>
                                        <TableCell className="py-4 pr-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="outline" className="h-10 w-10 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700" onClick={() => setEditUser(user)} title="Edit User">
                                                    <Edit className="h-5 w-5" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-10 w-10 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700" onClick={() => setResetPasswordUser(user)} title="Reset Password">
                                                    <Key className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="h-10 w-10 shadow-sm"
                                                    onClick={() => setDeleteUser(user)}
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information and profile details</DialogDescription>
                    </DialogHeader>
                    {editUser && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Full Name</Label>
                                <Input
                                    value={editUser.full_name || ''}
                                    onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Role</Label>
                                <Select
                                    value={editUser.role}
                                    onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="farmer">Farmer</SelectItem>
                                        <SelectItem value="vendor">Vendor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={editUser.phone_number || editUser.phone || ''}
                                    onChange={(e) => setEditUser({ ...editUser, phone_number: e.target.value, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Location</Label>
                                <Input
                                    value={editUser.location || ''}
                                    onChange={(e) => setEditUser({ ...editUser, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Crops Grown</Label>
                                <Input
                                    value={editUser.crops_grown || ''}
                                    onChange={(e) => setEditUser({ ...editUser, crops_grown: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Available Quantity</Label>
                                <Input
                                    type="number"
                                    value={editUser.available_quantity || 0}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, available_quantity: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </div>
                            <div>
                                <Label>Expected Price</Label>
                                <Input
                                    value={editUser.expected_price || ''}
                                    onChange={(e) => setEditUser({ ...editUser, expected_price: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditUser(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deleteUser?.full_name || deleteUser?.email}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteUser(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={!!resetPasswordUser} onOpenChange={() => setResetPasswordUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Enter a new password for {resetPasswordUser?.full_name || resetPasswordUser?.email}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label>New Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password (min 6 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setResetPasswordUser(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleResetPassword} disabled={submitting || newPassword.length < 6}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Reset Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
