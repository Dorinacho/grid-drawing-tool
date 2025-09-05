# GridCodeGenius - Astro + React + TypeScript

A modern, responsive grid creator application built with Astro.js, React, and TypeScript. Create interactive grids with multiple colors, export to PDF, and enjoy multi-language support.

## 🚀 Features

- **Interactive Grid Creation**: Click to paint/unpaint cells with 4 different colors
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Multi-language Support**: English and Romanian language options
- **PDF Export**: Export grids with A3, A4, or A5 paper sizes
- **Orientation Toggle**: Switch between horizontal and vertical layouts
- **A4 Aspect Ratio**: Maintains proper proportions based on A4 paper dimensions
- **Modern UI**: Built with Tailwind CSS and modern design principles

## 🛠️ Technology Stack

- **Frontend Framework**: Astro.js 4.x
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Build Tool**: Vite (via Astro)

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ControlPanel.tsx
│   ├── ExportModal.tsx
│   ├── GridCanvas.tsx
│   ├── GridCodeGenius.tsx
│   └── LanguageSelector.tsx
├── layouts/             # Astro layouts
│   └── Layout.astro
├── pages/              # Astro pages
│   └── index.astro
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    ├── grid.ts
    ├── language.ts
    └── pdf.ts
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gridcodegenius-astro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎯 Usage

### Basic Grid Operations

1. **Create Grid**: Set rows and columns (1-50 each) and click "Update"
2. **Paint Cells**: Click on grid cells to paint with selected color
3. **Change Colors**: Select from 4 available colors using the color picker
4. **Clear Grid**: Remove all painted cells
5. **Change Orientation**: Transpose the grid matrix

### PDF Export

1. Click "Export to PDF"
2. Select paper size (A3, A4, or A5)
3. Click "OK" to download the PDF
4. The PDF maintains the current grid orientation

### Language Support

- Click "EN" for English interface
- Click "RO" for Romanian interface  
- Language preference is saved locally

## 🔧 Configuration

### Adding New Languages

1. Add language code to `Language` type in `src/types/index.ts`
2. Add translations to `translations` object in `src/utils/language.ts`
3. Add language button to `LanguageSelector.tsx`

### Adding New Colors

1. Add color index to `ColorIndex` type in `src/types/index.ts`
2. Add color value to `colors` object in `src/utils/grid.ts`
3. Add color option to `ControlPanel.tsx`
4. Update PDF export colors in `src/utils/pdf.ts`

### Customizing Paper Sizes

Modify the `paperSizes` object in `src/utils/grid.ts`:

```typescript
export const paperSizes: Record<PaperSize, PaperDimensions> = {
  A3: { width: 420, height: 297 },
  A4: { width: 297, height: 210 },
  A5: { width: 210, height: 148 },
  // Add new sizes here
};
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

The application automatically adapts:
- Button sizes and spacing
- Grid canvas dimensions
- Control panel layout
- Modal dialog sizing

## 🎨 Styling

The application uses Tailwind CSS with a modern glassmorphism design:

- **Background**: Gradient from indigo to purple to pink
- **Components**: Semi-transparent with backdrop blur
- **Interactions**: Smooth hover and focus transitions
- **Colors**: Consistent indigo/purple theme

## 📦 Dependencies

### Core Dependencies
- `astro` - Static site generator
- `@astrojs/react` - React integration for Astro
- `@astrojs/tailwind` - Tailwind CSS integration
- `react` - UI library
- `react-dom` - React DOM renderer
- `typescript` - Type safety
- `tailwindcss` - Utility-first CSS framework
- `jspdf` - PDF generation library

### Development Dependencies
- `@astrojs/check` - TypeScript checker for Astro
- `@types/react` - React type definitions
- `@types/react-dom` - React DOM type definitions
- `@types/node` - Node.js type definitions

## 🏗️ Architecture

### Component Hierarchy
```
GridCodeGenius (Main App)
├── LanguageSelector
├── ControlPanel
├── GridCanvas
└── ExportModal
```

### State Management
- React hooks (`useState`, `useCallback`, `useEffect`)
- Local state for grid data and UI state
- LocalStorage for language persistence

### Type Safety
- Comprehensive TypeScript interfaces
- Strict type checking enabled
- Path aliases for clean imports

### Performance Optimizations
- `useCallback` for event handlers
- `client:load` directive for hydration
- Optimized canvas rendering
- Efficient matrix operations

## 🧪 Testing

The application includes type checking via TypeScript:

```bash
npm run astro check
```

## 🚀 Deployment

### Static Deployment
The application builds to static files and can be deployed to any static hosting service:

- Netlify
- Vercel  
- GitHub Pages
- AWS S3
- Any CDN or web server

### Build Output
```bash
npm run build
# Creates ./dist/ folder with static assets
```

## 🐛 Troubleshooting

### Common Issues

1. **jsPDF not loading**: Ensure the CDN script is loaded before the React components
2. **Canvas not rendering**: Check browser compatibility for HTML5 Canvas
3. **LocalStorage errors**: Handle SSR/client-side rendering differences
4. **TypeScript errors**: Run `npm run astro check` for detailed type checking

### Browser Compatibility

- **Modern browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Mobile browsers**: iOS Safari 12+, Chrome Mobile 60+
- **Required features**: HTML5 Canvas, ES2022, LocalStorage

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and conventions
- Add type definitions for new features
- Test on multiple screen sizes
- Ensure accessibility standards

## 🙏 Acknowledgments

- Astro.js team for the excellent framework
- React team for the robust UI library
- Tailwind CSS for the utility-first approach
- jsPDF library for PDF generation capabilities

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

Built with ❤️ using Astro.js, React, and TypeScript

==== INSTALLATION INSTRUCTIONS ====

To set up this project:

1. Extract all files maintaining the directory structure
2. Navigate to the project root directory
3. Run: npm install
4. Run: npm run dev
5. Open: http://localhost:4321

The project includes:
- Complete Astro.js + React + TypeScript setup
- Responsive design with Tailwind CSS
- Multi-language support (English/Romanian)
- PDF export functionality
- Interactive grid with 4 colors
- Modern glassmorphism UI design
- Full type safety with TypeScript
  GridCodeGenius-Astro-Project/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── tailwind.config.mjs
├── README.md
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── components/
    │   ├── ControlPanel.tsx
    │   ├── ExportModal.tsx
    │   ├── GridCanvas.tsx
    │   ├── GridCodeGenius.tsx
    │   └── LanguageSelector.tsx
    ├── layouts/
    │   └── Layout.astro
    ├── pages/
    │   └── index.astro
    ├── types/
    │   └── index.ts
    └── utils/
        ├── grid.ts
        ├── language.ts
        └── pdf.ts