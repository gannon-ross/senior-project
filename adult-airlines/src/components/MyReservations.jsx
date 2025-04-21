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
          className="flex flex-col bg-stone-400 text-stone-200 rounded-lg shadow-md p-4"
        >
          <h3 className="font-bold text-stone-600 text-lg mb-2">
            {res.origin} → {res.destination}
          </h3>
          <p className="text-sm">
            Departure: {new Date(res.departure_time).toLocaleString()}
          </p>
          <p className="text-sm">
            Arrival: {new Date(res.arrival_time).toLocaleString()}
          </p>
          <p className="text-sm italic mt-2">
            Aircraft: {res.aircraft_model}
          </p>
          <div className="flex justify-center mt-4 gap-4">
            <p className="text-sm font-bold mt-2">
              Cancel Flight?
            </p>
            <button
              onClick={() => {
                // Cancel attempt does not work - 
                // POST request 404s
                // Fails parsing of JSON from response?
                flightAPI.cancelFlight(res.reservation_id);
                console.log("Flight cancelled.")}}
              className="bg-stone-600 hover:bg-stone-500 text-stone-200 px-3 py-1 rounded">
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyReservations;
