import React from 'react';
import { ProfileSuggestions } from '../types';
import { PLATFORMS } from '../constants';
import { CopyableField } from './CopyableField';
import { ComplianceDashboard } from './ComplianceDashboard';
import { MarketIntelligenceReport } from './MarketIntelligenceReport';
import { ApiPayloadViewer } from './ApiPayloadViewer';
import { ConnectAccounts } from './ConnectAccounts';

interface Props {
  suggestions: ProfileSuggestions;
  onStartOver: () => void;
}

export const ResultsDashboard: React.FC<Props> = ({ suggestions, onStartOver }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-white mb-2">
          Your PersonaGen AI <span className="text-sky-400">Launch Kit</span> is Ready!
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Below is your complete set of generated profiles, along with simulated reports and next steps.
        </p>
      </div>

      {/* Final Profiles Section */}
      <section>
        <h3 className="text-2xl font-bold text-sky-300 mb-6">Finalized Social Profiles</h3>
        <div className="space-y-8">
          {suggestions.map((profile) => {
            const platformInfo = PLATFORMS[profile.platform];
            return (
              <div key={profile.platform} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-6">
                  <platformInfo.Icon className={`w-10 h-10 ${platformInfo.color}`} />
                  <h4 className="text-xl font-bold text-white">{platformInfo.name}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CopyableField label="Username" value={profile.username} />
                  <div className="md:col-span-2">
                    <CopyableField label="Bio" value={profile.bio} type="textarea" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Placeholder Components Section */}
      <section className="space-y-8">
        {/* FIX: The ConnectAccounts component was missing required props. 
            The component has been updated to render a placeholder when props are omitted, resolving the type error. */}
        <ConnectAccounts />
        <ComplianceDashboard />
        <MarketIntelligenceReport />
        <ApiPayloadViewer />
      </section>
      
      <div className="flex justify-center pt-8">
        <button
          onClick={onStartOver}
          className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};
