import React from 'react';
import Input from './Input';
import Textarea from './Textarea';
import { useCampaignContext } from '../contexts/CampaignContext';

const VariantForm = ({ campaignId, emailIndex, variant }) => {
  const { campaignsData, updateEmail } = useCampaignContext();

  const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
  if (!campaign || !campaign.emails[emailIndex]) return null;

  const email = campaign.emails[emailIndex];
  const variantData = email.variants[variant] || { subject: '', preview: '', body: '' };

  const handleChange = (field, value) => {
    updateEmail(campaignId, emailIndex, variant, field, value);
  };

  return (
    <div>
      <Input
        label="Subject Line"
        value={variantData.subject}
        onChange={(e) => handleChange('subject', e.target.value)}
        placeholder="Email subject line"
        helperText="This appears in the inbox as the email subject"
      />

      <Input
        label="Preview Text"
        value={variantData.preview}
        onChange={(e) => handleChange('preview', e.target.value)}
        placeholder="Inbox preview text"
        helperText="Text shown next to the subject in the inbox"
      />

      <Textarea
        label="Email Body"
        value={variantData.body}
        onChange={(e) => handleChange('body', e.target.value)}
        placeholder="Email content goes here..."
        minHeight="300px"
        monospace
        helperText="Use {{First_Name}} for personalization. Supports basic formatting."
      />
    </div>
  );
};

export default VariantForm;
