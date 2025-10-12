
import React from 'react';
import { ModalBase } from './ModalBase';

export const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div className="space-y-4 text-slate-300 text-sm">
        <p className="font-semibold text-slate-100">Last Updated: {new Date().toLocaleDateString()}</p>
        <p>This is a demo application. Your privacy is a top priority. Please read this policy to understand how your data is handled.</p>
        
        <h3 className="font-bold text-slate-100 pt-2 border-t border-slate-700">Data Storage: Your Browser Only</h3>
        <p>
          All data you enter into this application, including your persona details and any generated content, is stored exclusively in your browser's local storage.
          <strong>This application does not have a backend server, and your data is never sent to, or stored on, any server controlled by us.</strong> 
          It remains on your device.
        </p>

        <h3 className="font-bold text-slate-100 pt-2 border-t border-slate-700">Third-Party Services: Google Gemini API</h3>
        <p>
          To generate the AI content, the persona details you provide are sent to the Google Gemini API. Your use of this application is subject to Google's Privacy Policy and Terms of Service. We do not control how Google processes this data.
        </p>
        
        <h3 className="font-bold text-slate-100 pt-2 border-t border-slate-700">Clearing Your Data</h3>
        <p>
          You can clear all application data stored in your browser at any time by clearing your browser's cache and local storage for this site.
        </p>

        <p className="pt-4 text-xs text-slate-400">This policy is for informational purposes for this demo only and does not constitute a legally binding agreement.</p>
      </div>
    </ModalBase>
  );
};
