# JSON Formatter Browser Extension

A simple and lightweight browser extension for formatting and validating JSON data.

## Features

- **JSON Formatting**: Format JSON with 2-space indentation
- **JSON Validation**: Real-time syntax checking with visual feedback
- **File Upload**: Upload JSON files directly
- **Clipboard Support**: Copy and paste JSON easily
- **Simple Interface**: Clean and intuitive popup interface

## Installation

### Development

1. Clone the repository:
```bash
git clone <repository-url>
cd format-json
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build the extension:
```bash
npm run build
```

5. Load the extension in your browser:
   - Chrome/Edge: Go to `chrome://extensions/`, enable "Developer mode", and click "Load unpacked"
   - Firefox: Go to `about:debugging#/runtime/this-firefox`, and click "Load Temporary Add-on"

## Usage

### Popup View

1. Click the extension icon in your browser toolbar
2. Paste your JSON into the input area
3. Click "Format" to format the JSON
4. Use the toolbar buttons to:
   - **Format**: Format the JSON
   - **Edit**: Switch back to edit mode
   - **Copy**: Copy JSON to clipboard
   - **Paste**: Paste JSON from clipboard
   - **Upload**: Upload a JSON file
   - **Clear**: Clear all content

### Context Menu

1. Select JSON text on any webpage
2. Right-click and choose "Format JSON"
3. The selected text will be formatted in place

## Tech Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **Lucide React**: Icons

## Project Structure

```
format-json/
├── public/
│   ├── manifest.json       # Extension manifest
│   ├── background.js      # Background script
│   ├── content.js        # Content script
│   └── icons/           # Extension icons
├── src/
│   ├── hooks/           # Custom hooks
│   │   └── useJsonFormatter.ts
│   ├── utils/           # Utility functions
│   │   └── clipboard.ts
│   ├── styles/          # Global styles
│   │   └── globals.css
│   ├── PopupApp.tsx     # Popup component
│   ├── Popup.tsx        # Popup entry point
│   └── main.tsx        # Main entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Browser Compatibility

- Chrome 88+
- Edge 88+
- Firefox 109+
- Safari (planned)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.
