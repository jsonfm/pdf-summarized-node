import { Request as ExpressRequest } from "express";

export interface CustomRequest<T = unknown> extends ExpressRequest {
  parsed: T;
}
