import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
    AuthProvider,
    ThemeProvider,
    WalletProvider,
    NotificationProvider,
    LoadingProvider,
    TripProvider,
} from './context';
import PrivateRoute from './routes/PrivateRoute';
import Layout from './components/common/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard';
import DriverDashboard from './pages/dashboard/DriverDashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';

// Admin Pages
import Users from './pages/admin/Users';
import Cities from './pages/admin/Cities';
import AdminRoutes from './pages/admin/Routes';          // ← Renamed to avoid conflict with react-router-dom's Routes
import Vehicles from './pages/admin/Vehicles';
import VehicleTypes from './pages/admin/VehicleTypes';
import Trips from './pages/admin/Trips';
import Stats from './pages/admin/Stats';
import Penalties from './pages/admin/Penalties';
import Tables from './pages/admin/Tables';

// Booking Pages
import BookTrip from './pages/bookings/BookTrip';
import MyBookings from './pages/bookings/MyBookings';
import BookingDetails from './pages/bookings/BookingDetails';
import Payment from './pages/payment/Payment';

// Wallet
import Wallet from './pages/wallet/Wallet';

// Driver Pages
import Manifest from './pages/driver/Manifest';
import Settlements from './pages/driver/Settlements';
import DriverPenalties from './pages/driver/DriverPenalties';

// Freight Pages
import CreateOrder from './pages/freight/CreateOrder';
import Orders from './pages/freight/Orders';
import CustomsDocuments from './pages/freight/CustomsDocuments';

// Emergency & Audit
import EmergencyLogs from './pages/emergency/EmergencyLogs';
import AuditLogs from './pages/audit/AuditLogs';

// Unauthorized page
const Unauthorized = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Unauthorized Access</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
            You don't have permission to view this page.
        </p>
    </div>
);

// Not Found page
const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Page Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
            The page you're looking for doesn't exist.
        </p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <LoadingProvider>
                        <WalletProvider>
                            <NotificationProvider>
                                <TripProvider>
                                    <Toaster
                                        position="top-right"
                                        toastOptions={{
                                            className: 'dark:bg-slate-800 dark:text-slate-100',
                                            duration: 4000,
                                            style: {
                                                borderRadius: '12px',
                                                padding: '16px',
                                            },
                                        }}
                                    />
                                    <RouterRoutes>  {/* ← renamed from Routes to avoid conflict */}
                                        {/* Public Routes */}
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/forgot-password" element={<ForgotPassword />} />
                                        <Route path="/reset-password" element={<ResetPassword />} />

                                        {/* Protected Routes */}
                                        <Route path="/" element={
                                            <PrivateRoute>
                                                <Layout />
                                            </PrivateRoute>
                                        }>
                                            <Route index element={<CustomerDashboard />} />

                                            {/* Admin Routes */}
                                            <Route path="admin">
                                                <Route index element={<AdminDashboard />} />
                                                <Route path="users" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <Users />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="cities" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <Cities />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="routes" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <AdminRoutes />  {/* ← uses renamed import */}
                                                    </PrivateRoute>
                                                } />
                                                <Route path="vehicles" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <Vehicles />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="vehicle-types" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <VehicleTypes />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="trips" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <Trips />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="stats" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <Stats />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="penalties" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <Penalties />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="tables" element={
                                                    <PrivateRoute roles={['super_admin', 'dispatcher']}>
                                                        <Tables />
                                                    </PrivateRoute>
                                                } />
                                            </Route>

                                            {/* Driver Routes */}
                                            <Route path="driver">
                                                <Route index element={<DriverDashboard />} />
                                                <Route path="manifest" element={
                                                    <PrivateRoute roles={['driver']}>
                                                        <Manifest />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="settlements" element={
                                                    <PrivateRoute roles={['driver']}>
                                                        <Settlements />
                                                    </PrivateRoute>
                                                } />
                                                <Route path="penalties" element={
                                                    <PrivateRoute roles={['driver']}>
                                                        <DriverPenalties />
                                                    </PrivateRoute>
                                                } />
                                            </Route>

                                            {/* Customer Routes */}
                                            <Route path="book-trip" element={<BookTrip />} />
                                            <Route path="my-bookings" element={<MyBookings />} />
                                            <Route path="bookings/:id" element={<BookingDetails />} />
                                            <Route path="payment" element={<Payment />} />
                                            <Route path="wallet" element={<Wallet />} />

                                            {/* Freight Routes */}
                                            <Route path="freight">
                                                <Route path="create" element={<CreateOrder />} />
                                                <Route path="orders" element={<Orders />} />
                                                <Route path="customs" element={<CustomsDocuments />} />
                                            </Route>

                                            {/* Emergency & Audit */}
                                            <Route path="emergency/logs" element={
                                                <PrivateRoute roles={['super_admin', 'auditor', 'dispatcher']}>
                                                    <EmergencyLogs />
                                                </PrivateRoute>
                                            } />
                                            <Route path="audit/logs" element={
                                                <PrivateRoute roles={['auditor', 'super_admin']}>
                                                    <AuditLogs />
                                                </PrivateRoute>
                                            } />
                                        </Route>

                                        {/* Special Routes */}
                                        <Route path="/unauthorized" element={<Unauthorized />} />
                                        <Route path="*" element={<NotFound />} />
                                    </RouterRoutes>
                                </TripProvider>
                            </NotificationProvider>
                        </WalletProvider>
                    </LoadingProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;