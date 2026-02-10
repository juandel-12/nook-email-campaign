/**
 * Campaign Context
 * Global state management for campaign data, configuration, and actions
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultCampaignsData from '../data/defaultCampaigns.json';
import { ensureV2Format } from '../utils/migrate';

const CampaignContext = createContext();

// LocalStorage keys (matching legacy app)
const STORAGE_KEY = 'nookEmailCampaign';
const LAST_SAVED_KEY = 'nookEmailCampaignLastSaved';
const TOKEN_KEY = 'githubToken';
const GIST_ID_KEY = 'gistId';

export const CampaignProvider = ({ children }) => {
  // Core data state
  const [campaignsData, setCampaignsData] = useState({ version: '2.0', campaigns: [] });
  const [currentCampaignId, setCurrentCampaignId] = useState(null);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [currentVariant, setCurrentVariant] = useState('flooring');

  // Configuration state
  const [config, setConfig] = useState({
    gistId: localStorage.getItem(GIST_ID_KEY) || '',
    githubToken: localStorage.getItem(TOKEN_KEY) || '',
    saveDebounce: 2000
  });

  // Status state
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [lastSaved, setLastSaved] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = () => {
      try {
        // Try loading from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const validated = ensureV2Format(parsed);
          setCampaignsData(validated);

          // Set current campaign to first one
          if (validated.campaigns.length > 0) {
            setCurrentCampaignId(validated.campaigns[0].id);
          }

          console.log('Loaded data from localStorage');
          return;
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }

      // Fall back to default data
      console.log('Using default campaign data');
      setCampaignsData(defaultCampaignsData);
      if (defaultCampaignsData.campaigns.length > 0) {
        setCurrentCampaignId(defaultCampaignsData.campaigns[0].id);
      }
    };

    initializeData();

    // Load last saved timestamp
    const savedTime = localStorage.getItem(LAST_SAVED_KEY);
    if (savedTime) {
      setLastSaved(new Date(savedTime));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (campaignsData.campaigns.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaignsData));
        const now = new Date();
        localStorage.setItem(LAST_SAVED_KEY, now.toISOString());
        setLastSaved(now);
        console.log('Saved to localStorage');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [campaignsData]);

  // Get current campaign
  const getCurrentCampaign = useCallback(() => {
    return campaignsData.campaigns.find(c => c.id === currentCampaignId) || null;
  }, [campaignsData.campaigns, currentCampaignId]);

  // Campaign CRUD operations
  const selectCampaign = useCallback((campaignId) => {
    setCurrentCampaignId(campaignId);
    setCurrentEmailIndex(0); // Reset to first email
  }, []);

  const addCampaign = useCallback((name, description) => {
    const newCampaign = {
      id: `campaign-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      emails: []
    };

    setCampaignsData(prev => ({
      ...prev,
      campaigns: [...prev.campaigns, newCampaign]
    }));

    setCurrentCampaignId(newCampaign.id);
    return newCampaign.id;
  }, []);

  const updateCampaign = useCallback((campaignId, name, description) => {
    setCampaignsData(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c =>
        c.id === campaignId
          ? { ...c, name: name.trim(), description: description.trim() }
          : c
      )
    }));
  }, []);

  const deleteCampaign = useCallback((campaignId) => {
    setCampaignsData(prev => {
      const filtered = prev.campaigns.filter(c => c.id !== campaignId);

      // If we deleted the current campaign, switch to first available
      if (campaignId === currentCampaignId && filtered.length > 0) {
        setCurrentCampaignId(filtered[0].id);
        setCurrentEmailIndex(0);
      }

      return {
        ...prev,
        campaigns: filtered
      };
    });
  }, [currentCampaignId]);

  // Email operations
  const selectEmail = useCallback((index) => {
    setCurrentEmailIndex(index);
  }, []);

  const addEmail = useCallback((campaignId, dayNumber, title) => {
    const newEmail = {
      day: parseInt(dayNumber, 10),
      title: title.trim(),
      variants: {
        flooring: { subject: '', preview: '', body: '' },
        lighting: { subject: '', preview: '', body: '' },
        generic: { subject: '', preview: '', body: '' }
      }
    };

    setCampaignsData(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c =>
        c.id === campaignId
          ? { ...c, emails: [...c.emails, newEmail] }
          : c
      )
    }));

    // Select the new email
    const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setCurrentEmailIndex(campaign.emails.length);
    }
  }, [campaignsData.campaigns]);

  const deleteEmail = useCallback((campaignId, emailIndex) => {
    setCampaignsData(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c =>
        c.id === campaignId
          ? { ...c, emails: c.emails.filter((_, i) => i !== emailIndex) }
          : c
      )
    }));

    // Adjust current index if needed
    if (emailIndex === currentEmailIndex) {
      setCurrentEmailIndex(Math.max(0, emailIndex - 1));
    }
  }, [currentEmailIndex]);

  const updateEmail = useCallback((campaignId, emailIndex, variant, field, value) => {
    setCampaignsData(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c =>
        c.id === campaignId
          ? {
              ...c,
              emails: c.emails.map((email, i) =>
                i === emailIndex
                  ? {
                      ...email,
                      variants: {
                        ...email.variants,
                        [variant]: {
                          ...email.variants[variant],
                          [field]: value
                        }
                      }
                    }
                  : email
              )
            }
          : c
      )
    }));
  }, []);

  const updateEmailMeta = useCallback((campaignId, emailIndex, field, value) => {
    setCampaignsData(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c =>
        c.id === campaignId
          ? {
              ...c,
              emails: c.emails.map((email, i) =>
                i === emailIndex
                  ? { ...email, [field]: field === 'day' ? parseInt(value, 10) : value }
                  : email
              )
            }
          : c
      )
    }));
  }, []);

  // Data import/export
  const importData = useCallback((jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      const validated = ensureV2Format(parsed);

      setCampaignsData(validated);

      if (validated.campaigns.length > 0) {
        setCurrentCampaignId(validated.campaigns[0].id);
        setCurrentEmailIndex(0);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(campaignsData, null, 2);
  }, [campaignsData]);

  const resetToDefaults = useCallback(() => {
    setCampaignsData(defaultCampaignsData);
    if (defaultCampaignsData.campaigns.length > 0) {
      setCurrentCampaignId(defaultCampaignsData.campaigns[0].id);
      setCurrentEmailIndex(0);
    }
  }, []);

  // Config management
  const updateConfig = useCallback((newConfig) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };

      // Persist to localStorage
      if (newConfig.gistId !== undefined) {
        localStorage.setItem(GIST_ID_KEY, newConfig.gistId);
      }
      if (newConfig.githubToken !== undefined) {
        localStorage.setItem(TOKEN_KEY, newConfig.githubToken);
      }

      return updated;
    });
  }, []);

  const value = {
    // Data
    campaignsData,
    currentCampaignId,
    currentEmailIndex,
    currentVariant,
    getCurrentCampaign,

    // Campaign actions
    selectCampaign,
    addCampaign,
    updateCampaign,
    deleteCampaign,

    // Email actions
    selectEmail,
    addEmail,
    deleteEmail,
    updateEmail,
    updateEmailMeta,
    setCurrentVariant,

    // Data actions
    importData,
    exportData,
    resetToDefaults,

    // Config
    config,
    updateConfig,

    // Status
    saveStatus,
    setSaveStatus,
    lastSaved,
    cloudSyncEnabled: !!(config.gistId && config.githubToken)
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

// Custom hook to use the campaign context
export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaignContext must be used within a CampaignProvider');
  }
  return context;
};

export default CampaignContext;
