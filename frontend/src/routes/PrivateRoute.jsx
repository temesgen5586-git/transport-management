import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * PrivateRoute – Protects routes that require authentication
 * 
 * @param {React.ReactNode} children - The route component
 * @param {string[]} roles - Optional array of allowed roles
 * 
 * Usage:
 *   <Route path="/admin" element={
 *     <PrivateRoute roles={['super_admin', 'dispatcher']}>
 *       <AdminDashboard />
 *     </PrivateRoute>
 *   } />
 */
const PrivateRoute = ({ children, roles = [] }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return <LoadingSpinner />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role access
    if (roles.length > 0 && !roles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;