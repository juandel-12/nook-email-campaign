import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './SetupModal.module.css';

const SetupModal = ({ isOpen, onClose }) => {
  const { config, updateConfig } = useCampaignContext();
  const [gistId, setGistId] = useState(config.gistId || '');
  const [token, setToken] = useState(config.githubToken || '');

  const handleSave = () => {
    updateConfig({
      gistId: gistId.trim(),
      githubToken: token.trim()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cloud Sync Setup">
      <div className={styles.setupModal}>
        <p className={styles.description}>
          Connect your GitHub Gist to enable cloud synchronization across your team.
        </p>

        <Input
          label="GitHub Gist ID"
          type="text"
          value={gistId}
          onChange={(e) => setGistId(e.target.value)}
          placeholder="abc123def456..."
          helperText="Create a private Gist on GitHub and paste its ID here"
        />

        <Input
          label="GitHub Personal Access Token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxx"
          helperText="Create a token with 'gist' scope at github.com/settings/tokens"
        />

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Configuration
          </Button>
        </div>

        <div className={styles.instructions}>
          <h4>Setup Instructions:</h4>
          <ol>
            <li>Go to <a href="https://gist.github.com" target="_blank" rel="noopener noreferrer">gist.github.com</a></li>
            <li>Create a new <strong>private</strong> Gist with any filename</li>
            <li>Copy the Gist ID from the URL (the alphanumeric string)</li>
            <li>Create a Personal Access Token with <strong>gist</strong> scope</li>
            <li>Paste both values above and click Save</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
};

export default SetupModal;
