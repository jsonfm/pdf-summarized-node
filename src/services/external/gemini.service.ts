import { loadSummarizationChain, AnalyzeDocumentChain } from "langchain/chains";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Config } from "@/config";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { VectorStore } from "@/database/vstore";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { MessageEntity } from "@/entity/message.entity";

let model: ChatGoogleGenerativeAI;

const getGenerativeModel = () => {
  if (!model) {
    model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      maxOutputTokens: 2048,
      apiKey: Config.GOOGLE_API_KEY,
    });
  }
  return model;
};

export class GeminiService {
  static summary = async (docs: any) => {
    const model = getGenerativeModel();
    const combineDocsChain = loadSummarizationChain(model);
    const chain = new AnalyzeDocumentChain({
      combineDocumentsChain: combineDocsChain,
    });
    const res = await chain.invoke({
      input_document: docs,
    });
    return res;
  };

  static chat = async (message: string) => {
    const model = getGenerativeModel();
    const res = await model.invoke([["human", message]]);
    return res?.content;
  };

  static interrogate = async (vectorId: string, question: string, k: number = 10) => {
    const SYSTEM_TEMPLATE = `
    You are an assistant for question-answering tasks.
    Use the following pieces of retrieved context to answer the question.
    Use four sentences maximum and keep the answer concise.
    {context}
    `;
    const retriever = await VectorStore.getRetriever(vectorId, k);
    const context = retriever.pipe(formatDocumentsAsString);

    const model = getGenerativeModel();
    const outputParser = new StringOutputParser();
    const input = {
      context,
      question: new RunnablePassthrough(),
    };

    const messages = [
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
      HumanMessagePromptTemplate.fromTemplate("{question}"),
    ];

    const prompt = ChatPromptTemplate.fromMessages(messages);
    const chain = RunnableSequence.from([input, prompt, model, outputParser]);
    const answer = await chain.invoke(question);
    return answer;
  };

  static interrogateWithCitation = async (vectorId: string, question: string) => {
    const answer = await this.interrogate(vectorId, question);
    const { citation } = await VectorStore.similaritySearchCitation(vectorId, question);
    return {
      answer,
      citation,
    };
  };

  static interrogateWhileChat = async (vectorId: string, question: string, history: MessageEntity[], k = 10) => {
    const SYSTEM_TEMPLATE = `
    You are an assistant for question-answering tasks.
    Use the following pieces of retrieved context to answer the question.
    If you don't know the answer, just say that you don't know.
    Use three sentences maximum and keep the answer concise.

    {context}

    `;
    const retriever = await VectorStore.getRetriever(vectorId, k);
    const chatHistory = history.map((item) => {
      if (item.role === "SYSTEM") {
        return new AIMessage(`${item.content}`);
      } else {
        return new HumanMessage(`${item.content}`);
      }
    });
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
      new MessagesPlaceholder("chat_history"),
      HumanMessagePromptTemplate.fromTemplate(`{input}`),
    ]);
    const model = getGenerativeModel();
    const combineDocsChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
    });
    const retrievalChain = await createRetrievalChain({
      retriever,
      combineDocsChain,
    });
    const response = await retrievalChain.invoke({
      input: question,
      chat_history: chatHistory,
    });
    return response;
  };
}
