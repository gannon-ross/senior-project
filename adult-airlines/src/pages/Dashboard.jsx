import React, { useState } from "react";
import Booking from "../components/Booking";
import Agent from "../components/Agent";
import { useAuth } from "../context/AuthContext";
import MyReservations from "../components/MyReservations";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || "customer";

  // 🔁 Refresh trigger state
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
  };

  // 🔁 This gets passed to Booking and called after a reservation is made
  const handleReservationSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="dashboard">
      <div className="flex justify-between items-center p-4 bg-stone-600 mb-6">
        <h1 className="text-xl font-bold text-gray-300">
          Adult Airlines Dashboard
        </h1>
        <div className="flex items-center">
          <span className="text-gray-300 mr-4">
            Welcome, {user?.first_name} {user?.last_name} ({userRole})
          </span>
          <button
            onClick={handleLogout}
            className="bg-stone-400 hover:bg-stone-500 text-gray-300 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Customer view */}
      {userRole === "customer" ? (
        <>
          <Booking onReservationSuccess={handleReservationSuccess} />
          <div className="mt-10 px-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Your Reservations
            </h2>
            <MyReservations refreshKey={refreshKey} />
          </div>
        </>
      ) : (
        <Agent />
      )}
    </div>
  );
};

export default Dashboard;
