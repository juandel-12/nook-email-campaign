import React, { useState } from 'react';
import Modal from './Modal';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Button from './Button';
import { useCampaignContext } from '../contexts/CampaignContext';
import { testConnection } from '../utils/activeCampaignApi';
import { PREDEFINED_TEMPLATES } from '../utils/emailTemplate';
import { X } from 'lucide-react';
import styles from './SetupModal.module.css';

const SetupModal = ({ isOpen, onClose, onExport, onImport }) => {
  const { config, updateConfig } = useCampaignContext();
  const [activeTab, setActiveTab] = useState('general');
  const [gistId, setGistId] = useState(config.gistId || '');
  const [token, setToken] = useState(config.githubToken || '');
  const [acProxyUrl, setAcProxyUrl] = useState(config.acProxyUrl || '');
  const [acApiUrl, setAcApiUrl] = useState(config.acApiUrl || '');
  const [acApiKey, setAcApiKey] = useState(config.acApiKey || '');
  const [acTestStatus, setAcTestStatus] = useState(null);

  // Template management state
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateHtml, setNewTemplateHtml] = useState('');
  const [templateError, setTemplateError] = useState('');

  const handleSave = () => {
    updateConfig({
      gistId: gistId.trim(),
      githubToken: token.trim(),
      acProxyUrl: acProxyUrl.trim().replace(/\/+$/, ''),
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

  const handleAddTemplate = () => {
    const name = newTemplateName.trim();
    const html = newTemplateHtml.trim();

    if (!name) {
      setTemplateError('Please enter a template name.');
      return;
    }
    if (!html) {
      setTemplateError('Please enter the HTML content.');
      return;
    }

    const newTemplate = {
      id: `custom-${Date.now()}`,
      name,
      html
    };

    const updated = [...(config.customTemplates || []), newTemplate];
    updateConfig({ customTemplates: updated });
    setNewTemplateName('');
    setNewTemplateHtml('');
    setTemplateError('');
  };

  const handleDeleteTemplate = (templateId) => {
    const updated = (config.customTemplates || []).filter(t => t.id !== templateId);
    updateConfig({ customTemplates: updated });

    // If the deleted template was the active one, switch to the default
    const deleted = (config.customTemplates || []).find(t => t.id === templateId);
    if (deleted && config.htmlTemplate === deleted.html) {
      updateConfig({ customTemplates: updated, htmlTemplate: PREDEFINED_TEMPLATES[0].html });
    }
  };

  const handleTemplateFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewTemplateHtml(event.target.result);
      setTemplateError('');
    };
    reader.onerror = () => setTemplateError('Failed to read file');
    reader.readAsText(file);
  };

  const tabClass = (tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-primary text-foreground'
        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
    }`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" width="650px">
      <div className={styles.setupModal}>
        {/* Tab bar */}
        <div className="flex border-b border-border mb-6 -mt-2">
          <button type="button" className={tabClass('general')} onClick={() => setActiveTab('general')}>
            General
          </button>
          <button type="button" className={tabClass('templates')} onClick={() => setActiveTab('templates')}>
            Templates
          </button>
        </div>

        {activeTab === 'general' && (
          <>
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

            <hr className="my-6 border-border" />

            {/* Data Management Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Data Management
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export your campaign data as JSON or import from a file.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onExport}
                  className="text-sm px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Download JSON
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); onImport(); }}
                  className="text-sm px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Import JSON
                </button>
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
          </>
        )}

        {activeTab === 'templates' && (
          <>
            {/* Built-in templates */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Built-in Templates
              </h3>
              <div className="space-y-2">
                {PREDEFINED_TEMPLATES.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-6 border-border" />

            {/* Custom templates */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Custom Templates
              </h3>

              {(config.customTemplates || []).length === 0 ? (
                <p className="text-sm text-muted-foreground mb-4">No custom templates yet. Add one below.</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {(config.customTemplates || []).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-md border border-border">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.html.slice(0, 80)}...</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(t.id)}
                        className="ml-3 flex-shrink-0 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Remove template"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="my-6 border-border" />

            {/* Add new template */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Add New Template
              </h3>
              <div className="space-y-4">
                <div className="grid w-full gap-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => { setNewTemplateName(e.target.value); setTemplateError(''); }}
                    placeholder="e.g., Holiday Promo"
                  />
                </div>

                <div className="grid w-full gap-2">
                  <Label>HTML Content</Label>
                  <div className="flex items-center gap-3 mb-2">
                    <label className="text-sm px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                      Upload HTML File
                      <input
                        type="file"
                        accept=".html,.htm,text/html"
                        onChange={handleTemplateFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-muted-foreground italic">or paste below</span>
                  </div>
                  <textarea
                    value={newTemplateHtml}
                    onChange={(e) => { setNewTemplateHtml(e.target.value); setTemplateError(''); }}
                    placeholder="Paste your HTML email template here... Use {{PREVIEW_TEXT}}, {{EMAIL_BODY}}, and {{IMAGE_URL}} as placeholders."
                    className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use placeholders: <code>{'{{PREVIEW_TEXT}}'}</code>, <code>{'{{EMAIL_BODY}}'}</code>, <code>{'{{IMAGE_URL}}'}</code>
                  </p>
                </div>

                {templateError && (
                  <p className="text-sm text-destructive">{templateError}</p>
                )}

                <button
                  type="button"
                  onClick={handleAddTemplate}
                  className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Add Template
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SetupModal;
