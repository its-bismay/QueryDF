import axios from "axios";
import { batchArray } from "../lib/batchArray.js";


const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const MODEL = "jina-embeddings-v3";
const TASK = "text-matching";

const DEFAULT_BATCH_SIZE = 10;

export async function embedChunks(chunks, batchSize = DEFAULT_BATCH_SIZE) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("Chunks must be a non-empty array");
  }

  const batches = batchArray(chunks, batchSize);
  const embeddings = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    const response = await axios.post(
      JINA_API_URL,
      {
        model: MODEL,
        task: TASK,
        input: batch,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    const batchEmbeddings = response.data.data.map(
      (item) => item.embedding
    );

    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}

export async function embedQuery(query) {
  const response = await axios.post(
    JINA_API_URL,
    {
      model: MODEL,
      task: TASK,
      input: [query],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data[0].embedding;
}
