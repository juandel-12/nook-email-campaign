import React, { useState } from 'react';
import Select from './Select';
import Button from './Button';
import CampaignInfo from './CampaignInfo';
import CampaignActions from './CampaignActions';
import CampaignModal from './CampaignModal';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './CampaignSelector.module.css';

const CampaignSelector = () => {
  const { campaignsData, currentCampaignId, selectCampaign } = useCampaignContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCampaignId, setEditCampaignId] = useState(null);

  const campaignOptions = campaignsData.campaigns.map(c => ({
    value: c.id,
    label: c.name
  }));

  const handleEdit = () => {
    setEditCampaignId(currentCampaignId);
  };

  const handleCloseEditModal = () => {
    setEditCampaignId(null);
  };

  return (
    <div className={styles.campaignSelector}>
      <div className={styles.campaignControls}>
        <Select
          label="Campaign:"
          value={currentCampaignId || ''}
          onChange={(e) => selectCampaign(e.target.value)}
          options={campaignOptions}
        />

        <Button variant="success" onClick={() => setShowAddModal(true)}>
          + Add Campaign
        </Button>
      </div>

      {currentCampaignId && (
        <>
          <CampaignInfo campaignId={currentCampaignId} />
          <CampaignActions campaignId={currentCampaignId} onEdit={handleEdit} />
        </>
      )}

      <CampaignModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <CampaignModal
        isOpen={!!editCampaignId}
        onClose={handleCloseEditModal}
        editCampaignId={editCampaignId}
      />
    </div>
  );
};

export default CampaignSelector;
