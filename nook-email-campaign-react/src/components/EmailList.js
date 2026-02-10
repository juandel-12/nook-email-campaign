import React, { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './EmailList.module.css';

const EmailList = ({ campaignId }) => {
  const { campaignsData, currentEmailIndex, selectEmail, addEmail } = useCampaignContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDay, setNewDay] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
  if (!campaign) return null;

  // Sort emails by day number for display, but keep track of original indices
  // Sorts on every render to ensure real-time updates when day numbers change
  const sortedEmailsWithIndices = campaign.emails
    .map((email, originalIndex) => ({ email, originalIndex }))
    .sort((a, b) => {
      const dayA = parseInt(a.email.day, 10);
      const dayB = parseInt(b.email.day, 10);
      return dayA - dayB;
    });

  // Debug logging
  console.log('EmailList render - sorted days:', sortedEmailsWithIndices.map(e => `Day ${e.email.day}`));

  const handleAddEmail = () => {
    if (!newDay.trim() || !newTitle.trim()) {
      alert('Please fill in both day number and title');
      return;
    }

    addEmail(campaignId, newDay, newTitle);
    setNewDay('');
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className={styles.emailListContainer}>
      <div className={styles.emailManagement}>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          + Add Email
        </Button>
      </div>

      <div className={styles.emailSelector}>
        {sortedEmailsWithIndices.map(({ email, originalIndex }) => (
          <button
            key={originalIndex}
            className={`${styles.emailBtn} ${currentEmailIndex === originalIndex ? styles.active : ''}`}
            onClick={() => selectEmail(originalIndex)}
          >
            <div className={styles.day}>Day {email.day}</div>
            <div className={styles.title}>{email.title}</div>
          </button>
        ))}

        {campaign.emails.length === 0 && (
          <div className={styles.emptyState}>
            <p>No emails yet. Click "Add Email" to create one.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewDay('');
          setNewTitle('');
        }}
        title="Add New Email"
      >
        <div className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="day-number">Day Number</Label>
            <Input
              id="day-number"
              type="number"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              placeholder="0"
              required
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="email-title">Email Title</Label>
            <Input
              id="email-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Your Nook video is ready"
              required
            />
          </div>

          <div className={styles.modalActions}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setNewDay('');
                setNewTitle('');
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddEmail}>
              Add Email
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmailList;
