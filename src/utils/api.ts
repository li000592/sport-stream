export const API = 'https://streamed.pk/api';
export const IMG = 'https://streamed.pk';

export interface Source {
  source: string;
  id: string;
  language?: string;
  streamNo?: number;
  hd?: boolean;
  embedUrl?: string;
}

export interface Team {
  name: string;
  badge: string;
}

export interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  poster?: string;
  popular?: boolean;
  teams?: {
    home: Team;
    away: Team;
  };
  sources: Source[];
}

export async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status.toString());
    return await r.json();
  } catch(e: any) { 
    console.error(`Fetch error: ${e.message}`);
    return null; 
  }
}

export function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

export function getBadgeUrl(badge: string): string | null {
  if (!badge) return null;
  if (badge.startsWith('http')) return badge;
  if (badge.startsWith('/')) return `${IMG}${badge}`;
  
  if (badge.length > 50) {
    return `${IMG}/api/images/proxy/${badge}.webp`;
  }
  
  const id = badge.includes('-badge') ? badge : `${badge}-badge`;
  return `${IMG}/api/images/badge/${id}.webp`;
}

export function getPosterUrl(match: Match): string | null {
  if (match.poster) {
    if (match.poster.startsWith('http')) return match.poster;
    if (match.poster.startsWith('/')) return `${IMG}${match.poster}`;
    return `${IMG}/api/images/proxy/${match.poster}.webp`;
  }
  
  const home = match.teams?.home;
  const away = match.teams?.away;
  if (!home?.badge || !away?.badge) return null;
  
  const hId = home.badge.replace('-badge', '');
  const aId = away.badge.replace('-badge', '');
  return `${IMG}/api/images/poster/${hId}/${aId}.webp`;
}

export function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    football: '⚽',
    basketball: '🏀',
    tennis: '🎾',
    mma: '🥊',
    baseball: '⚾',
    hockey: '🏒',
    motorsport: '🏎',
    'american-football': '🏈'
  };
  return map[cat] || '🏅';
}

export function setReminder(id: string, title: string, date: number): void {
  // 1. Browser Notification Check
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("SportFlix Reminder Set!", {
          body: `We'll try to notify you when ${title} starts.`,
          icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png'
        });
      }
    });
  }

  // 2. Reliable iPad Fallback: Add to Calendar (.ics)
  const startTime = new Date(date);
  const endTime = new Date(date + 2 * 3600000); // Assume 2 hours
  
  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `URL:${window.location.href}`,
    `DTSTART:${formatDate(startTime)}`,
    `DTEND:${formatDate(endTime)}`,
    `SUMMARY:🏀 SportFlix: ${title}`,
    `DESCRIPTION:Watch the game live on SportFlix: ${window.location.href}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT10M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Game starting in 10 minutes!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert(`✅ Reminder set for ${title}!\n\nA calendar file has been generated to ensure you get a notification on your iPad/iPhone.`);
}
