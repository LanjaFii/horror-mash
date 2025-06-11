import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Utilise un modèle compatible API Inference gratuite
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

export async function generateHFPitch(prompt: string): Promise<string> {
  const response = await axios.post(
    HF_API_URL,
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 240000 // 4 minutes
    }
  );
  const data = response.data;
  let pitch = '';
  if (Array.isArray(data) && data[0]?.generated_text) {
    pitch = data[0].generated_text.trim();
  } else if (Array.isArray(data) && data[0]?.generated_texts?.[0]) {
    pitch = data[0].generated_texts[0].trim();
  } else {
    throw new Error('Réponse inattendue de Hugging Face');
  }
  // Extraire le texte entre guillemets s'il y en a (compatible ES5+)
  const match = pitch.match(/"([^"]{20,})"/);
  if (match) {
    return match[1].trim();
  }
  return pitch;
}
