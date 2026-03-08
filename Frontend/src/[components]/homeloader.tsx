import React from 'react';
import styled from 'styled-components';

const HomeLoader = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        {/* 👇 Increased width, height, and viewBox to 4000x800 to contain the 500px text */}
        <svg width="4000" height="800" viewBox="0 0 4000 800" className="text-svg">
          <defs>
            <linearGradient id="leadequator-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />   
              <stop offset="30%" stopColor="#FDE047" />  
              <stop offset="60%" stopColor="#EAB308" />  
              <stop offset="100%" stopColor="#EF4444" /> 
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
    width: 100%;
  }

  /* This ensures the massive SVG scales down to fit smaller screens automatically */
  .text-svg {
    max-width: 100%;
    height: auto;
  }

  .animated-text {
    font-family: 'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    
    /* 👇 Massive Font Size: 500px */
    font-size: 500px; 
    font-weight: 900;
    letter-spacing: 20px; /* Scaled up letter spacing */
    fill: transparent;
    stroke: url(#leadequator-gradient);
    stroke-width: 8px; /* Thickened the stroke so the lines don't look invisible at 500px */
    stroke-linecap: round;
    stroke-linejoin: round;
    
    /* 👇 Increased dash array/offset because 500px letters have massive perimeters */
    stroke-dasharray: 4000;
    stroke-dashoffset: 4000;
    
    /* Bumped animation to 5s so the longer lines have time to draw smoothly */
    animation: textDraw 5s ease-in-out infinite alternate; 
  }

  @keyframes textDraw {
    0% {
      /* 👇 Match the new offset here */
      stroke-dashoffset: 4000; 
      fill: transparent;
    }
    80% {
      stroke-dashoffset: 0;
      fill: transparent;
    }
    100% {
      stroke-dashoffset: 0;
      fill: rgba(234, 179, 8, 0.1); 
    }
  }
`;

export default HomeLoader;