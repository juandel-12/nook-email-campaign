/**
 * useGistSync Hook
 * Handles automatic synchronization with GitHub Gist
 */

import { useEffect, useRef, useCallback } from 'react';
import { loadFromGist, saveToGist } from '../utils/gistApi';
import { useDebounce } from './useDebounce';

export const useGistSync = (campaignsData, config, setSaveStatus, importData) => {
  const isInitialMount = useRef(true);

  // Debounce the campaigns data to avoid too frequent saves
  const debouncedData = useDebounce(campaignsData, config.saveDebounce);

  // Load from Gist on mount (if configured)
  useEffect(() => {
    const loadInitialData = async () => {
      if (!config.gistId || !config.githubToken) {
        console.log('No Gist credentials configured, skipping cloud load');
        return;
      }

      console.log('Loading initial data from Gist...');
      const data = await loadFromGist(config.gistId, config.githubToken);

      if (data) {
        // Only import if we got valid data
        const success = importData(data);
        if (success) {
          console.log('Successfully loaded cloud data on init');
        }
      } else {
        console.log('Could not load from Gist, using local data');
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Save to Gist whenever debounced data changes (except on initial mount)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if no credentials
    if (!config.gistId || !config.githubToken) {
      return;
    }

    // Skip if no campaigns
    if (!debouncedData.campaigns || debouncedData.campaigns.length === 0) {
      return;
    }

    const syncToGist = async () => {
      setSaveStatus('saving');

      const success = await saveToGist(
        config.gistId,
        config.githubToken,
        debouncedData
      );

      if (success) {
        setSaveStatus('saved');
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        // Reset to idle after 5 seconds
        setTimeout(() => setSaveStatus('idle'), 5000);
      }
    };

    syncToGist();
  }, [debouncedData, config.gistId, config.githubToken, setSaveStatus]);

  // Manual sync function (for forcing a save)
  const manualSync = useCallback(async () => {
    if (!config.gistId || !config.githubToken) {
      console.warn('No Gist credentials configured');
      return false;
    }

    setSaveStatus('saving');

    const success = await saveToGist(
      config.gistId,
      config.githubToken,
      campaignsData
    );

    if (success) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }

    return success;
  }, [campaignsData, config.gistId, config.githubToken, setSaveStatus]);

  // Manual load function
  const manualLoad = useCallback(async () => {
    if (!config.gistId || !config.githubToken) {
      console.warn('No Gist credentials configured');
      return false;
    }

    const data = await loadFromGist(config.gistId, config.githubToken);

    if (data) {
      return importData(data);
    }

    return false;
  }, [config.gistId, config.githubToken, importData]);

  return {
    manualSync,
    manualLoad
  };
};

export default useGistSync;
