import React from 'react';
import EmailList from './EmailList';
import EmailContent from './EmailContent';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './EmailEditor.module.css';

const EmailEditor = () => {
  const { currentCampaignId, currentEmailIndex, getCurrentCampaign } = useCampaignContext();

  const campaign = getCurrentCampaign();

  if (!currentCampaignId || !campaign) {
    return (
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <h2>No Campaign Selected</h2>
          <p>Please select or create a campaign to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <EmailList campaignId={currentCampaignId} />

      {campaign.emails.length > 0 && campaign.emails[currentEmailIndex] && (
        <EmailContent
          campaignId={currentCampaignId}
          emailIndex={currentEmailIndex}
        />
      )}

      {campaign.emails.length === 0 && (
        <div className={styles.noEmails}>
          <p>No emails in this campaign yet. Click "Add Email" to create one.</p>
        </div>
      )}
    </div>
  );
};

export default EmailEditor;
