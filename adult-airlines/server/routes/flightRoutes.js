import express from 'express';
import { fetchFlights } from '../controllers/flightController.js';
import * as reservationController from '../controllers/reservationController.js';


const router = express.Router();

// Map api/flights > fetchFlights controller
router.get('/', fetchFlights);

router.get('/user/:userId', reservationController.getUserReservations);


export default router;