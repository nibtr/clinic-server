import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { messageResponse } from "../utils/messageResponse";
import { skipTake } from "../utils/utils";

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
