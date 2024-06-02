import { VectorStore } from "@/database/vstore";
import { Document } from "@langchain/core/documents";

type VectorStoreProviderType = "POSTGRES";

interface IVectorStore {
  provider: VectorStoreProviderType;
  saveDocs: (vectorId: string, docs: Document[]) => Promise<void>;
}

export class VectorStoreService implements IVectorStore {
  provider: VectorStoreProviderType;
  constructor(provider: VectorStoreProviderType) {
    this.provider = provider;
  }
  saveDocs = async (vectorId: string, docs: Document[]) => {
    return await VectorStore.saveDocs(vectorId, docs);
  };
  similaritySearch = async (vectorId: string, query: string, k: number = 2) => {
    return await VectorStore.similaritySearch(vectorId, query, k);
  };

  similaritySearchCitation = async (vectorId: string, query: string, k: number = 2) => {
    return await VectorStore.similaritySearchCitation(vectorId, query, k);
  };
}
