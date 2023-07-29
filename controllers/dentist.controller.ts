import { Request, NextFunction, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken';
import config from '../configs';
import { comparePassword } from '../utils/passwordUtil';
export const getDentists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dentists = await prismaClient.dentist.findMany();
    res.status(200).json(dentists);
  } catch (error) {
    next(error);
  }
}

