import express from "express";
import * as staffController from "../../controllers/staff.controller";

const router = express.Router();

router.get("/appointment-requests", staffController.getAppointmentRequest);

export default router;
