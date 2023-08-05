import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";
import { STAFF_TYPE, DENTIST_TYPE, PATIENT_TYPE } from "../constant";

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

export const getExaminations = async (req: Request, res: Response, next: NextFunction) => {
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
        const [total, listExam] = await prismaClient.$transaction([
            prismaClient.examinationSession.count(),
            prismaClient.examinationSession.findMany({
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
                },
                
            })
        ])
        return res.status(200).json(
            messageResponse(200, {
                list: listExam,
                total: total
            })
        )
    }
    catch (error) {
        next(error)
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

export const getRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { limit, page } = req.query;
        let where = {};
        if (!limit) {
            return res.status(400).json(messageResponse(400, "limit is required"));
        }
        if (!page) {
            page = "0";
        }


        const [total, listRoom] = await prismaClient.$transaction([
            prismaClient.room.count(),
            prismaClient.room.findMany({
                take: Number(limit),
                skip: Number(page) * Number(limit),
                where,
                orderBy: {
                    id: 'asc'
                },
                select: {
                    id: true,
                    name: true,
                    code: true,
                    Session: {
                        select: {
                            patientID: true
                        }
                    }
                }
            })
        ])

        res.status(200).json(messageResponse(200, {
            list: listRoom,
            total: total
        }));
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}