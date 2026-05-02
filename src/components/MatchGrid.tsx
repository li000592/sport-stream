import React from 'react';
import styled from '@emotion/styled';
import useStore from '../store/useStore';
import { Match, getBadgeUrl, getPosterUrl, categoryEmoji, formatTime, setReminder } from '../utils/api';

const Section = styled.div`
  padding: 1.5rem 2rem;
  @media (max-width: 768px) { padding: 1rem 1.25rem; }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 2px;
  color: var(--text);
`;

const SectionTag = styled.span<{ live?: boolean }>`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 2px;
  background: ${props => props.live ? 'rgba(34,197,94,0.15)' : 'rgba(245,197,24,0.12)'};
  color: ${props => props.live ? 'var(--live)' : 'var(--gold)'};
  border: 1px solid ${props => props.live ? 'rgba(34,197,94,0.3)' : 'rgba(245,197,24,0.25)'};
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;
  
  @media (max-width: 480px) { grid-template-columns: 1fr; }
  @media (min-width: 481px) and (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  @media (min-width: 769px) and (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 1201px) { grid-template-columns: repeat(5, 1fr); }
`;

const PosterImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
`;

const PosterWrap = styled.div`
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  background: #1a1a1a;
`;

const Card = styled.div`
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.15);
  }
  
  &:hover .poster-img {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.96);
    opacity: 0.8;
  }
`;

const PosterOverlay = styled.div`
  position: absolute;
  inset: 0;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 50%);
  z-index: 1;
`;

const CardCategory = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
`;

const LiveBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--live);
  background: rgba(0,0,0,0.4);
  padding: 2px 6px;
  border-radius: 4px;
`;

const UpcomingBadge = styled.span`
  font-size: 10px;
  color: var(--gold);
  font-weight: 600;
  background: rgba(0,0,0,0.4);
  padding: 2px 6px;
  border-radius: 4px;
`;

const CardTeams = styled.div`
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Team = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const TeamBadgeWrap = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  img { width: 36px; height: 36px; object-fit: contain; }
`;

const VSBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const VSText = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.2rem;
  color: var(--muted);
  letter-spacing: 1px;
`;

const CardFooter = styled.div`
  padding: 8px 14px;
  border-top: 0.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0,0,0,0.2);
`;

const WatchBtn = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--red);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemindBtn = styled.button`
  font-size: 10px;
  font-weight: 600;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.05);
  padding: 4px 8px;
  border-radius: 4px;
  border: 0.5px solid var(--border);
  transition: all 0.2s;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.1); color: var(--text); }
  &:active { transform: scale(0.92); }
`;

const FilterWrap = styled.div`
  padding: 1.5rem 2rem 0.5rem;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar { display: none; }
`;

const Pill = styled.div<{ active?: boolean }>`
  flex-shrink: 0;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${props => props.active ? 'var(--red)' : 'var(--border)'};
  background: ${props => props.active ? 'var(--red)' : 'var(--bg3)'};
  color: ${props => props.active ? '#fff' : 'var(--muted)'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover { background: ${props => props.active ? 'var(--red)' : 'var(--card)'}; color: var(--text); }
`;

interface MatchCardProps {
  match: Match;
  isLive: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isLive }) => {
  const { openMatch } = useStore();
  const home = match.teams?.home;
  const away = match.teams?.away;
  const poster = getPosterUrl(match);

  return (
    <Card onClick={() => openMatch(match)}>
      <PosterWrap>
        <PosterImg className="poster-img" src={poster || ''} referrerPolicy="no-referrer" onError={(e: any) => e.target.style.opacity = '0'} />
        <PosterOverlay>
          <CardCategory>{categoryEmoji(match.category)} {match.category}</CardCategory>
          {isLive ? (
            <LiveBadge><span className="live-dot" style={{width:6, height:6, background:'var(--live)', borderRadius:'50%'}}></span>LIVE</LiveBadge>
          ) : (
            <UpcomingBadge>{formatTime(match.date)}</UpcomingBadge>
          )}
        </PosterOverlay>
      </PosterWrap>
      <div className="card-content">
        {home || away ? (
          <CardTeams>
            <Team>
              <TeamBadgeWrap>
                {home?.badge ? <img src={getBadgeUrl(home.badge) || ''} referrerPolicy="no-referrer" /> : <span>{home?.name?.[0] || '?'}</span>}
              </TeamBadgeWrap>
              <div style={{fontSize:12, fontWeight:600, textAlign:'center'}}>{home?.name || '?'}</div>
            </Team>
            <VSBlock><VSText>VS</VSText></VSBlock>
            <Team>
              <TeamBadgeWrap>
                {away?.badge ? <img src={getBadgeUrl(away.badge) || ''} referrerPolicy="no-referrer" /> : <span>{away?.name?.[0] || '?'}</span>}
              </TeamBadgeWrap>
              <div style={{fontSize:12, fontWeight:600, textAlign:'center'}}>{away?.name || '?'}</div>
            </Team>
          </CardTeams>
        ) : (
          <div style={{padding:'12px 14px 0', fontSize:13, fontWeight:500, color:'var(--text)'}}>{match.title}</div>
        )}
        <CardFooter>
          <span style={{fontSize:11, color:'var(--muted)'}}>{match.sources?.length || 0} streams available</span>
          {isLive ? (
            <WatchBtn>Watch ▶</WatchBtn>
          ) : (
            <RemindBtn onClick={(e) => { e.stopPropagation(); setReminder(match.id, match.title, match.date); }}>
              🔔 Remind
            </RemindBtn>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

const MatchGrid: React.FC = () => {
  const { liveMatches, todayMatches, currentSport, setSportFilter, isLoading } = useStore();

  const sortNBA = React.useCallback((list: Match[]) => {
    const filterFn = (m: Match) => currentSport === 'all' || m.category === currentSport;
    return [...list].filter(filterFn).sort((a, b) => {
      const aIsBball = a.category === 'basketball' || a.title?.toLowerCase().includes('nba');
      const bIsBball = b.category === 'basketball' || b.title?.toLowerCase().includes('nba');
      if (aIsBball && !bIsBball) return -1;
      if (!aIsBball && bIsBball) return 1;
      return 0;
    });
  }, [currentSport]);

  const sortedLive = React.useMemo(() => sortNBA(liveMatches), [liveMatches, sortNBA]);
  const sortedToday = React.useMemo(() => sortNBA(todayMatches), [todayMatches, sortNBA]);

  const sports = [
    { id: 'all', label: 'All Sports' },
    { id: 'football', label: 'Football', emoji: '⚽' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀' },
    { id: 'american-football', label: 'NFL', emoji: '🏈' },
    { id: 'tennis', label: 'Tennis', emoji: '🎾' },
    { id: 'baseball', label: 'Baseball', emoji: '⚾' },
    { id: 'mma', label: 'MMA/UFC', emoji: '🥊' },
    { id: 'hockey', label: 'Hockey', emoji: '🏒' },
    { id: 'motorsport', label: 'F1', emoji: '🏎' },
  ];

  if (isLoading) return <Section><Grid>{[1,2,3,4,5].map(i => <div key={i} style={{height:160, background:'var(--card)', borderRadius:8, position:'relative', overflow:'hidden'}} className="skeleton" />)}</Grid></Section>;

  return (
    <>
      <FilterWrap id="sport-filter">
        {sports.map(s => (
          <Pill key={s.id} active={currentSport === s.id} onClick={() => setSportFilter(s.id)}>
            {s.emoji && <span>{s.emoji}</span>} {s.label}
          </Pill>
        ))}
      </FilterWrap>

      <Section id="live">
        <SectionHeader>
          <SectionTitle>Live Now</SectionTitle>
          <SectionTag live>● Live Now</SectionTag>
        </SectionHeader>
        <Grid>
          {sortedLive.map(m => <MatchCard key={m.id} match={m} isLive={true} />)}
        </Grid>
      </Section>

      <Section id="today">
        <SectionHeader>
          <SectionTitle>Today's Matches</SectionTitle>
          <SectionTag>Upcoming</SectionTag>
        </SectionHeader>
        <Grid>
          {sortedToday.map(m => <MatchCard key={m.id} match={m} isLive={false} />)}
        </Grid>
      </Section>
    </>
  );
};

export default MatchGrid;
