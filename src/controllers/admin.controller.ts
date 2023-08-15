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
    try {
        const hashPassword = await utils.hashPassword(req.body.password);
        const data2: any = {
            nationalID: req.body.nationalID,
            name: req.body.name,
            dob: req.body.dob,
            gender: req.body.gender,
            type: 'staff',
            phone: req.body.phone,
        };
        const data: any = {
            username: req.body.username,
            password: hashPassword,
            email: req.body.email,
            personnelID: data2.id
        };
        const result = await prismaClient.$transaction(async (tx) => {
            const account = await tx.account.create({
                data,
            });
            const personnel = await tx.personnel.create({
                data: data2,
            });
            return { account, personnel };
        });

        return res.status(200).json(
            messageResponse(200, {
                account: result.account,
                personnel: result.personnel,
            })
        );
    } catch (error) {
        next(error);
    }
};
