// UpdateFlightModal.jsx
import React, { useEffect, useState } from "react";
import { flightAPI } from "../services/api";

const UpdateFlightModal = ({ reservation, onClose, onUpdate }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        if (!reservation?.reservation_id) return;
        const options = await flightAPI.getAlternativeFlights(
          reservation.reservation_id
        );
        setAlternatives(options);
      } catch (error) {
        console.error("Failed to fetch alternative flights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlternatives();
  }, [reservation?.reservation_id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!reservation?.reservation_id) return null;

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
      <div className="bg-stone-600 rounded-lg p-6 w-full max-w-2xl relative overflow-hidden">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 bg-stone-600 flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">Select a New Flight</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Scrollable flight list */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {loading ? (
            <p className="text-center text-sm text-gray-100">
              Loading flight options...
            </p>
          ) : alternatives.length === 0 ? (
            <p className="text-center text-sm text-gray-100">
              No alternative flights available for this route.
            </p>
          ) : (
            alternatives.map((flight) => (
              <div
                key={flight.id}
                className="bg-stone-400 rounded p-4 mb-4 shadow-md"
              >
                <p className="text-lg font-semibold text-center">
                  {flight.origin} ➔ {flight.destination}
                </p>
                <p className="text-sm text-center">
                  Departure: {new Date(flight.departure_time).toLocaleString()}
                </p>
                <p className="text-sm text-center">
                  Arrival: {new Date(flight.arrival_time).toLocaleString()}
                </p>
                <p className="text-sm text-center font-semibold mt-1">
                  ${Number(flight.price).toFixed(2)}
                </p>

                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => handleRebook(flight.id)}
                    className="bg-stone-700 hover:bg-stone-800 text-white px-4 py-1 rounded"
                  >
                    Rebook this Flight
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  async function handleRebook(newFlightId) {
    try {
      await flightAPI.updateReservationFlight(
        reservation.reservation_id,
        newFlightId
      );
      alert("Flight updated successfully!");
      onUpdate();
    } catch (error) {
      alert("Failed to update flight.");
      console.error(error);
    }
  }
};

export default UpdateFlightModal;
