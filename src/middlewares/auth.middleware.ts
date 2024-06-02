import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
// config
import { Config } from "@/config";

// services
import { UsersService } from "@/services/users.service";

const usersService = new UsersService();

export const authRequiredMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const decode = jwt.verify(token, Config.JWT_SECRET);
  const userId = decode.sub as string;
  if (!decode || !userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await usersService.findOneBy({ id: userId });
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req["user"] = user;
  next();
};
