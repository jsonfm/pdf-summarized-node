import { z } from "zod";
import { uuidSchema } from "@/schemas/common/ids";

export const GetSingleDocumentParamsSchema = z.object({
  params: z.object({
    documentId: uuidSchema,
  }),
});

export type GetSingleDocumentParamsSchemaType = z.infer<typeof GetSingleDocumentParamsSchema>;
