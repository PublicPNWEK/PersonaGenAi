

import React from 'react';
import { SparklesIcon, LockClosedIcon } from './icons/FeatureIcons';

interface Props {
  onUpgradeClick: () => void;
}

export const PremiumTeaser: React.FC<Props> = ({ onUpgradeClick }) => {
  return (
    <div className="max-w-4xl mx-auto bg-sky-900/50 border border-sky-700 p-6 rounded-xl animate-fade-in-fast text-center">
      <div className="flex justify-center items-center gap-3 mb-4">
        <SparklesIcon className="w-6 h-6 text-sky-400" />
        <h3 className="text-xl font-bold text-sky-300">Unlock Pro Features</h3>
      </div>
      <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
        Upgrade to unlock advanced analytics, enterprise dashboards, deployment options, and more to take your brand to the next level.
      </p>
      <button 
        onClick={onUpgradeClick}
        className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2 mx-auto">
        <LockClosedIcon className="w-4 h-4" />
        <span>View Pro Plans</span>
      </button>
    </div>
  );
};