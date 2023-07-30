import express from "express";
import dentistRoute from "./api/dentist.route";
import adminRoute from "./api/admin.route";
import staffRoute from "./api/staff.route";
import authRoute from "./api/login.route";

// API routes (/api/...)



const router = express.Router();

router.use("/dentists", dentistRoute);
router.use("/admin", adminRoute);
router.use("/staff", staffRoute);

router.use("", authRoute);

export default router;
