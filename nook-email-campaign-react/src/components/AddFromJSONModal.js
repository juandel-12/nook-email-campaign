import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './ImportModal.module.css';

const AddFromJSONModal = ({ isOpen, onClose }) => {
  const { addCampaignsFromJSON } = useCampaignContext();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonText(event.target.result);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleAdd = () => {
    if (!jsonText.trim()) {
      setError('Please provide JSON data');
      return;
    }

    const result = addCampaignsFromJSON(jsonText);
    if (result.success) {
      setJsonText('');
      setError('');
      onClose();
    } else {
      setError(result.message || 'Invalid JSON format. Please check your data and try again.');
    }
  };

  const handleClose = () => {
    setJsonText('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Campaigns from JSON" width="700px">
      <div className={styles.importModal}>
        <p className={styles.description}>
          Add campaigns from a JSON file. Existing campaigns will not be affected.
        </p>

        <div className={styles.fileUpload}>
          <label className={styles.fileLabel}>
            Choose JSON File
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
          </label>
          <span className={styles.fileHint}>or paste JSON below</span>
        </div>

        <div className={styles.textareaWrapper}>
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError('');
            }}
            placeholder='Paste JSON data here...'
            className={styles.textarea}
          />
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Campaigns
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddFromJSONModal;
