import React, { useState, useEffect } from 'react';
import { UserInput, Platform, Plan } from '../types';
import { VIBES, AUDIENCES, PLATFORMS } from '../constants';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { storageService } from '../services/storageService';
import { LockClosedIcon, SparklesIcon } from './icons/FeatureIcons';

interface Props {
  onSubmit: (data: UserInput) => void;
  isGenerating: boolean;
  currentPlan: Plan;
  onUpgradeClick: () => void;
}

const MAX_FREE_PLATFORMS = 3;

export const UserInputForm: React.FC<Props> = ({ onSubmit, isGenerating, currentPlan, onUpgradeClick }) => {
  const [name, setName] = useState('');
  const [bioDescription, setBioDescription] = useState('');
  const [detailedPrompt, setDetailedPrompt] = useState('');
  const [vibe, setVibe] = useState(VIBES[0]);
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [platforms, setPlatforms] = useState<Platform[]>(['twitter', 'linkedin']);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // New state for draft feature
  const [draftExists, setDraftExists] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Load draft from local storage on component mount
  useEffect(() => {
    const draft = storageService.getItem<UserInput>('personaGenDraft');
    if (draft) {
      setName(draft.name || '');
      setBioDescription(draft.bioDescription || '');
      setDetailedPrompt(draft.detailedPrompt || '');
      setVibe(draft.vibe || VIBES[0]);
      setAudience(draft.audience || AUDIENCES[0]);
      setPlatforms(draft.platforms || []);
      setAffiliateLink(draft.affiliateLink || '');
      setEmail(draft.email || '');
      setPhone(draft.phone || '');
      setDraftExists(true);
    }
  }, []);


  const handlePlatformChange = (platform: Platform) => {
    const isCurrentlySelected = platforms.includes(platform);

    if (!isCurrentlySelected && currentPlan === 'FREE' && platforms.length >= MAX_FREE_PLATFORMS) {
        onUpgradeClick(); // Open upgrade modal if limit is reached
        return;
    }

    setPlatforms(prev => 
      isCurrentlySelected
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit({ name, bioDescription, vibe, audience, platforms, affiliateLink, email, phone, detailedPrompt: currentPlan === 'PRO' ? detailedPrompt : undefined });
      storageService.removeItem('personaGenDraft'); // Clear draft on submit
      setDraftExists(false);
    }
  };

  const isFormValid = () => {
    return name.trim() && bioDescription.trim() && platforms.length > 0 && !isGenerating;
  };
  
  // Handler to save form state to local storage
  const handleSaveDraft = () => {
    const draftData = { name, bioDescription, vibe, audience, platforms, affiliateLink, email, phone, detailedPrompt };
    storageService.setItem('personaGenDraft', draftData);
    setDraftExists(true);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };
  
  // Handler to clear form and local storage draft
  const handleClearForm = () => {
    setName('');
    setBioDescription('');
    setDetailedPrompt('');
    setVibe(VIBES[0]);
    setAudience(AUDIENCES[0]);
    setPlatforms(['twitter', 'linkedin']);
    setAffiliateLink('');
    setEmail('');
    setPhone('');
    if (draftExists) {
      storageService.removeItem('personaGenDraft');
      setDraftExists(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sky-300 mb-2">Step 1: Define Your Persona</h2>
        <p className="text-slate-400">Tell the AI about yourself or your brand to generate tailored social media profiles.</p>
         {draftExists && !draftSaved && (
          <p className="text-xs text-sky-400 mt-2 bg-sky-500/10 border border-sky-500/30 rounded-full px-3 py-1 inline-block">
            Resuming from a saved draft.
          </p>
        )}
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
          <textarea id="bioDescription" value={bioDescription} onChange={e => setBioDescription(e.target.value)} required rows={3} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., A frontend developer passionate about AI, or a startup creating productivity tools."></textarea>
        </div>
        
        <div className="relative">
          <label htmlFor="detailedPrompt" className="block text-sm font-medium text-slate-300 mb-2">Detailed Prompt / Special Instructions</label>
          <textarea id="detailedPrompt" value={detailedPrompt} onChange={e => setDetailedPrompt(e.target.value)} rows={3} disabled={currentPlan === 'FREE'} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-800 disabled:cursor-not-allowed" placeholder="e.g., 'Focus on my experience in machine learning.', 'Use emojis in the bio.', 'Make the username a pun about coffee.'"></textarea>
          {currentPlan === 'FREE' && (
             <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-slate-700">
                <LockClosedIcon className="w-8 h-8 text-sky-400 mb-2"/>
                <p className="font-semibold text-white">This is a Pro Feature</p>
                <p className="text-xs text-slate-400 mb-3">Get more control over the AI's output.</p>
                <button type="button" onClick={onUpgradeClick} className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm py-2 px-4 rounded-lg transition">
                    Upgrade to Pro
                </button>
            </div>
          )}
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
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-slate-300">
                Select Target Platforms
            </label>
            {currentPlan === 'FREE' && (
                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                    {platforms.length} / {MAX_FREE_PLATFORMS} selected
                </span>
            )}
          </div>
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

        {/* Actions */}
        <div className="pt-6 space-y-4 border-t border-slate-700">
           <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-1/2 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {draftSaved ? '✓ Draft Saved' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={handleClearForm}
                className="w-full sm:w-1/2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-lg transition"
              >
                Clear Form
              </button>
            </div>

          <button type="submit" disabled={!isFormValid()} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-4 rounded-lg transition disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-3">
            {isGenerating ? (
              <>
                <LoadingSpinner />
                Generating Your Persona...
              </>
            ) : (
              <span className="flex items-center gap-2">
                Generate Profiles with AI <SparklesIcon className="w-5 h-5" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};