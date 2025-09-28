import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { StreamEvent } from '../src/types';

const app = express();
const port = process.env.PORT || 3001;

// --- Security Middleware ---
app.use(helmet()); // Apply sensible security headers
app.use(express.json());

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['YOUR_PRODUCTION_FRONTEND_URL'] // TODO: Replace with your actual frontend URL
  : ['http://localhost:5173']; 

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false, 
});

// --- Main API Route ---
app.post('/api/generate', apiLimiter, async (req: express.Request, res: express.Response) => {
    const { userQuery } = req.body;

    if (!userQuery) {
        return res.status(400).send({ error: 'userQuery is required' });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return res.status(500).send({ error: 'API_KEY is not configured on the server.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        
        const systemInstruction = `You are an expert AI software engineer. Your task is to solve a user's query for a hypothetical project.
You must output a stream of newline-delimited JSON objects. Do not output any text outside of these JSON objects. Each JSON object must be a valid 'StreamEvent'.
The stream must follow this sequence:
1.  A single 'status' event with the message 'Agent is thinking...'.
2.  A single 'architecture' event, providing a list of key files and directories for project context.
3.  A series of 'log' events, one for each step of your process. Each log event should be preceded by a 'status' event describing the step's title.
4.  A final 'status' event with the message 'Task completed' and 'completed: true'.`;

        const userPrompt = `Here is the task I need you to perform: '${userQuery}'`;
        
        // FIX: Use ai.models.generateContentStream directly according to guidelines.
        const result = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Stream the response
        // FIX: Iterate over the stream response directly and use the .text property.
        for await (const chunk of result) {
            const chunkText = chunk.text;
            if (chunkText) {
                // The model should be returning newline-delimited JSON.
                // We send it directly to the client.
                res.write(chunkText);
            }
        }

        res.end();

    } catch (error) {
        console.error("Error in /api/generate:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        // If headers are already sent, we can't send a 500 status, so we end the response.
        // The client-side will handle the abrupt end of the stream.
        if (!res.headersSent) {
            res.status(500).json({ type: 'error', message: `An error occurred on the server: ${errorMessage}` });
        } else {
            res.end();
        }
    }
});

// --- Production Static File Serving ---
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = new URL('../client', import.meta.url).pathname;
    app.use(express.static(clientBuildPath));
    app.get('*', (req: express.Request, res: express.Response) => {
        res.sendFile(clientBuildPath + '/index.html');
    });
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});