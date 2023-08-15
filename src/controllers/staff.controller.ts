import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";
import {
  ASSISTANT_TYPE,
  DENTIST_TYPE,
  PATIENT_TYPE,
  sessionStatus,
  sessionType,
  STAFF_TYPE,
} from "../constant";
import {
  getSessionFollowingType,
  getExaminationInfoFunction,
  getPersonnelFollowingType,
  getRoomsFunction,
  getTreatmentInfoFunction,
  postSession,
} from "./common.controller";
import { dayOfTheWeek, skipTake, splitDate } from "../utils/utils";

export const getDentistById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dentist = await prismaClient.$transaction([
      prismaClient.personnel.findUnique({
        where: {
          id: parseInt(req.params.id),
          type: DENTIST_TYPE,
        },
        select: {
          id: true,
          nationalID: true,
          name: true,
          dob: true,
          gender: true,
          phone: true,
        },
      }),
    ]);
    res.status(200).json(messageResponse(200, dentist));
  } catch (error) {
    next(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getPatientById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await prismaClient.$transaction([
      prismaClient.patient.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
        select: {
          id: true,
          nationalID: true,
          name: true,
          dob: true,
          gender: true,
          phone: true,
          drugContraindication: true,
          allergyStatus: true,
        },
      }),
    ]);
    res.status(200).json(messageResponse(200, patient));
  } catch (error) {
    next(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getReExaminations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { limit, page, today } = req.query;
    let where: any = { session: { type: "EXA" } };
    if (!limit) {
      return res.status(400).json(messageResponse(400, "limit is required"));
    }
    if (!page) {
      page = "0";
    }
    if (today === "true") {
      where.session.time = {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      };
    }
    const [total, listReExam] = await prismaClient.$transaction([
      prismaClient.reExaminationSession.count(),
      prismaClient.reExaminationSession.findMany({
        take: Number(limit),
        skip: Number(page) * Number(limit),
        orderBy: {
          Session: {
            time: "desc",
          },
        },
        where,
        select: {
          Session: {
            select: {
              time: true,
              status: true,
              Room: {
                select: {
                  name: true,
                },
              },
              dentistID: true,
              assistantID: true,
              Assistant: {
                select: {
                  name: true,
                },
              },
              Dentist: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);
    return res.status(200).json(
      messageResponse(200, {
        list: listReExam,
        total: total,
      })
    );
  } catch (error) {
    next(error);
  }
};

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
      prismaClient.appointmentRequest.count({
        where,
      }),
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

export const getAssistants = getPersonnelFollowingType(ASSISTANT_TYPE);

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

    const result = await postSession(
      patientID,
      dentistID,
      roomID,
      note,
      assistantID,
      time,
      sessionType.EXAMINATION
    );

    if (result.statusCode !== 200) {
      return response.status(result.statusCode).json(result);
    }

    await prismaClient.examinationSession.create({
      data: {
        Session: {
          connect: {
            id: result.data.id,
          },
        },
      },
    });

    return response.status(200).json(messageResponse(200, result.data));
  } catch (error) {
    next(error);
  }
};

export const getExaminations = getSessionFollowingType(sessionType.EXAMINATION);

export const getExaminationInfo = getExaminationInfoFunction();

export const getReExaminationsOfExamination = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response
        .status(400)
        .json(messageResponse(400, "ID of Examination is required !"));
    }

    const res = await prismaClient.reExaminationSession.findMany({
      where: {
        relatedExaminationID: Number(id),
      },
      include: {
        Session: true,
      },
    });

    return response.status(200).json(messageResponse(200, res));
  } catch (error) {
    next(error);
  }
};

export const getTreatmentSessions = getSessionFollowingType(
  sessionType.TREATMENT
);

export const getTreatmentSessionInfo = getTreatmentInfoFunction();

export const getCategoryList = async (
  _: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const categories = await prismaClient.category.findMany({
      include: {
        Procedure: true,
      },
    });

    return response.status(200).json(messageResponse(200, categories));
  } catch (error) {
    next(error);
  }
};

export const getToothList = async (
  _: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const teeth = await prismaClient.tooth.findMany();

    return response.status(200).json(messageResponse(200, teeth));
  } catch (error) {
    next(error);
  }
};

export const postTreatmentSession = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const {
      time,
      patientID,
      dentistID,
      assistantID,
      roomID,
      note,
      healthNote,
      description,
      categoryID,
      teeth,
    } = request.body;

    const result = await postSession(
      patientID,
      dentistID,
      roomID,
      note,
      assistantID,
      time,
      sessionType.TREATMENT
    );

    if (result.statusCode !== 200) {
      return response.status(result.statusCode).json(result);
    }

    const treatmentSession = await prismaClient.treatmentSession.create({
      data: {
        Session: {
          connect: {
            id: result.data.id,
          },
        },
        Category: {
          connect: {
            id: categoryID,
          },
        },
        healthNote,
        description,
      },
    });

    teeth.forEach(async (tooth: { toothID: number; order: number }) => {
      await prismaClient.toothSession.create({
        data: {
          order: tooth.order,
          TreatmentSession: {
            connect: {
              id: treatmentSession.id,
            },
          },
          Tooth: {
            connect: {
              id: tooth.toothID,
            },
          },
        },
      });
    });

    response.status(200).json(messageResponse(200, request.body));
  } catch (error) {
    next(error);
  }
};


export const deleteAppointmentReq = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    let where: any = { id: parseInt(req.params.id) };

    const staff = await prismaClient.$transaction( async (tx) => {
      tx.appointmentRequest.delete({
        where,
      })
    })

    return res.status(200).json(
      messageResponse(200,{status: staff})
    )
  }
  catch (error){
    next(error);
    res.status(500).send("Internal Server Error");
  }
}