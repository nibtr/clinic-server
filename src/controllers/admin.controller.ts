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
            type: 'STA',
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

        return res.status(201).json(
            messageResponse(201, {
                account: result.account,
                personnel: result.personnel,
            })
        );
    } catch (error) {
        next(error);
    }
};

export const getDentists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { limit, page, today } = req.query;
        let where: any = {type : 'DEN'}
        if (!limit) {
            return res.status(400).json(messageResponse(400, "limit is required"));
        }
        if (!page) {
            page = "0";
        }
        if (today === "true") {
            where.session.time = {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lte: new Date(new Date().setHours(23, 59, 99, 999))
            }
        }
        const [total, listDenstist] = await prismaClient.$transaction([
            prismaClient.personnel.count({
                where
            }),
            prismaClient.personnel.findMany({
                take: Number(limit),
                skip: Number(page) * Number(limit),
                where,
                select:{
                    name: true,
                    dob: true,
                    gender: true,
                    phone: true,
                    nationalID: true,
                    Schedule:{
                        select:{
                            dayID: true,
                            Day:{
                                select:{
                                    day: true,
                                }
                            }
                        }
                    }
                }
            })
        ]);
        return res.status(200).json(
            messageResponse(200, {
                total: total,
                list: listDenstist
            })
        )
    }
    catch(error){
        next(error)
    }
}