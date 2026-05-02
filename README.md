# ReportMaster MFE

A modern React/TypeScript frontend for the ReportMaster.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Lint code
yarn lint

# Preview production build
yarn preview
```

## 🔐 Authentication

The app includes a configurable authentication system. To disable auth for development:

1. Open `src/config.ts`
2. Set `AUTH_ENABLED: false`
3. Save and reload

See [AUTH_CONFIG.md](AUTH_CONFIG.md) for detailed documentation.

## 🎨 Features

- **Modern UI** - Gradient design with smooth animations
- **Authentication** - Configurable API key authentication
- **Responsive** - Works on desktop, tablet, and mobile
- **TypeScript** - Full type safety
- **Form Management** - School parameters configuration
- **Plot Selection** - Dynamic visualization selector
- **Report Generation** - PDF report creation workflow

## 📁 Project Structure

```
src/
├── App.tsx           # Main application component
├── App.css          # Main application styles
├── AuthPage.tsx     # Authentication landing page
├── AuthPage.css     # Authentication page styles
├── types.ts         # TypeScript interfaces
├── config.ts        # Application configuration
├── main.tsx         # Application entry point
└── index.css        # Global styles

public/
└── logo.png         # Application logo
```

## 🔧 Configuration

Edit `src/config.ts` to configure:
- Authentication (enable/disable)
- API base URL
- Development API key

## 📊 Backend Integration (TODO)

Three functions need backend API integration:

1. **Load Data** (`handleLoadData` in App.tsx)
   - Endpoint: `POST /api/load-data`
   - Payload: `{ snr, audience, ganztag, stype }`
   - Returns: School data and available plots

2. **Generate Report** (`handleGenerateReport` in App.tsx)
   - Endpoint: `POST /api/generate-report`
   - Payload: Form data + selected plot
   - Returns: Report ID or download URL

3. **Download Report** (`handleDownloadReport` in App.tsx)
   - Endpoint: `GET /api/download-report/:id`
   - Returns: PDF file

## 🎓 School Parameters

- **SNR**: School number (Schulnummer)
- **Audience**: Survey audience (All, Trainers, Parents, Teachers, Students, UBB)
- **Ganztag**: Full-day school status
- **School Type**: Various school categories

## 🛠 Tech Stack

- React 19
- TypeScript 6
- Vite 8
- ESLint
- CSS3 (No framework - custom modern design)

## 📝 License

Created by [Edgar Treischl](https://edgar-treischl.de)

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
