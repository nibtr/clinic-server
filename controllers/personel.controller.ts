import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";

export const getPersonels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const personels = await prismaClient.personel.findMany();

    res.status(200).json(personels);
  } catch (error) {
    next(error);
  }
}

export const getPersonelById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const personel = await prismaClient.personel.findUnique({
      where:{
        id: parseInt(req.params.id)
      }
    });
    res.status(200).json(personel);
  } catch (error) {
    next(error);
  }
}