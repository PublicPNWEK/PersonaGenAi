// Fix: Create the PostingProgress component to simulate automating profile updates.
import React, { useState, useEffect } from 'react';
import { ProfileSuggestions, Platform } from '../types';
import { PLATFORMS } from '../constants';
import { sleep } from '../utils';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { CheckCircleIcon, XCircleIcon } from './icons/StatusIcons';


type Status = 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';

interface Task {
  platform: Platform;
  status: Status;
  message: string;
}

interface Props {
  suggestions: ProfileSuggestions;
  connectedPlatforms: Platform[];
  onComplete: () => void;
}

export const PostingProgress: React.FC<Props> = ({ suggestions, connectedPlatforms, onComplete }) => {
  const initialTasks = suggestions
    .filter(s => connectedPlatforms.includes(s.platform))
    .map(s => ({
      platform: s.platform,
      status: 'PENDING' as Status,
      message: 'Waiting to post...',
    }));

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const runUpdates = async () => {
      for (let i = 0; i < tasks.length; i++) {
        if (!isMounted) return;

        const platform = tasks[i].platform;

        // Set to in progress
        setTasks(prev => prev.map(t => t.platform === platform ? { ...t, status: 'IN_PROGRESS', message: 'Updating profile...' } : t));
        
        await sleep(1200); // Simulate API call

        if (!isMounted) return;
        
        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.1; 
        
        if (isSuccess) {
            setTasks(prev => prev.map(t => t.platform === platform ? { ...t, status: 'SUCCESS', message: 'Profile updated successfully!' } : t));
        } else {
            setTasks(prev => prev.map(t => t.platform === platform ? { ...t, status: 'FAILED', message: 'Failed. API connection timed out.' } : t));
        }

        await sleep(500);
      }

      if (isMounted) {
        setIsComplete(true);
      }
    };

    runUpdates();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StatusIcon = ({ status }: { status: Status }) => {
    if (status === 'IN_PROGRESS') return <LoadingSpinner className="w-6 h-6 text-sky-400" />;
    if (status === 'SUCCESS') return <CheckCircleIcon className="w-6 h-6 text-green-400" />;
    if (status === 'FAILED') return <XCircleIcon className="w-6 h-6 text-red-400" />;
    return <div className="w-6 h-6 rounded-full bg-slate-600" />; // Pending
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-sky-300 mb-4">Step 4: Automating Your Profile Updates</h2>
            <p className="text-slate-400">
                This screen simulates the process of programmatically updating your profiles on the connected platforms.
            </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl space-y-4">
            {tasks.map(({ platform, status, message }) => {
                const platformInfo = PLATFORMS[platform];
                return (
                    <div key={platform} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                        <StatusIcon status={status} />
                        <platformInfo.Icon className={`w-8 h-8 ${platformInfo.color}`} />
                        <div className="flex-grow">
                            <p className="font-bold text-white">{platformInfo.name}</p>
                            <p className="text-xs text-slate-400">{message}</p>
                        </div>
                    </div>
                );
            })}
        </div>

        {isComplete && (
            <div className="mt-8 text-center">
                 <button
                    onClick={onComplete}
                    className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-12 rounded-lg transition"
                >
                    View Results Dashboard &rarr;
                </button>
            </div>
        )}
    </div>
  );
};
