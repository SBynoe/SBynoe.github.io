import React, { useEffect } from 'react';

const Cursor = () => {
  useEffect(() => {
    const smallCursor = document.querySelector('.small-cursor');
    const largeCursor = document.querySelector('.bg-black');

    let largeCursorX = 0, largeCursorY = 0;
    let targetX = 0, targetY = 0;

    const handleMouseMove = (e) => {
      const { pageX, pageY } = e;
      smallCursor.style.top = `${pageY}px`;
      smallCursor.style.left = `${pageX}px`;
      targetX = pageX;
      targetY = pageY;
    };

    const animateLargeCursor = () => {
      largeCursorX += (targetX - largeCursorX) * 0.2; // Adjust the factor for more or less lag
      largeCursorY += (targetY - largeCursorY) * 0.2;

      largeCursor.style.top = `${largeCursorY}px`;
      largeCursor.style.left = `${largeCursorX}px`;

      requestAnimationFrame(animateLargeCursor);
    };

    const handleMouseEnter = () => {
      largeCursor.classList.add('hover-active');
    };

    const handleMouseLeave = () => {
      largeCursor.classList.remove('hover-active');
    };

    const handleHoverEvents = (e) => {
      // Check if the element being hovered over is interactive
      const isInteractive = e.target.closest('a, button, [role="button"], input, textarea, select, .hover-enabled');
      if (isInteractive) {
        handleMouseEnter();
      } else {
        handleMouseLeave();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleHoverEvents);
    document.addEventListener('mouseout', handleMouseLeave);
    animateLargeCursor(); // Start the animation loop

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleHoverEvents);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <div className="Cursor">
      <style>
        {`
          body {
            cursor: none; /* Hide the default cursor */
          }

          .small-cursor {
            position: relative;
            height: 8px;
            width: 8px;
            background-color: grey;
            border-radius: 50%;
            transform: translate(-50%, -50%); /* Center the cursor */
            pointer-events: none; /* Ensure it doesn't block interactions */
            z-index: 10001;
          }

          .bg-black {
            cursor: crosshair; /* Set custom cursor appearance */
            border-radius: 600px;
            height: 50px;
            width: 50px;
            display: block;
            position: relative;
            filter: invert(1);
            mix-blend-mode: difference;
            z-index: 10000;
            transform: translate(-50%, -65%); /* Center the custom cursor */
            pointer-events: none; /* Ensure it doesn't block interactions */
            transition: transform 0.3s ease; /* Smooth transition for hover effect */
          }

          .bg-black.hover-active {
            pointer-events: none;
            cursor: none !important; /* Hide the default cursor when hover is active */
            transform: translate(-50%, -65%) scale(2); /* Scale up the large cursor on hover */
          }
        `}
      </style>

      <div className='small-cursor'></div>
      <div className='bg-black'></div>
    </div>
  );
}

export default Cursor;
