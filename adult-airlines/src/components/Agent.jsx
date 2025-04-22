import React, { useEffect, useState } from "react";
import { flightAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CancelFlightModal from "./CancelFlightModal";

const Agent = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [email, setEmail] = useState("");
  const [targetUserId, setTargetUserId] = useState(null);
  const [error, setError] = useState("");
  const [agentFlightResults, setAgentFlightResults] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [agentBooking, setAgentBooking] = useState({
    flightId: null,
    passengers: 1,
  });
  const [agentSearchParams, setAgentSearchParams] = useState({
    origin: "",
    destination: "",
    date: "",
  });

  const fetchAgentReservations = async () => {
    try {
      const data = await flightAPI.getReservationsByAgent(user.id);
      setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to load reservations");
    }
  };

  // Load agent reservations on mount
  useEffect(() => {
    fetchAgentReservations();
  }, []);

  // Calculate total sales
  const totalSales = reservations.reduce(
    (sum, r) => sum + r.price * r.passengers,
    0
  );

  const handleSearchUser = async () => {
    try {
      const result = await flightAPI.getUserByEmail(email);
      setTargetUserId(result.id);
      setError("");
    } catch (err) {
      console.error("User lookup failed:", err);
      setTargetUserId(null);
      setError("User not found");
    }
  };

  const handleFlightSearch = async () => {
    try {
      const results = await flightAPI.searchFlights(agentSearchParams);
      setAgentFlightResults(results);
    } catch (err) {
      console.error("Flight search failed:", err);
      setAgentFlightResults([]);
    }
  };

  const handleAgentBooking = async (flightId, passengers = 1) => {
    try {
      await flightAPI.reserveFlight({
        user_id: Number(targetUserId),
        flight_id: Number(flightId),
        seats_requested: Number(passengers),
        agent_id: Number(user.id),
      });

      // Reset state of search parameters
      setAgentSearchParams({
        origin: "",
        destination: "",
        date: "",
      });

      // Reset state of flight results
      setAgentFlightResults([]);

      // Refresh state for agent reservation list
      fetchAgentReservations();

      alert("Reservation successful!");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed.");
    }
  };

  return (
    <div className="flex flex-col p-6">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">Agent Dashboard</h2>

      <div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-300">
    Total Sales: ${totalSales.toFixed(2)}
  </h3>
  <button
    onClick={() => setShowCancelModal(true)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-4"
  >
    Cancel a Flight
  </button>
</div>


      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-300 mb-2">
          Book a Flight for Customer
        </h3>
        <div className="flex gap-2 justify-center mb-2">
          <input
            type="email"
            placeholder="Enter customer email"
            className="bg-stone-400 text-stone-800 placeholder:text-stone-800 px-3 py-2 rounded w-60"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSearchUser}
            className="bg-stone-400 hover:bg-stone-500 text-stone-200 px-3 py-1 rounded"
          >
            Lookup User
          </button>
        </div>
        {error && <p className="text-red-400">{error}</p>}
        {targetUserId && (
          <p className="text-green-400">User found! ID: {targetUserId}</p>
        )}
      </div>

      {targetUserId && (
        <div className="flex flex-col justify-center mt-4">
          <h4 className="text-gray-300">
            Search flights to book for this user:
          </h4>
          <div className="flex gap-2 justify-center my-2">
            <input
              placeholder="Origin"
              className="bg-stone-400 text-stone-800 placeholder:text-stone-800 px-2 py-1 rounded"
              value={agentSearchParams.origin}
              onChange={(e) =>
                setAgentSearchParams({
                  ...agentSearchParams,
                  origin: e.target.value,
                })
              }
            />
            <input
              placeholder="Destination"
              className="bg-stone-400 text-stone-800 placeholder:text-stone-800 px-2 py-1 rounded"
              value={agentSearchParams.destination}
              onChange={(e) =>
                setAgentSearchParams({
                  ...agentSearchParams,
                  destination: e.target.value,
                })
              }
            />
            <input
              type="date"
              className="w-40 bg-stone-400 text-stone-800 rounded shadow-md px-2 py-1 rounded"
              value={agentSearchParams.date}
              onChange={(e) =>
                setAgentSearchParams({
                  ...agentSearchParams,
                  date: e.target.value,
                })
              }
            />
            <button
              onClick={handleFlightSearch}
              className="bg-stone-400 hover:bg-stone-500 text-gray-300 px-3 py-1 rounded"
            >
              Search
            </button>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {agentFlightResults.map((f) => (
              <div
                key={f.id}
                className="bg-stone-400 text-stone-800 p-3 my-2 rounded shadow"
              >
                <p className="font-bold">
                  {f.origin} ➔ {f.destination}
                </p>
                <p className="italic">
                  Departure: {new Date(f.departure_time).toLocaleString()}
                </p>
                <p>Price: ${f.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p>Seats:</p>
                  <input
                    type="number"
                    min={1}
                    value={
                      agentBooking.flightId === f.id && agentBooking.passengers
                        ? agentBooking.passengers
                        : 1
                    }
                    onChange={(e) =>
                      setAgentBooking({
                        flightId: f.id,
                        passengers: Number(e.target.value),
                      })
                    }
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => {
                      const passengers =
                        agentBooking.flightId === f.id &&
                        agentBooking.passengers
                          ? agentBooking.passengers
                          : 1;
                      handleAgentBooking(f.id, passengers);
                    }}
                    className="font-bold bg-green-600 hover:bg-green-800 text-stone-800 px-3 py-1 rounded"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Your Reservations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((res) => (
            <div key={res.id} className="bg-stone-400 p-4 rounded shadow">
              <p>
                <strong>Flight:</strong> {res.destination}
              </p>
              <p>
                <strong>Departure:</strong>{" "}
                {new Date(res.departure_time).toLocaleString()}
              </p>
              <p>
                <strong>Arrival:</strong>{" "}
                {new Date(res.arrival_time).toLocaleString()}
              </p>
              <p>
                <strong>Aircraft:</strong> {res.aircraft_model}
              </p>
              <p>
                <strong>Seats Booked:</strong> {res.passengers}
              </p>
              <p>
                <strong>Total:</strong> $
                {(res.price * res.passengers).toFixed(2)}
              </p>
              <div className="flex justify-center">
                <p className="text-sm font-bold mt-2 px-2">Cancel Flight?</p>
                <button
                  onClick={() => {
                    flightAPI.cancelFlight(res.id);
                    alert("Reservation cancelled!");
                    fetchAgentReservations();
                  }}
                  className="bg-stone-600 hover:bg-stone-500 text-stone-200 px-3 py-1 rounded"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showCancelModal && (
        <CancelFlightModal
          onClose={() => setShowCancelModal(false)}
          onCancelSuccess={() => {
            fetchAgentReservations();
            console.log("Flight canceled!");
          }}
        />
      )}
    </div>
  );
};

export default Agent;
