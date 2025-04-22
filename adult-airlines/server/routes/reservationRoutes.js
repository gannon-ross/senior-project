import express from 'express';
import {
    reserveFlight,
    getUserReservations,
    getAgentReservations,
    cancelReservation,
    getAlternativeFlights,
    updateReservationFlight,
    cancelEntireFlight
  } from '../controllers/reservationController.js';


const router = express.Router();

// POST 
router.post('/', reserveFlight);
// GET reservations for a specific user
router.get('/user/:userId', getUserReservations);
// Get reservations for agents
router.get("/agent/:agentId", getAgentReservations);
// Cancel reservations
router.delete("/:reservationId", cancelReservation);
// Get alternative flights for current reservations
router.get("/alternatives/:reservationId", getAlternativeFlights);
// Post the new reservation
router.post('/update-flight', updateReservationFlight);
// GET alternative flights
router.get('/alternatives/:reservationId', getAlternativeFlights);
// DELETE an entire flight
router.post('/cancel', cancelEntireFlight);

 

export default router;
