import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LogGroup, StreamEvent } from './types';
import { generateTaskStream } from './services/geminiService';
import { Sidebar } from './components/Sidebar';
import { LogsPanel } from './components/LogsPanel';

const App: React.FC = () => {
  const [logGroups, setLogGroups] = useState<LogGroup[]>([]);
  const [architecture, setArchitecture] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("Awaiting task...");
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setError("Critical Error: API_KEY is not configured. Please set the API_KEY environment variable.");
    }
  }, []);

  const resetState = () => {
    setLogGroups([]);
    setArchitecture([]);
    setIsTaskCompleted(false);
    setIsAgentRunning(false);
    setStatusMessage("Awaiting task...");
    isCancelledRef.current = false;
    // Do not clear critical errors like missing API key
    if (error && !error.startsWith("Critical Error:")) {
       setError(null);
    }
  }

  const handleNewTask = useCallback(async (query: string) => {
    resetState();
    setIsAgentRunning(true);
    setStatusMessage("Initializing agent...");

    try {
      const stream = generateTaskStream(query, () => isCancelledRef.current);
      for await (const event of stream) {
        if (isCancelledRef.current) break;

        switch (event.type) {
          case 'architecture':
            setArchitecture(event.data);
            break;
          case 'log':
            setLogGroups(prevGroups => [...prevGroups, event.data]);
            break;
          case 'status':
            setStatusMessage(event.message);
            if (event.completed) {
              setIsTaskCompleted(true);
              setIsAgentRunning(false);
            }
            break;
          case 'error':
            setError(event.message);
            setIsTaskCompleted(true); // Treat error as completion of the attempt
            setIsAgentRunning(false);
            setStatusMessage("Error occurred");
            break;
        }
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during the stream.";
        setError(errorMessage);
        setStatusMessage("Stream failed");
        setIsTaskCompleted(true);
        setIsAgentRunning(false);
    }
  }, []);
  
  const handleStop = useCallback(() => {
    isCancelledRef.current = true;
    setIsAgentRunning(false);
    setStatusMessage("Task cancelled");
    setIsTaskCompleted(true); // Mark as "completed" to show reset button
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white font-sans">
      <div className="flex h-full w-full flex-col md:flex-row overflow-hidden">
        <Sidebar
          architecture={architecture}
          status={statusMessage}
          isCompleted={isTaskCompleted}
          onNewTask={handleNewTask}
          isAgentRunning={isAgentRunning}
          onStop={handleStop}
          onReset={resetState}
          hasError={!!error}
        />
        <LogsPanel
          logGroups={logGroups}
          isAgentRunning={isAgentRunning}
          error={error}
        />
      </div>
    </div>
  );
};

export default App;
