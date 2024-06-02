import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const nanoidSchema = z.string().length(8);
