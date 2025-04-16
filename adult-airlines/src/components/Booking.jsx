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
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    payment_card: "",
    expiry: "",
    cvv: "",
    name: "",
    zip: "",
    passengers: 1,
  });

  const { user } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = {};
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;
      if (date) params.date = date;

      // 💡 Reset previously selected flight before new search
      setSelectedFlight(null);
      setShowPayment(false);

      const results = await flightAPI.searchFlights(params);
      setFlights(results);
      setShowModal(true);
    } catch (error) {
      console.error("Flight search failed:", error);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("RESERVE FLIGHT", user.id, selectedFlight.id, formData.passengers);

      await flightAPI.reserveFlight(
        user.id,
        selectedFlight.id,
        parseInt(formData.passengers, 10)
      );
      
      alert("Reservation successful!");
      setSelectedFlight(null);
      setShowModal(false);
      setShowPayment(false);
    } catch (error) {
      console.error("Reservation failed:", error);
      alert("Failed to reserve flight.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start">
      <h2 className="text-2xl font-bold mb-2">
        Book Your Flight with Adult Airlines!
      </h2>
      <form className="flex flex-col justify-center" onSubmit={handleSearch}>
        <div className="flex items-center">
          <label className="w-40 text-right text-md text-gray-300 px-3">
            Departure City:
          </label>
          <input
            className="w-40 bg-stone-400 placeholder-stone-800 text-stone-800 rounded shadow-md px-3 py-2 my-2"
            type="text"
            placeholder="From"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <label className="w-40 text-right text-md text-gray-300 px-3">
            Destination City:
          </label>
          <input
            className="w-40 bg-stone-400 placeholder-stone-800 text-stone-800 rounded shadow-md px-3 py-2 my-2"
            type="text"
            placeholder="To"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <label className="w-40 text-right text-md text-gray-300 px-3">
            Date:
          </label>
          <input
            className="w-40 bg-stone-400 text-stone-800 rounded shadow-md px-3 py-2 my-2"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          className="place-self-center duration-300 w-[40%] rounded hover:cursor-pointer bg-stone-400 text-gray-300 hover:bg-stone-600 px-3 py-2 my-2"
          type="submit"
        >
          Search Flights
        </button>
      </form>

      <FlightSearchModal isOpen={showModal} onClose={() => setShowModal(false)}>
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
                      className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-gray-300 rounded"
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
          <>
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Payment for Flight</h3>
              <p>
                Flight: {selectedFlight.origin} ➔ {selectedFlight.destination}
              </p>
              <p>Price: ${selectedFlight.price}</p>

              <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => setShowPayment(true)}
              >
                Enter Payment Info
              </button>

              {showPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                    <form
                      onSubmit={handlePaymentSubmit}
                      autoComplete="off"
                      className="space-y-4"
                    >
                      <input
                        name="passengers"
                        type="number"
                        min="1"
                        placeholder="Number of Passengers"
                        required
                        onChange={handlePaymentChange}
                        value={formData.passengers}
                        className="w-full px-3 py-2 border rounded"
                      />

                      <input
                        name="payment_card"
                        type="text"
                        autoComplete="new-password"
                        placeholder="Card Number"
                        maxLength={16}
                        required
                        onChange={handlePaymentChange}
                        value={formData.cardNumber}
                        className="w-full px-3 py-2 border rounded"
                      />
                      <div className="flex gap-2">
                        <input
                          name="expiry"
                          type="text"
                          autoComplete="off"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          onChange={handlePaymentChange}
                          value={formData.expiry}
                          className="w-1/2 px-3 py-2 border rounded"
                        />
                        <input
                          name="cvv"
                          type="text"
                          autoComplete="off"
                          placeholder="CVV"
                          maxLength={4}
                          required
                          onChange={handlePaymentChange}
                          value={formData.cvv}
                          className="w-1/2 px-3 py-2 border rounded"
                        />
                      </div>
                      <input
                        name="name"
                        type="text"
                        autoComplete="off"
                        placeholder="Name on Card"
                        required
                        onChange={handlePaymentChange}
                        value={formData.name}
                        className="w-full px-3 py-2 border rounded"
                      />
                      <input
                        name="zip"
                        type="text"
                        autoComplete="off"
                        placeholder="Billing ZIP Code"
                        required
                        onChange={handlePaymentChange}
                        value={formData.zip}
                        className="w-full px-3 py-2 border rounded"
                      />
                      <div className="flex justify-between items-center mt-4">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                          Submit Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPayment(false)}
                          className="text-gray-600 underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </FlightSearchModal>
    </div>
  );
};

export default Booking;
