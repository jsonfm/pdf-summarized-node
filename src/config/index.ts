import dotenv from "dotenv";

if (process.env.NODE_ENV == "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

export const Config = {
  NODE_ENV: String(process.env.NODE_ENV || "dev"),
  PORT: Number(process.env.PORT || 3000),

  // Auth
  JWT_SECRET: String(process.env.JWT_SECRET || ""),

  // DB
  DB_HOST: String(process.env.DB_HOST || ""),
  DB_PASSWORD: String(process.env.DB_PASSWORD || ""),
  DB_USERNAME: String(process.env.DB_USERNAME || ""),
  DB_PORT: String(process.env.DB_PORT || ""),
  DB_DATABASE: String(process.env.DB_NAME || ""),
  DB_NAME: String(process.env.DB_NAME || ""),

  // Vector store
  DB_VECTORS_NAME: String(process.env.DB_VECTORS_NAME || ""),

  // Google
  GOOGLE_API_KEY: String(process.env.GOOGLE_API_KEY || ""),
};
