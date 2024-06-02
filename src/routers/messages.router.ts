import { Router, Request, Response } from "express";

//
import { authRequiredMiddleware } from "@/middlewares/auth.middleware";
//
import { MessagesService } from "@/services/messages.service";
//
import { MessageCreationFormSchema, MessageCreationFormSchemaType } from "@/schemas/messages/forms";
import { validateSchema } from "@/schemas/validator";

import { CustomRequest } from "@/types/common/requests";

export const router = Router();
router.use(authRequiredMiddleware);

//
const messagesService = new MessagesService();

router.get("/conversation/:conversationId", async (request: Request, response: Response) => {
  const conversationId = request.params.conversationId;
  const user = request.user;
  const { limit = 100, offset = 0 } = request.query;
  const [items, count] = await messagesService.findAndCount({
    where: {
      conversationId,
      userId: user.id,
    },
    take: Number(limit),
    skip: Number(offset),
  });
  return response.json({
    data: {
      count,
      items,
    },
  });
});

router.post(
  "/conversation/:conversationId",
  validateSchema(MessageCreationFormSchema),
  async (request: CustomRequest<MessageCreationFormSchemaType>, response: Response) => {
    const user = request?.user;
    const { conversationId } = request.parsed.params;
    const body = request.parsed.body;

    const message = {
      ...body,
      userId: user?.id,
      conversationId,
    };

    const result = await messagesService.save(message);
    return response.status(201).json({ data: result });
  },
);

router.delete("/:messageId", async (request: Request, response: Response) => {
  const { messageId } = request.params;
  const result = await messagesService.repository.update(messageId, {
    isDeleted: true,
  });
  return response.json({ data: result });
});
