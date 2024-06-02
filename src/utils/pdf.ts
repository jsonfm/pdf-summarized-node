import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";

interface loadPDFAndSplitOpts {
  chunkSize: number;
  overlap: number;
}

export const loadPDFAndSplit = async (
  pdf: Blob | string,
  opts: loadPDFAndSplitOpts = { chunkSize: 1500, overlap: 100 },
): Promise<Document[]> => {
  const loader = new PDFLoader(pdf, {
    splitPages: true,
  });
  const docs = await loader.load();
  // return docs;
  const splitter = new CharacterTextSplitter({
    separator: "",
    ...opts,
  });
  const splitDocs = await splitter.splitDocuments(docs);
  const mapped = splitDocs?.map((item) => ({
    ...item,
    metadata: { loc: item.metadata.loc },
  }));
  return mapped;
};
