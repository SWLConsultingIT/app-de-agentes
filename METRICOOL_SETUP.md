# Metricool Integration Setup

## Overview
La sección "Publish All with Metricool" en el AutoPublisher permite publicar todos los posts aprobados en ContentBuilder directamente en Metricool, usando la API key de SWL Consulting.

## How It Works

1. **Frontend** (app.js): El botón "Publish Queue" en la sección "Publish All with Metricool" del AutoPublisher
2. **Backend** (server.js): Endpoint `/api/metricool/publish` que:
   - Recibe los posts aprobados
   - Llama a la API de Metricool con el METRICOOL_TOKEN del .env
   - Retorna el estado de publicación

## Setup & Execution

### 1. Install dependencies
```bash
npm install
```

### 2. Ensure .env has METRICOOL_TOKEN
```
METRICOOL_TOKEN=UGGHGPJBKWDUGKBXKOALCCDIRAAGVYTFXTIXDUAICWOKZIGPUJUENOANIFWGMLLY
```

### 3. Start the server
```bash
npm start
```
This starts Express server on `http://localhost:3000`

### 4. Open the app in browser
```
http://localhost:3000
```

## Features

- **Automatic content detection**: Fetches all approved drafts from ContentBuilder
- **Bulk publishing**: Sends multiple posts to Metricool in one request
- **Metricool optimization**: Metricool handles optimal timing, cross-posting, and engagement
- **Real-time feedback**: Shows success/error status with live counters

## Flow Diagram

```
ContentBuilder (Approved Drafts)
         ↓
  publishAllWithMetricool()
         ↓
POST /api/metricool/publish
         ↓
Metricool API (with SWL token)
         ↓
LinkedIn, Twitter/X, Instagram, Facebook
         ↓
✓ Posts scheduled/published
```

## API Details

### POST /api/metricool/publish
**Request:**
```json
{
  "posts": [
    {
      "id": "draft-1",
      "title": "Post Title",
      "content": "Post caption/text",
      "image_url": "https://...",
      "channels": ["linkedin", "twitter"],
      "scheduled_time": "2026-06-13T14:00:00Z",
      "metadata": {
        "source": "ContentBuilder",
        "brand": "SWL Consulting"
      }
    }
  ]
}
```

**Response (Success):**
```json
{
  "ok": true,
  "published_count": 1,
  "metricool_response": { ... }
}
```

**Response (Error):**
```json
{
  "ok": false,
  "error": "Error message"
}
```

## Notes

- Currently uses **SWL Consulting's** Metricool API key
- Future enhancement: Per-company Metricool tokens (would require storing company-specific keys)
- Posts must be "approved" status in ContentBuilder to be included
- Metricool handles scheduling, optimal timing, and cross-platform optimization

## Troubleshooting

**"Cannot POST /api/metricool/publish"**
- Make sure `npm start` is running
- Check that server is on port 3000

**"METRICOOL_TOKEN not configured"**
- Verify .env file has METRICOOL_TOKEN
- Restart server after updating .env

**"Metricool API error"**
- Check token is valid in Metricool dashboard
- Verify Metricool API is accessible
- Check network in browser DevTools
