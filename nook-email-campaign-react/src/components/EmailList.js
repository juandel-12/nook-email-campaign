import React, { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import Input from './Input';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './EmailList.module.css';

const EmailList = ({ campaignId }) => {
  const { campaignsData, currentEmailIndex, selectEmail, addEmail } = useCampaignContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDay, setNewDay] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
  if (!campaign) return null;

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
        {campaign.emails.map((email, index) => (
          <button
            key={index}
            className={`${styles.emailBtn} ${currentEmailIndex === index ? styles.active : ''}`}
            onClick={() => selectEmail(index)}
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
        <Input
          label="Day Number"
          type="number"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          placeholder="0"
          required
        />

        <Input
          label="Email Title"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="e.g., Your Nook video is ready"
          required
        />

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
      </Modal>
    </div>
  );
};

export default EmailList;
