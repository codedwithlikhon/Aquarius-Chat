# Aquarius AI Agent

Aquarius is an AI agent that can read, modify, and run code to help you build faster, squash bugs, and understand unfamiliar code. This project provides a web-based interface for interacting with the agent in real-time.

## Features

-   **Real-time Streaming**: Watch the AI agent's thought process and actions as they happen.
-   **Dynamic Context**: The agent analyzes the project architecture and displays it for context.
-   **Interactive UI**: A sleek, responsive interface for submitting tasks and viewing logs.
-   **Secure Architecture**: A backend-for-frontend proxy ensures your Gemini API key is never exposed to the client.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Node.js, Express (as a secure proxy to the Gemini API)
-   **Build Tool**: Vite
-   **Testing**: Vitest, React Testing Library

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm (or your preferred package manager)
-   A Google Gemini API Key

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aquarius-ai-agent
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and add your Google Gemini API key:
    ```
    API_KEY="your_gemini_api_key_here"
    ```
    **Note**: This key is used securely on the server-side and is never exposed to the browser.

### Running the Application

To run the application in development mode (with hot-reloading for both frontend and backend), use:

```bash
npm run dev
```

This will start the Vite development server for the frontend and the Node.js server for the backend, accessible at `http://localhost:5173`.

## Available Scripts

-   `npm run dev`: Starts the frontend and backend development servers concurrently.
-   `npm run build`: Builds the application for production.
-   `npm start`: Starts the production server (requires a build to be run first).
-   `npm test`: Runs the test suite using Vitest.

## Project Structure

```
.
├── public/          # Static assets
├── server/          # Backend proxy server
│   └── index.ts
├── src/             # Frontend source code
│   ├── components/  # React components
│   ├── services/    # API services
│   ├── App.tsx
│   └── index.tsx
├── .env             # Local environment variables (gitignored)
├── .env.example     # Example environment variables
├── Dockerfile       # For containerizing the app
├── index.html       # Main HTML entry point
├── package.json
└── vite.config.ts   # Vite configuration
```
