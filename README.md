# Shortcuts

[![Build Status](https://drone.mikebgdev.com/api/badges/mikebgdev/Shortcuts/status.svg)](https://drone.mikebgdev.com/mikebgdev/Shortcuts)

**Shortcuts** is a web application to browse, organize, and practice keyboard shortcuts and commands across various platforms.

## Features

- Browse keyboard shortcuts and terminal commands for various platforms (PHPStorm, Arch Linux, Ubuntu, Git, Docker, Vim)
- Filter shortcuts by category (Navigation, Editing, Debugging, System, Window Management)
- Full-text search across shortcut title, description, and key combinations
- Save personal notes and mark favorites for quick access
- Quiz mode with timed questions and scoring to test your knowledge
- Light and dark themes
- Persistent storage with Firebase Firestore for notes, favorites, and quiz history
- Pre-commit hooks with Husky & lint-staged (autoformat & type checks)
- CI pipeline with linting, type-check, and build on pull requests

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase (Firestore)
- Radix UI
- React Query
- Framer Motion

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mikebgdev/Shortcuts.git
   cd Shortcuts
   ```

2. Install dependencies and set up Git hooks:
   ```bash
   npm install
   npm run prepare
   ```

3. Configure environment variables:
   Copy `.env` to `.env.local` and fill in the sensitive values:
   ```bash
   cp .env .env.local
   ```
   Edit `.env.local` with:
   ```ini
   VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_APP_ID=...
    VITE_DEMO_USER_ID=1
    ```

4. Run in development mode:
   ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

5. (Optional) Initialize Firestore with sample data:
   1. Start the development server.
   2. Open `http://localhost:5173/firebase-admin` in your browser.
   3. Click **Initialize Firestore** to populate the database.

## Useful Scripts

- `npm run dev` — Start development server with hot-reload.
- `npm run build` — Build for production.
- `npm run preview` — Preview the production build.
- `npm run lint` — Run ESLint.
- `npm run prepare` — Set up Git hooks (Husky + lint-staged; run once after cloning)
- `npm run ci` — Install dependencies for CI (with legacy peer deps)
- `npm test` — Run tests.

## Project Structure

```
.
├── src/
│   ├── components/   # Reusable React components
│   ├── contexts/     # React context providers (favorites, toast)
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Constants, data and Firebase integration
│   ├── pages/        # Application views (Home, Quiz)
│   ├── index.css     # Global styles
│   ├── App.tsx       # Application root
│   └── main.tsx      # Application entry point
├── public/           # Static assets and index.html
├── .env              # Default environment variables
├── .env.local        # Sensitive environment variables (not versioned)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature/my-feature`.
3. Make your changes and address formatting issues.
4. Open a pull request describing your changes.

