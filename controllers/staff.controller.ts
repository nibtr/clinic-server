import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";

export const getStaffs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staffs = await prismaClient.staff.findMany();
        res.status(200).json(staffs);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getStaffById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staff = await prismaClient.staff.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.status(200).json(staff);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getPersonels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personels = await prismaClient.personel.findMany();

        res.status(200).json(personels);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getPersonelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const personel = await prismaClient.personel.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.status(200).json(personel);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getDentists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dentists = await prismaClient.dentist.findMany({
            select: {
                id: true,
                Personnel: {
                    select: {
                        id: true,
                        nationalID: true,
                        name: true,
                        dob: true,
                        gender: true,
                        phone: true
                    }
                },
                Schedule: {
                    select: {
                        dayID: true
                    }
                },
                Session: {
                    select: {
                        id: true,
                        time: true,
                        note: true,
                        status: true,
                        patientID: true,
                        assistantID: true,
                        roomID: true
                    }
                }
            }
        }
        );
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
                        id: true,
                        nationalID: true,
                        name: true,
                        dob: true,
                        gender: true,
                        phone: true
                    }
                },
                Schedule: {
                    select: {
                        dayID: true
                    }
                },
                Session: {
                    select: {
                        id: true,
                        time: true,
                        note: true,
                        status: true,
                        patientID: true,
                        assistantID: true,
                        roomID: true
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


export const getAssistants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const assistants = await prismaClient.assistant.findMany({
            select: {
                id: true,
                Dentist: {
                    select: {
                        id: true
                    }
                },
                Session: {
                    select: {
                        id: true,
                        time: true,
                        note: true,
                        status: true,
                        patientID: true,
                        dentistID: true,
                        roomID: true
                    }
                }
            }
        });
        res.status(200).json(assistants);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getAssistantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const assistant = await prismaClient.assistant.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                id: true,
                Dentist: {
                    select: {
                        id: true
                    }
                },
                Session: {
                    select: {
                        id: true,
                        time: true,
                        note: true,
                        status: true,
                        patientID: true,
                        dentistID: true,
                        roomID: true
                    }
                }
            }
        });
        res.status(200).json(assistant);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patients = await prismaClient.patient.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                id: true,
                Personnel: {
                    select: {
                        id: true,
                        nationalID: true,
                        name: true,
                        dob: true,
                        gender: true,
                        phone: true
                    }
                },
                PaymentRecord: {
                    select: {
                        id: true,
                        date: true,
                        total: true,
                        method: true
                    }
                },
                Session: {
                    select: {
                        id: true,
                        time: true,
                        status: true,
                        dentistID: true,
                        assistantID: true,
                        roomID: true
                    }
                }
            }
        });
        res.status(200).json(patients);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}

export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patient = await prismaClient.patient.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                id: true,
                Personnel: {
                    select: {
                        id: true,
                        nationalID: true,
                        name: true,
                        dob: true,
                        gender: true,
                        phone: true
                    }
                },
                PaymentRecord: {
                    select: {
                        id: true,
                        date: true,
                        total: true,
                        method: true
                    }
                },
                Session: {
                    select: {
                        id: true,
                        time: true,
                        status: true,
                        dentistID: true,
                        assistantID: true,
                        roomID: true
                    }
                }
            }
        });
        res.status(200).json(patient);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}


export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessions = await prismaClient.session.findMany({
            select: {
                id: true,
                time: true,
                note: true,
                status: true,
                dentistID: true,
                assistantID: true,
                roomID: true
            }
        });
        res.status(200).json(sessions);
    } catch (error) {
        next(error);
        res.status(500).send('Internal Server Error');;
    }
}