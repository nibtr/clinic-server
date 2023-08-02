import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";


export const getPersonnels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { limit, page, today } = req.query
        

        if (!limit) {
            return res.status(400).json(messageResponse(400, "limit is required"))
        }
        if (!page) {
            page = "0"
        }
        
        const [total, listPersonnel] = await prismaClient.$transaction([
            prismaClient.personnel.count(),
            prismaClient.personnel.findMany({
                take: Number(limit),
                skip: Number(page) * Number(limit),
                orderBy: {
                    id: "asc"
                },
                select: {
                    id: true,
                    nationalID: true,
                    name: true,
                    dob: true,
                    gender: true,
                    phone: true
                }
            })
        ]);
        res.status(200).json(messageResponse(200, {
            list: listPersonnel,
            total: total
        }));

    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}