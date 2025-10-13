import React, { useState } from 'react';
import { Header } from './components/Header';
import { UserInputForm } from './components/UserInputForm';
import { SuggestionsReview } from './components/SuggestionsReview';
import { PostingProgress } from './components/PostingProgress';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ConnectAccounts } from './components/ConnectAccounts';
import { UserInput, ProfileSuggestions, Platform, Plan } from './types';
import { generateProfiles } from './services/geminiService';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/modals/PrivacyModal';
import { TermsModal } from './components/modals/TermsModal';
import { ContactModal } from './components/modals/ContactModal';
import { UpgradeModal } from './components/modals/UpgradeModal';


type AppState = 'INITIAL' | 'GENERATING' | 'REVIEWING' | 'CONNECTING' | 'POSTING' | 'RESULTS';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('INITIAL');
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [suggestions, setSuggestions] = useState<ProfileSuggestions | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan>('FREE');
  const [modal, setModal] = useState<'privacy' | 'terms' | 'contact' | 'upgrade' | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    setUserInput(data);
    setError(null);
    setAppState('GENERATING');
    try {
      // API key is handled by geminiService using environment variables.
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
        // API key is handled by geminiService using environment variables.
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
    // Keep plan state on reset
  };
  
  const handleToggleAdmin = () => {
    // This now acts as a developer tool to toggle PRO plan for testing
    setCurrentPlan('PRO');
    console.log("Pro plan enabled for testing!");
  };

  const handleUpgrade = () => {
    setCurrentPlan('PRO');
    setModal(null); // Close modal after upgrade
  };


  const renderContent = () => {
    // Show UserInputForm for both INITIAL and GENERATING states to utilize the form's loading state.
    if (appState === 'INITIAL' || appState === 'GENERATING') {
      return <UserInputForm 
                onSubmit={handleFormSubmit} 
                isGenerating={appState === 'GENERATING'} 
                currentPlan={currentPlan}
                onUpgradeClick={() => setModal('upgrade')}
             />;
    }

    switch (appState) {
      case 'REVIEWING':
        return suggestions && <SuggestionsReview suggestions={suggestions} onRegenerate={handleRegenerate} onAccept={handleReviewAccept} isRegenerating={isRegenerating} />;
      case 'CONNECTING':
        return userInput && <ConnectAccounts platforms={userInput.platforms} onComplete={handleConnectComplete} />;
      case 'POSTING':
        return suggestions && <PostingProgress suggestions={suggestions} connectedPlatforms={connectedPlatforms} onComplete={() => setAppState('RESULTS')} />;
      case 'RESULTS':
        return suggestions && <ResultsDashboard suggestions={suggestions} onStartOver={handleReset} currentPlan={currentPlan} onUpgradeClick={() => setModal('upgrade')}/>;
      default:
        // This case should be unreachable due to the check above, but provides a safe fallback.
        return <UserInputForm onSubmit={handleFormSubmit} isGenerating={false} currentPlan={currentPlan} onUpgradeClick={() => setModal('upgrade')} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col relative overflow-hidden">
      {/* Decorative Background Gradients for "Liquid Glass" feel */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/30 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/30 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header currentPlan={currentPlan} onUpgradeClick={() => setModal('upgrade')} />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-3xl mx-auto">
            {error && <ErrorDisplay message={error} onClear={() => setError(null)} />}
          </div>
          {renderContent()}
        </main>
        <Footer onOpenModal={(modalName) => setModal(modalName)} onToggleAdmin={handleToggleAdmin} />
      </div>
      
      <PrivacyModal isOpen={modal === 'privacy'} onClose={() => setModal(null)} />
      <TermsModal isOpen={modal === 'terms'} onClose={() => setModal(null)} />
      <ContactModal isOpen={modal === 'contact'} onClose={() => setModal(null)} />
      <UpgradeModal isOpen={modal === 'upgrade'} onClose={() => setModal(null)} onUpgrade={handleUpgrade} />

      {/* FIX: Removed invalid `jsx` and `global` props from the <style> tag, which are specific to Next.js and not supported in this React environment. */}
      <style>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default App;