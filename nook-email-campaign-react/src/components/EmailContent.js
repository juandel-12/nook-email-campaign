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
      <EmailHeader campaignId={campaignId} emailIndex={emailIndex} />
      <VariantTabs />
      <VariantForm
        campaignId={campaignId}
        emailIndex={emailIndex}
        variant={currentVariant}
        onPushToAC={onPushToAC}
      />
    </div>
  );
};

export default EmailContent;
