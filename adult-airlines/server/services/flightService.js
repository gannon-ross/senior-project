import { pool } from '../config/db.js';

// Flexible flight search
export async function searchFlights({flight_id, origin, destination, date}) {
    let baseQuery = 'SELECT id, origin, destination, departure_time, arrival_time, price FROM flights WHERE 1=1';
    const params = [];

    if (flight_id) {
        baseQuery += ' AND id = ?';
        params.push(flight_id);
    }

    if (origin) {
        baseQuery += ' AND origin = ?';
        params.push(origin);
    }

    if (destination) {
        baseQuery += ' AND destination = ?';
        params.push(destination);
    }
    if (date) {
        baseQuery += ' AND DATE(departure_time) = ?'; // assumes date comes in 'YYYY-MM-DD"
        params.push(date);
    }

    baseQuery += ' ORDER BY departure_time ASC';
    const [rows] = await pool.query(baseQuery, params);

    return rows;
    
}

// Flexible flight cancellation - works for agents and for customers
export async function cancelFlight({reservationId}) {
    let baseQuery = 'DELETE FROM reservations WHERE id = ?';
    const params = [reservationId];

    const [ack] = await pool.query(baseQuery, params);
    console.log(ack);
    return ack;
}