import { Request, Response } from 'express';
import { saveCv } from '../model/cv-model';
import { upload } from '../middleware/upload-middleware';
import { extractTextFromPDF } from '../utils/extract-text';
import { analyzeCvWithAi } from '../utils/gemini-service';

export const uploadCv = async (req: Request, res: Response) => {
  upload.single('cv')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({ message: 'File size is too large. Maximum size is 3MB' });
      }
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const userId = (req.user as any).userId;
      const filePath = req.file.path;
      const originalName = req.file.originalname;
      const data = { userId, filePath, originalName };
      const result = await saveCv(data);

      const extractedText = await extractTextFromPDF(filePath);
      const jobDescription = req.body.jobDescription || '';
      const aiSuggestions = await analyzeCvWithAi(
        extractedText,
        jobDescription
      );

      res.status(200).json({
        message: 'CV uploaded successfully',
        data: result,
        text: extractedText.slice(0, 100),
        suggestion: aiSuggestions,
      });
    } catch (error: any) {
      console.error('Error in cv controller', error);
      res.status(500).json({ message: error.message });
    }
  });
};
