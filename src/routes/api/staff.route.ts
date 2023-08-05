import express from "express";
import * as staffController from "../../controllers/staff.controller";

const router = express.Router();


router.get("/re-examinations", staffController.getReExaminations);
router.get('/personels', staffController.getPersonels);
router.get('/personels/:id', staffController.getPersonelById);
router.get('/staffs/:id', staffController.getStaffById);
router.get('/dentists/:id', staffController.getDentistById);
router.get('/assistants/:id', staffController.getAssistantById);
router.get('/patients/:id', staffController.getPatientById);
router.get('/sessions/:id', staffController.getSessions);

router.get("/appointment-requests", staffController.getAppointmentRequest);
router.get("/patients", staffController.getPatients);
router.get("/dentists", staffController.getDentists);
router.get("/rooms", staffController.getRooms);
router.get("/dentist-for-patient", staffController.findDentistForOldPatient);
router.post("/examination", staffController.postExamination);
router.get("/examinations", staffController.getExaminations);


export default router;
1;
