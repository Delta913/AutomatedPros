# Resource Explorer - Pokémon Edition

A modern, responsive React application built with Next.js and TypeScript that allows users to explore, search, filter, and manage their favorite Pokémon using the PokéAPI.

## 🌐 Live Demo

**Deployed on Vercel**: [https://automated-pros-one.vercel.app](https://automated-pros-one.vercel.app)

Experience the app live with all features including search, filtering, favorites, and detailed Pokémon information.

## Features

### ✅ Must-Have Requirements (All Implemented)

- **Project Setup**: Next.js 15 with TypeScript and Tailwind CSS
- **Data List + Detail View**: Paginated list with individual Pokémon detail pages
- **Search, Filter, Sort**: 
  - Debounced search (300ms) bound to URL
  - Sort by name or ID
  - Favorites filter
  - URL reflects all state for shareability
- **Favorites**: Toggle favorites from both list and detail views, persisted in localStorage
- **Data Fetching & State**: 
  - Loading states with skeletons
  - Error handling with retry buttons
  - Request cancellation using AbortController
  - React Query for caching and background refetch

### 🎯 Nice-to-Have Features (Implemented)

- **Client Caching**: React Query provides intelligent caching and background refetching
- **Optimistic UI**: Favorite toggles feel instant with proper state management
- **Accessibility**: Proper ARIA labels, keyboard navigation, and semantic HTML

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **API**: PokéAPI (https://pokeapi.co/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Delta913/AutomatedPros.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

This project is optimized for Vercel deployment:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Auto Deploy**: Vercel will automatically deploy on every push to main branch
3. **Environment**: No additional environment variables needed
4. **Domain**: Custom domain available at `automated-pros-one.vercel.app`

**Deployment Features**:
- ✅ Automatic builds and deployments
- ✅ Edge functions for optimal performance
- ✅ Global CDN for fast loading
- ✅ HTTPS enabled by default
- ✅ Preview deployments for pull requests

## Project Structure

```
test/
├── app/
│   ├── components/
│   │   ├── PokemonExplorer.tsx    # Main explorer component with search/filters
│   │   ├── PokemonList.tsx        # List component with pagination
│   │   └── SearchFilters.tsx      # Search, sort, and filter controls
│   ├── hooks/
│   │   ├── useDebounce.ts         # Custom hook for debounced search
│   │   └── useFavorites.ts        # Local storage favorites management
│   ├── pokemon/
│   │   └── [name]/
│   │       └── page.tsx           # Dynamic route for Pokémon details
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Main page with Suspense wrapper
│   ├── providers.tsx              # React Query provider setup
│   └── globals.css                # Global styles
├── public/                            # Static assets
├── next.config.ts                     # Next.js configuration
├── package.json                       # Dependencies and scripts
└── README.md                          # This file
```

## Architecture & Design Decisions

### Component Boundaries
- **Separation of Concerns**: Each component has a single responsibility
- **Reusable Hooks**: Custom hooks for debouncing and favorites management
- **Type Safety**: Full TypeScript coverage with proper interfaces

### State Management
- **URL as Source of Truth**: All search/filter/sort state is reflected in the URL
- **React Query**: Handles server state, caching, and background updates
- **Local State**: UI state managed with React hooks

### Data Fetching
- **AbortController**: Prevents race conditions when search changes
- **Debounced Search**: 300ms delay reduces API calls
- **Error Boundaries**: Graceful error handling with retry functionality

### Performance Optimizations
- **Pagination**: 20 items per page for optimal performance
- **Image Optimization**: Uses official Pokémon sprites with fallbacks
- **Memoization**: React Query handles caching automatically

## API Integration

The app integrates with the PokéAPI:
- **List Endpoint**: `/api/v2/pokemon` with pagination
- **Detail Endpoint**: `/api/v2/pokemon/{name}` for individual Pokémon
- **Sprite Images**: Official artwork and sprites from GitHub

## URL Structure

The app maintains state in the URL for shareability:
- `/?q=pikachu` - Search for "pikachu"
- `/?sort=id&page=2` - Sort by ID, page 2
- `/?favorites=true` - Show only favorites
- `/pokemon/pikachu` - View Pikachu details

## Key Features

### Search & Filtering
- **Debounced Search**: 300ms delay to avoid excessive API calls
- **Client-side Filtering**: Since PokéAPI doesn't support search queries
- **Favorites Filter**: Toggle to show only favorited Pokémon
- **Sort Options**: By name or ID

### Favorites System
- **Local Storage**: Persists favorites across browser sessions
- **Toggle from Anywhere**: Add/remove favorites from list or detail views
- **Visual Feedback**: Heart icons with proper ARIA labels
- **Count Display**: Shows total number of favorites

### Detail Pages
- **Comprehensive Info**: Stats, abilities, types, and images
- **Responsive Design**: Works on mobile and desktop
- **Back Navigation**: Proper browser history support
- **Favorite Integration**: Toggle favorites from detail view

## Trade-offs & Decisions

### Search Implementation
- **Challenge**: PokéAPI doesn't support search queries
- **Solution**: Fetch all Pokémon and filter client-side
- **Trade-off**: Slightly slower initial load, but better user experience

### Pagination vs Infinite Scroll
- **Choice**: Traditional pagination
- **Reason**: Better for deep linking and maintaining scroll position
- **Alternative**: Could implement infinite scroll for mobile

### State Persistence
- **Choice**: localStorage for favorites
- **Reason**: Simple, works offline, no backend needed
- **Alternative**: Could use IndexedDB for larger datasets

### Error Handling
- **Approach**: Graceful degradation with retry buttons
- **Reason**: Better UX than generic error messages
- **Future**: Could add offline support with service workers

## Future Enhancements

If I had more time, I would implement:

1. **Virtual Scrolling**: For better performance with 1000+ Pokémon
2. **Advanced Filters**: By type, generation, or stats
3. **Theme Toggle**: Light/dark mode with persistent preference
4. **E2E Testing**: Playwright tests for critical user flows
5. **Offline Support**: Service worker for cached data
6. **Advanced Search**: Fuzzy search with autocomplete

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Alt Text**: Descriptive alt text for all images

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- Progressive enhancement approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React Query](https://tanstack.com/query) for efficient data fetching
- [Vercel](https://vercel.com/) for seamless deployment and hosting
