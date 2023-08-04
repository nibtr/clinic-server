import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";

export const getDentists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dentists = await prismaClient.dentist.findMany();
    res.status(200).json(dentists);
  } catch (error) {
    next(error);
    res.status(500).send('Internal Server Error');;
  }
}

export const getDentistById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prismaClient.$transaction(async (tx) => {
      const dentist = await tx.dentist.findUnique({
        where: {
          id: parseInt(req.params.id)
        },
        select: {
          id: true,
          Personel: {
            select: {
              nationalID: true,
              name: true,
              dob: true,
              gender: true,
              phone: true
            }
          }
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
    let where: any = { dentistID: parseInt(req.params.id) };

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
          time: true,
          status: true,
          Patient: {
            select: {
              Personel: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          Assistant: {
            select: {
              Dentist: {
                select: {
                  Personel: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
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
