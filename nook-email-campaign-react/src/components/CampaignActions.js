import React from 'react';
import Button from './Button';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './CampaignActions.module.css';

const CampaignActions = ({ campaignId, onEdit }) => {
  const { campaignsData, deleteCampaign } = useCampaignContext();

  const handleDelete = () => {
    const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    if (window.confirm(`Delete campaign "${campaign.name}"? This cannot be undone.`)) {
      deleteCampaign(campaignId);
    }
  };

  const canDelete = campaignsData.campaigns.length > 1;

  return (
    <div className={styles.campaignActions}>
      <Button variant="secondary" onClick={onEdit}>
        Edit
      </Button>
      <Button
        variant="danger"
        onClick={handleDelete}
        disabled={!canDelete}
      >
        Delete
      </Button>
    </div>
  );
};

export default CampaignActions;
