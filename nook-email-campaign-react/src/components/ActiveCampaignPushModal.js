import React, { useState } from 'react';
import Modal from './Modal';
import { Label } from './ui/label';
import Button from './Button';
import { Badge } from './ui/badge';
import { useCampaignContext } from '../contexts/CampaignContext';
import { pushEmailVariant, pushCampaignVariant } from '../utils/activeCampaignApi';

/**
 * ActiveCampaign Push Modal
 *
 * Two modes:
 * 1. "bulk" — Push all emails in a campaign for a selected variant
 * 2. "single" — Push a single email's current variant
 */
const ActiveCampaignPushModal = ({ isOpen, onClose, mode = 'bulk', emailIndex = null }) => {
  const {
    currentCampaignId,
    currentVariant,
    config,
    setAcMessageId,
    getCurrentCampaign
  } = useCampaignContext();

  const [selectedVariant, setSelectedVariant] = useState(currentVariant || 'flooring');
  const [pushStatus, setPushStatus] = useState('idle'); // 'idle' | 'pushing' | 'done'
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);

  const campaign = getCurrentCampaign();
  const variants = ['flooring', 'lighting', 'generic'];

  // Build the full proxy endpoint URL from the stored base URL
  const proxyEndpoint = config.acProxyUrl
    ? config.acProxyUrl.replace(/\/+$/, '') + '/proxy'
    : '';

  const handlePush = async () => {
    if (!proxyEndpoint || !config.acApiUrl || !config.acApiKey) {
      alert('Please configure your ActiveCampaign credentials and proxy URL in Settings first.');
      return;
    }

    if (!campaign) {
      alert('No campaign selected.');
      return;
    }

    setPushStatus('pushing');
    setResults([]);
    setSummary(null);

    const variant = mode === 'single' ? currentVariant : selectedVariant;

    if (mode === 'single' && emailIndex !== null) {
      // Push a single email
      const email = campaign.emails[emailIndex];
      if (!email) {
        setPushStatus('idle');
        return;
      }

      const result = await pushEmailVariant(
        proxyEndpoint,
        config.acApiUrl,
        config.acApiKey,
        email,
        variant,
        config.htmlTemplate,
        campaign.name
      );

      // Store the message ID back in the campaign data
      if (result.success && result.messageId) {
        setAcMessageId(currentCampaignId, emailIndex, variant, result.messageId);
      }

      setResults([{
        emailDay: email.day,
        emailTitle: email.title,
        ...result
      }]);
      setSummary({
        successCount: result.success ? 1 : 0,
        errorCount: result.success ? 0 : 1,
        total: 1
      });
    } else {
      // Bulk push all emails in the campaign
      const { results: pushResults, successCount, errorCount } = await pushCampaignVariant(
        proxyEndpoint,
        config.acApiUrl,
        config.acApiKey,
        campaign,
        variant,
        config.htmlTemplate
      );

      // Store message IDs for all successful pushes
      pushResults.forEach((result, idx) => {
        if (result.success && result.messageId) {
          setAcMessageId(currentCampaignId, idx, variant, result.messageId);
        }
      });

      setResults(pushResults);
      setSummary({
        successCount,
        errorCount,
        total: campaign.emails.length
      });
    }

    setPushStatus('done');
  };

  const handleClose = () => {
    // Reset state on close
    setPushStatus('idle');
    setResults([]);
    setSummary(null);
    onClose();
  };

  const singleEmail = mode === 'single' && emailIndex !== null ? campaign?.emails[emailIndex] : null;
  const isConfigured = !!(proxyEndpoint && config.acApiUrl && config.acApiKey);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'single' ? 'Push Email to ActiveCampaign' : 'Push to ActiveCampaign'}
      width="550px"
    >
      <div className="space-y-5">
        {/* Campaign info */}
        <div className="text-sm text-muted-foreground">
          {mode === 'single' ? (
            <p>
              Push <strong>Day {singleEmail?.day}: {singleEmail?.title}</strong> ({currentVariant}) to ActiveCampaign.
            </p>
          ) : (
            <p>
              Push all <strong>{campaign?.emails.length || 0}</strong> emails in <strong>{campaign?.name}</strong> to ActiveCampaign for the selected variant.
            </p>
          )}
        </div>

        {/* Variant selector (bulk mode only) */}
        {mode === 'bulk' && pushStatus === 'idle' && (
          <div className="space-y-2">
            <Label>Select Variant</Label>
            <div className="flex gap-2">
              {variants.map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                    selectedVariant === v
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Email preview list (bulk mode) */}
        {mode === 'bulk' && pushStatus === 'idle' && campaign && (
          <div className="space-y-2">
            <Label>Emails to push</Label>
            <div className="max-h-48 overflow-y-auto border border-border rounded-md divide-y divide-border">
              {campaign.emails
                .slice()
                .sort((a, b) => a.day - b.day)
                .map((email, idx) => {
                  const variantData = email.variants[selectedVariant];
                  const hasExistingId = !!variantData?.acMessageId;
                  return (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <span className="text-muted-foreground w-10 flex-shrink-0">Day {email.day}</span>
                      <span className="flex-1 truncate">{email.title}</span>
                      {hasExistingId ? (
                        <Badge variant="secondary" className="text-xs flex-shrink-0">Update</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs flex-shrink-0">New</Badge>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Push progress / results */}
        {pushStatus === 'pushing' && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-sm text-muted-foreground">Pushing to ActiveCampaign...</p>
            </div>
          </div>
        )}

        {pushStatus === 'done' && summary && (
          <div className="space-y-3">
            {/* Summary */}
            <div className={`p-3 rounded-md text-sm ${
              summary.errorCount === 0
                ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : summary.successCount === 0
                  ? 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  : 'bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
            }`}>
              {summary.errorCount === 0
                ? `All ${summary.total} email(s) pushed successfully!`
                : summary.successCount === 0
                  ? `Failed to push ${summary.total} email(s).`
                  : `${summary.successCount} of ${summary.total} email(s) pushed. ${summary.errorCount} failed.`
              }
            </div>

            {/* Detailed results */}
            <div className="max-h-48 overflow-y-auto border border-border rounded-md divide-y divide-border">
              {results.map((result, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 text-sm">
                  <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full text-xs ${
                    result.success
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}>
                    {result.success ? '\u2713' : '\u2717'}
                  </span>
                  <span className="text-muted-foreground w-10 flex-shrink-0">Day {result.emailDay}</span>
                  <span className="flex-1 truncate">{result.emailTitle}</span>
                  {result.success && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {result.action === 'created' ? 'Created' : 'Updated'}
                    </Badge>
                  )}
                  {!result.success && (
                    <span className="text-xs text-red-600 dark:text-red-400 truncate max-w-[120px]" title={result.error}>
                      {result.error}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          {pushStatus === 'done' ? (
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePush}
                disabled={pushStatus === 'pushing' || !isConfigured}
              >
                {!isConfigured
                  ? 'Configure AC First'
                  : mode === 'single'
                    ? 'Push Email'
                    : `Push ${campaign?.emails.length || 0} Emails`
                }
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ActiveCampaignPushModal;
