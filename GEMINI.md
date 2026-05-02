# SportFlix - Mobile-Optimized Sports Streaming PWA

SportFlix is a modern, mobile-first web application designed for high-performance sports streaming. It features a Netflix-style user interface, optimized specifically for iPhone and iPad viewports, and operates as a Progressive Web App (PWA).

## 🚀 Project Overview

- **Core Goal**: Provide a clean, ad-resilient, and premium streaming experience without commercial bloat.
- **Tech Stack**: Vanilla JavaScript, CSS3, HTML5, Vite (Dev/Build), Service Workers (PWA), Netlify (Hosting).
- **Primary Data Source**: Integrated with the `streamed.pk` API.
- **Key Features**:
  - **Netflix-Style UI**: Large match posters (16:9), cinematic grids, and smooth transitions.
  - **Mobile-First Design**: Bottom navigation for devices under 768px, iOS safe area support (`viewport-fit=cover`), and standalone mode.
  - **NBA Prioritization**: Basketball matches and NBA events are automatically sorted to the first row of the grid.
  - **Ad-Resilience**: Multi-layered protection including iframe sandboxing, a "first-click" Ad-Shield overlay, and global popup interception.
  - **Image Proxy Logic**: Intelligent routing for team badges and posters, enforcing `.webp` extensions and bypassing hotlinking protections via a `no-referrer` policy.

## 🛠 Building and Running

### Local Development
The project uses Vite for a modern development experience.
```bash
npm install
npm run dev
```

### Production Build
Generates a optimized `dist` folder ready for deployment.
```bash
npm run build
```

### Deployment
Configured for **Netlify**. The build settings are managed in `netlify.toml`:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Headers**: Enforces `Referrer-Policy: no-referrer` globally to ensure image availability.

## 📐 Development Conventions

### Visual Standards
- **Breakpoints**: Mobile (<768px), Tablet (769px - 1024px), Desktop (>1024px).
- **Safe Areas**: Always use `--safe-bottom: env(safe-area-inset-bottom)` for fixed elements on iOS.
- **Typography**: Uses 'Bebas Neue' for headings/logos and 'DM Sans' for body text.

### Implementation Patterns
- **Image URLs**: Use the `getBadgeUrl(id)` and `getPosterUrl(match)` utility functions. Do not construct image paths manually.
- **Navigation**: Use `setActive(el)` to manage visual state for bottom navigation.
- **PWA**: Service Worker (`sw.js`) uses a **Network-First** strategy for the main entry point to ensure aggressive iPad caches are bypassed.

### Ad Blocking
- All streaming iframes must include: `sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"`.
- The `allow-popups` permission is intentionally omitted to block new-tab ads.
- Always activate the `#ad-shield` overlay when starting a new stream to intercept click-jacking.

## 📁 Key Files
- `index.html`: Main application logic, styles, and UI.
- `public/sw.js`: Service Worker for offline support and cache management (v3+).
- `public/manifest.json`: PWA configuration.
- `netlify.toml`: Deployment and header configuration.
- `package.json`: Dependency management and Vite scripts.
