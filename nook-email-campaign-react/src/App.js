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
import AddFromJSONModal from './components/AddFromJSONModal';
import CampaignModal from './components/CampaignModal';
import ActiveCampaignPushModal from './components/ActiveCampaignPushModal';
import SyncConflictDialog from './components/SyncConflictDialog';
import EmailContent from './components/EmailContent';
import { Button } from './components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Cloud } from 'lucide-react';
import './App.css';

const CloudSetupScreen = ({ onOpenSetup }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Cloud className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Cloud Setup Required</h1>
        <p className="text-muted-foreground mb-6">
          Please configure cloud sync to continue. Your campaign data will be stored in a private GitHub Gist shared across your team.
        </p>
        <Button onClick={onOpenSetup} size="lg">
          Configure Cloud Sync
        </Button>
      </div>
    </div>
  );
};

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
    saveStatus,
    lastSaved,
    updateCampaign,
    deleteCampaign,
    cloudSyncEnabled,
  } = useCampaignContext();

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [showAddFromJSONModal, setShowAddFromJSONModal] = useState(false);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [showACPushModal, setShowACPushModal] = useState(false);
  const [acPushMode, setAcPushMode] = useState('single');
  const [editingField, setEditingField] = useState(null); // null | 'name' | 'description'
  const [editValue, setEditValue] = useState('');

  // Define handleExport before early returns
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

  // Initialize Gist sync
  const { syncConflict, resolveKeepLocal, resolveUseCloud, isLoading } = useGistSync(campaignsData, config, setSaveStatus, importData);

  // Hard-block app if cloud is not configured
  if (!cloudSyncEnabled) {
    return (
      <>
        <CloudSetupScreen onOpenSetup={() => setShowSetupModal(true)} />
        <SetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          onExport={handleExport}
          onImport={() => setShowImportModal(true)}
        />
        <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
      </>
    );
  }

  // Show loading while fetching cloud data
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading from cloud...</p>
        </div>
      </div>
    );
  }

  // ActiveCampaign push handler (single email mode only)
  const handleSinglePushToAC = () => {
    setAcPushMode('single');
    setShowACPushModal(true);
  };

  const campaign = getCurrentCampaign();
  const currentEmail = campaign?.emails[currentEmailIndex];

  const startEditing = (field) => {
    setEditingField(field);
    setEditValue(field === 'name' ? campaign.name : campaign.description);
  };

  const finishEditing = () => {
    if (editingField && campaign) {
      const newName = editingField === 'name' ? editValue.trim() : campaign.name;
      const newDesc = editingField === 'description' ? editValue.trim() : campaign.description;
      if (newName) {
        updateCampaign(currentCampaignId, newName, newDesc);
      }
    }
    setEditingField(null);
    setEditValue('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') finishEditing();
    if (e.key === 'Escape') {
      setEditingField(null);
      setEditValue('');
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onOpenSetup={() => setShowSetupModal(true)}
        onAddCampaign={() => setShowAddCampaignModal(true)}
        onAddFromJSON={() => setShowAddFromJSONModal(true)}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1">
              {campaign && (
                <div className="flex items-center gap-2">
                  {editingField === 'name' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={finishEditing}
                      onKeyDown={handleEditKeyDown}
                      autoFocus
                      className="text-sm font-medium bg-transparent border-b border-primary outline-none px-0 py-0"
                    />
                  ) : (
                    <span className="text-sm font-medium">{campaign.name}</span>
                  )}
                  <Separator orientation="vertical" className="h-4" />
                  {editingField === 'description' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={finishEditing}
                      onKeyDown={handleEditKeyDown}
                      autoFocus
                      className="text-sm text-muted-foreground bg-transparent border-b border-primary outline-none px-0 py-0 flex-1"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {campaign.description}
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                        <span className="sr-only">Campaign options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => startEditing('name')}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => startEditing('description')}>
                        Update Description
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          if (window.confirm(`Delete "${campaign.name}"? This cannot be undone.`)) {
                            deleteCampaign(currentCampaignId);
                          }
                        }}
                      >
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {syncConflict && (
        <SyncConflictDialog
          onKeepLocal={resolveKeepLocal}
          onUseCloud={resolveUseCloud}
        />
      )}
      <SetupModal isOpen={showSetupModal} onClose={() => setShowSetupModal(false)} onExport={handleExport} onImport={() => setShowImportModal(true)} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
      <AddFromJSONModal isOpen={showAddFromJSONModal} onClose={() => setShowAddFromJSONModal(false)} />
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
