import { Request, Response } from "express";
import { messageResponse } from "../utils/messageResponse";

export const catchError = (error: Error) => {
  return (_: Request, res: Response) => {
    res.status(500).send(messageResponse(500, error.message));
  }
};
