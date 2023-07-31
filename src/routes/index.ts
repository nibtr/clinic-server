import express from "express";
import dentistRoute from "./api/dentist.route";
import adminRoute from "./api/admin.route";
import staffRoute from "./api/staff.route";

const router = express.Router();

router.use("/dentists", dentistRoute);
router.use("/admin", adminRoute);
router.use("/staff", staffRoute);

export default router;
