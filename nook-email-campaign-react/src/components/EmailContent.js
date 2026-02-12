import React from 'react';
import EmailHeader from './EmailHeader';
import VariantTabs from './VariantTabs';
import VariantForm from './VariantForm';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './EmailContent.module.css';

const EmailContent = ({ campaignId, emailIndex, onPushToAC }) => {
  const { currentVariant } = useCampaignContext();

  return (
    <div className={styles.emailContent}>
      <EmailHeader campaignId={campaignId} emailIndex={emailIndex} onPushToAC={onPushToAC} />
      <VariantTabs />
      <VariantForm
        campaignId={campaignId}
        emailIndex={emailIndex}
        variant={currentVariant}
      />
    </div>
  );
};

export default EmailContent;
