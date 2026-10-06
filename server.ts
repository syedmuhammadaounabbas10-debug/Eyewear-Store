import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI instance
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint for Bespoke Frame Concept Image Generation
app.post('/api/generate-frame', async (req, res) => {
  try {
    const { prompt, shape, material, color, lens, style, resolution = '1K' } = req.body;

    const validatedResolution = ['1K', '2K', '4K'].includes(resolution) ? resolution : '1K';

    const fullPrompt = `Architectural high-fashion eyewear product photography of a bespoke frame.
    Shape: ${shape || 'Architectural Square'}.
    Material: ${material || 'Handcrafted Italian Acetate'}.
    Color/Pattern: ${color || 'Midnight Slate'}.
    Lens: ${lens || 'Anti-Reflective Clear'}.
    Style: ${style || 'Contemporary Minimalist Luxury'}.
    ${prompt ? `Additional details: ${prompt}` : ''}.
    Studio lighting, pristine depth of field, sharp frame edge details, luxurious soft alabaster studio backdrop, centered 1:1 view.`;

    const ai = getGenAI();

    // Primary model specified by prompt: gemini-3-pro-image-preview
    // With resolution setting: 1K, 2K, or 4K
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
            imageSize: validatedResolution as '1K' | '2K' | '4K',
          },
        },
      });
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-3-pro-image-preview failed, attempting fallback to gemini-3.1-flash-image:', primaryErr?.message || primaryErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
            imageSize: validatedResolution as '1K' | '2K' | '4K',
          },
        },
      });
    }

    let imageUrl = null;
    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image generated in the response.' });
    }

    return res.json({
      success: true,
      imageUrl,
      resolution: validatedResolution,
      specs: {
        shape,
        material,
        color,
        lens,
        style,
        prompt,
      },
    });
  } catch (err: any) {
    console.error('Frame generation error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate custom frame image. Please check API key settings.',
    });
  }
});

// Start server with Vite middleware in dev or static files in prod
const PORT = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Nazar.pk server running on http://localhost:${PORT}`);
  });
}

startServer();
