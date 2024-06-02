import { Router, Request, Response } from "express";
import { GetSingleDocumentParamsSchema, GetSingleDocumentParamsSchemaType } from "@/schemas/documents/params";
import { validateSchema } from "@/schemas/validator";
import { DocumentsService } from "@/services/documents.service";
import { CustomRequest } from "@/types/common/requests";

export const router = Router();

const documentsService = new DocumentsService();

router.get("/", async (request: Request, response: Response) => {
  const { limit = 100, offset = 0 } = request.query;
  const [items, count] = await documentsService.findAndCount({
    take: Number(limit),
    skip: Number(offset),
  });
  return response.json({ data: { count, items } });
});

router.get(
  "/:documentId",
  validateSchema(GetSingleDocumentParamsSchema),
  async (request: CustomRequest<GetSingleDocumentParamsSchemaType>, response: Response) => {
    const { documentId } = request.parsed.params;
    const result = await documentsService.findOneById(documentId);
    if (!result) {
      return response.status(404).json({ error: "document not found" });
    }
    return response.json({ data: result });
  },
);
