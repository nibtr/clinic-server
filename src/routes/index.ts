import express from "express";
import dentistRoute from "./api/dentist.route";
import adminRoute from "./api/admin.route";
import staffRoute from "./api/staff.route";
import authRoute from "./api/login.route";
import customerRoute from "./api/customer.route";


const router = express.Router();

router.use("/dentist", dentistRoute);
router.use("/admin", adminRoute);
router.use("/staff", staffRoute);
router.use("/customer", customerRoute);
router.use("", authRoute);

export default router;
