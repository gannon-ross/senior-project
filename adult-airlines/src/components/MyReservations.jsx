import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { flightAPI } from "../services/api";


const MyReservations = ({refreshKey}) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (!user?.id) return; // Wait for user to be defined
  
    const fetchReservations = async () => {
      try {
        console.log("Fetching reservations for user ID:", user.id);
    
        const response = await flightAPI.getReservationsByUser(user.id); // use flightAPI wrapper
        console.log("Received reservations:", response);
    
        setReservations(response);
      } catch (error) {
        console.error("Failed to load reservations:", error);
      }
    };
    
  
    fetchReservations();
  }, [user?.id, refreshKey]);
  

  if (reservations.length === 0) {
    return <p className="text-gray-400 mt-4">You have no reservations yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
      {reservations.map((res) => (
        <div
          key={res.reservation_id}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <h3 className="font-bold text-lg mb-2">
            {res.origin} → {res.destination}
          </h3>
          <p className="text-sm text-gray-600">
            Departure: {new Date(res.departure_time).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Arrival: {new Date(res.arrival_time).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Aircraft: {res.aircraft_model}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyReservations;
