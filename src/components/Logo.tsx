import React from 'react';

const Gradients = () => (
    <defs>
        <linearGradient id="logo-grad-1" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#F54949" />
            <stop offset="50%" stopColor="#FFC93A" />
            <stop offset="100%" stopColor="#67D965" />
        </linearGradient>
        <linearGradient id="logo-grad-2" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#D849F5" />
            <stop offset="50%" stopColor="#4986F5" />
            <stop offset="100%" stopColor="#65D9D9" />
        </linearGradient>
        <linearGradient id="logo-grad-text" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#BDBDBD" />
            <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
    </defs>
);

export const AquariusLogoSquare: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`aspect-square flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <Gradients />
            <path d="M100 5 L20 85 L100 60 L180 85 Z" fill="url(#logo-grad-1)" />
            <path d="M100 175 L20 95 L100 120 L180 95 Z" fill="url(#logo-grad-2)" />
            <text x="100" y="93" textAnchor="middle" dominantBaseline="middle" fill="url(#logo-grad-text)" fontSize="26" fontWeight="600" fontFamily="sans-serif" letterSpacing="-1">
                AQUARIUS
            </text>
            <path d="M117.5 77.5 a 4 4 0 0 1 -4 4 a 4 4 0 0 1 -4 -4 c 0 -4 5 -4 8 0" fill="#67D965" transform="rotate(-30, 115.5, 77.5)"/>
        </svg>
    </div>
);

export const AquariusLogoHorizontal: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
        <svg viewBox="0 0 100 90" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
            <Gradients />
            <path d="M50 0 L0 45 L50 30 L100 45 Z" fill="url(#logo-grad-1)" />
            <path d="M50 90 L0 45 L50 60 L100 45 Z" fill="url(#logo-grad-2)" />
        </svg>
        <svg viewBox="0 0 180 30" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
            <Gradients />
                <text x="90" y="15" textAnchor="middle" dominantBaseline="middle" fill="url(#logo-grad-text)" fontSize="26" fontWeight="600" fontFamily="sans-serif" letterSpacing="-1">
                AQUARIUS
            </text>
            <path d="M117.5 2.5 a 4 4 0 0 1 -4 4 a 4 4 0 0 1 -4 -4 c 0 -4 5 -4 8 0" fill="#67D965" transform="rotate(-30, 115.5, 2.5)"/>
        </svg>
    </div>
);
