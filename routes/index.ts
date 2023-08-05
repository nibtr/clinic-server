import express from 'express';
import dentistRoute from './api/dentist.route';
import staffRoute from './api/staff.route';
// API routes (/api/...)
const router = express.Router();

router.use('/dentists', dentistRoute);
router.use('/staff',staffRoute)

export default router;