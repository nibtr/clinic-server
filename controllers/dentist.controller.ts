import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";

export const getDentists = async (req: Request, res: Response, next: NextFunction) => {
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
    const dentist = await prismaClient.dentist.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      select: {
        id: true,
        Personnel: {
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
  } catch (error) {
    next(error);
    res.status(500).send('Internal Server Error');;
  }
}

export const getSessionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await prismaClient.session.findMany({
      where: {
        dentistID: parseInt(req.params.id)
      },
      select: {
        id: true,
        time: true,
        note: true,
        status: true,
        patientID: true,
        assistantID: true,
        roomID: true,
        Patient: {
          select: {
            drugContraindication: true,
            oralHealthStatus: true,
            allergyStatus: true
          }
        },
        TreatmentSession: {
          select: {
            healthNote: true,
            description: true,
            categoryID: true,
            Category: {
              select: {
                description: true,
                code: true,
                name: true,
                Procedure: {
                  select: {
                    description: true,
                    code: true,
                    name: true
                  }
                }
              }
            },
            ToothSession: {
              select: {
                order: true,
                Tooth: {
                  select: {
                    id: true,
                    type: true,
                    name: true
                  }
                }
              }
            }

          }
        },
        ExaminationSession: {
          select: {
            id: true
          }
        }, ReExaminationSession: {
          select: {
            id: true,
            relatedExaminationID: true
          }
        }

      }
    });
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
    res.status(500).send('Internal Server Error');;
  }
}
