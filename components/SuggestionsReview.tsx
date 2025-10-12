// Fix: Create the SuggestionsReview component to display AI-generated profiles for user approval.
import React from 'react';
import { ProfileSuggestions } from '../types';
import { PLATFORMS } from '../constants';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface Props {
  suggestions: ProfileSuggestions;
  onRegenerate: () => void;
  onAccept: () => void;
  isRegenerating: boolean;
}

export const SuggestionsReview: React.FC<Props> = ({ suggestions, onRegenerate, onAccept, isRegenerating }) => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-sky-300 mb-2">Step 2: Review Your AI-Generated Profiles</h2>
        <p className="text-slate-400">Here are the suggestions for your social media presence. You can accept them or ask the AI to try again.</p>
      </div>

      <div className="space-y-6">
        {suggestions.map((profile) => {
          const platformInfo = PLATFORMS[profile.platform];
          return (
            <div key={profile.platform} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <platformInfo.Icon className={`w-10 h-10 ${platformInfo.color}`} />
                <h3 className="text-xl font-bold text-white">{platformInfo.name}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
                  <p className="bg-slate-700/50 p-3 rounded-md text-white font-mono text-sm">{profile.username}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bio</label>
                  <p className="bg-slate-700/50 p-3 rounded-md text-white text-sm whitespace-pre-wrap">{profile.bio}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isRegenerating ? <LoadingSpinner /> : 'Regenerate'}
        </button>
        <button
          onClick={onAccept}
          disabled={isRegenerating}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded-lg transition disabled:bg-slate-600"
        >
          Accept & Continue &rarr;
        </button>
      </div>
    </div>
  );
};
