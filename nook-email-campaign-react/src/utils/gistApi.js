/**
 * GitHub Gist API Integration
 * Handles loading and saving campaign data to GitHub Gist
 */

const GIST_FILENAME = 'nook-campaign.json';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Load campaign data from GitHub Gist
 * @param {string} gistId - The Gist ID
 * @param {string} githubToken - GitHub Personal Access Token
 * @returns {Promise<Object|null>} Campaign data or null on error
 */
export const loadFromGist = async (gistId, githubToken) => {
  if (!gistId || !githubToken) {
    console.warn('Missing gistId or githubToken');
    return null;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to load from Gist:', response.status, errorText);
      return null;
    }

    const gist = await response.json();
    const files = gist.files;

    // Read from the exact file we write to; fall back to first file for legacy gists
    const fileKey = files[GIST_FILENAME] ? GIST_FILENAME : Object.keys(files)[0];
    if (!fileKey || !files[fileKey].content) {
      console.error('No content found in Gist');
      return null;
    }

    const data = JSON.parse(files[fileKey].content);
    console.log('Successfully loaded data from Gist, file:', fileKey);
    return data;
  } catch (error) {
    console.error('Error loading from Gist:', error);
    return null;
  }
};

/**
 * Save campaign data to GitHub Gist
 * @param {string} gistId - The Gist ID
 * @param {string} githubToken - GitHub Personal Access Token
 * @param {Object} data - Campaign data to save
 * @returns {Promise<boolean>} true if successful, false otherwise
 */
export const saveToGist = async (gistId, githubToken, data) => {
  if (!gistId || !githubToken) {
    console.warn('Missing gistId or githubToken');
    return false;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to save to Gist:', response.status, errorText);
      return false;
    }

    console.log('Successfully saved data to Gist');
    return true;
  } catch (error) {
    console.error('Error saving to Gist:', error);
    return false;
  }
};
