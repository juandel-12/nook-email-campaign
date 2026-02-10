import React from 'react';
import { useCampaignContext } from '../contexts/CampaignContext';
import styles from './VariantTabs.module.css';

const variants = [
  { key: 'flooring', label: 'Flooring' },
  { key: 'lighting', label: 'Lighting' },
  { key: 'generic', label: 'Generic' }
];

const VariantTabs = () => {
  const { currentVariant, setCurrentVariant } = useCampaignContext();

  return (
    <div className={styles.tabs}>
      {variants.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.tab} ${currentVariant === key ? styles.active : ''}`}
          onClick={() => setCurrentVariant(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default VariantTabs;
