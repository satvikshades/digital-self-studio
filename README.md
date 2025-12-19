# Avatar Creator

A React + Vite frontend with a Node.js Express backend for generating cartoon avatars using Google Gemini AI.

## Project Structure

```
├── server/              # Express backend
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env.example     # Environment template
├── src/                 # React frontend
└── ...
```

## Prerequisites

- Node.js 18+ 
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Setup

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Frontend Setup

```bash
npm install
```

## Running Locally

### Start the Backend (Terminal 1)

```bash
cd server
npm start
```

The server will run at `http://localhost:5000`

### Start the Frontend (Terminal 2)

```bash
npm run dev
```

The frontend will run at `http://localhost:5173` (or similar)

## API Endpoints

### POST /generate-avatar

Generates a cartoon avatar from a photo.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "image": "data:image/png;base64,...",
  "message": "Your digital avatar is ready!"
}
```

### GET /health

Health check endpoint.

## How It Works

1. User takes a photo with their webcam
2. Frontend sends the base64 image to the local Express backend
3. Backend calls Google Gemini API to generate a cartoon avatar
4. Generated avatar is returned and displayed

## Technologies

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express
- **AI**: Google Gemini API

## Troubleshooting

- **CORS errors**: Make sure the backend is running on port 5000
- **API key errors**: Verify your Gemini API key is correctly set in `server/.env`
- **Rate limits**: Wait a moment and try again if you hit Gemini's rate limits
