console.log('reservationRoutes loaded');
import express from 'express';
import { reserveFlight } from '../controllers/reservationController.js';

const router = express.Router();

// POST 
router.post('/', reserveFlight);
 

export default router;
