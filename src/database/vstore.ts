import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Document } from "@langchain/core/documents";
import { Config } from "@/config";
import { getEmbeddingsModel } from "@/utils/embeddings";
// import pg from "pg";

export const getVectorConfig = (tableName: string) => {
  const vectorConfig = {
    postgresConnectionOptions: {
      type: "postgres",
      host: "localhost",
      port: Number(Config.DB_PORT), //same port number as docker-compose file
      password: Config.DB_PASSWORD,
      database: Config.DB_NAME,
      user: Config.DB_USERNAME,
    },
    tableName,
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  };
  return vectorConfig;
};

const getVectorStore = async (vectorId: string) => {
  const config = getVectorConfig(vectorId);
  const pgvectorStore = await PGVectorStore.initialize(getEmbeddingsModel(), config);
  return pgvectorStore;
};

export class VectorStore {
  static getRetriever = async (vectorId: string, k: number = 10) => {
    const store = await getVectorStore(vectorId);
    return store.asRetriever(k);
  };
  static saveDocs = async (vectorId: string, documents: Document<Record<string, any>>[]) => {
    const store = await getVectorStore(vectorId);
    return await store.addDocuments(documents);
  };
  static similaritySearch = async (vectorId: string, query: string, k = 2) => {
    const store = await getVectorStore(vectorId);
    return await store.similaritySearch(query, k);
  };

  static similaritySearchCitation = async (vectorId: string, query: string, k = 2) => {
    const docs = await this.similaritySearch(vectorId, query, k);
    const citation = docs?.map((item) => item.metadata.loc);
    return {
      docs,
      citation,
    };
  };
}
