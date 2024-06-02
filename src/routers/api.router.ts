import { Router } from "express";

//
import { router as authRouter } from "@/routers/auth.router";
import { router as conversationsRouter } from "@/routers/conversation.router";
import { router as summaryRouter } from "@/routers/summary.router";
import { router as messagesRouter } from "@/routers/messages.router";
import { router as documentsRouter } from "@/routers/documents.router";

export const router = Router();

router.use("/auth", authRouter);
router.use("/documents", documentsRouter);
router.use("/conversations", conversationsRouter);
router.use("/messages", messagesRouter);
router.use("/summary", summaryRouter);
