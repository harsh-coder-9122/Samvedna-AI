import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

function redactPII(text: string): string {
  if (!text) return text;
  // Mask email addresses
  let result = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL_REDACTED]");
  // Mask phone numbers (10+ digits)
  result = result.replace(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}/g, (match) => {
    const digits = match.replace(/\D/g, "");
    if (digits.length >= 10) return "[PHONE_REDACTED]";
    return match;
  });
  return result;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Project Samvedna Diagnostic API" });
  });

  // Diagnostic Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text, studentAlias, studentContext } = req.body;

      if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ error: "Student journal or diary entry text is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets."
        });
      }

      const sanitizedText = redactPII(text);
      const sanitizedAlias = redactPII(studentAlias || "Anonymous Student");
      const sanitizedContext = redactPII(studentContext || "General Log");

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are Samvedna AI, a clinical-grade empathetic mental health triage engine for college students.
Your job is to analyze diary entries, student logs, or messages written in English, Hindi, or Hinglish (Romanized Hindi).

CRITICAL RULES FOR OUTPUT:
1. ANONYMIZATION: Strip or mask any Personal Identifiable Information (PII) like phone numbers, addresses, or emails from the output log and analyzed text. Replace emails with [EMAIL_REDACTED] and phone numbers with [PHONE_REDACTED].
2. RISK MAPPING LOGIC (STRICT):
   - Distress Score < 40: "CRITICAL" Risk Level -> Alert Required: TRUE
   - Distress Score 40-59: "HIGH" Risk Level -> Alert Required: TRUE
   - Distress Score 60-74: "MODERATE" Risk Level -> Alert Required: FALSE
   - Distress Score >= 75: "LOW" Risk Level -> Alert Required: FALSE

3. ACTIONABLE STAKEHOLDER RECOMMENDATIONS:
   Provide distinct, compassionate, non-accusatory guidance for:
   - Parents/Guardians (e.g., empathetic daily check-ins)
   - Hostel Wardens / Campus Counselors (e.g., discreet safety/welfare check within 30 minutes)

4. MULTILINGUAL PROCESSING:
   Understand English, Hindi (Devanagari script), and Hinglish (Romanized Hindi). Generate the final report in clinical English while respecting emotional nuances of the source text.

CRITICAL ALERT RULE:
If Alert Required is TRUE (Distress Score < 60 OR Risk Level is 'CRITICAL' or 'HIGH'), you MUST include the exact keyword "**CRITICAL_ALERT**" as the first line of formattedReportMarkdown.

Exact Layout required for formattedReportMarkdown:

[IF Alert Required is TRUE, include "**CRITICAL_ALERT**" as line 1]

### 📋 Diagnostic Overview
* **Distress Score:** [Numeric score 0 to 100]
* **Primary Emotion:** [Dominant emotion: e.g., Sadness, Panic, Loneliness, Hopelessness, Apathy, Neutral, Positive]
* **Risk Severity Level:** [CRITICAL / HIGH / MODERATE / LOW strictly based on score]

### 🔍 Key Risk Indicators Identified
* [Trigger 1: Specific behavioral, emotional, or linguistic indicator found in text]
* [Trigger 2: Specific behavioral, emotional, or linguistic indicator found in text]

### 🛠️ Recommended Actionable Steps
* Step 1 (Parents/Guardians): [Compassionate, non-accusatory guidance for parents]
* Step 2 (Hostel Wardens / Counselors): [Discreet safety and welfare check SOP]`;

      const userPrompt = `Context: ${sanitizedContext}
Author Alias: ${sanitizedAlias}

Journal Entry / Log Text:
"""
${sanitizedText}
"""

Perform a clinical psychological triage analysis as Samvedna AI following all strict rules. Return the structured JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              formattedReportMarkdown: {
                type: Type.STRING,
                description: "Exact formatted markdown report strictly adhering to layout."
              },
              distressScore: {
                type: Type.INTEGER,
                description: "Numeric score 0 to 100 (100 = safe/positive, <40 = critical distress)"
              },
              primaryEmotion: {
                type: Type.STRING,
                description: "Dominant emotion, e.g. Sadness, Severe Panic, Loneliness, Hopelessness, Neutral"
              },
              riskSeverity: {
                type: Type.STRING,
                description: "CRITICAL, HIGH, MODERATE, or LOW"
              },
              keyIndicators: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific behavioral, emotional, or linguistic triggers found in text"
              },
              step1Parents: {
                type: Type.STRING,
                description: "Compassionate, empathetic guidance for Parents/Guardians"
              },
              step2Wardens: {
                type: Type.STRING,
                description: "Discreet safety/welfare check protocol for Hostel Wardens/Counselors"
              }
            },
            required: [
              "formattedReportMarkdown",
              "distressScore",
              "primaryEmotion",
              "riskSeverity",
              "keyIndicators",
              "step1Parents",
              "step2Wardens"
            ]
          }
        }
      });

      const responseText = response.text || "{}";
      let parsedData: any = {};
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse Gemini JSON response:", e);
      }

      let distressScore = typeof parsedData.distressScore === "number" ? parsedData.distressScore : 50;

      // STRICT RISK MAPPING LOGIC:
      // Distress Score < 40: "CRITICAL" Risk Level -> Alert Required: TRUE
      // Distress Score 40-59: "HIGH" Risk Level -> Alert Required: TRUE
      // Distress Score 60-74: "MODERATE" Risk Level -> Alert Required: FALSE
      // Distress Score >= 75: "LOW" Risk Level -> Alert Required: FALSE
      let riskSeverity: "Critical" | "High" | "Moderate" | "Low";
      let isCriticalAlert = false;

      if (distressScore < 40) {
        riskSeverity = "Critical";
        isCriticalAlert = true;
      } else if (distressScore < 60) {
        riskSeverity = "High";
        isCriticalAlert = true;
      } else if (distressScore < 75) {
        riskSeverity = "Moderate";
        isCriticalAlert = false;
      } else {
        riskSeverity = "Low";
        isCriticalAlert = false;
      }

      let formattedReport = redactPII(parsedData.formattedReportMarkdown || "");

      if (isCriticalAlert) {
        if (!formattedReport.includes("**CRITICAL_ALERT**")) {
          formattedReport = `**CRITICAL_ALERT**\n\n${formattedReport}`.trim();
        }
      }

      if (!formattedReport.includes("### 📋 Diagnostic Overview")) {
        const alertPrefix = isCriticalAlert ? "**CRITICAL_ALERT**\n\n" : "";
        const triggers = (parsedData.keyIndicators || ["High emotional strain", "Overwhelming pressure"])
          .map((item: string) => `* ${redactPII(item)}`)
          .join("\n");

        formattedReport = `${alertPrefix}### 📋 Diagnostic Overview
* **Distress Score:** ${distressScore}/100
* **Primary Emotion:** ${redactPII(parsedData.primaryEmotion || "Emotional Distress")}
* **Risk Severity Level:** ${riskSeverity}

### 🔍 Key Risk Indicators Identified
${triggers}

### 🛠️ Recommended Actionable Steps
* Step 1 (Parents/Guardians): ${redactPII(parsedData.step1Parents || "Initiate empathetic, non-judgmental check-ins with the student.")}
* Step 2 (Wardens/Counselors): ${redactPII(parsedData.step2Wardens || "Schedule a discreet in-person welfare check within 30 minutes.")}`;
      }

      const cleanKeyIndicators = (parsedData.keyIndicators || []).map((ind: string) => redactPII(ind));
      const cleanStep1 = redactPII(parsedData.step1Parents || "Initiate empathetic, non-judgmental check-ins.");
      const cleanStep2 = redactPII(parsedData.step2Wardens || "Schedule a discreet in-person welfare check within 30 minutes.");

      return res.json({
        success: true,
        report: {
          id: `samvedna-${Date.now()}`,
          timestamp: new Date().toISOString(),
          studentAlias: sanitizedAlias,
          studentContext: sanitizedContext,
          entryText: sanitizedText,
          rawReport: formattedReport,
          isCriticalAlert,
          distressScore,
          primaryEmotion: redactPII(parsedData.primaryEmotion || "Emotional Distress"),
          riskSeverity,
          keyIndicators: cleanKeyIndicators,
          recommendedSteps: {
            parentsGuardians: cleanStep1,
            wardensCounselors: cleanStep2
          }
        }
      });
    } catch (err: any) {
      console.error("Error in /api/analyze route:", err);
      return res.status(500).json({
        error: err?.message || "An error occurred while analyzing the journal entry."
      });
    }
  });

  // Vite development middleware vs Static Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Project Samvedna Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
