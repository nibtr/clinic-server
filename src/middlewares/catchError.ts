import { NextFunction, Request, Response } from "express";
import { messageResponse } from "../utils/messageResponse";

export const catchError = (error: Error, _: Request, response: Response) => {
  response.status(500).send(messageResponse(500, error.message));
};
