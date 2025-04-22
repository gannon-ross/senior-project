import { pool } from '../config/db.js';

// Flexible flight search
export async function searchFlights({flight_id, flight_number, origin, destination, date}) {
    let baseQuery = 'SELECT id, flight_number, origin, destination, departure_time, arrival_time, price FROM flights WHERE 1=1';
    const params = [];

    if (flight_id) {
        baseQuery += ' AND id = ?';
        params.push(flight_id);
    }

    if (flight_number) {
        baseQuery += ' AND flight_number = ?';
        params.push(flight_number);
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

export async function cancelWholeFlight(flight_id) {
    const [result] = await pool.query(
      'DELETE FROM flights WHERE id = ?',
      [flight_id]
    );
    return result;
  }
  