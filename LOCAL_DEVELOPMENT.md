# Local Development Guide

This guide explains how to run the Digital Self Avatar Creator locally.

## Prerequisites

- Node.js 18+
- A Google Gemini API key (get one free at [Google AI Studio](https://aistudio.google.com/apikey))

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How It Works

When `VITE_GEMINI_API_KEY` is set, the app calls Google Gemini API directly from the browser, bypassing the Supabase Edge Function. This is suitable for local development and testing.

**Note:** For production, you should use the Edge Function approach (without exposing the API key in the frontend).

## Converting to Next.js

If you want to use Next.js instead of Vite:

### 1. Create Next.js API route

Create `pages/api/generate-avatar.ts` (or `app/api/generate-avatar/route.ts` for App Router):

```typescript
// pages/api/generate-avatar.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const AVATAR_PROMPT = `Transform this photo into a cute, friendly cartoon avatar in Bitmoji/Snapchat avatar style...`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    const base64Match = image.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) {
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    const base64Data = base64Match[1];
    const mimeType = image.match(/^data:(image\/\w+);base64/)?.[1] || 'image/jpeg';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: AVATAR_PROMPT }, { inline_data: { mime_type: mimeType, data: base64Data } }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
        }),
      }
    );

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    
    for (const part of parts) {
      if (part.inline_data?.data) {
        const imgMime = part.inline_data.mime_type || 'image/png';
        return res.json({ image: `data:${imgMime};base64,${part.inline_data.data}` });
      }
    }

    return res.status(500).json({ error: 'No image generated' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### 2. Update frontend to call Next.js API

```typescript
const response = await fetch('/api/generate-avatar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: base64Image }),
});
```

### 3. Set environment variable

In `.env.local`:
```
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

## Troubleshooting

- **"Rate limit exceeded"**: Wait a few seconds and try again
- **"Invalid image format"**: Ensure the image is a valid base64 data URL
- **CORS errors**: When using direct API calls, ensure you're on localhost
