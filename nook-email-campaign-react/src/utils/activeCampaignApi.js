/**
 * ActiveCampaign API Integration
 * Handles creating and updating email messages in ActiveCampaign
 *
 * API v3 Reference: https://developers.activecampaign.com/reference/overview
 *
 * Why a proxy? ActiveCampaign's API does not support CORS, so browser-to-AC
 * requests fail. All calls are routed through a Cloudflare Worker proxy
 * (see /cloudflare-worker/worker.js) that forwards requests and adds CORS headers.
 *
 * Why only messages? The AC API does not support creating full automations
 * (triggers, wait steps, conditions). We push email content as messages,
 * then the user wires them into automation steps manually in the AC UI.
 */

/**
 * Build the full AC API URL for a given endpoint
 * @param {string} acApiUrl - The account URL (e.g., "https://yourname.api-us1.com")
 * @param {string} endpoint - API endpoint (e.g., "/messages")
 * @returns {string} Full API URL
 */
const getFullUrl = (acApiUrl, endpoint) => {
  const url = acApiUrl.replace(/\/+$/, '');
  return `${url}/api/3${endpoint}`;
};

/**
 * Make an authenticated request to ActiveCampaign via the CORS proxy
 *
 * All requests are POSTed to the proxy, which forwards them to AC.
 * The proxy adds CORS headers so the browser can read the response.
 *
 * @param {string} proxyUrl - Cloudflare Worker proxy URL
 * @param {string} acApiUrl - Account API URL
 * @param {string} acApiKey - API key
 * @param {string} endpoint - API endpoint (e.g., "/messages")
 * @param {object} options - Request options { method, body }
 * @returns {Promise<object>} Response JSON or error object
 */
const acFetch = async (proxyUrl, acApiUrl, acApiKey, endpoint, options = {}) => {
  const targetUrl = getFullUrl(acApiUrl, endpoint);

  // Parse body — if it's a string, parse it so we send a clean object to the proxy
  let bodyObj = null;
  if (options.body) {
    bodyObj = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  }

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        acUrl: targetUrl,
        acApiKey: acApiKey,
        method: options.method || 'GET',
        body: bodyObj
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ActiveCampaign API error [${response.status}]:`, errorText);
      return { error: true, status: response.status, message: errorText };
    }

    return await response.json();
  } catch (error) {
    console.error('ActiveCampaign API request failed:', error);
    return { error: true, status: 0, message: error.message };
  }
};

/**
 * Test the ActiveCampaign API connection with the provided credentials
 * @param {string} proxyUrl - CORS proxy URL
 * @param {string} acApiUrl - Account API URL
 * @param {string} acApiKey - API key
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testConnection = async (proxyUrl, acApiUrl, acApiKey) => {
  if (!proxyUrl) {
    return { success: false, message: 'Missing proxy URL. Deploy the Cloudflare Worker first.' };
  }
  if (!acApiUrl || !acApiKey) {
    return { success: false, message: 'Missing API URL or API key' };
  }

  const result = await acFetch(proxyUrl, acApiUrl, acApiKey, '/users/me', { method: 'GET' });

  if (result?.error) {
    if (result.status === 401 || result.status === 403) {
      return { success: false, message: 'Invalid API key. Check your credentials.' };
    }
    return { success: false, message: `Connection failed: ${result.message}` };
  }

  if (result?.user) {
    return { success: true, message: `Connected as ${result.user.firstName} ${result.user.lastName}` };
  }

  return { success: false, message: 'Unexpected response from ActiveCampaign' };
};

/**
 * Create a new message in ActiveCampaign
 * @param {string} proxyUrl - CORS proxy URL
 * @param {string} acApiUrl - Account API URL
 * @param {string} acApiKey - API key
 * @param {object} params - Message parameters
 * @param {string} params.subject - Email subject line
 * @param {string} params.preheaderText - Preview/preheader text
 * @param {string} params.htmlBody - Full HTML email body
 * @param {string} params.name - Internal message name
 * @param {string} [params.fromEmail] - From email address
 * @param {string} [params.fromName] - From name
 * @returns {Promise<{success: boolean, messageId: string|null, error: string|null}>}
 */
export const createMessage = async (proxyUrl, acApiUrl, acApiKey, params) => {
  const { subject, preheaderText, htmlBody, name, fromEmail, fromName } = params;

  const payload = {
    message: {
      subject,
      preheader_text: preheaderText || '',
      html: htmlBody,
      ...(fromEmail && { fromemail: fromEmail }),
      ...(fromName && { fromname: fromName }),
      format: 'mime'
    }
  };

  const result = await acFetch(proxyUrl, acApiUrl, acApiKey, '/messages', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (result?.error) {
    return { success: false, messageId: null, error: result.message };
  }

  if (result?.message?.id) {
    console.log(`Created AC message "${name}" with ID: ${result.message.id}`);
    return { success: true, messageId: String(result.message.id), error: null };
  }

  return { success: false, messageId: null, error: 'Unexpected response structure' };
};

/**
 * Update an existing message in ActiveCampaign
 * @param {string} proxyUrl - CORS proxy URL
 * @param {string} acApiUrl - Account API URL
 * @param {string} acApiKey - API key
 * @param {string} messageId - Existing AC message ID
 * @param {object} params - Updated message parameters
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const updateMessage = async (proxyUrl, acApiUrl, acApiKey, messageId, params) => {
  const { subject, preheaderText, htmlBody, fromEmail, fromName } = params;

  const payload = {
    message: {
      subject,
      preheader_text: preheaderText || '',
      html: htmlBody,
      ...(fromEmail && { fromemail: fromEmail }),
      ...(fromName && { fromname: fromName }),
      format: 'mime'
    }
  };

  const result = await acFetch(proxyUrl, acApiUrl, acApiKey, `/messages/${messageId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  if (result?.error) {
    return { success: false, error: result.message };
  }

  if (result?.message?.id) {
    console.log(`Updated AC message ID: ${messageId}`);
    return { success: true, error: null };
  }

  return { success: false, error: 'Unexpected response structure' };
};

/**
 * Get a message by ID to verify it still exists
 * @param {string} proxyUrl - CORS proxy URL
 * @param {string} acApiUrl - Account API URL
 * @param {string} acApiKey - API key
 * @param {string} messageId - AC message ID
 * @returns {Promise<{exists: boolean, message: object|null}>}
 */
export const getMessage = async (proxyUrl, acApiUrl, acApiKey, messageId) => {
  const result = await acFetch(proxyUrl, acApiUrl, acApiKey, `/messages/${messageId}`, {
    method: 'GET'
  });

  if (result?.error) {
    return { exists: false, message: null };
  }

  if (result?.message?.id) {
    return { exists: true, message: result.message };
  }

  return { exists: false, message: null };
};

/**
 * Push a single email variant to ActiveCampaign
 * Creates a new message or updates an existing one based on stored message ID
 *
 * @param {string} proxyUrl - CORS proxy URL
 * @param {string} acApiUrl - Account API URL
 * @param {string} acApiKey - API key
 * @param {object} emailData - Email object from campaign data
 * @param {string} variant - Variant key ('flooring', 'lighting', 'generic')
 * @param {string} htmlTemplate - Full HTML email template with placeholders
 * @param {string} campaignName - Campaign name for labeling
 * @returns {Promise<{success: boolean, messageId: string|null, action: 'created'|'updated'|null, error: string|null}>}
 */
export const pushEmailVariant = async (proxyUrl, acApiUrl, acApiKey, emailData, variant, htmlTemplate, campaignName) => {
  const variantData = emailData.variants[variant];
  if (!variantData) {
    return { success: false, messageId: null, action: null, error: `Variant "${variant}" not found` };
  }

  // Build the full HTML email by substituting placeholders in the template
  let fullHtml = htmlTemplate;
  fullHtml = fullHtml.replace(/\{\{PREVIEW_TEXT\}\}/g, variantData.preview || '');
  // Convert newlines to <br> for the body, preserving existing HTML
  const bodyWithBreaks = (variantData.body || '').replace(/\n/g, '<br>');
  fullHtml = fullHtml.replace(/\{\{EMAIL_BODY\}\}/g, bodyWithBreaks);

  const messageName = `${campaignName} - Day ${emailData.day} - ${variant.charAt(0).toUpperCase() + variant.slice(1)} - ${emailData.title}`;

  const messageParams = {
    subject: variantData.subject || '(No subject)',
    preheaderText: variantData.preview || '',
    htmlBody: fullHtml,
    name: messageName
  };

  // Check if we already have an AC message ID for this variant
  const existingId = variantData.acMessageId;

  if (existingId) {
    // Verify the message still exists in AC before updating
    const { exists } = await getMessage(proxyUrl, acApiUrl, acApiKey, existingId);

    if (exists) {
      const result = await updateMessage(proxyUrl, acApiUrl, acApiKey, existingId, messageParams);
      return {
        success: result.success,
        messageId: existingId,
        action: result.success ? 'updated' : null,
        error: result.error
      };
    }

    // Message was deleted in AC, create a new one
    console.warn(`AC message ${existingId} no longer exists, creating new one`);
  }

  // Create a new message
  const result = await createMessage(proxyUrl, acApiUrl, acApiKey, messageParams);
  return {
    success: result.success,
    messageId: result.messageId,
    action: result.success ? 'created' : null,
    error: result.error
  };
};

/**
 * Push all emails in a campaign for a specific variant to ActiveCampaign
 * @param {string} proxyUrl - CORS proxy URL
 * @param {string} acApiUrl - Account API URL
 * @param {string} acApiKey - API key
 * @param {object} campaign - Full campaign object
 * @param {string} variant - Variant to push
 * @param {string} htmlTemplate - HTML email template
 * @returns {Promise<{results: Array, successCount: number, errorCount: number}>}
 */
export const pushCampaignVariant = async (proxyUrl, acApiUrl, acApiKey, campaign, variant, htmlTemplate) => {
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const email of campaign.emails) {
    const result = await pushEmailVariant(
      proxyUrl, acApiUrl, acApiKey, email, variant, htmlTemplate, campaign.name
    );

    results.push({
      emailDay: email.day,
      emailTitle: email.title,
      ...result
    });

    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  return { results, successCount, errorCount };
};
