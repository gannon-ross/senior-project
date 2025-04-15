import express from 'express';
import { fetchFlights } from '../controllers/flightController.js';

const router = express.Router();

// Map api/flights > fetchFlights controller
router.get('/', fetchFlights);

export default router;