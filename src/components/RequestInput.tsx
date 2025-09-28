import React, { useState } from 'react';
import { PaperclipIcon, MicrophoneIcon, SendIcon } from './icons';

export const RequestInput: React.FC<{ onSubmit: (query: string) => void; disabled: boolean }> = ({ onSubmit, disabled }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !disabled) {
            onSubmit(query.trim());
            setQuery('');
        }
    };

    return (
        <div className="p-3 bg-black">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={disabled ? "Agent is running..." : "Describe the task for the agent..."}
                    className="w-full bg-[#1e1e1e] border border-gray-700/80 rounded-lg py-3 pl-4 pr-28 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-opacity disabled:opacity-60"
                    aria-label="Describe the task for the agent"
                    disabled={disabled}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                     <button type="button" className="p-1 rounded-md text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500" disabled={disabled} aria-label="Attach file">
                        <PaperclipIcon className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-1 ml-1 rounded-md text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500" disabled={disabled} aria-label="Use microphone">
                        <MicrophoneIcon className="w-5 h-5" />
                    </button>
                    <button type="submit" className="p-1 ml-1 rounded-md text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500" disabled={!query.trim() || disabled} aria-label="Send task">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};
