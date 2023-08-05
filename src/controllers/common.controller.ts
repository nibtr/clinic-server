import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";
import { skipTake } from "../utils/utils";
import { sessionType } from "../constant";

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

      const [total, list] = await prismaClient.$transaction([
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

export const getExaminationFunction = () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    let { limit, page } = request.query;

    if (!limit) {
      return response
        .status(400)
        .json(messageResponse(400, "limit is required"));
    }

    if (!page) {
      page = "0";
    }

    const { skip, take } = skipTake(limit as string, page as string);

    try {
      const res = await prismaClient.session.findMany({
        skip,
        take,
        where: {
          type: sessionType.EXAMINATION,
        },
        include: {
          Patient: {
            include: {
              Personel: true,
            },
          },
          Dentist: {
            include: {
              Personel: true,
            },
          },
          Room: true,
        },
      });
      return response.status(200).json(messageResponse(200, res));
    } catch (error) {
      next(error);
    }
  };
};
