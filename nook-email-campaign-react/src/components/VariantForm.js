import React from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
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
    <div className="space-y-6">
      <div className="grid w-full gap-3">
        <Label htmlFor="subject">Subject Line</Label>
        <Input
          id="subject"
          value={variantData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Email subject line"
        />
        <p className="text-sm text-muted-foreground">
          This appears in the inbox as the email subject
        </p>
      </div>

      <div className="grid w-full gap-3">
        <Label htmlFor="preview">Preview Text</Label>
        <Input
          id="preview"
          value={variantData.preview}
          onChange={(e) => handleChange('preview', e.target.value)}
          placeholder="Inbox preview text"
        />
        <p className="text-sm text-muted-foreground">
          Text shown next to the subject in the inbox
        </p>
      </div>

      <div className="grid w-full gap-3">
        <Label htmlFor="body">Email Body</Label>
        <Textarea
          id="body"
          value={variantData.body}
          onChange={(e) => handleChange('body', e.target.value)}
          placeholder="Email content goes here..."
          className="min-h-[300px] font-mono"
        />
        <p className="text-sm text-muted-foreground">
          Use {'{'}'{'}First_Name{'}'}{'}'}  for personalization. Supports basic formatting.
        </p>
      </div>
    </div>
  );
};

export default VariantForm;
