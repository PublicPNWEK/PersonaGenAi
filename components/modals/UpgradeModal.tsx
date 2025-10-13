import React from 'react';
import { ModalBase } from './ModalBase';
import { CheckCircleIcon, SparklesIcon } from '../icons/FeatureIcons';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

const ProFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-3">
        <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
        <span className="text-slate-300">{children}</span>
    </li>
);

export const UpgradeModal: React.FC<Props> = ({ isOpen, onClose, onUpgrade }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Upgrade to PersonaGen Pro">
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-slate-300">Unlock the full power of AI for your social media presence.</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-sky-300 mb-4">Pro Plan Features:</h3>
                <ul className="space-y-3 text-sm">
                    <ProFeature>Generate profiles for **unlimited** platforms</ProFeature>
                    <ProFeature>Use **Detailed Prompts** for fine-tuned AI control</ProFeature>
                    <ProFeature>Access **Advanced Analytics** & Market Reports</ProFeature>
                    <ProFeature>Unlock **Enterprise & Deployment** dashboards</ProFeature>
                    <ProFeature>Priority support</ProFeature>
                </ul>
            </div>

            <div className="text-center">
                <button 
                    onClick={onUpgrade}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Upgrade Now
                </button>
                <p className="text-xs text-slate-500 mt-2">(This is a demo action)</p>
            </div>
        </div>
    </ModalBase>
  );
};