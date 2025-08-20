import fs from 'fs';
import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);
  // console.log('CV data ==== ', data);
  return data.text;
};
