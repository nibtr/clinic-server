import { STAFF_TYPE } from "../constant";
import { getPersonnelFollowingType } from "./common.controller";
import { messageResponse } from "../utils/messageResponse";
import { NextFunction, Request, Response } from "express";

export const getStaffs = getPersonnelFollowingType(STAFF_TYPE);
