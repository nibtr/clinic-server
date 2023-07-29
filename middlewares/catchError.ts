import { NextFunction, Request, Response } from "express";

export const catchError = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Error handling middleware functionality
  console.log(`error ${error.message}`); // log the error
  // send back an easily understandable error message to the caller
  response.status(500).send({
    statusCode: 500,
    message: error.message,
  });
};
