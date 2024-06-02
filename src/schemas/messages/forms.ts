import { z } from "zod";
import { MessageRoleEnum } from "@/entity/message.entity";
import { uuidSchema } from "@/schemas/common/ids";

export const MessageCreationFormSchema = z.object({
  params: z.object({
    conversationId: uuidSchema,
  }),
  body: z.object({
    role: z.enum([MessageRoleEnum.SYSTEM, MessageRoleEnum.HUMAN]),
    content: z.string(),
  }),
});

export type MessageCreationFormSchemaType = z.infer<typeof MessageCreationFormSchema>;
