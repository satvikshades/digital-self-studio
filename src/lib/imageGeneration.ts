// AI Avatar generation via Google Gemini API
// Can use either Supabase Edge Function or direct API call for local development

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AVATAR_PROMPT = `Transform this photo into a cute, friendly cartoon avatar in Bitmoji/Snapchat avatar style.
Make it look like a charming illustrated character with:
- Soft, smooth skin with a warm, friendly appearance
- Big expressive eyes with a cute, approachable look
- Simplified but recognizable facial features from the original photo
- Clean vector-art style illustration
- Bright, cheerful colors
- Rounded, friendly shapes
- Professional cartoon illustration quality
Keep the person's likeness clearly recognizable but stylized as a cute cartoon avatar. Make it look like a premium Bitmoji-style personal avatar.`;

export async function generateAvatar(base64Image: string): Promise<string> {
  // If GEMINI_API_KEY is set, call Gemini directly (for local development)
  if (GEMINI_API_KEY) {
    return generateAvatarDirect(base64Image);
  }
  
  // Otherwise use Supabase Edge Function
  return generateAvatarViaEdgeFunction(base64Image);
}

async function generateAvatarDirect(base64Image: string): Promise<string> {
  try {
    // Extract base64 data from data URL
    const base64Match = base64Image.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) {
      throw new Error("Invalid image format");
    }
    const base64Data = base64Match[1];
    const mimeType = base64Image.match(/^data:(image\/\w+);base64/)?.[1] || "image/jpeg";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: AVATAR_PROMPT },
                { inline_data: { mime_type: mimeType, data: base64Data } }
              ]
            }
          ],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait and try again.");
      }
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    
    for (const part of parts) {
      if (part.inline_data?.data) {
        const imgMime = part.inline_data.mime_type || "image/png";
        return `data:${imgMime};base64,${part.inline_data.data}`;
      }
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Direct Gemini error:", error);
    throw error;
  }
}

async function generateAvatarViaEdgeFunction(base64Image: string): Promise<string> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-avatar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Generation failed: ${response.status}`;
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.image) {
      throw new Error("No image generated");
    }

    return data.image;
  } catch (error) {
    console.error("Edge function error:", error);
    throw error;
  }
}

export async function checkSDAvailability(): Promise<boolean> {
  return true;
}
