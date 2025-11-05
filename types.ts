
export interface ImageStyle {
  name: string;
  prompt: string;
}

export interface Dish {
  name: string;
  description: string;
}

export interface GeneratedImage {
  id: string;
  dishName: string;
  dishDescription: string;
  stylePrompt: string;
  base64: string;
  mimeType: string;
}
