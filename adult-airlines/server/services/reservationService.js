import {pool} from '../config/db.js';

// Find the flight by ID
export async function getFlightById(flightId) {
    const [rows] = await pool.query('SELECT * FROM flights WHERE id = ?', [flightId]);
    return rows[0];
}

// Create the reservation
export async function createReservation(userId, flightId, agentId = null, passengers = 1) {
    const [result] = await pool.query(
        'INSERT INTO reservations (user_id, flight_id, booking_time, agent_id, passengers) VALUES (?, ?, NOW(), ?, ?)',
        [userId, flightId, agentId, passengers]
    );

    const [reservationRows] = await pool.query(
        'SELECT * FROM reservations WHERE id = ?',
        [result.insertId]
    );

    return reservationRows[0];
}

// Cancel (delete) a reservation
export async function cancelReservationById(reservationId) {
    await pool.query(
        'DELETE FROM reservations WHERE id = ?', 
        [reservationId]
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

export async function getReservationsByUser(userId) {
    const [rows] = await pool.query(
      `SELECT r.id AS reservation_id, f.origin, f.destination, f.departure_time, f.arrival_time, f.aircraft_model
       FROM reservations r
       JOIN flights f ON r.flight_id = f.id
       WHERE r.user_id = ?`,
      [userId]
    );
    return rows;
  }
  
export async function getReservationsByAgent(agentId) {
    const [rows] = await pool.query(
        `Select r.*, f.destination, f.departure_time, f.arrival_time, f.aircraft_model, f.price, f.flight_number
        FROM reservations r
        Join flights f ON r.flight_id = f.id
        WHERE r.agent_id = ?
        ORDER BY r.booking_time DESC`,
        [agentId]
    );
    return rows;
}

export async function findAlternativeFlights({ origin, destination, excludeFlightId }) {
    const query = `
      SELECT *
      FROM flights
      WHERE origin = ?
        AND destination = ?
        AND id != ?
        AND departure_time > NOW()
      ORDER BY departure_time ASC
    `;
  
    const [rows] = await pool.query(query, [origin, destination, excludeFlightId]);
    return rows;
  }

export async function getReservationById(reservationId) {
    const [rows] = await pool.query(
      `SELECT r.*, f.origin, f.destination
       FROM reservations r
       JOIN flights f ON r.flight_id = f.id
       WHERE r.id = ?`,
      [reservationId]
    );
    return rows;
  }
  export async function getReservationByFlight(flight_id) {
    const [rows] = await pool.query(
      `SELECT r.*, f.origin, f.destination, f.flight_number, f.departure_time
       FROM reservations r
       JOIN flights f ON r.flight_id = f.id
       WHERE r.flight_id = ?`,
      [flight_id]
    );  
    return rows;
  }
  
  export async function deleteReservationsByFlight(flight_id) {
    const [result] = await pool.query(
      'DELETE FROM reservations WHERE flight_id = ?',
      [flight_id]
    );
    return result;
  }
  
  

  export async function updateReservationFlight(reservationId, newFlightId) {
    await pool.query(
      'UPDATE reservations SET flight_id = ? WHERE id = ?',
      [newFlightId, reservationId]
    );
  }
  
  
  