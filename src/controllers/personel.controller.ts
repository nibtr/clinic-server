import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";

export const getPersonel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const personel = await prismaClient.personel.findMany();

    res.status(200).json(personel);
  } catch (error) {
    next(error);
  }
};
