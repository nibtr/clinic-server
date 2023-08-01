import express from "express";
import * as staffController from "../../controllers/staff.controller";

const router = express.Router();

router.get("/appointment-requests", staffController.getAppointmentRequest);
router.get("/patients", staffController.getPatients);
router.get("/dentists", staffController.getDentists);
router.get("/rooms", staffController.getRooms);
router.get("/dentist-for-patient", staffController.findDentistForOldPatient);
router.post("/examination", staffController.postExamination);
router.get("/examinations", staffController.getExaminations);

export default router;
1;
