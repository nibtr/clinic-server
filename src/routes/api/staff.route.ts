import express from "express";
import * as staffController from "../../controllers/staff.controller";

const router = express.Router();

router.get("/appointment-requests", staffController.getAppointmentRequest);
router.get("/examinations", staffController.getExaminations);
router.get("/re-examinations", staffController.getReExaminations);


router.get('/personels', staffController.getPersonels);
router.get('/personels/:id', staffController.getPersonelById);
router.get('/staffs', staffController.getStaffs);
router.get('/staffs/:id', staffController.getStaffById);
router.get('/dentists', staffController.getDentists);
router.get('/dentists/:id', staffController.getDentistById);
router.get('/assistants', staffController.getAssistants);
router.get('/assistants/:id', staffController.getAssistantById);
router.get('/patients', staffController.getPatients);
router.get('/patients/:id', staffController.getPatientById);
router.get('/sessions/:id', staffController.getSessions);

export default router;
