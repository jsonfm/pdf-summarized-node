import { UserEntity } from "@/entity/user.entity";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      user: UserEntity;
      parsed: any;
    }
  }
}

export const validateSchema = (schema: z.ZodType) => (request: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = schema.parse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    request.parsed = parsed;
    next();
  } catch (err: any) {
    return res.status(400).json({ error: err.errors });
  }
};
