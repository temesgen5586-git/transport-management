import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './routes/PrivateRoute';
import Layout from './components/common/Layout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard';
import DriverDashboard from './pages/dashboard/DriverDashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';

// Admin
import Users from './pages/admin/Users';
import Cities from './pages/admin/Cities';
import Routes from './pages/admin/Routes';
import Vehicles from './pages/admin/Vehicles';
import VehicleTypes from './pages/admin/VehicleTypes';
import Trips from './pages/admin/Trips';
import Stats from './pages/admin/Stats';
import Penalties from './pages/admin/Penalties';

// Bookings
import BookTrip from './pages/bookings/BookTrip';
import MyBookings from './pages/bookings/MyBookings';
import BookingDetails from './pages/bookings/BookingDetails';
import Payment from './pages/payment/Payment';

// Wallet
import Wallet from './pages/wallet/Wallet';

// Driver
import Manifest from './pages/driver/Manifest';
import Settlements from './pages/driver/Settlements';
import DriverPenalties from './pages/driver/DriverPenalties';

// Freight
import CreateOrder from './pages/freight/CreateOrder';
import Orders from './pages/freight/Orders';
import CustomsDocuments from './pages/freight/CustomsDocuments';

// Emergency & Audit
import EmergencyLogs from './pages/emergency/EmergencyLogs';
import AuditLogs from './pages/audit/AuditLogs';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<CustomerDashboard />} />
              <Route path="admin">
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="cities" element={<Cities />} />
                <Route path="routes" element={<Routes />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="vehicle-types" element={<VehicleTypes />} />
                <Route path="trips" element={<Trips />} />
                <Route path="stats" element={<Stats />} />
                <Route path="penalties" element={<Penalties />} />
              </Route>
              <Route path="driver">
                <Route index element={<DriverDashboard />} />
                <Route path="manifest" element={<Manifest />} />
                <Route path="settlements" element={<Settlements />} />
                <Route path="penalties" element={<DriverPenalties />} />
              </Route>
              <Route path="book-trip" element={<BookTrip />} />
              <Route path="my-bookings" element={<MyBookings />} />
              <Route path="bookings/:id" element={<BookingDetails />} />
              <Route path="payment" element={<Payment />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="freight">
                <Route path="create" element={<CreateOrder />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customs" element={<CustomsDocuments />} />
              </Route>
              <Route path="emergency/logs" element={<EmergencyLogs />} />
              <Route path="audit/logs" element={<AuditLogs />} />
            </Route>
            <Route path="/unauthorized" element={<div className="p-8 text-center text-red-600">Unauthorized Access</div>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;