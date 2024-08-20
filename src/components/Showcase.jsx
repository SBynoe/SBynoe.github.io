import React, { useState, useCallback } from 'react';
import AudioVisual from './AudioVisualizer';

const Showcase = () => {
  const [activeIndex, setActiveIndex] = useState(3);
  //Song imports
  const songs = [
    { title: 'Dance', src: '../songs/DANCE222.wav' },
    { title: 'Brent X Cole', src: '../songs/Brent X Cole.wav' },
    { title: 'DPAT', src: '../songs/DPAT TYPE BEAT.wav' },
    { title: 'Lions Gate', src: '../songs/Lions Gate.wav' },
    { title: 'Runnin Down', src: '../songs/runnindown.wav' },
    { title: 'Never Gets Better', src: '../songs/NEVERGETSBETTER.wav' },
    { title: 'NYC', src: '../songs/nyc.wav' },
  ];

  //slider next and prev functions
  const handleNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % songs.length);
  }, [songs.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  }, [songs.length]);

  return (
    <div className='showcase'>
      <AudioVisual
        songs={songs}
        activeIndex={activeIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};

export default Showcase;
