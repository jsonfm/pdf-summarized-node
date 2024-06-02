// express
import express from "express";

// routers
import { router as routeApiV1 } from "@/routers/api.router";

// middlewares
import { errorHandlerMiddleware } from "@/middlewares/error.middleware";

export const app = express();

// configure middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandlerMiddleware);

// configure routers
app.use("/api/v1", routeApiV1);
