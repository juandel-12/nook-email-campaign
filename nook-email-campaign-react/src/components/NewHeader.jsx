import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ui/theme-toggle';
import StatusIndicator from './StatusIndicator';
import SetupModal from './SetupModal';
import ImportModal from './ImportModal';
import { useCampaignContext } from '../contexts/CampaignContext';
import {
  Mail,
  Download,
  Upload,
  Copy,
  RotateCcw,
  Cloud,
  Github
} from 'lucide-react';

const NewHeader = () => {
  const { campaignsData, currentCampaignId, exportData, resetToDefaults, saveStatus, lastSaved } = useCampaignContext();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

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
    const campaign = campaignsData.campaigns.find(c => c.id === currentCampaignId);

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

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-6">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Nook Email Campaign</h1>
              <p className="text-xs text-muted-foreground">Email Editor & Manager</p>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center gap-2">
            <StatusIndicator status={saveStatus} lastSaved={lastSaved} />
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/juandel-12/nook-email-campaign"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="border-t bg-muted/30 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setShowSetupModal(true)} className="gap-2">
              <Cloud className="w-4 h-4" />
              Cloud Setup
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Download JSON
            </Button>
            <Button variant="outline" onClick={() => setShowImportModal(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Import JSON
            </Button>
            <Button variant="outline" onClick={handleCopyAll} className="gap-2">
              <Copy className="w-4 h-4" />
              Copy All
            </Button>
            <div className="ml-auto">
              <Button variant="destructive" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      </header>

      <SetupModal isOpen={showSetupModal} onClose={() => setShowSetupModal(false)} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </>
  );
};

export default NewHeader;
