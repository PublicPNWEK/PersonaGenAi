
import React, { useState } from 'react';
import { ClipboardIcon, CheckCircleIcon } from './icons/FeatureIcons';

interface Props {
  label: string;
  value: string;
  type?: 'text' | 'textarea';
}

export const CopyableField: React.FC<Props> = ({ label, value, type = 'text' }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleCopy = async () => {
    // Reset states on each click
    setCopied(false);
    setCopyError(null);

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Success message lasts 2s
    } catch (err) {
      console.error("Clipboard API failed:", err);
      setCopyError("Copy failed. Check browser permissions.");
      setTimeout(() => setCopyError(null), 3000); // Error message lasts 3s
    }
  };

  const baseClasses = "w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 pr-12 text-white text-sm";
  
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <div className="relative">
        {type === 'textarea' ? (
           <textarea
             readOnly
             value={value}
             rows={3}
             className={`${baseClasses} resize-none`}
           />
        ) : (
          <input
            type="text"
            readOnly
            value={value}
            className={`${baseClasses} overflow-x-auto`}
          />
        )}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 bg-slate-600 hover:bg-slate-500 rounded-md transition"
          title="Copy to clipboard"
        >
          {copied ? (
            <CheckCircleIcon className="w-4 h-4 text-green-400" />
          ) : (
            <ClipboardIcon className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>
      {copyError && (
        <p className="text-xs text-red-400 mt-1 animate-fade-in">
          {copyError}
        </p>
      )}
    </div>
  );
};
