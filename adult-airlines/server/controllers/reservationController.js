import * as reservationService from '../services/reservationService.js';

// talk with frontend and validate logic
export async function reserveFlight (req, res) {
    let user_id, flight_id, seats_requested;

    try {
        // Validate input
        if (
            typeof req.body.user_id !== 'number' ||
            typeof req.body.flight_id !== 'number' ||
            typeof req.body.seats_requested !== 'number' ||
            req.body.seats_requested <= 0
        ) {
            return res.status(400).json({ message: 'Invalid input. Please provide valid user_id, flight_id, and seats_requested.' });
        }
        //=============
        // Future: Use real data from the frontend/search
        // (uncomment here when the search is working)

        
        user_id = req.body.user_id;
        flight_id = req.body.flight_id;
        seats_requested = req.body.seats_requested;
        
       //===================

       
       
       //+++++++++++++++++
       // for testing implementation without search; random user and flight
        /*
       const randomUser = await reservationService.getRandomUser();
       const randomFlight = await reservationService.getRandomFlight();

       user_id = randomUser.id;
       flight_id = randomFlight.id;
       seats_requested = req.body.seats_requested || 1; //change value to adjust number of reservations
       */
       //++++++++++++++++++++

       const flight = await reservationService.getFlightById(flight_id);

       if (!flight) {
        return res.status(404).json({ message: 'Flight not found'});
       }

       if (flight.total_seats < seats_requested) {
        return res.status(400).json({ message: 'Not enough seats available'});
       }

       await reservationService.createReservation(user_id, flight_id);
       await reservationService.updateFlightSeats(flight_id, seats_requested);

       // Console output to check the random DB placement
       console.log('-------------------------');
       console.log('Reservation created!');
       console.log('Go check in your DB:');
       console.log(`Select * From reservations WHERE user_id = ${user_id} AND flight_id = ${flight_id}`);
       console.log('--------------------------');

       res.status(201).json({
        message: 'Reservation successful',
        user_id,
        flight_id,
        seats_requested
       });
    } catch (error) {
        console.error('Error reserving flight:', error);
        res.status(500).json({ message: 'Server error'});
    }
};

