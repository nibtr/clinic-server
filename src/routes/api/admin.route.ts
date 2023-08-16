import express from "express";
import * as adminController from "../../controllers/admin.controller";

const router = express.Router();

router.get("/staffs", adminController.getStaffs);
router.post("/staffs", adminController.createStaff);
router.get("/dentists", adminController.getDentists);
export default router;
