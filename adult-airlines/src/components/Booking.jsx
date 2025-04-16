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
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handlePaymentSubmit = async () => {
    // Simple client-side validation for appearance
    const { cardNumber, expiry, cvv, name, zip } = paymentInfo;
    if (!cardNumber || !expiry || !cvv || !name || !zip) {
      alert("Please fill out all payment fields.");
      return;
    }
    try {
      await flightAPI.reserveFlight(user.id, selectedFlight.id, 1);
      alert("Payment approved. Reservation successful!");
      setSelectedFlight(null);
      setShowModal(false);
      setShowPaymentForm(false);
      setPaymentInfo({ cardNumber: "", expiry: "", cvv: "", name: "", zip: "" });
    } catch (error) {
      console.error("Reservation failed:", error);
      alert("Failed to reserve flight.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start">
      
      <h2 className="text-2xl font-bold mb-2">Book Your Flight with Adult Airlines!</h2>
      <form className="flex flex-col justify-center" onSubmit={handleSearch}>
        
          <div className="flex items-center">
            <label className="w-40 text-right text-md text-gray-300 px-3">Departure City:</label>
            <input
              className='w-40 bg-stone-400 placeholder-stone-800 text-stone-800 rounded shadow-md px-3 py-2 my-2'
              type="text"
              placeholder="From"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-right text-md text-gray-300 px-3">Destination City:</label>
            <input
              className='w-40 bg-stone-400 placeholder-stone-800 text-stone-800 rounded shadow-md px-3 py-2 my-2'
              type="text"
              placeholder="To"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-right text-md text-gray-300 px-3">Date:</label>
            <input
              className='w-40 bg-stone-400 text-stone-800 rounded shadow-md px-3 py-2 my-2' 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

        <button 
          className='place-self-center duration-300 w-[40%] rounded hover:cursor-pointer bg-stone-400 text-gray-300 hover:bg-stone-600 px-3 py-2 my-2'
          type="submit">Search Flights</button>
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
          <><div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Payment for Flight</h3>
              <p>
                Flight: {selectedFlight.origin} ➔ {selectedFlight.destination}
              </p>
              <p>Price: ${selectedFlight.price}</p>

              
              {/* Placeholder for payment fields */}
              <Button
                className="mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => setShowPayment(true)}
              >
                Enter Payment Info
              </Button>

              <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <DialogTitle className="text-lg font-semibold p-4">Payment Details</DialogTitle>
                <DialogContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4 p-2">
                    <Input
                      name="cardNumber"
                      type="text"
                      placeholder="Card Number"
                      maxLength={16}
                      required
                      onChange={handlePaymentChange}
                      value={formData.cardNumber} />
                    <div className="flex gap-2">
                      <Input
                        name="expiry"
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        onChange={handlePaymentChange}
                        value={formData.expiry} />
                      <Input
                        name="cvv"
                        type="text"
                        placeholder="CVV"
                        maxLength={4}
                        required
                        onChange={handlePaymentChange}
                        value={formData.cvv} />
                    </div>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Name on Card"
                      required
                      onChange={handlePaymentChange}
                      value={formData.name} />
                    <Input
                      name="zip"
                      type="text"
                      placeholder="Billing ZIP Code"
                      required
                      onChange={handlePaymentChange}
                      value={formData.zip} />
                    <DialogFooter className="mt-4">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Submit Payment
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div><div className="mt-4">
                <p className="text-sm text-gray-500">
                  [ Payment Form Coming Soon ]
                </p>
                <button>
                  
                  Simulate Payment Success
                </button>
              </div></>
        
                )}</FlightSearchModal>
    </div>
  );
};

export default Booking;
