import express from "express";
import * as customerController from "../../controllers/customer.controller";

const router = express.Router();

router.post("/appointment", customerController.makeAppointment);
router.get("/categories", customerController.getCategories);

export default router;
