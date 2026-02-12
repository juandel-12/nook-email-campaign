/**
 * useGistSync Hook
 * Handles automatic synchronization with GitHub Gist
 * Shows a conflict dialog when cloud and local data differ on load
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { loadFromGist, saveToGist } from '../utils/gistApi';
import { useDebounce } from './useDebounce';

// Compare two campaign data objects to detect meaningful differences
const dataHasChanged = (local, cloud) => {
  if (!local || !cloud) return true;
  return JSON.stringify(local) !== JSON.stringify(cloud);
};

export const useGistSync = (campaignsData, config, setSaveStatus, importData) => {
  const isInitialMount = useRef(true);
  const conflictResolved = useRef(false);

  // Conflict state: holds cloud data while waiting for user decision
  const [syncConflict, setSyncConflict] = useState(null); // null | { cloudData }

  // Debounce the campaigns data to avoid too frequent saves
  const debouncedData = useDebounce(campaignsData, config.saveDebounce);

  // Load from Gist on mount (if configured) — detect conflicts instead of auto-importing
  useEffect(() => {
    const loadInitialData = async () => {
      if (!config.gistId || !config.githubToken) {
        console.log('No Gist credentials configured, skipping cloud load');
        conflictResolved.current = true;
        return;
      }

      console.log('Loading initial data from Gist...');
      const cloudData = await loadFromGist(config.gistId, config.githubToken);

      if (cloudData) {
        // Check if cloud data differs from local data
        if (dataHasChanged(campaignsData, cloudData)) {
          console.log('Cloud data differs from local — asking user to resolve');
          setSyncConflict({ cloudData });
        } else {
          console.log('Cloud and local data are identical — no conflict');
          conflictResolved.current = true;
        }
      } else {
        console.log('Could not load from Gist, using local data');
        conflictResolved.current = true;
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // User chose to keep local data (overwrite cloud on next auto-save)
  const resolveKeepLocal = useCallback(() => {
    console.log('User chose: Keep Local — cloud will be updated on next auto-save');
    setSyncConflict(null);
    conflictResolved.current = true;
  }, []);

  // User chose to use cloud data (replace local)
  const resolveUseCloud = useCallback(() => {
    if (syncConflict?.cloudData) {
      console.log('User chose: Use Cloud — replacing local data');
      importData(syncConflict.cloudData);
    }
    setSyncConflict(null);
    conflictResolved.current = true;
  }, [syncConflict, importData]);

  // Save to Gist whenever debounced data changes (except on initial mount)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Block auto-save until the user resolves any sync conflict
    if (!conflictResolved.current) {
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
    manualLoad,
    syncConflict,
    resolveKeepLocal,
    resolveUseCloud
  };
};

export default useGistSync;
