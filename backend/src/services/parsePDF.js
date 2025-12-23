import { PDFExtract } from 'pdf.js-extract';

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
    const dataBuffer = Buffer.from(arrayBuffer);
    
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extractBuffer(dataBuffer);
    
    // Combine text from all pages
    const text = data.pages
      .map(page => page.content.map(item => item.str).join(' '))
      .join('\n');
    
    const formattedText = formatText(text);
    return formattedText;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}