import {pool} from '../config/db.js';

// Find the flight by ID
export async function getFlightById(flightId) {
    const [rows] = await pool.query('SELECT * FROM flights WHERE id = ?', [flightId]);
    return rows[0];
}

// Create the reservation
export async function createReservation(userId, flightId) {
    await pool.query(
        'INSERT INTO reservations (user_id, flight_id, booking_time) VALUES (?, ?, NOW())',
        [userId, flightId]
    );
}

// Update number of seats available on the flight
export async function updateFlightSeats(flightId, seatsToSubtract) {
    await pool.query(
        'UPDATE flights SET total_seats = total_seats - ? WHERE id = ?',
        [seatsToSubtract, flightId]
    );
}

// Get a random user ID for testing
export async function getRandomUser() {
    const [rows] = await pool.query('SELECT id FROM users ORDER BY RAND() LIMIT 1');
    return rows[0];
}

// Get a random flight ID for testing
export async function getRandomFlight() {
    const [rows] = await pool.query('SELECT id FROM flights ORDER BY RAND() LIMIT 1');
    return rows[0];
}
