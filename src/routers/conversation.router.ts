import { Router, Request, Response } from "express";
import { authRequiredMiddleware } from "@/middlewares/auth.middleware";
import { ConversationsService } from "@/services/conversation.service";

export const router = Router();
router.use(authRequiredMiddleware);

// services
const conversationsService = new ConversationsService();

//
router.get("/", async (request: Request, response: Response) => {
  const user = request.user;
  const { limit = 100, offset = 0 } = request.params;
  const [items, count] = await conversationsService.findAndCount({
    where: {
      userId: user?.id,
      isDeleted: false,
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

//
router.post("/", async (request: Request, response: Response) => {
  const user = request.user;
  const conversation = {
    userId: user.id,
  };
  const result = await conversationsService.save(conversation);
  return response.status(201).json({
    data: result,
  });
});

router.delete("/:conversationId", async (request: Request, response: Response) => {
  // const user = request?.user;
  const conversationId = request.params.conversationId;
  const result = await conversationsService.deleteOne(conversationId);
  return response.json({
    data: result,
  });
});
