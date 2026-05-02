import React from 'react';
import styled from '@emotion/styled';
import useStore from '../store/useStore';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(10,10,15,0.98), rgba(10,10,15,0.85));
  backdrop-filter: blur(12px);
  border-bottom: 0.5px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 2rem;
  height: 60px;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
    justify-content: center;
  }
`;

const Logo = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 2px;
  color: var(--red);
  flex-shrink: 0;
  span { color: var(--text); }
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 1.5rem;
  list-style: none;
  font-size: 13px;
  font-weight: 500;

  @media (max-width: 768px) { display: none; }
`;

const NavLink = styled.a<{ active?: boolean }>`
  color: ${props => props.active ? 'var(--text)' : 'var(--muted)'};
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
  user-select: none;
  &:hover { color: var(--text); }
`;

const BottomNav = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  border-top: 0.5px solid var(--border);
  padding: 8px 0 calc(8px + var(--safe-bottom));
  z-index: 1000;
  justify-content: space-around;

  @media (max-width: 768px) { display: flex; }
`;

const BottomNavItem = styled.a<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${props => props.active ? 'var(--text)' : 'var(--muted)'};
  text-decoration: none;
  font-size: 10px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;

  &:active {
    transform: scale(0.92);
    opacity: 0.8;
  }
`;

const BottomNavIcon = styled.span`
  font-size: 20px;
`;

const Navigation: React.FC = () => {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Nav>
        <Logo>SPORT<span>FLIX</span></Logo>
        <NavLinks>
          <li><NavLink active onClick={() => handleScroll('live')}>Live Now</NavLink></li>
          <li><NavLink onClick={() => handleScroll('today')}>Schedule</NavLink></li>
          <li><NavLink onClick={() => handleScroll('sport-filter')}>Sports</NavLink></li>
        </NavLinks>
      </Nav>

      <BottomNav>
        <BottomNavItem active onClick={() => handleScroll('live')}>
          <BottomNavIcon>📺</BottomNavIcon>
          <span>Live Now</span>
        </BottomNavItem>
        <BottomNavItem onClick={() => handleScroll('today')}>
          <BottomNavIcon>📅</BottomNavIcon>
          <span>Schedule</span>
        </BottomNavItem>
        <BottomNavItem onClick={() => handleScroll('sport-filter')}>
          <BottomNavIcon>🏆</BottomNavIcon>
          <span>Sports</span>
        </BottomNavItem>
      </BottomNav>
    </>
  );
}

export default Navigation;
