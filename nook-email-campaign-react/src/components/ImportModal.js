import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './ImportModal.module.css';

const ImportModal = ({ isOpen, onClose }) => {
  const { importData } = useCampaignContext();
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

  const handleImport = () => {
    if (!jsonText.trim()) {
      setError('Please provide JSON data');
      return;
    }

    const success = importData(jsonText);
    if (success) {
      setJsonText('');
      setError('');
      onClose();
    } else {
      setError('Invalid JSON format. Please check your data and try again.');
    }
  };

  const handleClose = () => {
    setJsonText('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Campaign Data" width="700px">
      <div className={styles.importModal}>
        <p className={styles.description}>
          Import campaign data from a JSON file. This will replace your current data.
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
          <Button variant="primary" onClick={handleImport}>
            Import Data
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
