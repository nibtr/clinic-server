import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";
import { DENTIST_TYPE } from "../constant";

export const getDentists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { limit, page } = req.query;
    // let where: any = { dentistID: parseInt(req.params.id) };

    if (!limit) {
      return res.status(400).json(messageResponse(400, "limit is required"))
    }

    if (!page) {
      page = "0";
    }
    const dentists = await prismaClient.personnel.findMany({
      take: Number(limit),
      skip: Number(page) * Number(limit),
      where: {
        type: DENTIST_TYPE
      }
    });
    res.status(200).json(dentists);
  } catch (error) {
    next(error);
    res.status(500).send('Internal Server Error');;
  }
}

export const getDentistById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prismaClient.$transaction(async (tx) => {
      const dentist = await tx.personnel.findUnique({
        where: {
          id: parseInt(req.params.id),
          type: DENTIST_TYPE
        },
        select: {
          id: true,
          nationalID: true,
          name: true,
          dob: true,
          gender: true,
          phone: true
        }
      });
      res.status(200).json(dentist);
    })
  } catch (error) {
    next(error);
    res.status(500).send('Internal Server Error');;
  }
}

export const getSessionById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    let { limit, page, today } = req.query;
    let where: any = { personnelSession: { dentistID: parseInt(req.params.id) } };

    if (!limit) {
      return res.status(400).json(messageResponse(400, "limit is required"))
    }

    if (!page) {
      page = "0";
    }

    if (today === "true") {
      where.time = {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999))
      }
    }

    const [total, listSession] = await prismaClient.$transaction([
      prismaClient.session.count({
        where
      }),
      prismaClient.session.findMany({
        take: Number(limit),
        skip: Number(page) * Number(limit),
        where,
        orderBy: {
          time: "desc"
        },
        select: {
          id: true,
          time: true,
          status: true,
          note: true,
          patientID: true,
          roomID: true,
          type: true,
          PersonnelSession: {
            select:{
                id: true,
                dentistID: true,
                assistantID: true,
            }
            
        }
        }

      })
    ]);
    return res.status(200).json(messageResponse(200, {
      list: listSession,
      total: total
    }));
  } catch (error) {
    next(error);
    res.status(500).send('Internal Server Error');;
  }
}
