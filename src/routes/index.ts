import express from "express";
import dentistRoute from "./api/dentist.route";
import adminRoute from "./api/admin.route";


// API routes (/api/...)

import staffRoute from "./api/staff.route";
import authRoute from "./api/auth.route";


const router = express.Router();

router.use("/dentists", dentistRoute);
router.use("/admin", adminRoute);
router.use("/staff", staffRoute);

router.use("", authRoute);

export default router;
