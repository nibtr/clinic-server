import express from "express";
import * as adminController from "../../controllers/admin.controller";
import { catchError } from "../../middlewares/catchError";

const router = express.Router();

router.get("/staffs", adminController.getStaff, catchError);
// router.post("/staff", adminController.postStaff, catchError);

export default router;
