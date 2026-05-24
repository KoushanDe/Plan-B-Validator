import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const PLANB_API_URL = process.env.PLANB_API_URL || "http://localhost:8080";
const PORT = 3000;

async function startServer() {
  const app = express();
  
  // Use memory storage for uploaded resume PDFs (max 10 MB)
  const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Helper to format errors exactly according to contract
  const sendError = (res: express.Response, status: number, errorCode: string, message: string) => {
    res.status(status).json({
      error: {
        code: errorCode,
        message,
        requestId: null
      }
    });
  };

  // Helper to build headers with skip warning and X-User-Id if present
  const getUpstreamHeaders = (req: express.Request, defaults: Record<string, string> = {}) => {
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      ...defaults
    };
    const userId = req.headers["x-user-id"] || req.headers["X-User-Id"];
    if (userId) {
      headers["X-User-Id"] = userId as string;
    }
    return headers;
  };

  // GET /api/health -> GET /v1/health
  app.get("/api/health", async (req, res) => {
    try {
      const upstreamRes = await fetch(`${PLANB_API_URL}/v1/health`, {
        headers: getUpstreamHeaders(req)
      });
      if (!upstreamRes.ok) {
        throw new Error(`Upstream health returned status ${upstreamRes.status}`);
      }
      const data = await upstreamRes.json();
      res.json(data);
    } catch (error: any) {
      sendError(res, 500, "INTERNAL_ERROR", error.message || "Failed to fetch health check from backend service.");
    }
  });

  // GET /api/questionnaire/questions -> GET /v1/questionnaire/questions
  app.get("/api/questionnaire/questions", async (req, res) => {
    try {
      const upstreamRes = await fetch(`${PLANB_API_URL}/v1/questionnaire/questions`, {
        headers: getUpstreamHeaders(req)
      });
      if (!upstreamRes.ok) {
        throw new Error(`Upstream questions returned status ${upstreamRes.status}`);
      }
      const data = await upstreamRes.json();
      res.json(data);
    } catch (error: any) {
      sendError(res, 500, "INTERNAL_ERROR", error.message || "Failed to fetch questionnaire Questions.");
    }
  });

  // POST /api/questionnaire/score -> POST /v1/questionnaire/score
  app.post("/api/questionnaire/score", async (req, res) => {
    try {
      const upstreamRes = await fetch(`${PLANB_API_URL}/v1/questionnaire/score`, {
        method: "POST",
        headers: getUpstreamHeaders(req, {
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(req.body)
      });
      if (!upstreamRes.ok) {
        throw new Error(`Upstream scoring returned status ${upstreamRes.status}`);
      }
      const data = await upstreamRes.json();
      res.json(data);
    } catch (error: any) {
      sendError(res, 500, "INTERNAL_ERROR", error.message || "Failed to score questionnaire.");
    }
  });

  // Core runway calculator handler
  const handleRunwayCalculate = async (req: express.Request, res: express.Response) => {
    try {
      const upstreamRes = await fetch(`${PLANB_API_URL}/v1/runway/calculate`, {
        method: "POST",
        headers: getUpstreamHeaders(req, {
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(req.body)
      });
      if (!upstreamRes.ok) {
        throw new Error(`Upstream runway returned status ${upstreamRes.status}`);
      }
      const data = await upstreamRes.json();
      res.json(data);
    } catch (error: any) {
      sendError(res, 500, "INTERNAL_ERROR", error.message || "Failed to calculate dynamic liquid cash runway.");
    }
  };

  // Support both endpoint variants for absolute safety
  app.post("/api/runway", handleRunwayCalculate);
  app.post("/api/runway/calculate", handleRunwayCalculate);

  // Helper for forwarding standard analyze requests
  const handleAnalyzeProxy = async (req: express.Request, res: express.Response) => {
    res.setTimeout(300000); // 5 minutes client timeout wrapper
    const targetUrl = `${PLANB_API_URL}/v1/analyze`;
    
    let baseHeaders: Record<string, string> = {};
    let body: any;

    const files = req.files as Express.Multer.File[] | undefined;
    const resumeFile = files?.find(f => f.fieldname === "resume");
    const requestFile = files?.find(f => f.fieldname === "request");

    if (resumeFile) {
      const formData = new FormData();
      
      // Append resume as blob with headers
      const resumeBlob = new Blob([resumeFile.buffer], { type: resumeFile.mimetype });
      formData.append("resume", resumeBlob, resumeFile.originalname);
      
      // Append application/json text part
      let requestPayload = req.body.request;
      if (!requestPayload && requestFile) {
        requestPayload = requestFile.buffer.toString("utf-8");
      }
      if (!requestPayload) {
        requestPayload = "{}";
      }
      formData.append("request", requestPayload);
      
      body = formData;
    } else if (req.headers["content-type"]?.includes("multipart/form-data")) {
      const formData = new FormData();
      let requestPayload = req.body.request;
      if (!requestPayload && requestFile) {
        requestPayload = requestFile.buffer.toString("utf-8");
      }
      if (!requestPayload) {
        requestPayload = "{}";
      }
      formData.append("request", requestPayload);
      body = formData;
    } else {
      baseHeaders["Content-Type"] = "application/json";
      body = JSON.stringify(req.body);
    }

    const headers = getUpstreamHeaders(req, baseHeaders);

    try {
      const upstreamRes = await fetch(targetUrl, {
        method: "POST",
        headers,
        body,
      });

      const upstreamContentType = upstreamRes.headers.get("content-type") || "";

      // Ensure upstream is ok and did not return an HTML document (e.g. proxy warning / error)
      if (!upstreamRes.ok || upstreamContentType.includes("text/html")) {
        const status = upstreamRes.status;
        let code = "INTERNAL_ERROR";
        if (status === 400) code = "INVALID_INPUT";
        if (status === 429) code = "RATE_LIMITED";

        if (upstreamContentType.includes("application/json")) {
          const errData = await upstreamRes.json();
          return res.status(status).json(errData);
        } else {
          const errText = await upstreamRes.text();
          return sendError(
            res,
            status || 500,
            code,
            errText || `Upstream service returned status code ${status}`
          );
        }
      }

      res.status(upstreamRes.status);
      res.setHeader("Content-Type", upstreamContentType);

      const text = await upstreamRes.text();
      res.send(text);
    } catch (error: any) {
      console.error(`Error forwarding to /v1/analyze:`, error.message || error);
      sendError(res, 500, "INTERNAL_ERROR", error.message || "Failed to analyze Plan B options.");
    }
  };

  // POST /api/analyze -> POST /v1/analyze
  app.post("/api/analyze", upload.any(), async (req, res) => {
    await handleAnalyzeProxy(req, res);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Forwarding requests to PLANB_API_URL: ${PLANB_API_URL}`);
  });
}

startServer();
