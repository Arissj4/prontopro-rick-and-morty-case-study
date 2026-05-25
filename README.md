# Rick and Morty Case Study

A responsive web application built with Next.js and TypeScript, using the Rick and Morty API to browse characters, locations, and episodes.

## Features

- Browse characters, locations, and episodes
- Search by name
- Search episodes by episode code, such as `S01E01`
- Advanced filters for characters and locations
- Pagination / load more functionality
- Responsive mobile-first UI
- Reusable components
- Basic test coverage for main components
- CI workflow for formatting, linting, type checking, testing, and build

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- SCSS/SASS
- Jest
- React Testing Library
- GitHub Actions

## Project Structure

```txt
src
├── components
│   ├── CharacterComponent.tsx
│   ├── FilterComponent.tsx
│   ├── NavbarComponent.tsx
│   ├── PaginationComponent.tsx
│   └── SimpleCardComponent.tsx
├── lib
│   ├── costumeTypes.ts
│   └── getAdvancedFilters.ts
├── pages
│   ├── episodes
│   ├── locations
│   ├── profil
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── public
└── styles
    ├── globals.css
    └── globals.scss


The main UI logic is organized inside reusable components. Shared TypeScript types and helper functions are placed in the `lib` folder. The `pages` folder contains the route-based pages for characters, locations, episodes, and profile details.

```

## Getting Started

### 1. Install dependencies

`npm install`

### 2. Run the development server

`npm run dev`

### Then open:

`txt http://localhost:3000 `

## Available Scripts

- Run development server
  `npm run dev`

- Check formatting
  `npm run format`

- Run lint
  `npm run lint`

- Run type check
  `npm run type-check`

- Run tests
  `npm test`

- Build project
  `npm run build`

## Testing

The project includes beginner-friendly tests for the main UI components, including:

- Character component
- Filter component
- Navbar component
- Pagination component
- Simple card component

Tests are written with **Jest** and **React Testing Library**.

`npm test`

## CI

The project includes a GitHub Actions workflow that runs:

- Formatting check
- Lint
- Type check
- Tests
- Production build

This helps make sure the project is stable before submission.

## API

This project uses the public Rick and Morty API:
`https://rickandmortyapi.com/api`

Main resources used:

```
/character
/location
/episode
```

## Notes

The application focuses on clean component structure, readable TypeScript code, reusable logic, and simple but useful tests.

Some logic, such as advanced filter generation, was extracted into helper functions to keep page files easier to read and maintain.
