import express from "express";
import * as staffController from "../../controllers/staff.controller";

const router = express.Router();

router.get("/re-examinations", staffController.getReExaminations);
router.get("/dentists/:id", staffController.getDentistById);
router.get("/patients/:id", staffController.getPatientById);
router.get("/appointment-requests", staffController.getAppointmentRequest);
router.get("/patients", staffController.getPatients);
router.get("/dentists", staffController.getDentists);
router.get("/rooms", staffController.getRooms);
router.get("/dentist-for-patient", staffController.findDentistForOldPatient);
router.post("/examination", staffController.postExamination);
router.get("/examinations", staffController.getExaminations);
router.get("/examinations/:id", staffController.getExaminationInfo);
router.get(
  "/examinations/:id/re-examinations",
  staffController.getReExaminationsOfExamination
);
router.get("/treatment-sessions", staffController.getTreatmentSessions);
router.get("/treatment-sessions/:id", staffController.getTreatmentSessionInfo);
router.get("/categories", staffController.getCategoryList);
router.get("/teeth", staffController.getToothList);
router.get("/assistants", staffController.getAssistants);
router.post("/treatment-session", staffController.postTreatmentSession);
router.delete("/delete-appointment-req", staffController.deleteAppointmentReq);
export default router;
