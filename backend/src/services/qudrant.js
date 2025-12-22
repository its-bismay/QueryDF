import { QdrantClient } from "@qdrant/js-client-rest";
import crypto from "crypto";
import ENV from "../lib/envConfig";


const client = new QdrantClient({
  url: ENV.qdrantUrl,
  apiKey: ENV.qdrantApiKey,
  checkCompatibility: false,
});

const VECTOR_SIZE = 1024; 

export async function storePdfEmbeddings({
  pdfName,
  chunks,
  embeddings,
  pdfUrl,
}) {
  if (chunks.length !== embeddings.length) {
    throw new Error("Chunks and embeddings length mismatch");
  }


  const collections = await client.getCollections();
  const exists = collections.collections.some(
    (c) => c.name === pdfName
  );


  if (!exists) {
    await client.createCollection(pdfName, {
      vectors: {
        size: VECTOR_SIZE,
        distance: "Cosine",
      },
    });
  }


  const points = chunks.map((chunk, index) => ({
    id: crypto.randomUUID(),
    vector: embeddings[index],
    payload: {
      text: chunk,
      chunkIndex: index,
      source: pdfUrl,
    },
  }));


  await client.upsert(pdfName, {
    wait: true,
    points,
  });

  console.log(
    `✅ Stored ${points.length} vectors in collection: ${pdfName}`
  );
}


export async function searchPdf({
  pdfName,
  queryVector,
  limit = 5,
}) {
  const result = await client.search(pdfName, {
    vector: queryVector,
    limit,
    with_payload: true,
  });

  return result.map((point) => ({
    text: point.payload.text,
    score: point.score,
    source: point.payload.source,
    chunkIndex: point.payload.chunkIndex,
  }));
}
