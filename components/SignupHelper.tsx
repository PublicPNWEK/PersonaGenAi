
import React from 'react';
import { PLATFORMS } from '../constants';
import { Platform } from '../types';

interface Props {
    platform: Platform;
}

export const SignupHelper: React.FC<Props> = ({ platform }) => {
    const platformInfo = PLATFORMS[platform];

    if (!platformInfo) {
        return null;
    }

    return (
        <div className="bg-slate-700/50 p-4 rounded-lg mt-4">
            <p className="text-sm text-slate-300">
                Ready to use your new persona? Sign up for {platformInfo.name} or update your existing profile.
            </p>
            <a 
                href={platformInfo.signupUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors mt-2 inline-block"
            >
                Go to {platformInfo.name} &rarr;
            </a>
        </div>
    );
};
