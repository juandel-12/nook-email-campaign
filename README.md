# Nook Email Campaign Editor

An interactive web-based editor for managing the Nook Watch Video Nurture email campaign (6 emails over 28 days).

## Features

✨ **Auto-Save**: All changes automatically saved to browser localStorage
📧 **6 Email Sequence**: Days 0, 2, 5, 10, 18, 28
🎯 **3 Variants**: Flooring, Lighting, Generic
💾 **Export/Import**: Download and restore campaign data as JSON
📋 **Copy to Clipboard**: Export all emails as formatted text
🔄 **Reset**: Restore default content anytime

## Quick Start

Simply open `index.html` in your browser. No server required!

## How to Use

1. **Navigate**: Click day buttons to switch between emails
2. **Edit Variants**: Use tabs to switch between Flooring/Lighting/Generic
3. **Auto-Save**: Changes save automatically to your browser
4. **Export**: Download your changes as JSON for backup
5. **Import**: Restore previous versions by importing JSON

## Data Persistence

- **Browser Storage**: All edits saved to localStorage (survives browser restarts)
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

- Pure HTML/CSS/JavaScript (no dependencies)
- Works offline after first load
- Data stored in browser localStorage
- Compatible with all modern browsers

## License

Copyright © 2026 Nook
