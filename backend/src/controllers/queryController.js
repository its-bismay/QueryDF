import { embedQuery } from "../services/embeddingText.js";
import { generateAnswer } from "../services/gemini.js";
import { searchPdf } from "../services/qudrant.js";

export const askQueryDF = async(req, res) => {
  const { query, pdfName } = req.body;
    if (!query || !pdfName) {
    return res.status(400).json({
      error: "query and pdfName are required",
    });
  }

  try {

    const queryVector = await embedQuery(query);


    const contexts = await searchPdf({
      pdfName,
      queryVector,
      limit: 5,
    });

    if (contexts.length === 0) {
      return res.json({
        answer: "I don't know",
        sources: [],
      });
    }


    const answer = await generateAnswer({
      query,
      contexts,
    });


    res.json({
      answer,
      sources: contexts.map((c, i) => ({
        sourceId: i + 1,
        chunkIndex: c.chunkIndex,
        source: c.source,
        score: c.score,
        text: c.text,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Query failed" });
  }
}