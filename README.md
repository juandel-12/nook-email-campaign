# Nook Email Campaign Editor

An interactive web-based editor for managing the Nook Watch Video Nurture email campaign (6 emails over 28 days) with **cloud sync** for team collaboration.

## Features

✨ **Auto-Save**: All changes automatically saved to browser localStorage
☁️ **Cloud Sync**: Optional GitHub Gist integration for team sharing (2-5 people)
📧 **Multiple Campaigns**: Manage multiple email campaigns with flexible email counts
🎯 **3 Variants**: Flooring, Lighting, Generic
💾 **Export/Import**: Download and restore campaign data as JSON
📋 **Copy to Clipboard**: Export all emails as formatted text
🔄 **Reset**: Restore default content anytime
💰 **$0/month**: Entirely free hosting and data storage

## Quick Start

### Local Usage (Single User)
Simply open `index.html` in your browser. No server or setup required!

### Team Usage (2-5 People with Cloud Sync)
See [SETUP.md](SETUP.md) for complete deployment instructions.

**Quick summary:**
1. Create GitHub Gist for data storage
2. Generate GitHub Personal Access Token
3. Configure cloud sync in the app
4. Deploy to GitHub Pages
5. Share credentials with team

**Live URL**: https://juandel-12.github.io/nook-email-campaign/

## How to Use

### Basic Editing
1. **Navigate**: Click day buttons to switch between emails
2. **Edit Variants**: Use tabs to switch between Flooring/Lighting/Generic
3. **Auto-Save**: Changes save automatically to your browser
4. **Export**: Download your changes as JSON for backup
5. **Import**: Restore previous versions by importing JSON

### Cloud Sync Setup
1. Click "⚙️ Cloud Sync Setup" button
2. Enter your GitHub Personal Access Token (PAT)
3. Enter your Gist ID
4. Click "Save & Sync"
5. Your data now syncs across all team members!

## Architecture

### Components
- **Frontend**: Single HTML file with embedded CSS/JavaScript
- **Local Storage**: Browser localStorage for offline editing
- **Cloud Storage**: GitHub Gist (JSON file) for team collaboration
- **Hosting**: GitHub Pages (free static hosting)
- **API**: GitHub REST API for Gist read/write operations

### Data Flow
1. User makes edits → Auto-saves to localStorage (immediate)
2. After 2-second debounce → Syncs to GitHub Gist (cloud)
3. Other team members refresh → Load latest data from Gist
4. Offline edits → Save locally, sync when back online

### Cost Breakdown
- **GitHub Pages**: $0
- **GitHub Gist**: $0 (5GB limit, unlimited gists)
- **GitHub API**: $0 (5,000 requests/hour)
- **Total**: **$0/month**

## Data Persistence

- **Browser Storage**: All edits saved to localStorage (survives browser restarts)
- **Cloud Storage**: All edits synced to GitHub Gist (shared across team)
- **Version History**: Gist automatically tracks all changes
- **JSON Backup**: Export your work to save externally
- **Import**: Restore from JSON files

## Campaign Structure

```
Campaign 1: Watch Video Nurture
├── Day 0: Your Nook video is ready
├── Day 2: What you'll see inside Nook
├── Day 5: Why "name + phone" leads cost you sales
├── Day 10: Your website could be doing the selling for you
├── Day 18: How flooring teams close faster with Nook
└── Day 28: Still exploring? Let's make it easy
```

Each email has three variants:
- **Flooring**: Hardwood, LVP, tile, carpet focus
- **Lighting**: Chandeliers, pendants, fixtures focus
- **Generic**: Home improvement retailers

## Trigger & Goal

- **Trigger**: Watch Video form submission
- **Goal**: Educate → build trust → invite to demo
- **Sender**: Marc Signer, Founder

## Technical Details

- Pure HTML/CSS/JavaScript (no external dependencies)
- Works offline with localStorage fallback
- Cloud sync via GitHub Gist API
- Compatible with all modern browsers
- Responsive design (mobile-friendly)

## Security

### Access Control
- Single shared GitHub PAT (Personal Access Token) with `gist` scope only
- Credentials stored in browser localStorage (not in code)
- Can revoke and regenerate PAT anytime

### Best Practices
1. Share credentials securely (1Password, LastPass, etc.)
2. Use private/secret Gist for additional privacy
3. Don't commit credentials to repository
4. Rotate GitHub PAT annually or if compromised

## Project Structure

```
nook-email-campaign/
├── index.html                  # Main editor (enhanced with cloud sync)
├── data/
│   └── default-campaigns.json  # Default email campaign data
├── SETUP.md                    # Complete setup & deployment guide
└── README.md                   # This file
```

## Files Overview

- **index.html** - Complete email campaign editor with:
  - GitHub Gist API integration
  - localStorage caching
  - Auto-save functionality
  - Cloud sync configuration UI
  - Import/export features

- **data/default-campaigns.json** - Default campaign structure:
  - 6 emails (Days 0, 2, 5, 10, 18, 28)
  - 3 variants per email (Flooring, Lighting, Generic)
  - Used to initialize new Gists

- **SETUP.md** - Step-by-step deployment guide:
  - Creating GitHub Gist
  - Generating Personal Access Token
  - Configuring cloud sync
  - Deploying to GitHub Pages
  - Troubleshooting tips

## Deployment

See [SETUP.md](SETUP.md) for complete deployment instructions.

**Quick Deploy:**
```bash
# Deploy to GitHub Pages
git add index.html
git commit -m "Deploy editor"
git push origin main
```

Enable GitHub Pages in repository settings (Settings → Pages → Deploy from branch `main`)

## Troubleshooting

### Cloud Sync Not Working
- Verify GitHub PAT has `gist` scope at https://github.com/settings/tokens
- Verify Gist ID is correct
- Check browser console (F12) for error messages
- Ensure internet connection is active

### Changes Not Syncing to Team
- All team members must use same Gist ID
- Team members need to refresh page to see updates
- Last save wins (no complex merge logic)
- Export/import JSON for manual sync if needed

## Support

- **Setup Guide**: See [SETUP.md](SETUP.md)
- **GitHub Issues**: Report bugs or feature requests
- **Gist Verification**: Check https://gist.github.com/{username}/{GIST_ID} directly

## License

Copyright © 2026 Nook
