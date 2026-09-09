# Copilot instructions

## Project commands

Run commands from the `MacroTracker` directory:

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint across the project.

There are currently no test files or test script. No single-test command is available.

## Architecture

- `src/main.jsx` mounts `App` inside React `StrictMode`.
- `src/App.jsx` owns the application state. It stores targets and meals per selected date and persists the complete `days` object in `localStorage` under `macro-tracker-days`.
- `App` passes controlled state and functional setters into the feature components:
  - `DayPicker` changes the active date.
  - `MacrosTarget` edits daily macro targets.
  - `AddMeals` builds, validates, saves, edits, and deletes meals.
  - `MacrosCount` derives protein, carbohydrate, and fat totals.
  - `Progress` derives calorie goals, consumption, remaining calories, and progress percentages.
- Components are colocated with their feature-specific CSS files under `src/Components/`. Global styles are in `src/index.css` and `src/App.css`.
- Meal data is persisted as item records. Items in the same meal share `mealKey`; `number` is the user-facing meal number. Nutrition calculations are performed in `AddMeals` from the local `foods` catalog.

## Codebase conventions

- Use functional React components and hooks with controlled form inputs.
- Keep day-level state updates immutable and use functional state updates when deriving from existing state. Preserve the `emptyDay()` shape when adding new day-level fields.
- Keep derived totals in the consuming component rather than duplicating them in application state.
- Add new meal fields consistently to both the builder/save path and saved-item edit path. Preserve `mealKey` when editing an item so grouping and deletion continue to work.
- Meal quantities are stored in `grams`; count-based foods use the same field for their count, with the food catalog's `unit: 'count'` determining calculation and labels.
- Normalize food lookups through the existing `getNutrition` helper rather than indexing `foods` directly.
- Use the existing BEM-like CSS naming pattern (`block`, `block__element`, and `block--modifier`) and colocated stylesheet imports.
- Use stable IDs from `crypto.randomUUID()` for new meals and items. Do not use array indexes as React keys.
- Keep navigation section IDs and accessible labels synchronized when adding or renaming sections.
- ESLint uses the flat config in `eslint.config.js`, targets `**/*.{js,jsx}`, ignores `dist`, and enables the recommended React Hooks and React Refresh rules.
- The project uses ES modules and single quotes in JavaScript/JSX. Follow the surrounding formatting and trailing-comma style.
