import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { MongoDuplicateKeyError } from "../types/typesAndEnums"; 
import { ErrorType } from "../types/errorTypes"; 
import { AppError } from "../errors/customError";
import { HttpStatus } from "../types/statusCodeC";

export const erroHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    error instanceof Error &&
    "code" in error &&
    error.code === HttpStatus.MONGO_DUPLICATE
  ) {
    const err = error as MongoDuplicateKeyError;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "unknown";
    return res.status(HttpStatus.BAD_REQUEST).json({
      message:'duplication error',
      sucess: false,
      result: { [field]: `${field} already exists` },
      errorType: ErrorType.FieldError,
    });
  } else if (error instanceof AppError) {
    res.status(error.statusCode).json(error.toJSON());
  } else if (error instanceof Error) {
   
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "server error" });
  } else {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "server error" });
  }

};
