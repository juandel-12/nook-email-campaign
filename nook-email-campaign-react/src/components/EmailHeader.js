import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MoreVertical, Copy, Trash2 } from 'lucide-react';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './EmailHeader.module.css';

const EmailHeader = ({ campaignId, emailIndex }) => {
  const { campaignsData, updateEmailMeta, deleteEmail, duplicateEmail } = useCampaignContext();

  const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
  if (!campaign || !campaign.emails[emailIndex]) return null;

  const email = campaign.emails[emailIndex];

  const handleDelete = () => {
    if (window.confirm(`Delete email "${email.title}"? This cannot be undone.`)) {
      deleteEmail(campaignId, emailIndex);
    }
  };

  const handleDuplicate = () => {
    duplicateEmail(campaignId, emailIndex);
  };

  return (
    <div className={styles.emailHeader}>
      <div className={styles.fields}>
        <div className={styles.dayInput}>
          <Label htmlFor="email-day">Day Number</Label>
          <Input
            id="email-day"
            type="number"
            value={email.day}
            onChange={(e) => updateEmailMeta(campaignId, emailIndex, 'day', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className={styles.titleInput}>
          <Label htmlFor="email-title-header">Email Title</Label>
          <div className="flex gap-2">
            <Input
              id="email-title-header"
              type="text"
              value={email.title}
              onChange={(e) => updateEmailMeta(campaignId, emailIndex, 'title', e.target.value)}
              placeholder="Email title for reference"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailHeader;
