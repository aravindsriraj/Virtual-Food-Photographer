
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Dish } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Parses a restaurant menu from text into a structured JSON array of dishes.
 * @param menuText The raw text of the menu.
 * @returns A promise that resolves to an array of Dish objects.
 */
export async function parseMenu(menuText: string): Promise<Dish[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Parse the following restaurant menu text into a JSON array of objects. Each object must have a 'name' and a 'description' key. Only include main dishes. Ignore prices, categories, and side notes. Here is the menu: \n\n${menuText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the dish.",
            },
            description: {
              type: Type.STRING,
              description: "A brief description of the dish.",
            },
          },
          required: ["name", "description"],
        },
      },
    },
  });

  try {
    const jsonString = response.text.trim();
    const dishes = JSON.parse(jsonString);
    return dishes as Dish[];
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", response.text);
    throw new Error("The AI failed to return a valid menu structure. Please check your menu format.");
  }
}

/**
 * Generates a high-quality food photograph for a given dish.
 * @param dishName The name of the dish.
 * @param dishDescription The description of the dish.
 * @param stylePrompt A string describing the desired photographic style.
 * @returns A promise that resolves to an object with base64 image data and mimeType.
 */
export async function generateFoodImage(dishName: string, dishDescription: string, stylePrompt: string): Promise<{ base64: string, mimeType: string }> {
  const fullPrompt = `A stunning, professional food photograph of "${dishName}". Description: ${dishDescription}. The aesthetic is ${stylePrompt}. Highly detailed, realistic, gourmet presentation, photorealistic.`;

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '4:3',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const imageData = response.generatedImages[0].image;
    return { base64: imageData.imageBytes, mimeType: 'image/png' };
  } else {
    throw new Error("Image generation failed to produce an image.");
  }
}

/**
 * Edits an existing image using a text prompt.
 * @param base64Image The base64-encoded string of the image to edit.
 * @param mimeType The MIME type of the image.
 * @param editPrompt The text prompt describing the desired edit.
 * @returns A promise that resolves to the edited image as a base64 string and its mimeType.
 */
export async function editImage(base64Image: string, mimeType: string, editPrompt: string): Promise<{ base64: string, mimeType: string }> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType,
                    },
                },
                {
                    text: editPrompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return {
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType,
            };
        }
    }

    throw new Error("Image editing failed. The AI did not return an edited image.");
}

/**
 * Generates a sample restaurant menu using AI.
 * @returns A promise that resolves to a string containing the sample menu.
 */
export async function generateSampleMenu(): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a sample menu for a trendy cafe with 5 creative main dishes. For each dish, provide a name and a brief, appealing description. The format should be one dish per line, like this: "Dish Name - Description". Do not include prices or category headers.`,
  });

  return response.text;
}

/**
 * Generates social media captions for a dish.
 * @param dishName The name of the dish.
 * @param dishDescription The description of the dish.
 * @param stylePrompt The photography style of the image.
 * @returns A promise that resolves to an array of caption strings.
 */
export async function generateSocialMediaCaptions(dishName: string, dishDescription: string, stylePrompt: string): Promise<string[]> {
  const prompt = `You are a creative social media manager for a restaurant. Generate 3 engaging and distinct Instagram captions for a dish.
  
  Dish Name: "${dishName}"
  Description: "${dishDescription}"
  Photo Style: "${stylePrompt}"
  
  For each caption, include a call-to-action and a few relevant, popular food hashtags. Make the tone of each caption slightly different (e.g., one excited, one descriptive, one questioning).`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          captions: {
            type: Type.ARRAY,
            description: "An array of 3 social media captions.",
            items: {
              type: Type.STRING
            }
          }
        },
        required: ["captions"],
      },
    },
  });

  try {
    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);
    if (parsed.captions && Array.isArray(parsed.captions)) {
      return parsed.captions;
    }
    throw new Error("Invalid JSON structure for captions.");
  } catch (e) {
    console.error("Failed to parse captions JSON from Gemini:", response.text, e);
    throw new Error("The AI failed to generate valid captions. Please try again.");
  }
}
