import React, { useState } from 'react';
import Modal from './Modal';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Button from './Button';
import { useCampaignContext } from '../contexts/CampaignContext';
import { testConnection } from '../utils/activeCampaignApi';
import styles from './SetupModal.module.css';

const SetupModal = ({ isOpen, onClose }) => {
  const { config, updateConfig } = useCampaignContext();
  const [gistId, setGistId] = useState(config.gistId || '');
  const [token, setToken] = useState(config.githubToken || '');
  const [acProxyUrl, setAcProxyUrl] = useState(config.acProxyUrl || '');
  const [acApiUrl, setAcApiUrl] = useState(config.acApiUrl || '');
  const [acApiKey, setAcApiKey] = useState(config.acApiKey || '');
  const [acTestStatus, setAcTestStatus] = useState(null); // null | 'testing' | { success, message }

  const handleSave = () => {
    updateConfig({
      gistId: gistId.trim(),
      githubToken: token.trim(),
      acProxyUrl: acProxyUrl.trim().replace(/\/+$/, ''), // strip trailing slash
      acApiUrl: acApiUrl.trim(),
      acApiKey: acApiKey.trim()
    });
    onClose();
  };

  const handleTestAcConnection = async () => {
    setAcTestStatus('testing');
    const proxyEndpoint = acProxyUrl.trim().replace(/\/+$/, '') + '/proxy';
    const result = await testConnection(proxyEndpoint, acApiUrl.trim(), acApiKey.trim());
    setAcTestStatus(result);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" width="650px">
      <div className={styles.setupModal}>
        {/* GitHub Gist Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Cloud Sync (GitHub Gist)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sync campaign data across your team via a private GitHub Gist.
          </p>

          <div className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="gist-id">GitHub Gist ID</Label>
              <Input
                id="gist-id"
                type="text"
                value={gistId}
                onChange={(e) => setGistId(e.target.value)}
                placeholder="abc123def456..."
              />
              <p className="text-sm text-muted-foreground">
                Create a private Gist on GitHub and paste its ID here
              </p>
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="github-token">GitHub Personal Access Token</Label>
              <Input
                id="github-token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
              />
              <p className="text-sm text-muted-foreground">
                Create a token with 'gist' scope at github.com/settings/tokens
              </p>
            </div>
          </div>
        </div>

        <hr className="my-6 border-border" />

        {/* ActiveCampaign Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            ActiveCampaign Integration
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Push email content directly to ActiveCampaign as messages. Requires a CORS proxy (Cloudflare Worker).
          </p>

          <div className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="ac-proxy-url">CORS Proxy URL</Label>
              <Input
                id="ac-proxy-url"
                type="text"
                value={acProxyUrl}
                onChange={(e) => setAcProxyUrl(e.target.value)}
                placeholder="https://nook-ac-proxy.your-subdomain.workers.dev"
              />
              <p className="text-sm text-muted-foreground">
                Your deployed Cloudflare Worker URL (see setup instructions below)
              </p>
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="ac-api-url">ActiveCampaign API URL</Label>
              <Input
                id="ac-api-url"
                type="text"
                value={acApiUrl}
                onChange={(e) => setAcApiUrl(e.target.value)}
                placeholder="https://yourname.api-us1.com"
              />
              <p className="text-sm text-muted-foreground">
                Found in Settings &gt; Developer in your ActiveCampaign account
              </p>
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="ac-api-key">ActiveCampaign API Key</Label>
              <Input
                id="ac-api-key"
                type="password"
                value={acApiKey}
                onChange={(e) => setAcApiKey(e.target.value)}
                placeholder="Your ActiveCampaign API key"
              />
              <p className="text-sm text-muted-foreground">
                Found in Settings &gt; Developer in your ActiveCampaign account
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTestAcConnection}
                disabled={!acProxyUrl.trim() || !acApiUrl.trim() || !acApiKey.trim() || acTestStatus === 'testing'}
                className="text-sm px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {acTestStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              {acTestStatus && acTestStatus !== 'testing' && (
                <span className={`text-sm ${acTestStatus.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {acTestStatus.message}
                </span>
              )}
            </div>
          </div>
        </div>

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
            <li><strong>Cloud Sync:</strong> Go to <a href="https://gist.github.com" target="_blank" rel="noopener noreferrer">gist.github.com</a>, create a private Gist, and paste its ID + a token with <strong>gist</strong> scope.</li>
            <li><strong>ActiveCampaign Proxy:</strong> Deploy the Cloudflare Worker from the <code>cloudflare-worker/</code> folder using <code>npx wrangler deploy</code>. Paste the resulting URL above.</li>
            <li><strong>ActiveCampaign API:</strong> Go to your AC account &gt; Settings &gt; Developer, and copy the API URL and Key.</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
};

export default SetupModal;
