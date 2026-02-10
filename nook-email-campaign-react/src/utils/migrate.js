/**
 * Data Migration Utilities
 * Handles migration from v1 (flat array) to v2 (nested campaigns) format
 */

/**
 * Migrates v1 format data to v2 format
 * @param {Array} v1Data - Flat array of emails
 * @returns {Object} v2 format data with campaigns structure
 */
export const migrateFromV1 = (v1Data) => {
  if (!Array.isArray(v1Data)) {
    console.warn('Invalid v1 data format, returning default structure');
    return {
      version: '2.0',
      campaigns: []
    };
  }

  const now = new Date().toISOString();

  return {
    version: '2.0',
    campaigns: [
      {
        id: 'campaign-migrated',
        name: 'Migrated Campaign',
        description: 'Campaign migrated from v1 format',
        createdAt: now,
        emails: v1Data
      }
    ]
  };
};

/**
 * Validates if data is in v2 format
 * @param {*} data - Data to validate
 * @returns {boolean} true if valid v2 format
 */
export const isV2Format = (data) => {
  return (
    data &&
    typeof data === 'object' &&
    data.version === '2.0' &&
    Array.isArray(data.campaigns)
  );
};

/**
 * Validates if data is in v1 format
 * @param {*} data - Data to validate
 * @returns {boolean} true if valid v1 format
 */
export const isV1Format = (data) => {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data[0].hasOwnProperty('day') &&
    data[0].hasOwnProperty('variants')
  );
};

/**
 * Auto-detects format and migrates if needed
 * @param {*} data - Data to process
 * @returns {Object} v2 format data
 */
export const ensureV2Format = (data) => {
  if (isV2Format(data)) {
    return data;
  }

  if (isV1Format(data)) {
    console.log('Detected v1 format, migrating to v2');
    return migrateFromV1(data);
  }

  console.warn('Unknown data format, returning default structure');
  return {
    version: '2.0',
    campaigns: []
  };
};
