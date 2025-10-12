import React from 'react';
import { CodeBracketIcon, CloudArrowUpIcon, ServerIcon } from './icons/FeatureIcons';

export const DeployDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 p-6 rounded-xl animate-fade-in-fast">
      <h3 className="text-xl font-bold text-sky-400 mb-6">Deployment & Integration Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Vercel/Netlify */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <CloudArrowUpIcon className="w-6 h-6 text-green-400" />
            <h4 className="font-semibold text-green-300">One-Click Deploy</h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Deploy this entire application to Vercel or Netlify with a single click from the GitHub repository.
          </p>
          <button className="w-full text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-md transition">
            Deploy to Vercel
          </button>
        </div>

        {/* API Integration */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <CodeBracketIcon className="w-6 h-6 text-sky-400" />
            <h4 className="font-semibold text-sky-300">Integrate the API</h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Use the core `geminiService.ts` logic in your own application to generate profiles programmatically.
          </p>
          <button className="w-full text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-md transition">
            View API Code
          </button>
        </div>

        {/* Self-Host */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <ServerIcon className="w-6 h-6 text-purple-400" />
            <h4 className="font-semibold text-purple-300">Self-Host</h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Clone the repository and run the application on your own infrastructure using Node.js.
          </p>
          <button className="w-full text-xs bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-md transition">
            View README
          </button>
        </div>
      </div>
    </div>
  );
};
