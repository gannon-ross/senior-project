import fetch from 'node-fetch';

const makeReservation = async () => {
  try {
    const response = await fetch('http://localhost:3001/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1,          // Example user_id
        flight_id: 100,      // Example flight_id
        seats_requested: 25   // Example seat request
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Reservation failed:', data.message);
    } else {
      console.log('Reservation successful:', data);
    }
  } catch (error) {
    console.error('Error making reservation:', error);
  }
};

makeReservation();
