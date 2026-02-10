import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import Button from './Button';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './CampaignModal.module.css';

const CampaignModal = ({ isOpen, onClose, editCampaignId = null }) => {
  const { campaignsData, addCampaign, updateCampaign } = useCampaignContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isEdit = !!editCampaignId;
  const title = isEdit ? 'Edit Campaign' : 'Add New Campaign';

  // Load existing campaign data when editing
  useEffect(() => {
    if (isEdit && editCampaignId) {
      const campaign = campaignsData.campaigns.find(c => c.id === editCampaignId);
      if (campaign) {
        setName(campaign.name);
        setDescription(campaign.description);
      }
    } else {
      setName('');
      setDescription('');
    }
  }, [isEdit, editCampaignId, campaignsData.campaigns]);

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      alert('Please enter a campaign name');
      return;
    }

    if (isEdit) {
      updateCampaign(editCampaignId, trimmedName, trimmedDescription);
    } else {
      addCampaign(trimmedName, trimmedDescription);
    }

    setName('');
    setDescription('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className={styles.campaignModal}>
        <div className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Watch Video Nurture"
              required
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="campaign-description">Description</Label>
            <Textarea
              id="campaign-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this campaign's purpose"
              className="min-h-[100px]"
            />
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isEdit ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CampaignModal;
