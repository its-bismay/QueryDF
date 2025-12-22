import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";



const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 200, separators:["\n\n", "\n", ". ", " ", ""] })

export async function chunkText(text) {

  const docs = await splitter.createDocuments([text]);

  return docs.map((doc) => doc.pageContent);
}