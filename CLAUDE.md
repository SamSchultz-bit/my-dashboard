# Project: Personal Dashboard

A personal dashboard for tracking mortgage and loan applications — statuses, next steps, blockers, and due dates.

---

## Stack

- **Framework:** React 18 + Vite
- **Node:** 20 (via nvm — run `nvm use 20` if needed)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6 (if multi-page) or single-page with conditional rendering
- **State:** React useState / useContext to start; upgrade to Zustand if it gets complex
- **Persistence:** localStorage for now (no backend); swap for a real API later if needed
- **Package manager:** npm

---

## Dev Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## Folder Structure

```
src/
  components/     # Reusable UI components (Button, Card, Modal, etc.)
  pages/          # Top-level page components (if using React Router)
  hooks/          # Custom hooks (e.g., useLocalStorage, useTracker)
  utils/          # Pure helper functions (formatDate, calculateStreak, etc.)
  context/        # React context providers (if using shared state)
  assets/         # Static images, icons
  App.jsx         # Root component and routing
  main.jsx        # Entry point — don't edit unless necessary
```

---

## Coding Conventions

- **Formatting:** Prettier on save (configured in VS Code). Run `npx prettier --write src/` to format all files.
- **Components:** One component per file. File and component name must match (e.g., `HabitCard.jsx` exports `HabitCard`).
- **Naming:** PascalCase for components, camelCase for functions and variables, kebab-case for CSS class names.
- **Props:** Prefer explicit named props over spreading objects. Add PropTypes or JSDoc comments on components others will reuse.
- **No inline styles** unless it's a one-off dynamic value (e.g., a width calculated from data). Use class names for everything static.
- **Imports:** Group in this order — React, third-party libraries, local components, local utils/hooks, styles.

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root layout and routing |
| `src/context/AppContext.jsx` | Global state (create this when you need shared state) |
| `src/hooks/useLocalStorage.js` | Wrapper for persisting state to localStorage |
| `vite.config.js` | Vite config — don't change without a reason |
| `.env` | Environment variables (never commit this) |

---

## State & Persistence Notes

- Use `localStorage` for user data (tracker entries, settings, preferences).
- Create a `useLocalStorage` custom hook early — it saves a lot of boilerplate.
- Keep data shape simple and flat. Avoid deeply nested objects in storage.
- If the app grows to need a real backend, PostgreSQL is already set up locally (port 5432).

---

## Things Claude Should Know

- Sam is the only user of this app — no auth or multi-user logic needed.
- Prefer simple, readable code over clever abstractions. This is a personal project.
- When adding a new feature, check if a custom hook already handles similar logic before writing new state from scratch.
- Keep components small. If JSX exceeds ~80 lines, consider splitting it.
- Always run `npm run lint` after making changes to catch issues early.
- Sam uses VS Code with format-on-save, so don't worry about formatting in edits — it'll be handled automatically.

---

## Current Status

- [x] Project scaffolded with Vite
- [x] Tailwind CSS v4 configured
- [x] Core layout — header, main grid, sticky sidebar
- [x] Project tracker — add, edit, delete, status cycling, filter, sort, search
- [x] localStorage persistence via `useLocalStorage` hook
- [x] Sidebar — Next Steps and Waiting On lists with status filters
- [x] Archive completed projects (Archive/Unarchive button on cards)
- [x] Export / Import as JSON (header buttons)
- [x] Undo — status badge changes (4s) and next-step completions (4s)
- [x] Keyboard shortcut — Cmd/Ctrl+N to open Add Project form
- [x] Design — dark header, indigo accent, status left-border on cards
