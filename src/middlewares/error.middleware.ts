import { logger } from "@/logs";
import { Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // if (!error) {
  //   return next();
  // }
  logger.error(`Error: ${error.message}`);
  return res.status(500).json({ message: "Internal server error" });
};
