import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import useStore from '../store/useStore';

const HeroSection = styled.div<{ bg: string }>`
  position: relative;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center 20%;
  padding: 6rem 2rem 4rem;
  overflow: hidden;
  min-height: 480px;
  display: flex;
  align-items: center;
  transition: background-image 0.5s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(10,10,15,1) 0%, rgba(10,10,15,0.8) 30%, transparent 100%),
                linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 40%);
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem 2rem;
  }
`;

const HeroInner = styled.div`
  position: relative;
  max-width: 800px;
  z-index: 2;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(232,23,58,0.15);
  border: 1px solid rgba(232,23,58,0.3);
  color: #ff6b87;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 4px 12px;
  border-radius: 2px;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const LiveDot = styled.span`
  width: 6px; height: 6px;
  background: var(--live);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
`;

const TitleArt = styled.div`
  max-width: 450px;
  margin-bottom: 1.5rem;
  img {
    width: 100%;
    max-height: 140px;
    object-fit: contain;
    object-position: left;
  }
`;

const HeroDesc = styled.p`
  color: var(--muted);
  font-size: 14px;
  max-width: 480px;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) { font-size: 13px; max-width: 100%; }
`;

const HeroCTAs = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const HeroBtn = styled.button`
  background: var(--red);
  color: #fff;
  border: none;
  padding: 11px 28px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  &:hover { background: var(--red-dark); }
  &:active { transform: scale(0.96); opacity: 0.8; }
`;

const HeroStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 0.5px solid var(--border);
`;

const StatItem = styled.div``;
const StatNum = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  color: var(--red);
  letter-spacing: 1px;
`;
const StatLabel = styled.div`
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

interface HeroAsset {
  bg: string;
  art: string;
}

const HERO_ASSETS: HeroAsset[] = [
  {
    bg: 'https://m.media-amazon.com/images/S/sonata-images-prod/CA_NBA_2026Playoffs_Sportsnet_Evergreen/61a3261f-d55d-4d24-98ff-fe9e6f01db4a._SX3840_FMjpg_.jpeg',
    art: 'https://m.media-amazon.com/images/S/sonata-images-prod/CA_NBA_2026Playoffs_Sportsnet_Evergreen/beefb8a4-ffda-4658-acd5-abc554310f1e._BR-6_AC_SX2000_FMpng_.png'
  },
  {
    bg: 'https://m.media-amazon.com/images/S/sonata-images-prod/TSN_NBA_Playoffs_2026_Evergreen/42b21cd9-b62d-4d0b-a349-bd9939ac62e9._SX3840_FMjpg_.jpeg',
    art: 'https://m.media-amazon.com/images/S/sonata-images-prod/TSN_NBA_Playoffs_2026_Evergreen/e69b0833-381e-4775-9ffc-79048eb1d88f._BR-6_AC_SX2000_FMpng_.png'
  }
];

const Hero: React.FC = () => {
  const { liveMatches, todayMatches } = useStore();
  
  const picked = useMemo(() => 
    HERO_ASSETS[Math.floor(Math.random() * HERO_ASSETS.length)], []
  );

  return (
    <HeroSection bg={picked.bg} id="hero-section">
      <HeroInner>
        <HeroBadge>
          <LiveDot />
          Live NBA Coverage
        </HeroBadge>
        <TitleArt>
          <img src={picked.art} alt="NBA" />
        </TitleArt>
        <HeroDesc>
          Watch every game of the 2026 NBA Playoffs live in HD. No blackouts, no cable required. Stream on any device.
        </HeroDesc>
        <HeroCTAs>
          <HeroBtn onClick={() => document.getElementById('live')?.scrollIntoView({behavior:'smooth'})}>
            ▶ Watch Now
          </HeroBtn>
        </HeroCTAs>
        <HeroStats>
          <StatItem>
            <StatNum>{liveMatches.length || '—'}</StatNum>
            <StatLabel>Live Right Now</StatLabel>
          </StatItem>
          <StatItem>
            <StatNum>{(liveMatches.length + todayMatches.length) || '—'}</StatNum>
            <StatLabel>Games Today</StatLabel>
          </StatItem>
          <StatItem>
            <StatNum>9+</StatNum>
            <StatLabel>Stream Sources</StatLabel>
          </StatItem>
          <StatItem>
            <StatNum>HD</StatNum>
            <StatLabel>Quality</StatLabel>
          </StatItem>
        </HeroStats>
      </HeroInner>
    </HeroSection>
  );
}

export default Hero;
