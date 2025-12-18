// AI Avatar generation via Lovable AI Gateway
// Uses Gemini image model for cyberpunk-style avatar generation

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function generateAvatar(base64Image: string): Promise<string> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-avatar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Generation failed: ${response.status}`;
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }
      
      if (response.status === 402) {
        throw new Error("AI usage limit reached. Please add credits to your workspace.");
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.image) {
      throw new Error("No image generated");
    }

    return data.image;
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
}

// Check if the AI service is available (always true for cloud)
export async function checkSDAvailability(): Promise<boolean> {
  return true;
}
