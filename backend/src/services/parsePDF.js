// import { PDFParse } from "pdf-parse";

// const fromatText = (txt) => {
//   return txt
//     // remove page footers like "-- 1 of 1 --"
//     .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, " ")

//     // remove multiple newlines
//     .replace(/\n{2,}/g, "\n")

//     // remove single newlines inside sentences
//     .replace(/([a-zA-Z0-9,])\n([a-zA-Z])/g, "$1 $2")

//     // remove bullet symbols
//     .replace(/[•§ï]/g, " ")

//     // normalize spaces
//     .replace(/\s{2,}/g, " ")

//     .trim();    
// }

import fetch from "node-fetch";
import pdfParse from "pdf-parse";

export async function extractTextFromPDF(pdfUrl) {
  const res = await fetch(pdfUrl);

  if (!res.ok) {
    throw new Error(`Failed to fetch PDF: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  const parsed = await pdfParse(buffer);

  return parsed.text;
}
