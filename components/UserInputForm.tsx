
import React, { useState } from 'react';
import { UserInput, Platform } from '../types';
import { VIBES, AUDIENCES, PLATFORMS } from '../constants';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface Props {
  onSubmit: (data: UserInput) => void;
  isGenerating: boolean;
}

export const UserInputForm: React.FC<Props> = ({ onSubmit, isGenerating }) => {
  const [name, setName] = useState('');
  const [bioDescription, setBioDescription] = useState('');
  const [vibe, setVibe] = useState(VIBES[0]);
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [platforms, setPlatforms] = useState<Platform[]>(['twitter', 'linkedin']);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handlePlatformChange = (platform: Platform) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit({ name, bioDescription, vibe, audience, platforms, affiliateLink, email, phone });
    }
  };

  const isFormValid = () => {
    return name.trim() && bioDescription.trim() && platforms.length > 0 && !isGenerating;
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sky-300 mb-2">Step 1: Define Your Persona</h2>
        <p className="text-slate-400">Tell the AI about yourself or your brand to generate tailored social media profiles.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 border border-slate-700 p-8 rounded-xl">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Your Name / Brand Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., Alex Doe, QuantumLeap AI" />
          </div>
           <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Contact Email (Optional)</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., alex.doe@example.com" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Contact Phone (Optional)</label>
            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., (555) 123-4567" />
          </div>
          <div>
            <label htmlFor="affiliateLink" className="block text-sm font-medium text-slate-300 mb-2">Promotional Link (Optional)</label>
            <input type="url" id="affiliateLink" value={affiliateLink} onChange={e => setAffiliateLink(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., https://yourproduct.com/deal" />
          </div>
        </div>
        <div>
          <label htmlFor="bioDescription" className="block text-sm font-medium text-slate-300 mb-2">Describe yourself or your brand</label>
          <textarea id="bioDescription" value={bioDescription} onChange={e => setBioDescription(e.target.value)} required rows={4} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., A frontend developer passionate about AI, or a startup creating productivity tools."></textarea>
        </div>

        {/* Vibe and Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="vibe" className="block text-sm font-medium text-slate-300 mb-2">Desired Vibe / Tone</label>
                <select id="vibe" value={vibe} onChange={e => setVibe(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500 appearance-none">
                    {VIBES.map(v => <option key={v}>{v}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="audience" className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
                <select id="audience" value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500 appearance-none">
                    {AUDIENCES.map(a => <option key={a}>{a}</option>)}
                </select>
            </div>
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Select Target Platforms</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(PLATFORMS).map(([key, { name, Icon }]) => (
              <button key={key} type="button" onClick={() => handlePlatformChange(key as Platform)} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${platforms.includes(key as Platform) ? 'bg-sky-500/20 border-sky-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}>
                <Icon className={`w-8 h-8 mb-2 ${platforms.includes(key as Platform) ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">{name}</span>
              </button>
            ))}
          </div>
          {platforms.length === 0 && <p className="text-red-400 text-xs mt-2">Please select at least one platform.</p>}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button type="submit" disabled={!isFormValid()} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-4 rounded-lg transition disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-3">
            {isGenerating ? (
              <>
                <LoadingSpinner />
                Generating Your Persona...
              </>
            ) : (
              'Generate Profiles with AI ✨'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};