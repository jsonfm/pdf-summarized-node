import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { Config } from "@/config";

let embeddings: GoogleGenerativeAIEmbeddings;

export const getEmbeddingsModel = () => {
  if (!embeddings) {
    embeddings = new GoogleGenerativeAIEmbeddings({
      model: "embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      apiKey: Config.GOOGLE_API_KEY,
    });
  }
  return embeddings;
};

export const getEmbeddings = async (data: string[]) => {
  const embeddings = getEmbeddingsModel();
  return await embeddings.embedDocuments(data);
};
