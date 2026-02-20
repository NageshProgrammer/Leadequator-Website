import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        <svg width="600" height="100" viewBox="0 0 600 100" className="text-svg">
          <defs>
            {/* Custom Theme Colors for Leadequator */}
            <linearGradient id="leadequator-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />   {/* Bright White */}
              <stop offset="30%" stopColor="#FDE047" />  {/* Light Yellow */}
              <stop offset="60%" stopColor="#EAB308" />  {/* Primary Gold Accent (from Pilot badge) */}
              <stop offset="100%" stopColor="#EF4444" /> {/* Subtle Red (from lightning icon) */}
            </linearGradient>
          </defs>
          
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            className="animated-text"
          >
            LEADEQUATOR
          </text>
        </svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .text-svg {
    max-width: 100%;
    height: auto;
  }

  .animated-text {
    /* Kept the rounded, bold font for the glowing neon effect */
    font-family: 'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 68px;
    font-weight: 900;
    letter-spacing: 2px;
    fill: transparent;
    stroke: url(#leadequator-gradient); /* Now using your theme colors */
    stroke-width: 3px;
    stroke-linecap: round;
    stroke-linejoin: round;
    
    /* Animation logic */
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    animation: textDraw 3s ease-in-out infinite alternate;
  }

  .sub-text {
    margin-top: -10px;
    color: #9CA3AF; /* A softer gray to match the dark theme background */
    font-family: sans-serif;
    font-size: 14px;
    letter-spacing: 1px;
  }

  @keyframes textDraw {
    0% {
      stroke-dashoffset: 600;
      fill: transparent;
    }
    80% {
      stroke-dashoffset: 0;
      fill: transparent;
    }
    100% {
      stroke-dashoffset: 0;
      fill: rgba(234, 179, 8, 0.1); /* Adds a faint golden glow inside when fully drawn */
    }
  }
`;

export default Loader;