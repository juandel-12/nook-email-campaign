import React from 'react';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './CampaignInfo.module.css';

const CampaignInfo = ({ campaignId }) => {
  const { campaignsData } = useCampaignContext();

  const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
  if (!campaign) return null;

  return (
    <div className={styles.campaignInfo}>
      <h3>{campaign.name}</h3>
      <p>{campaign.description}</p>
      <span>{campaign.emails.length} email{campaign.emails.length !== 1 ? 's' : ''}</span>
    </div>
  );
};

export default CampaignInfo;
