import React, { useState } from 'react';
import { CampaignProvider, useCampaignContext } from './contexts/CampaignContext';
import { useGistSync } from './hooks/useGistSync';
import { AppSidebar } from './components/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';
import { Separator } from './components/ui/separator';
import { ThemeToggle } from './components/ui/theme-toggle';
import StatusIndicator from './components/StatusIndicator';
import SetupModal from './components/SetupModal';
import ImportModal from './components/ImportModal';
import CampaignModal from './components/CampaignModal';
import ActiveCampaignPushModal from './components/ActiveCampaignPushModal';
import EmailContent from './components/EmailContent';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';
import './App.css';

const AppContent = () => {
  const {
    campaignsData,
    currentCampaignId,
    currentEmailIndex,
    getCurrentCampaign,
    config,
    setSaveStatus,
    importData,
    exportData,
    resetToDefaults,
    saveStatus,
    lastSaved,
  } = useCampaignContext();

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [showACPushModal, setShowACPushModal] = useState(false);
  const [acPushMode, setAcPushMode] = useState('bulk'); // 'bulk' | 'single'

  // Initialize Gist sync
  useGistSync(campaignsData, config, setSaveStatus, importData);

  const handleExport = () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nook-campaigns-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    const campaign = getCurrentCampaign();
    if (!campaign) {
      alert('No campaign selected');
      return;
    }

    let text = `Campaign: ${campaign.name}\n\n`;
    campaign.emails.forEach(email => {
      text += `=== Day ${email.day}: ${email.title} ===\n\n`;
      ['flooring', 'lighting', 'generic'].forEach(variant => {
        const v = email.variants[variant];
        text += `[${variant.toUpperCase()}]\n`;
        text += `Subject: ${v.subject}\n`;
        text += `Preview: ${v.preview}\n`;
        text += `Body:\n${v.body}\n\n`;
      });
      text += '\n---\n\n';
    });

    navigator.clipboard.writeText(text).then(() => {
      alert('Copied all emails to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const handleReset = () => {
    if (window.confirm('Reset to default campaign? This will replace all your data.')) {
      resetToDefaults();
    }
  };

  // ActiveCampaign push handlers
  const handleBulkPushToAC = () => {
    setAcPushMode('bulk');
    setShowACPushModal(true);
  };

  const handleSinglePushToAC = () => {
    setAcPushMode('single');
    setShowACPushModal(true);
  };

  const campaign = getCurrentCampaign();
  const currentEmail = campaign?.emails[currentEmailIndex];

  return (
    <SidebarProvider>
      <AppSidebar
        onOpenSetup={() => setShowSetupModal(true)}
        onExport={handleExport}
        onImport={() => setShowImportModal(true)}
        onCopyAll={handleCopyAll}
        onReset={handleReset}
        onAddCampaign={() => setShowAddCampaignModal(true)}
        onPushToAC={handleBulkPushToAC}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1">
              {campaign && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{campaign.name}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-sm text-muted-foreground">
                    {campaign.description}
                  </span>
                </div>
              )}
              {!campaign && (
                <span className="text-sm text-muted-foreground">No campaign selected</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {campaign && campaign.emails.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddEmailModal(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Email
                </Button>
              )}
              <StatusIndicator status={saveStatus} lastSaved={lastSaved} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {campaign && currentEmail && (
          <div className="border-b bg-muted/30 px-4 py-3">
            <h3 className="text-lg font-semibold">
              Day {currentEmail.day}: {currentEmail.title}
            </h3>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 p-4">
          {!campaign && (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">No Campaign Selected</h2>
                <p className="text-muted-foreground mb-4">
                  Select a campaign from the sidebar or create a new one
                </p>
                <Button onClick={() => setShowAddCampaignModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            </div>
          )}

          {campaign && campaign.emails.length === 0 && (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">No Emails Yet</h2>
                <p className="text-muted-foreground mb-4">
                  Add your first email to get started
                </p>
                <Button onClick={() => setShowAddEmailModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Email
                </Button>
              </div>
            </div>
          )}

          {campaign && currentEmail && (
            <EmailContent
              campaignId={currentCampaignId}
              emailIndex={currentEmailIndex}
              onPushToAC={handleSinglePushToAC}
            />
          )}
        </div>
      </SidebarInset>

      <SetupModal isOpen={showSetupModal} onClose={() => setShowSetupModal(false)} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
      <CampaignModal
        isOpen={showAddCampaignModal}
        onClose={() => setShowAddCampaignModal(false)}
        mode="add"
      />
      <ActiveCampaignPushModal
        isOpen={showACPushModal}
        onClose={() => setShowACPushModal(false)}
        mode={acPushMode}
        emailIndex={acPushMode === 'single' ? currentEmailIndex : null}
      />
      <AddEmailModal
        isOpen={showAddEmailModal}
        onClose={() => setShowAddEmailModal(false)}
        campaignId={currentCampaignId}
      />
    </SidebarProvider>
  );
};

// Simple Add Email Modal component
const AddEmailModal = ({ isOpen, onClose, campaignId }) => {
  const { addEmail } = useCampaignContext();
  const [newDay, setNewDay] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleAddEmail = () => {
    if (!newDay.trim() || !newTitle.trim()) {
      alert('Please fill in both day number and title');
      return;
    }
    addEmail(campaignId, newDay, newTitle);
    setNewDay('');
    setNewTitle('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Email</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Day Number</label>
            <input
              type="number"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              placeholder="0"
              className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Your Nook video is ready"
              className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAddEmail}>Add Email</Button>
          </div>
        </div>
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
