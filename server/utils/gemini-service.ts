import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export const analyzeCvWithAi = async (
  cvText: string,
  jobDescription: string
) => {
  const prompt = `Analyze the following CV: ${cvText}\n\n Compare it with the following 
  job description: ${jobDescription}\n\n And provide suggestions on what can be improved 
  in CV so that it will closely align with the job description.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });

    console.log(response.text);
    return response.text;
  } catch (error: any) {
    console.error('Error while analyzing CV: ', error);
    throw new Error('AI Aanlysis Failed. Please try again after sometime');
  }
};
