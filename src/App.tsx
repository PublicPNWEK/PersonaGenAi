

import React, { useState } from 'react';
import { Header } from './components/Header';
import { UserInputForm } from './components/UserInputForm';
import { SuggestionsReview } from './components/SuggestionsReview';
import { PostingProgress } from './components/PostingProgress';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ApiKeyManager } from './components/ApiKeyManager';
import { ConnectAccounts } from './components/ConnectAccounts';
import { UserInput, ProfileSuggestions, Platform } from './types';
import { generateProfiles } from './services/geminiService';
import { Footer } from './components/Footer';


type AppState = 'INITIAL' | 'GENERATING' | 'REVIEWING' | 'CONNECTING' | 'POSTING' | 'RESULTS';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('INITIAL');
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [suggestions, setSuggestions] = useState<ProfileSuggestions | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleFormSubmit = async (data: UserInput) => {
    setUserInput(data);
    setError(null);
    setAppState('GENERATING');
    try {
      // FIX: API key is handled by geminiService using environment variables.
      const result = await generateProfiles(data);
      setSuggestions(result);
      setAppState('REVIEWING');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setAppState('INITIAL');
    }
  };

  const handleRegenerate = async () => {
    if (userInput) {
      setError(null);
      setIsRegenerating(true);
      try {
        // FIX: API key is handled by geminiService using environment variables.
        const result = await generateProfiles(userInput);
        setSuggestions(result);
      } catch (e: any)
      {
        setError(e.message || 'An unknown error occurred during regeneration.');
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const handleReviewAccept = () => {
    setAppState('CONNECTING');
  };
  
  const handleConnectComplete = (platforms: Platform[]) => {
    setConnectedPlatforms(platforms);
    setAppState('POSTING');
  };

  const handleReset = () => {
    setAppState('INITIAL');
    setUserInput(null);
    setSuggestions(null);
    setConnectedPlatforms([]);
    setError(null);
  };

  const renderContent = () => {
    // FIX: Show UserInputForm for both INITIAL and GENERATING states to utilize the form's loading state.
    // This resolves the TypeScript error and improves the UX by not unmounting the form during submission.
    if (appState === 'INITIAL' || appState === 'GENERATING') {
      return <UserInputForm onSubmit={handleFormSubmit} isGenerating={appState === 'GENERATING'} />;
    }

    switch (appState) {
      case 'REVIEWING':
        return suggestions && <SuggestionsReview suggestions={suggestions} onRegenerate={handleRegenerate} onAccept={handleReviewAccept} isRegenerating={isRegenerating} />;
      case 'CONNECTING':
        return userInput && <ConnectAccounts platforms={userInput.platforms} onComplete={handleConnectComplete} />;
      case 'POSTING':
        return suggestions && <PostingProgress suggestions={suggestions} connectedPlatforms={connectedPlatforms} onComplete={() => setAppState('RESULTS')} />;
      case 'RESULTS':
        return suggestions && <ResultsDashboard suggestions={suggestions} onStartOver={handleReset} />;
      default:
        // This case should be unreachable due to the check above, but provides a safe fallback.
        return <UserInputForm onSubmit={handleFormSubmit} isGenerating={false} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          {error && <ErrorDisplay message={error} onClear={() => setError(null)} />}
        </div>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
