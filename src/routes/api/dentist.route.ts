import express from 'express';
import * as dentistController from '../../controllers/dentist.controller';

const router = express.Router();

router.get('/dentists', dentistController.getDentists);
router.get('/dentists/:id', dentistController.getDentistById);
router.get('/dentists/sessions/:id', dentistController.getSessionById);

export default router;
