import React, { useState, useEffect } from 'react';

interface Props {
  apiKey: string | null;
  onSave: (key: string) => void;
}

export const ApiKeyManager: React.FC<Props> = ({ apiKey, onSave }) => {
  const [keyInput, setKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(!!apiKey);
  
  useEffect(() => {
    setIsSaved(!!apiKey);
    if (apiKey) {
        setKeyInput(''); // Clear input after save
    }
  }, [apiKey]);

  const handleSave = () => {
    if (keyInput.trim()) {
      onSave(keyInput.trim());
      setIsSaved(true);
    }
  };

  const handleEdit = () => {
    setIsSaved(false);
  }

  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-lg mb-6">
      <h3 className="font-semibold text-lg text-slate-200 mb-2">API Key Settings</h3>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full">
            <input
              type="password"
              value={isSaved ? '••••••••••••••••••••••••••••••••••' : keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              disabled={isSaved}
              placeholder="Enter your Google Gemini API key"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md pl-4 pr-12 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:bg-slate-700 disabled:cursor-not-allowed"
            />
             {isSaved && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-xs font-bold">SAVED</span>}
        </div>
        {isSaved ? (
             <button
                onClick={handleEdit}
                className="w-full sm:w-auto flex-shrink-0 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
                Edit
            </button>
        ) : (
            <button
                onClick={handleSave}
                disabled={!keyInput.trim()}
                className="w-full sm:w-auto flex-shrink-0 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                Save Key
            </button>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-2">Your API key is stored securely in your browser's local storage and is never sent anywhere else.</p>
      
      <div className="mt-4 pt-4 border-t border-slate-700/50">
          <h4 className="font-semibold text-slate-300">Where do I get an API key?</h4>
          <p className="text-xs text-slate-400 mt-1">
              This application uses a Google Gemini API key to power all AI generation features. You can get your own free API key from Google AI Studio.
          </p>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-semibold mt-2 inline-block"
          >
            Get a Gemini API Key &rarr;
          </a>
          <p className="text-xs text-slate-500 mt-2 italic">
              Note: You do not need separate API keys for Twitter, Instagram, etc. This app only simulates profile creation.
          </p>
      </div>
    </div>
  );
};