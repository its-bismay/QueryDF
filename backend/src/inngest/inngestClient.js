import { Inngest } from "inngest";
import { extractTextFromPDF } from "../services/parsePDF.js";
import { chunkText } from "../services/chunking.js";
import { embedChunks } from "../services/embeddingText.js";
import { storePdfEmbeddings } from "../services/qudrant.js";

export const inngest = new Inngest({ id: "QueryDF" });

// Your new function:
const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

const processPdf = inngest.createFunction(
  { id: "process-pdf" },
  { event: "pdf/process" },
  async ({ event, step }) => {
    const { filePath, pdfName } = event.data;

    console.log("📄 Background job started for:", pdfName);

    const text = await extractTextFromPDF(filePath);

    const chunks = await chunkText(text);

    const embeddings = await embedChunks(chunks);

    await step.run("store-qdrant", () =>
      storePdfEmbeddings({
        pdfName,
        chunks,
        embeddings,
        pdfUrl: filePath,
      })
    );

    return {
      success: true,
      chunksStored: chunks.length,
      collection: pdfName,
    };
  }
);

// Add the function to the exported array:
export const functions = [
  helloWorld,
  processPdf
];