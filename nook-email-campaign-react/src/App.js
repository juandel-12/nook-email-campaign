import React from 'react';
import { CampaignProvider, useCampaignContext } from './contexts/CampaignContext';
import { useGistSync } from './hooks/useGistSync';
import NewHeader from './components/NewHeader';
import NewCampaignSelector from './components/NewCampaignSelector';
import EmailEditor from './components/EmailEditor';
import './App.css';

const AppContent = () => {
  const {
    campaignsData,
    config,
    setSaveStatus,
    importData
  } = useCampaignContext();

  // Initialize Gist sync
  useGistSync(campaignsData, config, setSaveStatus, importData);

  return (
    <div className="min-h-screen bg-background">
      <NewHeader />
      <div className="container mx-auto max-w-7xl px-4 pb-8">
        <NewCampaignSelector />
        <EmailEditor />
      </div>
    </div>
  );
};

function App() {
  return (
    <CampaignProvider>
      <AppContent />
    </CampaignProvider>
  );
}

export default App;
