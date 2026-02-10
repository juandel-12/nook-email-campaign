import React from 'react';
import { CampaignProvider, useCampaignContext } from './contexts/CampaignContext';
import { useGistSync } from './hooks/useGistSync';
import Header from './components/Header';
import CampaignSelector from './components/CampaignSelector';
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
    <div className="App">
      <div className="container">
        <Header />
        <CampaignSelector />
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
