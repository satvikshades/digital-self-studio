# Avatar Creator - Next.js

A Next.js application for generating cartoon avatars using Google Gemini AI.

## Prerequisites

- Node.js 18+
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Setup

```bash
# Install dependencies
npm install

# Copy environment file and add your Gemini API key
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/generate-avatar/route.ts  # API route for avatar generation
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Main page
├── components/
│   ├── ui/button.tsx                  # Button component
│   ├── AvatarViewer.tsx               # Avatar display component
│   ├── ProcessingOverlay.tsx          # Processing animation
│   ├── StepIndicator.tsx              # Step progress indicator
│   └── WebcamCapture.tsx              # Webcam capture component
├── lib/
│   └── utils.ts                       # Utility functions
└── ...
```

## How It Works

1. User takes a photo with their webcam
2. Frontend sends the base64 image to `/api/generate-avatar`
3. API route calls Google Gemini API to generate a cartoon avatar
4. Generated avatar is returned and displayed

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom + Radix UI
- **AI**: Google Gemini API
