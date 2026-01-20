# Quick Copy DOM

<p align="center">
  <img src="icons/icon128.png" alt="Quick Copy DOM Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Select any element on a webpage and instantly copy its HTML to clipboard.</strong>
</p>

<p align="center">
  Like DevTools element inspector, but faster.
</p>

---

## Features

- **Visual Element Selection** - Hover over elements to see them highlighted in real-time
- **Element Info Tooltip** - Shows tag name, classes, and dimensions while hovering
- **One-Click Copy** - Click any element to copy its complete outerHTML
- **Keyboard Shortcut** - Quick access with `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
- **ESC to Cancel** - Press Escape to exit selection mode anytime
- **Lightweight** - No bloat, minimal permissions
- **Privacy First** - Works entirely locally, no data collection

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the `Quick Copy DOM` folder
6. The extension is now installed!

## Usage

1. **Activate the selector:**
   - Click the extension icon in your toolbar, OR
   - Press `Ctrl+Shift+E` (`Cmd+Shift+E` on Mac)

2. **Select an element:**
   - Move your mouse over the page
   - Elements will highlight as you hover
   - A tooltip shows the element's tag, classes, and size

3. **Copy the HTML:**
   - Click on any highlighted element
   - The complete HTML is copied to your clipboard
   - A toast notification confirms the copy

4. **Cancel selection:**
   - Press `ESC` to cancel without copying

## Permissions

| Permission | Reason |
|------------|--------|
| `activeTab` | To highlight and copy elements on the current page |
| `scripting` | To inject the selection functionality when activated |

This extension does **NOT**:
- Collect any user data
- Track your browsing
- Make any network requests
- Access your data on any site until you activate it

## Development

### Project Structure

```
Quick Copy DOM/
├── manifest.json      # Extension configuration
├── background.js      # Service worker for keyboard shortcuts
├── content.js         # Element selection logic
├── popup.html         # Extension popup UI
├── popup.js           # Popup interaction logic
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── store/             # Chrome Web Store assets
    ├── description.txt
    ├── short-description.txt
    ├── promo-tile-small.png
    └── promo-tile-large.png
```

### Building for Production

The extension is ready to use as-is. To publish to the Chrome Web Store:

1. Zip the extension folder (excluding the `store/` directory)
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Create a new item and upload the zip file
4. Fill in the listing details using content from `store/`
5. Submit for review

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

<p align="center">
  Made with ❤️ for developers who value their time
</p>
