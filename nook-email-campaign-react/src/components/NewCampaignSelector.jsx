import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import NewCampaignInfo from './NewCampaignInfo';
import CampaignActions from './CampaignActions';
import CampaignModal from './CampaignModal';
import { useCampaignContext } from '../contexts/CampaignContext';
import { Plus, ChevronDown } from 'lucide-react';

const NewCampaignSelector = () => {
  const { campaignsData, currentCampaignId, selectCampaign } = useCampaignContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCampaignId, setEditCampaignId] = useState(null);

  const currentCampaign = campaignsData.campaigns.find(c => c.id === currentCampaignId);

  const handleEdit = () => {
    setEditCampaignId(currentCampaignId);
  };

  const handleCloseEditModal = () => {
    setEditCampaignId(null);
  };

  return (
    <div className="space-y-4 mb-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Campaign Selection</CardTitle>
              <CardDescription>Choose a campaign to edit or create a new one</CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium mb-2 block">
                Current Campaign
              </label>
              <div className="relative">
                <select
                  value={currentCampaignId || ''}
                  onChange={(e) => selectCampaign(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {campaignsData.campaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {currentCampaign && (
              <div className="pt-2 flex items-center gap-2">
                <Badge variant="secondary">
                  {currentCampaign.emails.length} emails
                </Badge>
                <Badge variant="outline">
                  {currentCampaign.targetAudience}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {currentCampaignId && (
        <>
          <NewCampaignInfo campaignId={currentCampaignId} />
          <CampaignActions campaignId={currentCampaignId} onEdit={handleEdit} />
        </>
      )}

      <CampaignModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
      />

      {editCampaignId && (
        <CampaignModal
          isOpen={true}
          onClose={handleCloseEditModal}
          mode="edit"
          campaignId={editCampaignId}
        />
      )}
    </div>
  );
};

export default NewCampaignSelector;
