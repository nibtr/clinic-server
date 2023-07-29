import express from 'express';
import { getStaffById, getStaffs, getPersonelById, getPersonels, getDentistById, getDentists, getAssistantById, getAssistants, getPatients, getPatientById, getSessions } from '../../controllers/staff.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dentists
 *   description: Get all dentists
 * /api/dentists:
 *   get:
 *     summary: Get all dentists
 *     tags: [Dentists]
 *     responses:
 *       200:
 *         description: List of all dentists
 *       500:
 *         description: Some server error
 *
 */
router.get('/personels', getPersonels);
router.get('/personel/:id', getPersonelById);
router.get('/staffs', getStaffs);
router.get('/staff/:id', getStaffById);
router.get('/dentists', getDentists);
router.get('/dentist/:id', getDentistById);
router.get('/assistants', getAssistants);
router.get('/assistant/:id', getAssistantById);
router.get('/patients', getPatients);
router.get('/patient/:id', getPatientById);
router.get('/sessions/:id', getSessions);


export default router;
