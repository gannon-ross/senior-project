import React from 'react';
import Booking from '../components/Booking';
import Agent from '../components/Agent';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    // Get user role from authenticated user
    const userRole = user?.role || 'customer';

    const handleLogout = () => {
        logout();
        // No need to navigate, the ProtectedRoute will handle redirection
    };

    return (
        <div className='dashboard'>
            <div className="flex justify-between items-center p-4 bg-stone-600 mb-6">
                <h1 className="text-xl font-bold text-white">Adult Airlines Dashboard</h1>
                <div className="flex items-center">
                    <span className="text-white mr-4">
                        Welcome, {user?.first_name} {user?.last_name} ({userRole})
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-stone-400 hover:bg-stone-500 text-white px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Display Booking page for customers, Agent page for agents */}
            {userRole === 'customer' ? <Booking/> : <Agent/>}
        </div>
    );
};

export default Dashboard;