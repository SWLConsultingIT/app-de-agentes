import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());

const METRICOOL_TOKEN = process.env.METRICOOL_TOKEN;
const METRICOOL_API_BASE = 'https://api.metricool.com/v3';

// Serve index.html for SPA routing
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Endpoint to publish content with Metricool
app.post('/api/metricool/publish', async (req, res) => {
  try {
    if (!METRICOOL_TOKEN) {
      return res.status(400).json({
        ok: false,
        error: 'METRICOOL_TOKEN not configured in .env'
      });
    }

    const { posts } = req.body;

    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid posts payload'
      });
    }

    console.log(`[Metricool] Publishing ${posts.length} post(s)...`);

    // Call Metricool API to schedule/publish posts
    // Metricool API endpoint: POST /publication/bulk
    const metricoolPayload = {
      publications: posts.map(post => ({
        title: post.title || '',
        text: post.content || '',
        image: post.image_url || null,
        platforms: post.channels || ['linkedin', 'twitter'],
        scheduleDate: post.scheduled_time ? new Date(post.scheduled_time).toISOString() : null,
        customFields: {
          source: 'ContentBuilder',
          brand: post.metadata?.brand || 'SWL Consulting'
        }
      }))
    };

    const response = await axios.post(
      `${METRICOOL_API_BASE}/publication/bulk`,
      metricoolPayload,
      {
        headers: {
          'Authorization': `Bearer ${METRICOOL_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[Metricool] Response:`, response.data);

    res.json({
      ok: true,
      published_count: posts.length,
      metricool_response: response.data
    });
  } catch (error) {
    console.error('[Metricool] API Error:', error.response?.data || error.message);
    res.status(500).json({
      ok: false,
      error: error.response?.data?.message || error.message || 'Metricool API error'
    });
  }
});

// Endpoint to get publishing drafts
app.get('/api/publishing-drafts/:brandId', (req, res) => {
  // Mock data - in production this would fetch from Supabase
  const brandId = req.params.brandId;
  res.json({
    ok: true,
    drafts: [
      // Mock drafts would be returned here
    ]
  });
});

// Endpoint to check Metricool connection
app.get('/api/metricool/status', async (req, res) => {
  try {
    if (!METRICOOL_TOKEN) {
      return res.json({ ok: false, connected: false, message: 'No API token configured' });
    }

    // Try a simple API call to verify token
    const response = await axios.get(
      `${METRICOOL_API_BASE}/accounts`,
      {
        headers: { 'Authorization': `Bearer ${METRICOOL_TOKEN}` },
        timeout: 5000
      }
    );

    res.json({
      ok: true,
      connected: true,
      accounts: response.data
    });
  } catch (error) {
    console.error('[Metricool] Connection check failed:', error.message);
    res.json({
      ok: false,
      connected: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', metricool_configured: !!METRICOOL_TOKEN });
});

app.listen(PORT, () => {
  console.log(`GrowthAI server running on http://localhost:${PORT}`);
  console.log(`Metricool configured: ${!!METRICOOL_TOKEN}`);
});
