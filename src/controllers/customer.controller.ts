import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";

export const makeAppointment = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { name, phone, appointmentTime, requestTime, note } = request.body;
        const duplicateApm = await prismaClient.appointmentRequest.findFirst({
            where: {
                phone: phone,
                appointmentTime: appointmentTime,
            }
        });

        if (duplicateApm) {
            response.status(400).json({ message: "Appointment request is existed" });
            return;
        }

        if (phone.length !== 10 || !phone.startsWith("0")) {
            response.status(400).json({ message: "Phone number is invalid" });
            return;
        }

        const appointment = await prismaClient.$transaction([
            prismaClient.appointmentRequest.create({
                data: {
                    name: name,
                    phone: phone,
                    appointmentTime: appointmentTime,
                    requestTime: requestTime,
                    note: note,
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