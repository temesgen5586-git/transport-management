import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks';
import Logo from './Logo';
import {
    HomeIcon,
    UsersIcon,
    TruckIcon,
    MapPinIcon,
    CalendarIcon,
    WalletIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CubeIcon,
    DocumentArrowDownIcon,
    Cog6ToothIcon,
    TableCellsIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const { user } = useAuth();

    // Define menu items based on role
    const getMenuItems = () => {
        // Common items for all authenticated users
        const common = [
            { path: '/', icon: HomeIcon, label: 'Dashboard' },
            { path: '/my-bookings', icon: BookOpenIcon, label: 'My Bookings' },
            { path: '/wallet', icon: WalletIcon, label: 'Wallet' },
        ];

        // Admin items (super_admin and dispatcher)
        const admin = [
            { path: '/admin/users', icon: UsersIcon, label: 'Users' },
            { path: '/admin/cities', icon: MapPinIcon, label: 'Cities' },
            { path: '/admin/routes', icon: MapPinIcon, label: 'Routes' },
            { path: '/admin/vehicles', icon: TruckIcon, label: 'Vehicles' },
            { path: '/admin/vehicle-types', icon: Cog6ToothIcon, label: 'Vehicle Types' },
            { path: '/admin/trips', icon: CalendarIcon, label: 'Trips' },
            { path: '/admin/stats', icon: ChartBarIcon, label: 'Stats' },
            { path: '/admin/penalties', icon: ExclamationTriangleIcon, label: 'Penalties' },
            { path: '/admin/tables', icon: TableCellsIcon, label: 'All Tables' },
            { path: '/emergency/logs', icon: ExclamationTriangleIcon, label: 'Emergency' },
        ];

        // Auditor items
        const auditor = [
            { path: '/audit/logs', icon: ShieldCheckIcon, label: 'Audit Logs' },
            { path: '/emergency/logs', icon: ExclamationTriangleIcon, label: 'Emergency' },
        ];

        // Driver items
        const driver = [
            { path: '/driver/manifest', icon: TruckIcon, label: 'My Trips' },
            { path: '/driver/settlements', icon: WalletIcon, label: 'Settlements' },
            { path: '/driver/penalties', icon: ExclamationTriangleIcon, label: 'Penalties' },
        ];

        // Freight items (available to all)
        const freight = [
            { path: '/freight/orders', icon: CubeIcon, label: 'Freight Orders' },
            { path: '/freight/create', icon: DocumentArrowDownIcon, label: 'Create Order' },
            { path: '/freight/customs', icon: ShieldCheckIcon, label: 'Customs Docs' },
        ];

        // Build menu based on role
        if (user?.role === 'super_admin' || user?.role === 'dispatcher') {
            return [...common, ...admin, ...freight];
        }
        if (user?.role === 'auditor') {
            return [...common, ...auditor];
        }
        if (user?.role === 'driver') {
            return [...common, ...driver, ...freight];
        }
        return [...common, ...freight];
    };

    const menuItems = getMenuItems();

    return (
        <div className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-300 flex flex-col">
            {/* Logo Section */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <Logo />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {user?.role?.replace('_', ' ')} · {user?.full_name}
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                            }`
                        }
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${({ isActive }) => isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Version Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 text-center">
                EthioTrans v1.0.0
            </div>
        </div>
    );
};

export default Sidebar;