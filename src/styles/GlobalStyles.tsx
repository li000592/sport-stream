import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

      * { 
        margin: 0; padding: 0; box-sizing: border-box; 
        -webkit-tap-highlight-color: transparent;
      }

      :root {
        --red: #E8173A;
        --red-dark: #b01029;
        --gold: #F5C518;
        --bg: #0a0a0f;
        --bg2: #111118;
        --bg3: #18181f;
        --card: #1c1c25;
        --border: rgba(255,255,255,0.07);
        --text: #f0f0f0;
        --muted: #888899;
        --live: #22c55e;
        --safe-bottom: env(safe-area-inset-bottom);
      }

      body {
        background: var(--bg);
        color: var(--text);
        font-family: 'DM Sans', sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
      }

      .no-scrollbar::-webkit-scrollbar { display: none; }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `}
  />
);

export default GlobalStyles;
