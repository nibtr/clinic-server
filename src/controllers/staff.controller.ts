import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";

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
