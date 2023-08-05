import express from "express";
import * as adminController from "../../controllers/admin.controller";

const router = express.Router();

router.get("/staffs", adminController.getStaffs);

export default router;
