import React, { useState } from "react";
import FlightSearchModal from "./FlightSearchModal";
import { flightAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";



const Booking = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const { user } = useAuth();


  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const params = {};
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;
      if (date) params.date = date;

      const results = await flightAPI.searchFlights(params);
      setFlights(results);
      setShowModal(true); // Open modal after search
    } catch (error) {
      console.error("Flight search failed:", error);
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Your Flight with Adult Airlines!</h2>

      <form onSubmit={handleSearch}>
        <div>
          <label>Departure City:</label>
          <input
            type="text"
            placeholder="From"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>

        <div>
          <label>Destination City:</label>
          <input
            type="text"
            placeholder="To"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit">Search Flights</button>
      </form>

      {/* Modal for flight search results */}
      <FlightSearchModal isOpen={showModal} onClose={() => setShowModal(false)}>
        {/* Show either flights list or payment form based on selection */}

        {!selectedFlight ? (
          flights.length > 0 ? (
            flights.map((flight) => (
              <div
                key={flight.id}
                className="flight-card border p-4 rounded-lg mb-4 shadow-md bg-white"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">
                      {flight.origin} ➔ {flight.destination}
                    </p>
                    <p className="text-sm">
                      Departure:{" "}
                      {new Date(flight.departure_time).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Arrival: {new Date(flight.arrival_time).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">${flight.price}</p>
                    <button
                      className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                      onClick={() => setSelectedFlight(flight)}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No flights found.</p>
          )
        ) : (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Payment for Flight</h3>
            <p>
              Flight: {selectedFlight.origin} ➔ {selectedFlight.destination}
            </p>
            <p>Price: ${selectedFlight.price}</p>

            {/* Placeholder for payment fields */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                [ Payment Form Coming Soon ]
              </p>
              <button
                className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                onClick={async () => {
                    try {
                        // Simulate reservation after payment
                        await flightAPI.reserveFlight(user.id, selectedFlight.id, 1);
                        alert('Reservation successful!');
                        setSelectedFlight(null);
                        setShowModal(false);
                      } catch (error) {
                        console.error('Reservation failed:', error);
                        alert('Failed to reserve flight.');
                      }
                }}
              >
                Simulate Payment Success
              </button>
            </div>
          </div>
        )}
      </FlightSearchModal>
    </div>
  );
};

export default Booking;
