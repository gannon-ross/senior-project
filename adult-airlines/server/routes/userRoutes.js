import express from 'express';
import { getUserByEmailHandler } from '../controllers/reservationController.js';

const router = express.Router();

router.get('/by-email', getUserByEmailHandler);

export default router;
