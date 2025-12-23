import { extractText } from 'unpdf';

const formatText = (txt) => {
  return txt
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/([a-zA-Z0-9,])\n([a-zA-Z])/g, "$1 $2")
    .replace(/[•§ï]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();    
}

export async function extractTextFromPDF(filePath) {
  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Extract text using unpdf
    const { text } = await extractText(arrayBuffer, { mergePages: true });
    
    const formattedText = formatText(text);
    return formattedText;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}