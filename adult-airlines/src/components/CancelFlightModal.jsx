import React, { useEffect, useState } from "react";
import { flightAPI } from "../services/api";

const CancelFlightModal = ({ onClose, onCancelSuccess }) => {
  const [searchParams, setSearchParams] = useState({ origin: "", destination: "", flight_number: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const flights = await flightAPI.searchFlights(searchParams);
      setResults(flights);
    } catch (err) {
      console.error("Error searching flights:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (flightId) => {
    try {
      await flightAPI.cancelEntireFlight(flightId);
      alert("Flight cancelled and passengers notified.");
      onCancelSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to cancel flight:", err);
      alert("Failed to cancel flight.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-stone-600 rounded-lg p-6 w-full max-w-2xl relative overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-stone-600 flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">Cancel a Flight</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Input Controls */}
        <div className="flex flex-wrap gap-2 mb-4 p-4">
          <input
            type="text"
            placeholder="Flight # (e.g., AO0124)"
            className="flex-1 p-2 rounded bg-stone-300 text-black"
            value={searchParams.flight_number}
            onChange={(e) => setSearchParams({ ...searchParams, flight_number: e.target.value })}
          />
          <input
            type="text"
            placeholder="Origin"
            className="flex-1 p-2 rounded bg-stone-300 text-black"
            value={searchParams.origin}
            onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
          />
          <input
            type="text"
            placeholder="Destination"
            className="flex-1 p-2 rounded bg-stone-300 text-black"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
          />
          <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 p-4">
          {loading ? (
            <p className="text-center text-white">Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-center text-white">No matching flights found.</p>
          ) : (
            results.map((flight) => (
              <div key={flight.id} className="bg-stone-400 p-4 rounded">
                <p className="text-lg font-semibold">{flight.origin} ➔ {flight.destination}</p>
                
                <p><strong>Flight #:</strong> {flight.flight_number}</p>
                
                <p>Departure: {new Date(flight.departure_time).toLocaleString()}</p>
                <p>Arrival: {new Date(flight.arrival_time).toLocaleString()}</p>
                <button
                  onClick={() => handleCancel(flight.id)}
                  className="mt-2 bg-red-700 hover:bg-red-800 text-white px-4 py-1 rounded"
                >
                  Cancel This Flight
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelFlightModal;
