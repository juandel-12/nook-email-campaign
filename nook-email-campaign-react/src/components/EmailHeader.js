import React from 'react';
import Input from './Input';
import Button from './Button';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './EmailHeader.module.css';

const EmailHeader = ({ campaignId, emailIndex }) => {
  const { campaignsData, updateEmailMeta, deleteEmail } = useCampaignContext();

  const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
  if (!campaign || !campaign.emails[emailIndex]) return null;

  const email = campaign.emails[emailIndex];

  const handleDelete = () => {
    if (window.confirm(`Delete email "${email.title}"? This cannot be undone.`)) {
      deleteEmail(campaignId, emailIndex);
    }
  };

  return (
    <div className={styles.emailHeader}>
      <div className={styles.fields}>
        <Input
          label="Day Number"
          type="number"
          value={email.day}
          onChange={(e) => updateEmailMeta(campaignId, emailIndex, 'day', e.target.value)}
          placeholder="0"
          className={styles.dayInput}
        />

        <Input
          label="Email Title"
          type="text"
          value={email.title}
          onChange={(e) => updateEmailMeta(campaignId, emailIndex, 'title', e.target.value)}
          placeholder="Email title for reference"
          className={styles.titleInput}
        />
      </div>

      <Button variant="danger" onClick={handleDelete}>
        Delete Email
      </Button>
    </div>
  );
};

export default EmailHeader;
