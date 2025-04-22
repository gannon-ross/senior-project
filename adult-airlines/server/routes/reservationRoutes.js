import express from 'express';
import { reserveFlight, getUserReservations, getAgentReservations, cancelReservation } from '../controllers/reservationController.js';


const router = express.Router();

// POST 
router.post('/', reserveFlight);
// GET reservations for a specific user
router.get('/user/:userId', getUserReservations);
// Get reservations for agents
router.get("/agent/:agentId", getAgentReservations);
// Cancel reservations
router.delete("/:reservationId", cancelReservation);

 

export default router;
