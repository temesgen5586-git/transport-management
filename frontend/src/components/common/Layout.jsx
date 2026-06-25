import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ScrollToTop from './ScrollToTop';

/**
 * Layout – Main application layout wrapper
 * 
 * Usage:
 *   <Route path="/" element={<Layout />}>
 *     <Route index element={<Dashboard />} />
 *   </Route>
 */
const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <ScrollToTop />
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;