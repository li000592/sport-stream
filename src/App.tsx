import React, { useEffect } from 'react';
import useStore from './store/useStore';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import MatchGrid from './components/MatchGrid';
import PlayerModal from './components/PlayerModal';

const App: React.FC = () => {
  const { fetchMatches } = useStore();

  useEffect(() => {
    // Initial data fetch
    fetchMatches();

    // Anti-Ad / Popup Blocker
    const originalOpen = window.open;
    (window as any).open = function() { 
      console.warn("Blocked a popup attempt."); 
      return null; 
    };
    
    const handleSuspiciousClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && (target as HTMLAnchorElement).target === '_blank') {
        const href = (target as HTMLAnchorElement).href || '';
        if (href.includes('ads') || href.includes('track') || href.includes('pop')) {
          e.preventDefault();
          console.warn("Blocked a suspicious link click.");
        }
      }
    };
    document.addEventListener('click', handleSuspiciousClick, true);

    // Service Worker Registration
    const registerSW = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(reg => {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                window.location.reload();
              }
            });
          });
        }).catch(err => console.log('SW failed', err));
      }
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }

    return () => {
      document.removeEventListener('click', handleSuspiciousClick, true);
      window.removeEventListener('load', registerSW);
      (window as any).open = originalOpen;
    };
  }, [fetchMatches]);

  return (
    <>
      <Navigation />
      <Hero />
      <MatchGrid />
      <PlayerModal />
    </>
  );
}

export default App;
