# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Email campaign editor for Nook Watch Video Nurture campaign. React app with GitHub Gist cloud sync, deployed on GitHub Pages for 2-5 team members.

**Current version**: React with Shadcn/ui design system
**Legacy version**: `index.legacy.html` (63KB single-file app, preserved as backup)

## Architecture

### State Management
- **CampaignContext** (`src/contexts/CampaignContext.js`) - Global state via React Context API
  - Manages campaigns data, current selections, config, save status
  - Auto-saves to localStorage on every change
  - Syncs with GitHub Gist via debounced hook

### Data Flow
1. User edits → Context state update
2. Context automatically saves to localStorage (immediate)
3. `useGistSync` hook debounces and syncs to GitHub Gist (2s delay)
4. Status indicator shows "Saved Locally ✓" or "Saved to Cloud ✓"

### Key Hooks
- `useGistSync` - Handles GitHub Gist API sync with 2s debounce
- `useLocalStorage` - Persists state to localStorage
- `useDarkMode` - Dark mode toggle
- `useDebounce` - Generic debouncing utility
- `useModal` - Modal open/close state

### Component Architecture
Components follow Shadcn/ui patterns with class-variance-authority for variants:
- **UI primitives**: `src/components/ui/` (Button, Card, Badge, theme-toggle)
- **Composed components**: `src/components/` (EmailEditor, CampaignSelector, etc.)
- Use `cn()` utility from `src/lib/utils.js` to merge Tailwind classes

### Data Format
```json
{
  "version": "2.0",
  "campaigns": [{
    "id": "watch-video-nurture",
    "name": "Watch Video Nurture",
    "description": "...",
    "emails": [{
      "day": 0,
      "title": "...",
      "variants": {
        "flooring": {"subject": "...", "preview": "...", "body": "..."},
        "lighting": {...},
        "generic": {...}
      }
    }]
  }]
}
```

## Development Commands

```bash
# Start dev server (localhost:3000/nook-email-campaign)
cd nook-email-campaign-react
npm start

# Build for production (outputs to nook-email-campaign-react/build/)
npm run build

# Deploy to GitHub Pages (builds + pushes to gh-pages branch)
npm run deploy

# Run tests
npm test
```

## Deployment

Production build is copied to repository root for GitHub Pages:
```bash
cd nook-email-campaign-react
npm run build
# Build artifacts copied to root: index.html, static/, manifest.json, etc.
git add index.html static/ manifest.json robots.txt favicon.ico asset-manifest.json logo192.png logo512.png
git commit -m "Deploy: <description>"
git push origin main
```

Live URL: https://juandel-12.github.io/nook-email-campaign/

## Critical Security Rules

- NEVER hardcode GitHub Personal Access Tokens (PAT)
- PAT and Gist ID stored in localStorage only (TOKEN_KEY, GIST_ID_KEY)
- Use `.textContent` for user content, never `.innerHTML` (XSS protection)
- All GitHub API calls in `src/utils/gistApi.js` must have error handling
- Before every deploy: run `grep -r "ghp_" .` to verify no tokens in code

## Styling System

Uses Shadcn/ui + Tailwind CSS v3:
- **Theme**: Neutral palette with dark mode support
- **CSS Variables**: Design tokens in `src/index.css` (--background, --foreground, --primary, etc.)
- **Dark mode**: Toggle via `useDarkMode` hook, persisted to localStorage
- **Variants**: Use `cva()` from class-variance-authority for component variants
- **Animations**: tailwindcss-animate provides smooth transitions

Key Tailwind utilities:
- `cn(...)` - Merge classes safely (from `src/lib/utils.js`)
- `bg-background`, `text-foreground` - Semantic color tokens
- `border-border`, `ring-ring` - Consistent borders/focus rings

## Testing Checklist

Manual tests (no automated tests yet):
- [ ] `npm start` launches without errors
- [ ] Edit email content → saves locally → status shows "Saved Locally ✓"
- [ ] Configure cloud sync → changes sync → status shows "Saved to Cloud ✓"
- [ ] Import/Export JSON works
- [ ] All 3 variants (Flooring/Lighting/Generic) render correctly
- [ ] Dark mode toggle persists across page reloads
- [ ] Mobile responsive (test at 375px, 768px, 1440px)

## Custom Agents

Located in `.claude/agents/`:
- **security-guardian** - Validates no PAT leaks, XSS protection
- **grumpy-docs-critic** - Reviews README/SETUP accuracy after feature changes
- **deployment-readiness** - Pre-deploy checks for GitHub Pages
- **data-integrity-guardian** - Validates JSON schema and data migrations
- **api-contract-validator** - GitHub Gist API error handling validation
- **html-quality-inspector** - Code quality for single-file HTML (legacy only)

Use these proactively before commits/deploys.

## Code Standards

- **Imports**: Group by external, internal, relative; sort alphabetically
- **Components**: Function components with destructured props
- **Variants**: Use `cva()` for consistent variant patterns
- **Error handling**: Try-catch around all API calls (GitHub Gist)
- **Comments**: Explain *why*, not *what* (especially for Gist sync logic)
- **localStorage keys**: Match legacy app for backward compatibility

## Common Gotchas

- **Homepage in package.json**: Set to `/nook-email-campaign/` for GitHub Pages subdirectory
- **Build output**: React build goes to `nook-email-campaign-react/build/`, then copied to root
- **localStorage keys**: Must match legacy app (`nookEmailCampaign`, `nookEmailCampaignLastSaved`)
- **Gist API rate limit**: 5000 req/hour - debouncing prevents hitting limit
- **Data migration**: `ensureV2Format()` in `src/utils/migrate.js` handles v1→v2 migration

## File Reference

**Active development**: `nook-email-campaign-react/src/`
**Production build**: Root directory (`index.html`, `static/`)
**Legacy backup**: `index.legacy.html`
**Documentation**: `README.md`, `SETUP.md`, `DESIGN_SYSTEM.md`
**Default data**: `data/default-campaigns.json`
