import React from 'react';
import { ExclamationTriangleIcon, KeyIcon, ClockIcon, ShieldExclamationIcon } from './icons/FeatureIcons';

interface Props {
  message: string;
  onClear: () => void;
}

export const ErrorDisplay: React.FC<Props> = ({ message, onClear }) => {
  let title = "An Error Occurred";
  let Icon = ExclamationTriangleIcon;
  let styleClasses = "bg-red-500/20 border-red-500 text-red-300";
  let suggestedAction = "Please try again. If the issue persists, check the console for more details.";

  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes('api key')) {
    title = "API Key Error";
    Icon = KeyIcon;
    styleClasses = "bg-yellow-500/20 border-yellow-500 text-yellow-300";
    suggestedAction = "Please ensure your Google Gemini API key is set correctly as an environment variable and is valid.";
  } else if (lowerCaseMessage.includes('rate limit')) {
    title = "Rate Limit Exceeded";
    Icon = ClockIcon;
    styleClasses = "bg-yellow-500/20 border-yellow-500 text-yellow-300";
    suggestedAction = "You've made too many requests. Please wait a moment and try again, or check your API quota.";
  } else if (lowerCaseMessage.includes('safety') || lowerCaseMessage.includes('blocked')) {
    title = "Content Safety Block";
    Icon = ShieldExclamationIcon;
    styleClasses = "bg-orange-500/20 border-orange-500 text-orange-300";
    suggestedAction = "Your request was blocked for safety reasons. Please adjust your input and try again.";
  } else if (lowerCaseMessage.includes('ai response')) {
    title = "AI Response Error";
    Icon = ExclamationTriangleIcon;
    suggestedAction = "The AI returned an unexpected response. Try regenerating or slightly modifying your input.";
  }


  return (
    <div className={`border px-4 py-3 rounded-lg relative mb-6 animate-fade-in ${styleClasses}`} role="alert">
      <div className="flex items-start">
        <Icon className={`w-6 h-6 mr-3 mt-1 flex-shrink-0`} />
        <div>
          <strong className="font-bold">{title}</strong>
          <p className="text-sm mt-1">{message}</p>
          <div className="mt-2 text-xs border-t border-current/30 pt-2">
            <strong className="font-semibold">Suggested Action:</strong> {suggestedAction}
          </div>
        </div>
      </div>
      <button onClick={onClear} className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Close error message">
        <svg className={`fill-current h-6 w-6`} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </button>
    </div>
  );
};