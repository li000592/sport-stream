import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import useStore from '../store/useStore';

const Overlay = styled.div<{ show: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  opacity: ${props => props.show ? 1 : 0};
  transition: all 0.3s;
`;

const ModalBox = styled.div`
  background: var(--bg2);
  border: 0.5px solid var(--border);
  border-radius: 12px;
  width: 95%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  @media (max-width: 768px) {
    width: 100%; height: 100%; max-height: 100vh; border-radius: 0;
  }
`;

const Header = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.5px solid var(--border);
`;

const Title = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.2rem;
  letter-spacing: 2px;
`;

const IconButton = styled.button`
  background: var(--bg3);
  border: 0.5px solid var(--border);
  color: var(--text);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:active { transform: scale(0.9); }
`;

const PlayerWrap = styled.div`
  background: #000;
  position: relative;
  padding-top: 56.25%;
  width: 100%;
`;

const PlayerIframe = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 1;
`;

const AdShield = styled.div<{ show: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 10;
  cursor: pointer;
  background: transparent;
  display: ${props => props.show ? 'block' : 'none'};
`;

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  gap: 8px;
  font-size: 14px;
`;

const StreamList = styled.div`
  padding: 14px 20px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StreamBtn = styled.button<{ active?: boolean }>`
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => props.active ? 'var(--red)' : 'var(--border)'};
  background: ${props => props.active ? 'var(--red)' : 'var(--bg3)'};
  color: ${props => props.active ? '#fff' : 'var(--muted)'};
  font-family: 'DM Sans', sans-serif;
  transition: all 0.15s;
  &:active { transform: scale(0.94); }
`;

const Tip = styled.div<{ warning?: boolean }>`
  width: 100%;
  font-size: 11px;
  color: ${props => props.warning ? '#ff6b87' : 'var(--muted)'};
  margin-bottom: 4px;
`;

const PlayerModal: React.FC = () => {
  const { isModalOpen, modalMatch, activeStreamUrl, availableStreams, isLoadingStreams, closeModal, setStreamUrl, openMatch } = useStore();
  const [showShield, setShowShield] = useState(false);
  const [tipText, setTipText] = useState('💡 Pro-tip: Unmute manually if needed. If a stream buffers, try another source.');
  const [isWarning, setIsWarning] = useState(false);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeStreamUrl) {
      setShowShield(true);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      
      setIsWarning(false);
      setTipText('💡 Pro-tip: Unmute manually if needed. If a stream buffers, try another source.');

      // iPad Watchdog
      watchdogRef.current = setTimeout(() => {
        setIsWarning(true);
        setTipText('⚠️ Stream taking too long? Try refreshing sources or pick a different Backup below.');
      }, 8000);
    }
    return () => {
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    };
  }, [activeStreamUrl]);

  const handleStreamSelect = (url: string) => {
    setStreamUrl(url);
    // User gesture -> attempt fullscreen
    if (containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (!isModalOpen) return null;

  return (
    <Overlay show={isModalOpen} onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <ModalBox>
        <Header>
          <Title>{modalMatch?.title || 'Loading...'}</Title>
          <div style={{display:'flex', gap:8}}>
            <IconButton onClick={toggleFullscreen} title="Fullscreen">⛶</IconButton>
            <IconButton onClick={() => modalMatch && openMatch(modalMatch)} title="Refresh Sources">🔄</IconButton>
            <IconButton onClick={closeModal}>✕</IconButton>
          </div>
        </Header>
        
        <PlayerWrap id="player-container" ref={containerRef}>
          <AdShield show={showShield} onClick={() => setShowShield(false)} />
          {!activeStreamUrl && !isLoadingStreams && (
            <Placeholder>
              <div style={{fontSize:'2.5rem'}}>▶</div>
              <div>Select a stream below to start watching</div>
            </Placeholder>
          )}
          {isLoadingStreams && <Placeholder>Loading backup streams...</Placeholder>}
          {activeStreamUrl && (
            <PlayerIframe 
              src={activeStreamUrl} 
              allowFullScreen 
              allow="autoplay; encrypted-media; fullscreen"
            />
          )}
        </PlayerWrap>

        <StreamList>
          <Tip warning={isWarning}>{tipText}</Tip>
          {availableStreams.map((st, i) => (
            <StreamBtn 
              key={i}
              active={activeStreamUrl === st.embedUrl}
              onClick={() => st.embedUrl && handleStreamSelect(st.embedUrl)}
            >
              {st.language || 'Backup'} {st.streamNo} {st.hd ? '· HD' : ''}
            </StreamBtn>
          ))}
          {availableStreams.length === 0 && !isLoadingStreams && <Tip>No streams available right now.</Tip>}
        </StreamList>
      </ModalBox>
    </Overlay>
  );
}

export default PlayerModal;
