/**
 * useGistSync Hook
 * Handles automatic synchronization with GitHub Gist
 * Cloud-first: automatically loads cloud data on mount and overwrites local
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { loadFromGist, saveToGist } from '../utils/gistApi';
import { useDebounce } from './useDebounce';

export const useGistSync = (campaignsData, config, setSaveStatus, importData) => {
  const lastCloudHash = useRef(null);
  const conflictResolved = useRef(false);
  const skipNextSave = useRef(false);

  // Conflict state: holds cloud data while waiting for user decision
  const [syncConflict, setSyncConflict] = useState(null); // null | { cloudData }

  // Loading state: true while fetching cloud data on mount
  const [isLoading, setIsLoading] = useState(!!(config.gistId && config.githubToken));

  // Debounce the campaigns data to avoid too frequent saves
  const debouncedData = useDebounce(campaignsData, config.saveDebounce);

  // Helper: fetch cloud data and return its hash for consistent comparison
  const getCloudHash = useCallback(async () => {
    const data = await loadFromGist(config.gistId, config.githubToken);
    if (data) {
      return { data, hash: JSON.stringify(data) };
    }
    return { data: null, hash: null };
  }, [config.gistId, config.githubToken]);

  // Load from Gist on mount — cloud-first: silently overwrite local with cloud data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!config.gistId || !config.githubToken) {
        conflictResolved.current = true;
        setIsLoading(false);
        return;
      }

      console.log('[sync] Loading from Gist on mount...');
      const { data: cloudData, hash: cloudHash } = await getCloudHash();

      if (cloudData) {
        console.log('[sync] Cloud data loaded, overwriting local');
        importData(cloudData);
        lastCloudHash.current = cloudHash;
        // Skip the next auto-save since we just imported cloud data (nothing changed)
        skipNextSave.current = true;
      } else {
        console.log('[sync] Cloud load failed, using local data');
      }

      conflictResolved.current = true;
      setIsLoading(false);
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // User chose to keep local data (overwrite cloud)
  const resolveKeepLocal = useCallback(async () => {
    console.log('[sync] Conflict resolved: Keep Local');
    setSyncConflict(null);

    // Force save local data to cloud
    setSaveStatus('saving');
    const success = await saveToGist(config.gistId, config.githubToken, campaignsData);
    if (success) {
      const { hash } = await getCloudHash();
      lastCloudHash.current = hash;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }

    conflictResolved.current = true;
  }, [campaignsData, config.gistId, config.githubToken, setSaveStatus, getCloudHash]);

  // User chose to use cloud data (replace local)
  const resolveUseCloud = useCallback(() => {
    if (syncConflict?.cloudData) {
      console.log('[sync] Conflict resolved: Use Cloud');
      importData(syncConflict.cloudData);
      lastCloudHash.current = JSON.stringify(syncConflict.cloudData);
      // Skip the next auto-save since we just imported cloud data
      skipNextSave.current = true;
    }
    setSyncConflict(null);
    conflictResolved.current = true;
  }, [syncConflict, importData]);

  // Save to Gist whenever debounced data changes
  useEffect(() => {
    // Block auto-save until initial cloud load is resolved
    if (!conflictResolved.current) return;

    // Skip if no credentials
    if (!config.gistId || !config.githubToken) return;

    // Skip if no campaigns
    if (!debouncedData.campaigns || debouncedData.campaigns.length === 0) return;

    // Skip one save after cloud import (data hasn't actually changed)
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    const syncToGist = async () => {
      // Pre-save conflict check: fetch current cloud data
      const { data: currentCloudData, hash: cloudHash } = await getCloudHash();

      if (currentCloudData && lastCloudHash.current) {
        // If cloud changed since our last load/save, we have a conflict
        if (cloudHash !== lastCloudHash.current) {
          console.log('[sync] Conflict detected — cloud changed since last sync');
          setSyncConflict({ cloudData: currentCloudData });
          conflictResolved.current = false;
          return;
        }
      }

      setSaveStatus('saving');

      const success = await saveToGist(
        config.gistId,
        config.githubToken,
        debouncedData
      );

      if (success) {
        // Re-fetch to get canonical cloud hash (avoids serialization mismatches)
        const { hash: newHash } = await getCloudHash();
        lastCloudHash.current = newHash || JSON.stringify(debouncedData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 5000);
      }
    };

    syncToGist();
  }, [debouncedData, config.gistId, config.githubToken, setSaveStatus, getCloudHash]);

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
      const { hash } = await getCloudHash();
      lastCloudHash.current = hash || JSON.stringify(campaignsData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }

    return success;
  }, [campaignsData, config.gistId, config.githubToken, setSaveStatus, getCloudHash]);

  // Manual load function
  const manualLoad = useCallback(async () => {
    if (!config.gistId || !config.githubToken) {
      console.warn('No Gist credentials configured');
      return false;
    }

    const { data, hash } = await getCloudHash();

    if (data) {
      lastCloudHash.current = hash;
      skipNextSave.current = true;
      return importData(data);
    }

    return false;
  }, [config.gistId, config.githubToken, importData, getCloudHash]);

  return {
    manualSync,
    manualLoad,
    syncConflict,
    resolveKeepLocal,
    resolveUseCloud,
    isLoading,
  };
};

export default useGistSync;
