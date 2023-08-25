import express from "express";
import dentistRoute from "./api/dentist.route";
import adminRoute from "./api/admin.route";
import staffRoute from "./api/staff.route";
import authRoute from "./api/login.route";
import authorizeUser from "../middlewares/auth";
import customerRoute from "./api/customer.route";
import { ADMIN_TYPE, DENTIST_TYPE, STAFF_TYPE } from "../constant";

const router = express.Router();

router.use("/dentist", authorizeUser(DENTIST_TYPE), dentistRoute);
router.use("/admin", authorizeUser(ADMIN_TYPE), adminRoute);
router.use("/staff", authorizeUser(STAFF_TYPE), staffRoute);
router.use("/customer", customerRoute);
router.use("", authRoute);

export default router;
