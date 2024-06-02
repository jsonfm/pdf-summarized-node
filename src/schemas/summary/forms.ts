import { z } from "zod";
import { nanoidSchema, uuidSchema } from "@/schemas/common/ids";

export const SummaryInterrogateFormSchema = z.object({
  params: z.object({
    vectorId: nanoidSchema,
  }),
  body: z.object({
    question: z.string().min(3),
  }),
});

export const SummaryInterrogateChatFormSchema = z.object({
  params: z.object({
    vectorId: nanoidSchema,
    conversationId: uuidSchema,
  }),
  body: z.object({
    question: z.string().min(3),
  }),
});

export const SummaryCitationFormSchema = z.object({
  params: z.object({
    vectorId: nanoidSchema,
  }),
  body: z.object({
    prompt: z.string(),
  }),
});

export type SummaryInterrogateFormSchemaType = z.infer<typeof SummaryInterrogateFormSchema>;
export type SummaryInterrogateChatFormSchemaType = z.infer<typeof SummaryInterrogateChatFormSchema>;

export type SummaryCitationFormSchemaType = z.infer<typeof SummaryCitationFormSchema>;
