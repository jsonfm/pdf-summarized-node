import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { Config } from "@/config";

const { JWT_SECRET } = Config;

export const TokenType = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
};

export class encrypt {
  static encryptpass(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }
  static generateAccessToken(payload: any) {
    return jwt.sign({ tokenType: TokenType.ACCESS_TOKEN, ...payload }, JWT_SECRET, {
      expiresIn: "1d",
    });
  }
  static generateRefreshToken(payload: any) {
    return jwt.sign({ tokenType: TokenType.REFRESH_TOKEN, ...payload }, JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  static generateAccessAndRefreshTokens = (payload: any) => {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
  };
}
