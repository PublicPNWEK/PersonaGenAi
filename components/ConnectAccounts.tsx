import React, { useState } from 'react';
import { Platform } from '../types';
import { PLATFORMS } from '../constants';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { CheckCircleIcon } from './icons/StatusIcons';
import { sleep } from '../utils';

interface Props {
  platforms?: Platform[];
  onComplete?: (connectedPlatforms: Platform[]) => void;
}

type ConnectionStatus = 'IDLE' | 'CONNECTING' | 'CONNECTED';

export const ConnectAccounts: React.FC<Props> = ({ platforms, onComplete }) => {
    // FIX: Render a placeholder view if essential props are not provided.
    // This handles the case where the component is used for display purposes, like on the results dashboard.
    if (!platforms || !onComplete) {
      return (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-sky-400 mb-4">Account Connection</h3>
          <p className="text-sm text-slate-400">
            This placeholder represents the step where you would connect social media accounts to automate posting.
          </p>
        </div>
      );
    }
    
    const [statuses, setStatuses] = useState<Record<string, ConnectionStatus>>(
        Object.fromEntries(platforms.map(p => [p, 'IDLE']))
    );

    const handleConnect = async (platform: Platform) => {
        setStatuses(prev => ({ ...prev, [platform]: 'CONNECTING' }));
        
        // Simulate OAuth window and user authorization
        await sleep(1500 + Math.random() * 1000);

        setStatuses(prev => ({ ...prev, [platform]: 'CONNECTED' }));
    };

    const connectedCount = Object.values(statuses).filter(s => s === 'CONNECTED').length;
    const connectedPlatforms = Object.entries(statuses)
                                .filter(([, status]) => status === 'CONNECTED')
                                .map(([platform]) => platform as Platform);

    return (
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-sky-300 mb-4">Step 3: Connect Your Accounts</h2>
            <p className="text-slate-400 mb-8">
                In a live application, this step would securely connect to each social media platform using OAuth. For this demo, we'll simulate the connection process.
            </p>

            <div className="space-y-4">
                {platforms.map(platform => {
                    const platformInfo = PLATFORMS[platform];
                    const status = statuses[platform];
                    return (
                        <div key={platform} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <platformInfo.Icon className={`w-8 h-8 ${platformInfo.color}`} />
                                <span className="font-bold text-white">{platformInfo.name}</span>
                            </div>
                            <button
                                onClick={() => handleConnect(platform)}
                                disabled={status !== 'IDLE'}
                                className="w-32 text-center bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:cursor-not-allowed disabled:bg-slate-700"
                            >
                                {status === 'IDLE' && 'Connect'}
                                {status === 'CONNECTING' && <LoadingSpinner className="w-5 h-5 mx-auto" />}
                                {status === 'CONNECTED' && (
                                    <div className="flex items-center justify-center gap-2 text-green-400">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Connected
                                    </div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8">
                <button
                    onClick={() => onComplete(connectedPlatforms)}
                    disabled={connectedCount === 0}
                    className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-12 rounded-lg transition disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    Continue to Posting &rarr;
                </button>
            </div>
        </div>
    );
};
