import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";

// get all categories
export const getCategories = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    
    try {
        const categories = await prismaClient.category.findMany();
        return response.status(200).json(
            messageResponse(200, categories)
        );
    }
    catch (error) {
        next(error);
    }
}

export const makeAppointment = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { patientName, patientPhone, appointmentTime, requestTime, note, categoryName } = request.body;
        let appointmentTimeDate = new Date(appointmentTime);
        let requestTimeDate = new Date(requestTime);

        const duplicateApm = await prismaClient.appointmentRequest.findFirst({
            where: {
                patientPhone: patientPhone,
                appointmentTime: appointmentTimeDate,
            }
        });

        if (duplicateApm) {
            response.status(400).json({ message: "Appointment request is existed" });
            return;
        }


        if (patientPhone.length !== 10 || !patientPhone.startsWith("0")) {
            response.status(400).json({ message: "Phone number is invalid" });
            return;
        }

        const appointment = await prismaClient.$transaction([
            prismaClient.appointmentRequest.create({
                data: {
                    patientName: patientName,
                    patientPhone: patientPhone,
                    appointmentTime: appointmentTimeDate,
                    requestTime: requestTimeDate,
                    note: note,
                    categoryName: categoryName,
                }

            }),
        ]);

        return response.status(201).json(
            messageResponse(201, appointment)
        );

    } catch (error) {
        next(error);
    }

}