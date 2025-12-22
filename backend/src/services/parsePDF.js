import { PDFParse } from "pdf-parse";

const fromatText = (txt) => {
  return txt
    // remove page footers like "-- 1 of 1 --"
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, " ")

    // remove multiple newlines
    .replace(/\n{2,}/g, "\n")

    // remove single newlines inside sentences
    .replace(/([a-zA-Z0-9,])\n([a-zA-Z])/g, "$1 $2")

    // remove bullet symbols
    .replace(/[•§ï]/g, " ")

    // normalize spaces
    .replace(/\s{2,}/g, " ")

    .trim();    
}

export async function extractTextFromPDF(filePath) {
  const parser = new PDFParse({url: filePath });
  const result = await parser.getText();
  const text = result.text;

  const formatedText = fromatText(text);
  return formatedText;
}
