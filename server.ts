import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { GoogleGenAI, Type } from "@google/genai";
import Stripe from "stripe";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
// Note: In production, use a service account JSON. 
// For this environment, we assume the environment is pre-configured or uses default credentials.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Or use service account if provided
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "weblino-ai-studio-907ab"
  });
}

const db = admin.firestore();

async function getSystemConfig() {
  const doc = await db.collection("system").doc("config").get();
  return doc.data() || {};
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Public Config (Safe to expose feature flags, but NOT keys)
  app.get("/api/config/public", async (req, res) => {
    const config = await getSystemConfig();
    res.json({
      activeAiProvider: config.activeAiProvider || 'gemini',
      isPaymentEnabled: config.isPaymentEnabled ?? true,
      isAiEnabled: config.isAiEnabled ?? true,
      stripePublishableKey: config.stripePublishableKey || '',
      plans: config.plans || {
        free: { projectLimit: 3 },
        pro: { projectLimit: -1, price: 29 },
        enterprise: { projectLimit: -1, price: 99 }
      }
    });
  });

  // Admin: Get Full Config (Including Keys)
  app.get("/api/admin/config", async (req, res) => {
    // In a real app, verify admin token from headers
    const config = await getSystemConfig();
    res.json(config);
  });

  // Admin: Update Config
  app.post("/api/admin/config", async (req, res) => {
    const newConfig = req.body;
    await db.collection("system").doc("config").set(newConfig, { merge: true });
    res.json({ success: true });
  });

  // AI Generation Proxy
  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, type = 'website' } = req.body;
    const config = await getSystemConfig();

    if (!config.isAiEnabled) {
      return res.status(403).json({ error: "AI generation is currently disabled." });
    }

    try {
      if (config.activeAiProvider === 'gemini' && config.geminiKey) {
        const genAI = new GoogleGenAI({ apiKey: config.geminiKey });

        if (type === 'website') {
          const result = await genAI.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: [{ role: 'user', parts: [{ text: `Generate a complete, modern, responsive website based on this prompt: "${prompt}". Output must be valid JSON with keys: html, css, js, meta (title, description, keywords), content (headlines, taglines, descriptions, imageKeywords).` }] }],
            config: { responseMimeType: "application/json" }
          });
          return res.json(JSON.parse(result.text || "{}"));
        } else {
          // Handle other content types
          const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: `Task: Generate ${type} for context: ${prompt}. Output as JSON array of strings in 'result' key.` }] }],
            config: { responseMimeType: "application/json" }
          });
          return res.json(JSON.parse(result.text || "{}").result);
        }
      } else {
        res.status(500).json({ error: "AI Provider not configured or unavailable." });
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout Proxy
  app.post("/api/payments/create-checkout", async (req, res) => {
    const { planId, userId } = req.body;
    const config = await getSystemConfig();

    if (!config.isPaymentEnabled || !config.stripeSecretKey) {
      return res.status(403).json({ error: "Payments are currently disabled." });
    }

    const stripe = new Stripe(config.stripeSecretKey);
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: `${planId} Subscription` },
            unit_amount: (config.plans?.[planId]?.price || 0) * 100,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/dashboard`,
        metadata: { userId, planId }
      });

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
