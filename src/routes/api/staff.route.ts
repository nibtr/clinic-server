import express from "express";
import * as staffController from "../../controllers/staff.controller";

const router = express.Router();

router.get("/appointment-requests", staffController.getAppointmentRequest);
router.get("/Examinations", staffController.getExaminations);


// router.get('/personels', staffController.getPersonels);
// router.get('/personel/:id', staffController.getPersonelById);
// router.get('/staffs', staffController.getStaffs);
// router.get('/staff/:id', staffController.getStaffById);
// router.get('/dentists', staffController.getDentists);
// router.get('/dentist/:id', staffController.getDentistById);
// router.get('/assistants', staffController.getAssistants);
// router.get('/assistant/:id', staffController.getAssistantById);
// router.get('/patients', staffController.getPatients);
// router.get('/patient/:id', staffController.getPatientById);
// router.get('/sessions/:id', staffController.getSessions);

export default router;
