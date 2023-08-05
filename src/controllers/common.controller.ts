import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";
import { skipTake } from "../utils/utils";
import { PATIENT_TYPE, sessionType } from "../constant";

export const getPersonnelFollowingType = (type: string) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      let { limit, page, name } = request.query;

      if (!limit) {
        return response
          .status(400)
          .json(messageResponse(400, "limit is required"));
      }

      if (!page) {
        page = "0";
      }

      const { skip, take } = skipTake(limit as string, page as string);

      const [total, list] =
        type === PATIENT_TYPE
          ? await prismaClient.$transaction([
              prismaClient.patient.count({
                where: {
                  name: {
                    contains: name as string,
                  },
                },
              }),
              prismaClient.patient.findMany({
                skip,
                take,
                where: {
                  name: {
                    contains: name as string,
                  },
                },
              }),
            ])
          : await prismaClient.$transaction([
              prismaClient.personnel.count({
                where: {
                  type,
                  name: {
                    contains: name as string,
                  },
                },
              }),
              prismaClient.personnel.findMany({
                skip,
                take,
                where: {
                  type,
                  name: {
                    contains: name as string,
                  },
                },
              }),
            ]);

      return response.status(200).json(
        messageResponse(200, {
          list,
          total,
        })
      );
    } catch (error) {
      next(error);
    }
  };
};

export const getRoomsFunction = () => {
  return async (_: Request, response: Response, next: NextFunction) => {
    try {
      const rooms = await prismaClient.room.findMany();
      return response.status(200).json(messageResponse(200, rooms));
    } catch (error) {
      next(error);
    }
  };
};

//edited
export const getSessionFollowingType = (type: string) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    let { limit, page, today } = request.query;
    let todayCondition = {};

    if (!limit) {
      return response
        .status(400)
        .json(messageResponse(400, "limit is required"));
    }

    if (!page) {
      page = "0";
    }

    if (today === "true") {
      todayCondition = {
        time: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      };
    }

    const { skip, take } = skipTake(limit as string, page as string);

    try {
      const [list, total] = await prismaClient.$transaction([
        prismaClient.session.findMany({
          skip,
          take,
          where: {
            type,
            ...todayCondition,
          },
          orderBy: {
            time: "desc",
          },
          include: {
            Patient: true,
            Dentist: true,
            Assistant: true,
            Room: {
              select: {
                name: true,
              },
            },
          },
        }),
        prismaClient.session.count({
          where: {
            type,
            ...todayCondition,
          },
        }),
      ]);
      return response.status(200).json(
        messageResponse(200, {
          list,
          total,
        })
      );
    } catch (error) {
      next(error);
    }
  };
};

//edited
export const getExaminationInfoFunction = () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      if (!id) {
        return response
          .status(400)
          .json(messageResponse(400, "id is required"));
      }

      const examination = await prismaClient.session.findUnique({
        where: {
          id: Number(id),
          type: sessionType.EXAMINATION,
        },
        include: {
          Patient: true,
          Dentist: true,
          Assistant: true,
          Room: true,
        },
      });

      if (!examination) {
        return response
          .status(400)
          .json(messageResponse(400, "examination not found"));
      }

      return response.status(200).json(messageResponse(200, examination));
    } catch (error) {
      next(error);
    }
  };
};

//edited
export const getTreatmentInfoFunction = () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      if (!id) {
        return response
          .status(400)
          .json(messageResponse(400, "id is required"));
      }

      const treatment = await prismaClient.treatmentSession.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          Session: {
            include: {
              Patient: true,
              Dentist: true,
              Assistant: true,
              Room: true,
            },
          },
          Category: true,
          Prescription: {
            include: {
              Drug: true,
            },
          },
          ToothSession: {
            include: {
              Tooth: true,
            },
          },
          PaymentRecord: true,
        },
      });

      if (!treatment) {
        return response
          .status(400)
          .json(messageResponse(400, "treatment not found"));
      }

      return response.status(200).json(messageResponse(200, treatment));
    } catch (error) {
      next(error);
    }
  };
};
