import pdfParse from "pdf-parse"

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
  try {
    // Fetch PDF from URL
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }
    
    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);
    
    // Parse PDF
    const data = await pdfParse(dataBuffer);
    
    // Format and return text
    const formattedText = formatText(data.text);
    return formattedText;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}
