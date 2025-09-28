import React from 'react';
import { SpinnerIcon, StopIcon, FolderIcon, CheckCircleIcon, PlusIcon } from './icons';
import { RequestInput } from './RequestInput';
import { AquariusLogoHorizontal } from './Logo';

const ArchitectureCard: React.FC<{ architecture: string[] }> = ({ architecture }) => (
    <div className="bg-[#1e1e1e] rounded-lg p-4 border border-gray-700/80">
        <h3 className="text-sm font-semibold text-white mb-3">Architecture</h3>
        <div className="space-y-2 text-xs text-gray-400">
            {architecture.length > 0 ? (
                architecture.map((item, index) => {
                    const isDirectory = item.endsWith('/');
                    return (
                        <div key={index} className="flex items-center">
                            <FolderIcon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                            <span className={`truncate ${isDirectory ? 'text-white' : 'text-gray-400'}`}>{item}</span>
                        </div>
                    );
                })
            ) : (
                <div className="flex items-center text-xs text-gray-400">
                    <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />
                    <span>Analyzing project...</span>
                </div>
            )}
        </div>
    </div>
);


const StatusCard: React.FC<{ status: string; isCompleted: boolean; onStop: () => void; onReset: () => void; }> = ({ status, isCompleted, onStop, onReset }) => (
    <div className="bg-[#1e1e1e] rounded-lg p-4 border border-gray-700/80 flex items-center justify-between">
        <div className="flex items-center min-w-0">
            {isCompleted ? (
                <CheckCircleIcon className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
            ) : (
                <SpinnerIcon className="w-5 h-5 mr-3 text-gray-400 animate-spin flex-shrink-0" />
            )}
            <div className="truncate">
                <p className="text-sm font-medium text-white truncate">
                    {isCompleted ? 'Task finished' : 'Working on your task'}
                </p>
                <p className="text-xs text-gray-400 truncate">{status}</p>
            </div>
        </div>
        {isCompleted ? (
             <button onClick={onReset} className="flex items-center text-xs ml-2 px-3 py-1.5 rounded-md text-white bg-blue-600 hover:bg-blue-700" aria-label="Start new task">
                <PlusIcon className="w-4 h-4 mr-1" />
                New Task
            </button>
        ) : (
            <button onClick={onStop} className="p-2 ml-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white flex-shrink-0" aria-label="Stop task">
                <StopIcon className="w-5 h-5" />
            </button>
        )}
    </div>
);


export const Sidebar: React.FC<{ 
    architecture: string[]; 
    status: string; 
    isCompleted: boolean;
    onNewTask: (query: string) => void;
    isAgentRunning: boolean;
    onStop: () => void;
    onReset: () => void;
    hasError: boolean;
}> = ({ architecture, status, isCompleted, onNewTask, isAgentRunning, onStop, onReset, hasError }) => {
    
    const showArchitecture = isAgentRunning || isCompleted || architecture.length > 0;
    const showStatus = isAgentRunning || isCompleted;
    
    return (
        <aside className="w-full md:w-1/3 md:max-w-sm flex flex-col border-r border-gray-700/50 bg-black h-full">
            <div className="p-4 border-b border-gray-700/50">
                <AquariusLogoHorizontal />
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {showArchitecture && <ArchitectureCard architecture={architecture} />}
                {showStatus && <StatusCard status={status} isCompleted={isCompleted} onStop={onStop} onReset={onReset} />}
            </div>
            <div className="mt-auto border-t border-gray-700/50">
                <RequestInput onSubmit={onNewTask} disabled={isAgentRunning || hasError} />
            </div>
        </aside>
    );
};
