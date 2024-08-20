import React from 'react';
const SliderComponent = ({ songs, activeIndex, onPlayClick, onPauseClick, onPrev, onNext }) => {

  const sliderStyle = {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1200px',
  };

  const getItemStyle = (index) => {
    const baseStyle = {
      position: 'absolute',
      top: '20%',
      transform: 'translateY(-50%)',
      padding: '20px',
      backgroundColor: 'rgba(104, 58, 58, .6)',
      borderRadius: '5px',
      zIndex: 10,
      transition: 'transform 0.5s, opacity 0.5s',
    };

    const stt = Math.abs(index - activeIndex);
    if (stt === 0) {
      return { ...baseStyle, transform: 'translateX(0) scale(1)', opacity: 1 };
    }

    const offset = 200; // Distance between items
    const scale = Math.max(0.5, 1 - 0.2 * stt); // Adjust for scaling non-centered items
    return {
      ...baseStyle,
      transform: `translateX(${(index - activeIndex) * offset}px) scale(${scale})`,
      opacity: .01 * scale, // Adjust opacity based on scale
    };
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'hsla(17, 100%, 56%, 1)',
    marginBottom: '10px',
  };

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 'xxx-large',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  };

  const nextButtonStyle = {
    ...buttonStyle,
    left: 'unset',
    right: '20px',
  };

  const prevButtonStyle = {
    ...buttonStyle,
    left: '20px',
  };

  // Define your slider styles here or move them to a CSS file


  return (
    <div className='slider' style={sliderStyle}>
      {songs.map((song, index) => (
        <div key={index} className='item' style={getItemStyle(index)}>
          <div id='item'>
            <div id='title' className="title" style={titleStyle}>{song.title}</div>
            <audio className="audio" src={song.src}></audio>
            <button className="play-btn" onClick={() => onPlayClick(index)}>Play</button><br />
            <button className="pause-btn" onClick={onPauseClick}>Pause</button>
          </div>
        </div>
      ))}
      <div id="slider-controls">
        <button id="prev" style={prevButtonStyle} onClick={onPrev}>&lt;</button>
        <button id="next" style={nextButtonStyle} onClick={onNext}>&gt;</button>
      </div>
    </div>
  );
};

export default SliderComponent;