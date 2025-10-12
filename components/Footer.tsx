import React, { useState } from 'react';

interface Props {
  onOpenModal: (modal: 'privacy' | 'terms' | 'contact') => void;
  onToggleAdmin: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenModal, onToggleAdmin }) => {
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleAdminClick = () => {
    const newCount = adminClickCount + 1;
    if (newCount >= 5) {
      onToggleAdmin();
      setAdminClickCount(0); // Reset after activation
    } else {
      setAdminClickCount(newCount);
    }
  };
  
  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-400">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
          <button onClick={() => onOpenModal('privacy')} className="hover:text-sky-400 transition-colors">Privacy Policy</button>
          <button onClick={() => onOpenModal('terms')} className="hover:text-sky-400 transition-colors">Terms of Service</button>
          <button onClick={() => onOpenModal('contact')} className="hover:text-sky-400 transition-colors">Contact</button>
        </div>
        <p onClick={handleAdminClick} className="cursor-pointer select-none" title="Admin Access">
          &copy; {new Date().getFullYear()} PersonaGen AI. All rights reserved.
        </p>
        <p className="text-xs text-slate-500 mt-2">This is a demo application built with React and the Google Gemini API.</p>
      </div>
    </footer>
  );
};