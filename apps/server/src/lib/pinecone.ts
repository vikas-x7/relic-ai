import { Pinecone } from "@pinecone-database/pinecone";

let pinecone: Pinecone | undefined;

function getPineconeClient() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not configured");
  }

  pinecone ??= new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  return pinecone;
}

export function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX;

  if (!indexName) {
    throw new Error("PINECONE_INDEX is not configured");
  }

  return getPineconeClient().index(indexName);
}
