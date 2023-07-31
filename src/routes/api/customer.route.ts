import express from "express";
import * as customerController from "../../controllers/customer.controller";

const router = express.Router();

router.post("/make-appointment", customerController.makeAppointment);

export default router;
