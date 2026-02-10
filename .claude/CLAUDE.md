# Nook Email Campaign Editor

## Project Overview
Single-file HTML/CSS/JavaScript email campaign editor with GitHub Gist cloud sync.
Deployed on GitHub Pages. Team of 2-5 users.

## Critical Security Rules
- NEVER hardcode GitHub Personal Access Tokens
- ALWAYS sanitize user-generated email content (XSS risk)
- localStorage contains sensitive tokens - handle carefully
- All API calls must use HTTPS and proper error handling

## Tech Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- GitHub Gist API for cloud storage
- localStorage for auto-save
- GitHub Pages for hosting

## File Structure
- `index.html` - Main application (currently ~63KB)
- `data/default-campaigns.json` - Default email data
- `README.md` - Feature documentation
- `SETUP.md` - Deployment guide

## Common Commands
```bash
# Deploy to GitHub Pages
git add index.html
git commit -m "Update: [description]"
git push origin main

# Verify no secrets committed
grep -r "ghp_" .
grep -r "gist.*:" index.html
```

## Code Standards
- Use `const` and `let`, never `var`
- Proper error handling with try-catch for all API calls
- Use `.textContent` for user content, never `.innerHTML`
- Cache DOM selectors to avoid repeated queries
- Comment complex logic, especially API integration

## Testing Checklist
- [ ] Open index.html in browser (should load without errors)
- [ ] Test localStorage save/load
- [ ] Test cloud sync with test Gist
- [ ] Test import/export JSON
- [ ] Test all 3 variants display correctly
- [ ] Test mobile responsive design

## Security Validation
Before every deployment:
- Use security-guardian agent
- Verify no tokens in source
- Check XSS protection on email content
- Validate API error handling

## Documentation Rules
- Update README.md when features change
- Update SETUP.md when deployment process changes
- Keep code comments synchronized with logic
- Use grumpy-docs-critic agent to validate accuracy
