import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";
import {
  DENTIST_TYPE,
  PATIENT_TYPE,
  sessionStatus,
  sessionType,
  STAFF_TYPE,
} from "../constant";
import {
  getExaminationFunction,
  getPersonnelFollowingType,
  getRoomsFunction,
} from "./common.controller";
import { dayOfTheWeek, skipTake, splitDate } from "../utils/utils";

export const getStaffById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staff = await prismaClient.$transaction([
            prismaClient.personnel.findUnique({
                where: {
                    id: parseInt(req.params.id),
                    type: STAFF_TYPE
                },
                select: {
                    id: true,
                    name: true,
                    dob: true,
                    gender: true,
                    phone: true,
                    nationalID: true,
                }
            })
        ])
        res.status(200).json(messageResponse(200, staff));
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getPersonels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { limit, page } = req.query


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
                    phone: true,
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

export const getPersonelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personnel = await prismaClient.$transaction([
            prismaClient.personnel.findUnique({
                where: {
                    id: parseInt(req.params.id)
                },
                select: {
                    id: true,
                    nationalID: true,
                    name: true,
                    dob: true,
                    gender: true,
                    phone: true,
                }
            })
        ])
        res.status(200).json(messageResponse(200, personnel));
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getDentistById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dentist = await prismaClient.$transaction([
            prismaClient.personnel.findUnique({
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
                    phone: true,
                }
            })
        ])
        res.status(200).json(messageResponse(200, dentist));
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getAssistantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const assistant = await prismaClient.$transaction([
            prismaClient.personnel.findUnique({
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
                    phone: true,
                }
            })
        ])
        res.status(200).json(messageResponse(200, assistant
        ));
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patient = await prismaClient.$transaction([
            prismaClient.patient.findUnique({
                where: {
                    id: parseInt(req.params.id)
                },
                select: {
                    id: true,
                    nationalID: true,
                    name: true,
                    dob: true,
                    gender: true,
                    phone: true,
                    drugContraindication: true,
                    allergyStatus: true
                }
            })
        ])
        res.status(200).json(messageResponse(200, patient));
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}


export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { limit, page, today } = req.query;
        let where = {};
        if (!limit) {
            return res.status(400).json(messageResponse(400, "limit is required"));
        }
        if (!page) {
            page = "0";
        }
        if (today === "true") {
            where = {
                session: {
                    time: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999)),
                    }
                }
            };
        }

        const [total, listSession] = await prismaClient.$transaction([
            prismaClient.session.count({ where }),
            prismaClient.session.findMany({
                take: Number(limit),
                skip: Number(page) * Number(limit),
                where,
                orderBy: {
                    time: 'desc'
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
                        select: {
                            id: true,
                            dentistID: true,
                            assistantID: true,
                        }

                    }
                }
            })
        ])

        res.status(200).json(messageResponse(200, {
            list: listSession,
            total: total
        }));
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getReExaminations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { limit, page, today } = req.query
        let where: any = { session: { type: 'EXA' } }
        if (!limit) {
            return res.status(400).json(messageResponse(400, "limit is required"))
        }
        if (!page) {
            page = "0"
        }
        if (today === "true") {
            where.session.time = {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lte: new Date(new Date().setHours(23, 59, 59, 999)),
            }
        }
        const [total, listReExam] = await prismaClient.$transaction([
            prismaClient.reExaminationSession.count(),
            prismaClient.reExaminationSession.findMany({
                take: Number(limit),
                skip: Number(page) * Number(limit),
                orderBy: {
                    Session: {
                        time: "desc",
                    }
                },
                where,
                select: {
                    Session: {
                        select: {
                            time: true,
                            status: true,
                            Room: {
                                select: {
                                    name: true
                                }
                            },
                            PersonnelSession: {
                                select: {
                                    id: true,
                                    dentistID: true,
                                    assistantID: true,
                                    Personnel_PersonnelSession_assistantIDToPersonnel: {
                                        select: {
                                            name: true
                                        }
                                    },
                                    Personnel_PersonnelSession_dentistIDToPersonnel: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        ])
        return res.status(200).json(
            messageResponse(200, {
                list: listReExam,
                total: total
            })
        )
    }
    catch (error) {
        next(error)
    }
}

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

export const getExaminations = getExaminationFunction();

