// Stable Diffusion API integration via AUTOMATIC1111 WebUI
// Note: This requires running AUTOMATIC1111 locally with --api flag
// and --cors-allow-origins flag for browser access

const SD_API_ENDPOINT = "http://localhost:7860/sdapi/v1/img2img";

const PROMPT = `A futuristic 3D avatar of the person in the image, sci-fi cyberpunk style, smooth stylized skin, Pixar-quality lighting, digital human, high fidelity facial structure, metaverse avatar, cinematic lighting, detailed eyes, perfect symmetry, studio lighting, 8k ultra HD`;

const NEGATIVE_PROMPT = `deformed face, extra eyes, blurry, uncanny, distorted, low quality, bad anatomy, extra limbs, poorly drawn face, mutation, mutated, ugly, out of frame, watermark, signature, text`;

interface Img2ImgPayload {
  init_images: string[];
  prompt: string;
  negative_prompt: string;
  steps: number;
  cfg_scale: number;
  sampler_name: string;
  denoising_strength: number;
  width: number;
  height: number;
  restore_faces: boolean;
}

interface Img2ImgResponse {
  images: string[];
  info: string;
}

export async function generateAvatar(base64Image: string): Promise<string> {
  // Remove data URL prefix if present
  const imageData = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const payload: Img2ImgPayload = {
    init_images: [imageData],
    prompt: PROMPT,
    negative_prompt: NEGATIVE_PROMPT,
    steps: 30,
    cfg_scale: 7,
    sampler_name: "DPM++ 2M Karras",
    denoising_strength: 0.5,
    width: 768,
    height: 768,
    restore_faces: true,
  };

  try {
    const response = await fetch(SD_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SD API Error:", errorText);
      throw new Error(`Stable Diffusion API error: ${response.status}`);
    }

    const data: Img2ImgResponse = await response.json();

    if (!data.images || data.images.length === 0) {
      throw new Error("No image generated");
    }

    // Return as data URL
    return `data:image/png;base64,${data.images[0]}`;
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
}

// Check if Stable Diffusion API is available
export async function checkSDAvailability(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:7860/sdapi/v1/sd-models", {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
