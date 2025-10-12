
import React from 'react';
import { ModalBase } from './ModalBase';

export const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Contact Us">
      <div className="space-y-4 text-slate-300 text-sm">
        <p>For questions, feedback, or support regarding this demo application, please reach out.</p>
        
        <div className="pt-2">
            <p className="font-semibold text-slate-100">Email</p>
            <a href="mailto:support@example.com" className="text-sky-400 hover:text-sky-300">support@example.com</a>
        </div>

        <div className="pt-2">
            <p className="font-semibold text-slate-100">GitHub Repository</p>
            <a href="https://github.com/google/generative-ai-docs/tree/main/apps/react-social-profiles-creator" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300">View Project on GitHub</a>
        </div>
        
        <p className="pt-4 text-xs text-slate-400">Please note that response times may vary as this is a demonstration project.</p>
      </div>
    </ModalBase>
  );
};
