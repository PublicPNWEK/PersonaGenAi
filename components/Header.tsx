import React from 'react';
import { SparklesIcon } from './icons/FeatureIcons';

export const Header: React.FC = () => (
  <header className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-800">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-sky-400" />
        <h1 className="text-2xl font-bold text-white">
          Persona<span className="text-sky-400">Gen</span> AI
        </h1>
      </div>
      <a
        href="https://github.com/google/generative-ai-docs/tree/main/apps/react-social-profiles-creator"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-400 hover:text-sky-400 transition-colors"
      >
        View on GitHub
      </a>
    </div>
  </header>
);
