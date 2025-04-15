import { searchFlights } from '../services/flightService.js';

// Controller to handle the frontend inputs
export async function fetchFlights(req, res) {
    try{
        const { flight_id, origin, destination, date } = req.query;

        //Force at least one passed parameter to search
        if (!flight_id && !origin && !destination && !date) {
            return res.status(400).json({message: 'At least one search parameter is required.'});
        }

        //Performs the search if valid input
        const flights = await searchFlights({flight_id, origin, destination, date});

        if (flights.length === 0) {
            return res.status(404).json({ message: 'No matching flights found.'});
        }

        res.status(200).json(flights);
    }   catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).json({ message: 'Server error'});
    }
}