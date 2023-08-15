import { STAFF_TYPE } from "../constant";
import { getPersonnelFollowingType } from "./common.controller";
import { messageResponse } from "../utils/messageResponse";
import { NextFunction, Request, Response } from "express";
import * as utils from "../utils/passwordUtil"
import prismaClient from "../utils/prismaClient";

export const getStaffs = getPersonnelFollowingType(STAFF_TYPE);

export const createStaff = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const hashPassword = await utils.hashPassword(req.body.password)
        await prismaClient.$transaction
    }
}