import React, { useState } from 'react';
import Button from './Button';
import StatusIndicator from './StatusIndicator';
import SetupModal from './SetupModal';
import ImportModal from './ImportModal';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './Header.module.css';

const Header = () => {
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
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Nook Email Campaign Editor</h1>
          <div className={styles.headerRight}>
            <StatusIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <Button variant="primary" onClick={() => setShowSetupModal(true)}>
          Cloud Setup
        </Button>
        <Button variant="secondary" onClick={handleExport}>
          Download JSON
        </Button>
        <Button variant="secondary" onClick={() => setShowImportModal(true)}>
          Import JSON
        </Button>
        <Button variant="secondary" onClick={handleCopyAll}>
          Copy All Emails
        </Button>
        <Button variant="danger" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>

      <SetupModal isOpen={showSetupModal} onClose={() => setShowSetupModal(false)} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </>
  );
};

export default Header;
