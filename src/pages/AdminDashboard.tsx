import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Shield, Users, FlaskConical, FileText, UserCircle,
  BarChart3, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileManagement from './admin/ProfileManagement';
import LabManagement from './admin/LabManagement';
import SchemeManagement from './admin/SchemeManagement';
import ExpertManagement from './admin/ExpertManagement';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profiles', label: 'Profile Management', icon: '👥' },
    { id: 'labs', label: 'Lab Management', icon: '🧪' },
    { id: 'schemes', label: 'Scheme Management', icon: '📜' },
    { id: 'experts', label: 'Expert Management', icon: '👨‍🔬' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <span className="text-4xl mr-2">🛡️</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
                <p className="text-lg text-gray-500">Manage FarmIQ Platform</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <nav className="container mx-auto px-4 py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl mb-2 transition-colors text-lg font-medium ${activeTab === item.id
                  ? 'bg-green-100 text-green-800 border-2 border-green-200'
                  : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1 p-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-200 text-lg font-medium ${activeTab === item.id
                        ? 'bg-green-100 text-green-800 shadow-sm translate-x-1 border-r-4 border-green-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
                        }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                  <p className="text-gray-600">Manage all platform data and settings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {navItems.slice(1).map((item) => (
                    <Card
                      key={item.id}
                      className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200 group overflow-hidden"
                      onClick={() => setActiveTab(item.id)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-gray-50 to-white">
                        <CardTitle className="text-xl font-bold text-gray-700 group-hover:text-green-700 transition-colors">
                          {item.label}
                        </CardTitle>
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground text-lg mb-4">
                          Manage records, view statistics, and update settings.
                        </p>
                        <div className="flex items-center text-green-600 font-bold group-hover:translate-x-2 transition-transform">
                          Manage Now <span className="ml-2">→</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <Card className="border-none shadow-md bg-slate-50">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <span>⚡</span> Quick Actions
                    </CardTitle>
                    <CardDescription className="text-lg">Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Button onClick={() => setActiveTab('profiles')} className="h-20 text-lg font-bold bg-white text-gray-800 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all">
                      <span className="mr-3 text-3xl">👥</span> Manage Users
                    </Button>
                    <Button onClick={() => setActiveTab('labs')} className="h-20 text-lg font-bold bg-white text-gray-800 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all">
                      <span className="mr-3 text-3xl">🧪</span> Add Lab
                    </Button>
                    <Button onClick={() => setActiveTab('schemes')} className="h-20 text-lg font-bold bg-white text-gray-800 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all">
                      <span className="mr-3 text-3xl">📜</span> Add Scheme
                    </Button>
                    <Button onClick={() => setActiveTab('experts')} className="h-20 text-lg font-bold bg-white text-gray-800 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all">
                      <span className="mr-3 text-3xl">👨‍🔬</span> Add Expert
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'profiles' && <ProfileManagement />}
            {activeTab === 'labs' && <LabManagement />}
            {activeTab === 'schemes' && <SchemeManagement />}
            {activeTab === 'experts' && <ExpertManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
