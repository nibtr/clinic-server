import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";
import {
  DENTIST_TYPE,
  PATIENT_TYPE,
  sessionStatus,
  sessionType,
} from "../constant";
import {
  getPersonnelFollowingType,
  getRoomsFunction,
} from "./common.controller";
import { dayOfTheWeek, skipTake, splitDate } from "../utils/utils";

export const getAppointmentRequest = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let { limit, page, today } = request.query;
    let where = {};

    if (!limit) {
      return response
        .status(400)
        .json(messageResponse(400, "limit is required"));
    }

    if (!page) {
      page = "0";
    }

    if (today === "true") {
      where = {
        requestTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      };
    }

    const [total, listAppointmentReq] = await prismaClient.$transaction([
      prismaClient.appointmentRequest.count(),
      prismaClient.appointmentRequest.findMany({
        take: Number(limit),
        skip: Number(page) * Number(limit),
        orderBy: {
          requestTime: "desc",
        },
        where,
      }),
    ]);

    return response.status(200).json(
      messageResponse(200, {
        list: listAppointmentReq,
        total,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getPatients = getPersonnelFollowingType(PATIENT_TYPE);

export const getDentists = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let { limit, page, name, workingDay } = request.query;

    if (!limit) {
      return response
        .status(400)
        .json(messageResponse(400, "limit is required"));
    }

    if (!page) {
      page = "0";
    }

    const { skip, take } = skipTake(limit as string, page as string);

    if (workingDay) {
      const { year, month, day } = splitDate(workingDay as string);
      const dayOfWeek = dayOfTheWeek(year, month, day);
      const [dentistIDList, total] = await prismaClient.$transaction([
        prismaClient.schedule.findMany({
          take,
          skip,
          where: {
            dayID: dayOfWeek,
          },
          select: {
            dentistID: true,
          },
        }),
        prismaClient.schedule.count({
          where: {
            dayID: dayOfWeek,
          },
        }),
      ]);

      const dentistList = await prismaClient.personnel.findMany({
        where: {
          id: {
            in: dentistIDList.map((item) => item.dentistID),
          },
          name: {
            contains: name as string,
          },
          type: DENTIST_TYPE,
        },
      });
      return response
        .status(200)
        .json(messageResponse(200, { list: dentistList, total }));
    }

    const [total, list] = await prismaClient.$transaction([
      prismaClient.personnel.count({
        where: {
          type: DENTIST_TYPE,
          name: {
            contains: name as string,
          },
        },
      }),
      prismaClient.personnel.findMany({
        skip,
        take,
        where: {
          type: DENTIST_TYPE,
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

export const getRooms = getRoomsFunction();

export const findDentistForOldPatient = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { patientID } = request.query;

    if (!patientID || patientID === "-1") {
      return response.status(200).json(
        messageResponse(200, {
          haveDentist: false,
          dentist: null,
        })
      );
    }

    const sessions = await prismaClient.session.findMany({
      where: {
        patientID: Number(patientID),
      },
      orderBy: {
        time: "desc",
      },
    });

    if (sessions.length === 0) {
      return response.status(200).json(
        messageResponse(200, {
          haveDentist: false,
          dentist: null,
        })
      );
    }

    const dentist = await prismaClient.personnel.findUnique({
      where: {
        id: sessions[0].dentistID,
      },
    });

    return response.status(200).json(
      messageResponse(200, {
        haveDentist: sessions.length > 0,
        dentist: sessions.length > 0 ? dentist : null,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const postExamination = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { patientID, dentistID, roomID, note, assistantID, time } =
      request.body;

    if (!patientID || !dentistID || !roomID || !time) {
      return response
        .status(400)
        .json(messageResponse(400, "You are missing some fields !"));
    }

    const existedPatient = !!(await prismaClient.personnel.findUnique({
      where: {
        id: Number(patientID),
      },
    }));

    if (!existedPatient) {
      return response
        .status(400)
        .json(messageResponse(400, "Patient is not exist"));
    }

    const existedDentist = !!(await prismaClient.personnel.findUnique({
      where: {
        id: Number(dentistID),
      },
    }));

    if (!existedDentist) {
      return response
        .status(400)
        .json(messageResponse(400, "Dentist is not exist"));
    }

    const existedRoom = !!(await prismaClient.room.findUnique({
      where: {
        id: Number(roomID),
      },
    }));

    if (!existedRoom) {
      return response
        .status(400)
        .json(messageResponse(400, "Room is not exist"));
    }

    if (assistantID) {
      const existedAssistant = !!(await prismaClient.personnel.findUnique({
        where: {
          id: Number(assistantID),
        },
      }));

      if (!existedAssistant) {
        return response
          .status(400)
          .json(messageResponse(400, "Assistant is not exist"));
      }
    }

    const session = await prismaClient.session.create({
      data: {
        patientID: Number(patientID),
        dentistID: Number(dentistID),
        roomID: Number(roomID),
        note,
        assistantID: assistantID ? Number(assistantID) : null,
        time: new Date(time),
        type: sessionType.EXAMINATION,
        status: sessionStatus.SCHEDULED,
      },
    });

    await prismaClient.examinationSession.create({
      data: {
        Session: {
          connect: {
            id: session.id,
          },
        },
      },
    });

    response.status(200).json(messageResponse(200, session));
  } catch (error) {
    next(error);
  }
};
