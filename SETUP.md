# Nook Email Campaign Editor - Setup Guide

This guide will walk you through setting up the Nook Email Campaign Editor with cloud sync for your team (2-5 people).

**Total Setup Time**: ~10-15 minutes
**Cost**: $0/month

---

## Architecture Overview

Your email campaign editor uses:
- **GitHub Pages** - Free static hosting
- **GitHub Gist** - Free cloud database (JSON storage)
- **GitHub API** - Free data synchronization

All team members share:
- One GitHub Personal Access Token (to access the Gist)
- One Gist ID (where campaign data is stored)

---

## Step 1: Create a GitHub Gist (Database)

Your Gist will store the campaign data that all team members can access.

### Instructions:

1. **Go to GitHub Gist**
   Navigate to: https://gist.github.com

2. **Create New Gist**
   - **Filename**: `nook-campaign.json`
   - **Content**: Copy the entire contents from `data/default-campaigns.json` in this repository
   - **Description** (optional): "Nook Email Campaign Data"

3. **Choose Visibility**
   - **Public Gist**: Anyone with the link can view (but can't edit without your token)
   - **Secret Gist**: Only people with the exact URL can view (recommended)

   Click "Create secret gist" or "Create public gist"

4. **Copy the Gist ID**
   - After creating, look at the URL: `https://gist.github.com/{username}/{GIST_ID}`
   - Copy the `GIST_ID` (e.g., `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
   - **Save this** - you'll need it later

---

## Step 2: Create a GitHub Personal Access Token (PAT)

The PAT allows the app to read and write to your Gist.

### Instructions:

1. **Go to GitHub Settings**
   Navigate to: https://github.com/settings/tokens

2. **Generate New Token**
   - Click "Generate new token" → "Generate new token (classic)"

3. **Configure Token**
   - **Note**: "Nook Email Campaign Editor"
   - **Expiration**: Choose "No expiration" or "1 year" (you can regenerate later)
   - **Scopes**: Check ONLY the `gist` checkbox
     - ✅ `gist` - Create gists

4. **Generate and Copy Token**
   - Click "Generate token" at the bottom
   - Copy the token (starts with `ghp_`)
   - **IMPORTANT**: Save this token somewhere safe - you can't see it again!
   - **Share with team**: All 2-5 team members will use the same token

---

## Step 3: Configure the App with Cloud Sync

Now configure your local `index.html` with the Gist credentials.

### Option A: Configure via UI (Easiest)

1. Open `index.html` in your browser locally
2. Click the "⚙️ Cloud Sync Setup" button
3. Enter:
   - **GitHub Token (PAT)**: Paste your token from Step 2
   - **Gist ID**: Paste your Gist ID from Step 1
4. Click "Save & Sync"
5. Choose whether to load data from cloud or upload your local data

### Option B: Pre-configure in Code (For deployment)

If you want to embed the Gist ID directly (token should still be entered by users):

1. Open `index.html` in a text editor
2. Find the `CONFIG` object (around line 465):
   ```javascript
   const CONFIG = {
       gistId: localStorage.getItem('gistId') || '',
       githubToken: localStorage.getItem('githubToken') || '',
       saveDebounce: 2000
   };
   ```
3. Replace with your Gist ID:
   ```javascript
   const CONFIG = {
       gistId: localStorage.getItem('gistId') || 'YOUR_GIST_ID_HERE',
       githubToken: localStorage.getItem('githubToken') || '',
       saveDebounce: 2000
   };
   ```
4. Save the file

**Note**: Do NOT hardcode the token in the HTML file - it should be entered by users for security.

---

## Step 4: Deploy to GitHub Pages

Deploy your app to GitHub Pages for free hosting.

### Instructions:

1. **Enable GitHub Pages**
   - Go to your repository: https://github.com/juandel-12/nook-email-campaign
   - Click "Settings" → "Pages" (left sidebar)
   - Under "Source", select "Deploy from a branch"
   - Select branch: `main` and folder: `/ (root)`
   - Click "Save"

2. **Commit and Push**
   ```bash
   cd /Volumes/Extreme\ SSD/Apps/nook-email-campaign

   git add index.html
   git commit -m "Deploy campaign editor

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   git push origin main
   ```

3. **Wait for Deployment**
   - GitHub Pages takes 1-2 minutes to deploy
   - Check the "Actions" tab to see build progress

4. **Access Your App**
   - URL: https://juandel-12.github.io/nook-email-campaign/
   - Share this URL with your team (2-5 people)

---

## Step 5: Share Credentials with Team

All team members need two things to access the editor:

### What to Share:

1. **App URL**
   ```
   https://juandel-12.github.io/nook-email-campaign/
   ```

2. **GitHub Credentials** (for Cloud Sync)
   - **GitHub Token (PAT)**: The `ghp_...` token from Step 2
   - **Gist ID**: The Gist ID from Step 1

### How Team Members Access:

1. Navigate to the app URL
2. Click "⚙️ Cloud Sync Setup"
3. Enter GitHub Token and Gist ID
4. Click "Save & Sync"
5. Choose to load data from cloud

**First-time setup**: Each team member only needs to configure this once. The credentials are saved in their browser.

---

## Usage & Workflow

### Daily Workflow

1. **Access the App**
   - Go to https://juandel-12.github.io/nook-email-campaign/

2. **Make Edits**
   - Click day buttons to switch between emails
   - Use tabs to switch between variants (Flooring/Lighting/Generic)
   - Edit subject, preview, and body text
   - Changes auto-save every 2 seconds

3. **Cloud Sync**
   - All edits automatically save to your browser (localStorage)
   - All edits automatically sync to GitHub Gist (cloud)
   - Status indicator shows "Saved to Cloud ✓"

4. **Team Collaboration**
   - Other team members refresh the page to see your changes
   - Last save wins (no complex merge logic)
   - Export/import JSON for backup and restore

### Conflict Resolution

If two team members edit simultaneously:
- Both edits save locally immediately
- Last person to save overwrites the Gist
- This is expected behavior for a 2-5 person team
- For critical changes, communicate with team before editing

### Backup & Restore

**Backup:**
- Click "💾 Download JSON" to export all campaign data
- Save the JSON file somewhere safe (Dropbox, Google Drive, etc.)

**Restore:**
- Click "📥 Import JSON"
- Paste the JSON content
- Click "Import"

---

## Troubleshooting

### "Failed to connect to cloud"

**Possible causes:**
1. GitHub Token is incorrect or expired
2. Gist ID is incorrect
3. GitHub Token doesn't have `gist` scope
4. Gist was deleted

**Solutions:**
1. Verify your GitHub Token at https://github.com/settings/tokens
2. Verify your Gist exists at https://gist.github.com/{username}/{GIST_ID}
3. Generate a new token with `gist` scope
4. Re-run cloud sync setup with correct credentials

### "Saved Locally ✓" instead of "Saved to Cloud ✓"

This means:
- Cloud sync is not configured, OR
- Cloud sync encountered an error

**Solution:**
- Click "⚙️ Cloud Sync Setup" and verify credentials
- Check browser console (F12) for error messages

### Changes not syncing to team members

**Solutions:**
1. Make sure all team members have the same Gist ID
2. Have team members refresh the page (Cmd+R or Ctrl+R)
3. Check the Gist directly at https://gist.github.com/{username}/{GIST_ID} to see latest data
4. Verify everyone has internet connection

### Want to change Gist or Token

**Solution:**
1. Click "⚙️ Cloud Sync Setup"
2. Enter new credentials
3. Click "Save & Sync"
4. Share new credentials with team

---

## Security Best Practices

### Token Management

1. **Keep token private** - only share with your 2-5 team members
2. **Use minimal scope** - only `gist` permission needed
3. **Rotate token** annually or if compromised
4. **Revoke old tokens** at https://github.com/settings/tokens
5. **Don't commit token** to the repository

### Gist Visibility

- **Secret Gist**: Only people with exact URL can view
- **Public Gist**: Anyone can view but can't edit without token
- Either is acceptable for a small team

---

## Updating the App

### To make changes to the editor itself:

1. **Edit index.html**
   ```bash
   # Make changes to index.html
   ```

2. **Deploy**
   ```bash
   git add index.html
   git commit -m "Update editor"
   git push origin main
   ```

---

## Support

For issues or questions:
1. Check this SETUP.md guide
2. Check the [README.md](README.md) for architecture details
3. Review GitHub Gist directly to verify data
4. Check browser console (F12) for error messages

---

## Summary Checklist

- [ ] Created GitHub Gist with campaign data
- [ ] Generated GitHub Personal Access Token (PAT) with `gist` scope
- [ ] Configured app with Gist ID and PAT
- [ ] Deployed to GitHub Pages
- [ ] Shared URL, token, and Gist ID with team
- [ ] Verified team members can access and edit
- [ ] Tested that changes sync across team

**Estimated Total Cost**: $0/month 🎉

**Estimated Setup Time**: 10-15 minutes ⚡

**Team Size**: 2-5 people 👥

**Storage Limit**: 5GB per Gist (plenty for JSON text)

**API Rate Limit**: 5,000 requests/hour (plenty for small team)

---

© 2026 Nook
