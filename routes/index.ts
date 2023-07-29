import express from "express";
import dentistRoute from "./api/dentist.route";
import adminRoute from "./api/admin.route";
import authRoute from "./api/auth.route";
// API routes (/api/...)
const router = express.Router();

router.use("/dentists", dentistRoute);
router.use("/admin", adminRoute);
router.use("", authRoute);

export default router;
