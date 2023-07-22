import express from 'express';
import dentistRoute from './api/dentist.route';

// this route is '/api'
const router = express.Router();
router.use('/dentists', dentistRoute);

export default router;