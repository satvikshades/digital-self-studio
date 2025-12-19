// Avatar generation via local Express backend
const API_URL = 'http://localhost:5000';

export async function generateAvatar(base64Image: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/generate-avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Generation failed: ${response.status}`;

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.image) {
      throw new Error('No image generated');
    }

    return data.image;
  } catch (error) {
    console.error('Avatar generation error:', error);
    throw error;
  }
}
