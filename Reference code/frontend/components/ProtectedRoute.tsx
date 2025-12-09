import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'farmer' | 'vendor' | 'admin' | 'GP';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[]; // Accept single role or array of roles
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication (but only briefly)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!user?.role || !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user's actual role
      const redirectPath = user?.role === 'farmer' ? '/farmer/dashboard' :
        user?.role === 'vendor' ? '/vendor/dashboard' :
          user?.role === 'admin' ? '/admin/dashboard' :
            user?.role === 'GP' ? '/grampanchayat/dashboard' : '/login';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
}
