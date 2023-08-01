import { STAFF_TYPE } from "../constant";
import { getPersonnelFollowingType } from "./common.controller";

export const getStaffs = getPersonnelFollowingType(STAFF_TYPE);
