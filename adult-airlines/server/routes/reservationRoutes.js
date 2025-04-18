console.log('reservationRoutes loaded');
import express from 'express';
import { reserveFlight, getUserReservations } from '../controllers/reservationController.js';


const router = express.Router();

// POST 
router.post('/', reserveFlight);
// GET reservations for a specific user
router.get('/:userId', getUserReservations);

 

export default router;
