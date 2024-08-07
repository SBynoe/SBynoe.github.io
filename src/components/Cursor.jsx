import React, { useEffect } from 'react';

const Cursor = () => {

  useEffect(() => {
    const cursorElements = document.getElementsByClassName('bg-black');

    const handleMouseMove = (e) => {
      for (let cursor of cursorElements) {
        cursor.style.top = e.pageY + "px";
        cursor.style.left = e.pageX + "px";
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
      <div  cursor-none className='bg-black' style={{
        borderRadius: '600px',
        height: '50px',
        width: '50px',
        display: 'block',
        position: 'relative',
        top: '0',
        left: '0',
        filter: 'invert(1)',
        mixBlendMode: 'difference',
        cursor: "crosshair",
        zIndex: "10000"
      }}>
        <div id="tip"></div>
        <div id='outline' style={{
          borderRadius: '50px',
          height: '50px',
          width: '50px',
          display: 'block'
        }}></div>
      </div>
  );
}

export default Cursor;

