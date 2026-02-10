import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useCampaignContext } from '../contexts/CampaignContext';
import { Calendar, Users, Mail } from 'lucide-react';

const NewCampaignInfo = ({ campaignId }) => {
  const { campaignsData } = useCampaignContext();

  const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
  if (!campaign) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription className="mt-1.5">{campaign.description}</CardDescription>
          </div>
          <Badge>{campaign.targetAudience}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{campaign.emails.length} email{campaign.emails.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{campaign.emails.length} days</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>3 variants per email</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewCampaignInfo;
