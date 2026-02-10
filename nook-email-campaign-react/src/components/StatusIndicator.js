import React from 'react';
import styles from './StatusIndicator.module.css';

const StatusIndicator = ({ status, lastSaved }) => {
  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved ✓';
      case 'error':
        return 'Error!';
      default:
        return 'Auto-save enabled';
    }
  };

  const getLastSavedText = () => {
    if (!lastSaved) return '';

    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastSaved.toLocaleDateString();
  };

  return (
    <div className={styles.statusContainer}>
      <span className={`${styles.indicator} ${styles[status]}`}>
        {getStatusText()}
      </span>
      {lastSaved && (
        <span className={styles.lastSaved}>
          {getLastSavedText()}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
