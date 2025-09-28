import React, { useState, useEffect } from 'react';
import { LogGroup, LogLine } from '../types';
import { ChevronDownIcon, FolderIcon, CheckCircleIcon } from './icons';

const BlinkingCursor: React.FC = () => (
    <span className="blinking-cursor" style={{
        animation: 'blink 1s step-end infinite',
        backgroundColor: '#e6edf3',
        display: 'inline-block',
        width: '8px',
        height: '1rem',
        marginLeft: '4px',
        verticalAlign: 'text-bottom',
    }}>
        <style>
        {`
          @keyframes blink {
            from, to { opacity: 1 }
            50% { opacity: 0 }
          }
        `}
        </style>
    </span>
);

const TypingEffect: React.FC<{ text: string, onComplete: () => void }> = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        setDisplayedText(''); // Reset on text change
        setShowCursor(true);
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                setShowCursor(false);
                onComplete();
            }
        }, 20); // Typing speed

        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return (
        <pre className="whitespace-pre-wrap font-mono">
            <code>
                {displayedText}
                {showCursor && <BlinkingCursor />}
            </code>
        </pre>
    );
};


const ShellOutput: React.FC<{ line: LogLine, onComplete: () => void }> = ({ line, onComplete }) => {
    return (
        <div className="bg-[#0e0e0e] rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto border border-gray-700/80">
            <TypingEffect text={line.content} onComplete={onComplete} />
        </div>
    );
};

const Thought: React.FC<{ line: LogLine }> = ({ line }) => (
    <p className="text-gray-400 text-sm italic py-2">{line.content}</p>
);

export const LogEntry: React.FC<{ group: LogGroup, isLast: boolean }> = ({ group, isLast }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const shellLogs = group.logs.filter(log => log.type === 'shell');
    const [completedShellAnimations, setCompletedShellAnimations] = useState(0);

    useEffect(() => {
      // Auto-open the last log group as it streams in
      if (isLast) {
          setIsOpen(true);
      }
      // Reset completion count if the group changes (e.g., on a new task)
      setCompletedShellAnimations(0);
    }, [isLast, group]);

    const handleAnimationComplete = React.useCallback(() => {
        setCompletedShellAnimations(prev => prev + 1);
    }, []);
    
    const isGroupCompleted = completedShellAnimations >= shellLogs.length;

    return (
        <div className="bg-[#161616] rounded-lg border border-gray-700/80 overflow-hidden">
            <button
                className="w-full flex items-center justify-between p-3 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="flex items-center min-w-0">
                    { isGroupCompleted ? (
                         <CheckCircleIcon className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                    ) : (
                         <FolderIcon className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="font-medium text-white text-sm truncate">{group.title}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} flex-shrink-0`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-700/80">
                    <div className="space-y-4">
                        {group.logs.map((log, index) => (
                            <div key={index}>
                                {log.type === 'thought' ? (
                                    <Thought line={log} />
                                ) : (
                                    <ShellOutput line={log} onComplete={handleAnimationComplete} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
