export type LogType = 'thought' | 'shell';

export interface LogLine {
  type: LogType;
  content: string;
}

export interface LogGroup {
  title: string;
  logs: LogLine[];
}

export type StreamEvent = 
  | { type: 'architecture'; data: string[] }
  | { type: 'log'; data: LogGroup }
  | { type: 'status'; message: string; completed?: boolean }
  | { type: 'error'; message: string };
