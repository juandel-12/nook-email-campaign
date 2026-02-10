# Nook Email Campaign Editor (React)

An interactive web-based editor for managing the Nook Watch Video Nurture email campaign (6 emails over 28 days) with **cloud sync** for team collaboration.

**✨ Now built with React!** Modern, component-based architecture for better maintainability and developer experience.

## Features

✨ **Auto-Save**: All changes automatically saved to browser localStorage
☁️ **Cloud Sync**: Optional GitHub Gist integration for team sharing (2-5 people)
📧 **Multiple Campaigns**: Manage multiple email campaigns with flexible email counts
🎯 **3 Variants**: Flooring, Lighting, Generic
💾 **Export/Import**: Download and restore campaign data as JSON
📋 **Copy to Clipboard**: Export all emails as formatted text
🔄 **Reset**: Restore default content anytime
💰 **$0/month**: Entirely free hosting and data storage
⚛️ **React Powered**: Modern UI with hot reload, component architecture

## Quick Start

### For Development
```bash
cd nook-email-campaign-react
npm install
npm start
# Opens http://localhost:3000/nook-email-campaign
```

### For Production
**Live URL**: https://juandel-12.github.io/nook-email-campaign/

### Team Usage (2-5 People with Cloud Sync)
1. Create GitHub Gist for data storage
2. Generate GitHub Personal Access Token
3. Configure cloud sync in the app (click "Cloud Setup")
4. Share credentials with team
5. Everyone edits, auto-syncs every 2 seconds!

See [SETUP.md](SETUP.md) for complete deployment instructions.

## How to Use

### Basic Editing
1. **Select Campaign**: Use dropdown to choose or create campaigns
2. **Navigate Emails**: Click day buttons to switch between emails
3. **Edit Variants**: Use tabs to switch between Flooring/Lighting/Generic
4. **Auto-Save**: Changes save automatically to your browser
5. **Export**: Download your changes as JSON for backup
6. **Import**: Restore previous versions by importing JSON

### Cloud Sync Setup
1. Click "Cloud Setup" button
2. Enter your GitHub Personal Access Token (PAT)
3. Enter your Gist ID
4. Click "Save Configuration"
5. Your data now syncs across all team members!

## Architecture

### Frontend Stack
- **Framework**: React 18+ with Create React App
- **State Management**: React Context API + Hooks
- **Styling**: CSS Modules (scoped per component)
- **Components**: 15 modular, reusable components
- **Hooks**: Custom hooks for Gist sync, debouncing, localStorage

### Backend/Storage
- **Local Storage**: Browser localStorage for offline editing
- **Cloud Storage**: GitHub Gist (JSON file) for team collaboration
- **Hosting**: GitHub Pages (free static hosting)
- **API**: GitHub REST API for Gist read/write operations

### Data Flow
1. User makes edits → Updates React state → Auto-saves to localStorage (immediate)
2. After 2-second debounce → Syncs to GitHub Gist (cloud)
3. Other team members refresh → Load latest data from Gist
4. Offline edits → Save locally, sync when back online

### Cost Breakdown
- **GitHub Pages**: $0
- **GitHub Gist**: $0 (5GB limit, unlimited gists)
- **GitHub API**: $0 (5,000 requests/hour)
- **Total**: **$0/month**

## Project Structure

```
nook-email-campaign/
├── nook-email-campaign-react/        # React application
│   ├── src/
│   │   ├── components/               # 15 React components
│   │   ├── contexts/                 # CampaignContext (state)
│   │   ├── hooks/                    # Custom hooks (4)
│   │   ├── utils/                    # Gist API, migration
│   │   ├── data/                     # Default campaigns
│   │   └── App.js                    # Root component
│   ├── public/
│   ├── package.json
│   └── README.md
├── index.legacy.html                 # Legacy single-file version (backup)
├── data/
│   └── default-campaigns.json        # Default campaign data
├── SETUP.md                          # Deployment guide
└── README.md                         # This file
```

## React Components

### Basic UI
- `Button` - Reusable button with variants
- `Input` - Text input with labels
- `Textarea` - Multiline input (monospace for email bodies)
- `Select` - Dropdown selector
- `StatusIndicator` - Save status display

### Modals
- `Modal` - Base modal with React portal
- `SetupModal` - GitHub Gist configuration
- `ImportModal` - JSON import with file upload
- `CampaignModal` - Add/edit campaign

### Email Editor
- `EmailList` - Grid of email selector buttons
- `EmailContent` - Complete email editor
- `EmailHeader` - Day/title editor with delete
- `VariantTabs` - Three variant tabs
- `VariantForm` - Subject/preview/body fields

### Campaign Management
- `CampaignSelector` - Campaign dropdown + controls
- `CampaignInfo` - Campaign metadata display
- `CampaignActions` - Edit/delete buttons

### Layout
- `Header` - App header with actions
- `EmailEditor` - Main editor area

## Development

### Commands
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Run tests (future)
npm test
```

### Tech Stack Details
- **React**: 19.2.4
- **Create React App**: 5.0.1
- **CSS Modules**: Scoped component styles
- **Context API**: Global state management
- **Custom Hooks**: Gist sync, debouncing, localStorage
- **GitHub Pages**: Automated deployment with gh-pages

## Campaign Structure

```
Campaign: Watch Video Nurture
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

## Data Persistence

- **Browser Storage**: All edits saved to localStorage (survives browser restarts)
- **Cloud Storage**: All edits synced to GitHub Gist (shared across team)
- **Version History**: Gist automatically tracks all changes
- **JSON Backup**: Export your work to save externally
- **Import**: Restore from JSON files
- **Backward Compatible**: Uses same localStorage keys as legacy app

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
5. Never hardcode tokens in source code (React app enforces this)

## Deployment

See [SETUP.md](SETUP.md) for complete deployment instructions.

**Quick Deploy:**
```bash
cd nook-email-campaign-react
npm run build
npm run deploy
```

Your app will be live at: https://juandel-12.github.io/nook-email-campaign/

## Migrating from Legacy Version

The React version maintains **100% backward compatibility**:

✅ **Same localStorage keys** - Your data automatically migrates
✅ **Same Gist API** - Use existing Gist IDs and tokens
✅ **Same data format** - v2.0 campaign structure
✅ **v1 migration** - Automatically converts old flat arrays

**Legacy version preserved**: `index.legacy.html` (fully functional backup)

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

### Development Issues
- Clear browser cache if seeing stale UI
- Check `npm start` output for compilation errors
- Verify Node.js version (v14+ recommended)
- Delete `node_modules` and reinstall if issues persist

## Performance

- **Bundle size**: 71KB gzipped (production)
- **Initial load**: < 2 seconds on 3G
- **Hot reload**: ~200-500ms in development
- **Auto-save debounce**: 2 seconds
- **Component re-renders**: Optimized with React.memo

## Future Enhancements

Possible improvements (not yet implemented):
- TypeScript for type safety
- Testing suite (Jest + React Testing Library)
- Rich text editor for email bodies
- Real-time collaboration (WebSockets)
- Undo/redo functionality
- Email preview rendering
- Mobile app (React Native)

## Support

- **Setup Guide**: See [SETUP.md](SETUP.md)
- **GitHub Issues**: Report bugs or feature requests
- **Gist Verification**: Check https://gist.github.com/{username}/{GIST_ID} directly
- **Migration Docs**: See `nook-email-campaign-react/MIGRATION_STATUS.md`

## License

Copyright © 2026 Nook
