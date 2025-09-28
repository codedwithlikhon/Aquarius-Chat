import React from 'react';
import { LogGroup } from '../types';
import { LogEntry } from './LogEntry';
import { WarningIcon } from './icons';

const WelcomeMessage: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
            <h3 className="text-xl font-semibold">Aquarius AI Agent</h3>
            <p className="mt-2 text-sm">Describe a task, bug, or question in the input box to get started.</p>
        </div>
    </div>
);

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
     <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-400 bg-red-900/30 p-6 rounded-lg border border-red-500/50 max-w-md">
            <WarningIcon className="w-10 h-10 mx-auto mb-3 text-red-400" />
            <h3 className="text-lg font-semibold text-white">An Error Occurred</h3>
            <p className="mt-2 text-sm text-red-300">{error}</p>
        </div>
    </div>
)

export const LogsPanel: React.FC<{ logGroups: LogGroup[], isAgentRunning: boolean, error: string | null }> = ({ logGroups, isAgentRunning, error }) => {
    return (
        <div className="bg-black flex-1 flex flex-col h-full md:h-auto">
            <div className="p-4 border-b border-gray-700/50">
                 <h2 className="text-lg font-semibold text-white">Logs</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {error ? <ErrorDisplay error={error} /> :
                    (logGroups.length === 0 && !isAgentRunning) ? <WelcomeMessage /> :
                    logGroups.map((group, index) => (
                        <LogEntry 
                            key={index} 
                            group={group} 
                            isLast={index === logGroups.length - 1}
                        />
                    ))
                }
            </div>
        </div>
    );
};
