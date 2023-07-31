import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";

export const makeAppointment = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    let { name, phone, appointmentTime, requestTime, note } = request.body;
    const duplicateApm = await prismaClient.appointmentRequest.find({
        where: {
            phone: phone,
            appointmentTime: appointmentTime,
        }
    });

    if (phone.length !== 10) {
        response.status(400).json({ message: "Phone number is invalid" });
        return;
    }

    if (duplicateApm) {
        response.status(400).json({ message: "Appointment request is existed" });
        return;
    }

    try {
        const appointment = await prismaClient.appointmentRequest.create({
            data: {
                name: name,
                phone: phone,
                appointmentTime: new Date(appointmentTime),
                requestTime: new Date(requestTime),
                note: note,
            }
        });

        return response.status(200).json(
            messageResponse(200, appointment)
        );

    } catch (error) {
        next(error);
    }

}