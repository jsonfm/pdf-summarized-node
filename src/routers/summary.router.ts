// express
import { Router, Request, Response } from "express";

// middlewares
import { uploadFilesMiddleware } from "@/middlewares/files.middleware";

// services
import { GeminiService } from "@/services/external/gemini.service";
import { VectorStoreService } from "@/services/vector.service";
import { MessagesService } from "@/services/messages.service";

// utils
import { loadPDFAndSplit } from "@/utils/pdf";
import { generateRandomId } from "@/utils/strings";

// schemas
import {
  SummaryCitationFormSchema,
  SummaryCitationFormSchemaType,
  SummaryInterrogateChatFormSchema,
  SummaryInterrogateChatFormSchemaType,
  SummaryInterrogateFormSchema,
  SummaryInterrogateFormSchemaType,
} from "@/schemas/summary/forms";

// validators
import { validateSchema } from "@/schemas/validator";

// types
import { CustomRequest } from "@/types/common/requests";
import { DocumentsService } from "@/services/documents.service";
import { authRequiredMiddleware } from "@/middlewares/auth.middleware";
import { MessageRoleEnum } from "@/entity/message.entity";
import { logger } from "@/logs";

export const router = Router();
router.use(authRequiredMiddleware);

const vectorStoreService = new VectorStoreService("POSTGRES");
const documentsService = new DocumentsService();
const messagesService = new MessagesService();

router.post("/pdf", uploadFilesMiddleware.single("pdf"), async (request: Request, response: Response) => {
  const pdf = request.file;
  if (pdf?.mimetype !== "application/pdf" || !pdf?.buffer) {
    return response.status(400).json({ error: "invalid file type" });
  }

  const SUMMARY_PROMPT = "Make a concise and short summary of the document";
  const user = request.user;
  const exists = await documentsService.findOneByName(pdf.originalname);

  if (!!exists) {
    const answer = await GeminiService.interrogate(exists.externalVectorId, SUMMARY_PROMPT);
    return response.json({
      message: "document created",
      data: {
        document: exists,
        summary: answer,
      },
    });
  }

  const vectorId = generateRandomId();

  // save vectorized documents
  const pdfBlob = new Blob([pdf.buffer], { type: "application/pdf" });
  const docs = await loadPDFAndSplit(pdfBlob);

  await vectorStoreService.saveDocs(vectorId, docs);

  // save vector reference
  const document = {
    externalVectorId: vectorId,
    name: pdf.originalname,
    type: "book",
    userId: user?.id,
  };
  const result = await documentsService.save(document);
  const summary = await GeminiService.interrogate(vectorId, SUMMARY_PROMPT);
  return response.status(201).json({
    data: {
      document: result,
      summary,
    },
    message: "document created",
  });
});

router.post(
  "/chat/vector/:vectorId/conversation/:conversationId",
  validateSchema(SummaryInterrogateChatFormSchema),
  async (request: CustomRequest<SummaryInterrogateChatFormSchemaType>, response: Response) => {
    const { vectorId, conversationId } = request.parsed.params;
    const { question } = request.parsed.body;
    const user = request.user;

    // check for the document
    const document = await documentsService.findOneByExternalVectorId(vectorId);
    if (!document) {
      return response.status(404).json({ error: "Sorry, I have not found this document" });
    }

    const [history] = await messagesService.findAndCount({
      where: {
        conversationId,
        userId: user.id,
      },
      take: 10,
      skip: 0,
      order: {
        createdAt: "ASC",
      },
    });
    console.log("history: ", history);
    console.log("---");

    let result: {
      context: Record<string, any>[];
      answer: string;
    };
    try {
      result = await GeminiService.interrogateWhileChat(vectorId, question, history, 2);
    } catch (error: any) {
      logger.error(`${error?.message}`);
      return response.status(429).json({ error: "Sorry, I feel bad, for the moment, try later" });
    }

    const { answer } = result;

    await messagesService.save({
      role: MessageRoleEnum.HUMAN,
      content: question,
      userId: user.id,
      conversationId,
    });

    await messagesService.save({
      role: MessageRoleEnum.SYSTEM,
      content: answer,
      userId: user.id,
      conversationId,
    });

    const citation = result?.context?.map((item) => ({
      loc: item.metadata.loc,
    }));

    return response.json({
      data: {
        answer,
        citation,
      },
    });
  },
);

router.get(
  "/citation/vector/:vectorId",
  validateSchema(SummaryCitationFormSchema),
  async (request: CustomRequest<SummaryCitationFormSchemaType>, response: Response) => {
    const { vectorId } = request.parsed.params;
    const { prompt } = request.parsed.body;

    const result = await vectorStoreService.similaritySearch(vectorId, prompt);
    return response.json({ data: result });
  },
);

router.post(
  "/interrogate/vector/:vectorId",
  authRequiredMiddleware,
  validateSchema(SummaryInterrogateFormSchema),
  async (request: CustomRequest<SummaryInterrogateFormSchemaType>, response: Response) => {
    const { vectorId } = request.parsed.params;
    const document = await documentsService.findOneByExternalVectorId(vectorId);
    if (!document) {
      return response.status(404).json({ error: "Sorry, I have not found this document" });
    }
    const { question } = request.parsed.body;
    const { answer, citation } = await GeminiService.interrogateWithCitation(document.externalVectorId, question);

    return response.json({ data: { answer, citation } });
  },
);
