import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the API client
// The API key must be obtained from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 *
 * @param base64Image The original image as a Base64 Data URI.
 * @param prompt The text description of the edit (e.g., "Make it anime style").
 * @returns The generated image as a Base64 Data URI.
 */
export const editImageWithGemini = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    // Extract the raw base64 data and mime type
    // Data URIs are typically "data:image/jpeg;base64,....."
    const matches = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
    
    let mimeType = 'image/jpeg'; // Default fallback
    let rawBase64 = base64Image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      rawBase64 = matches[2];
    } else {
      // If it doesn't match the pattern, assume it is raw base64 and just needs a type
      // This is a safeguard, though we usually pass full Data URIs.
      rawBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: rawBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Check for valid response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API.");
    }

    const firstCandidate = candidates[0];
    const contentParts = firstCandidate.content?.parts;

    if (!contentParts || contentParts.length === 0) {
      throw new Error("No content parts in the response.");
    }

    // Look for the inlineData part which contains the image
    const imagePart = contentParts.find(p => p.inlineData);
    
    if (imagePart && imagePart.inlineData) {
      const generatedBase64 = imagePart.inlineData.data;
      // Construct a displayable Data URI
      return `data:image/png;base64,${generatedBase64}`;
    }

    throw new Error("The model did not return an image. It might have refused the request.");

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    // Enhance error message if possible
    if (error.message?.includes("400")) {
      throw new Error("Bad Request: The image might be too large or the prompt invalid.");
    }
    throw error;
  }
};