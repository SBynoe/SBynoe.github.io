import React from 'react';
import proj1 from '../assets/ai-music.jpg';
import proj2 from '../assets/study.jpg';
import proj3 from '../assets/puzzle.jpg';
import proj4 from '../assets/real-estate.jpg';
import { Link } from 'react-router-dom';

const Work = () => {
  return (
    <div className='py-6 max-w-[1200px] mx-auto' id='Projects'>
      <div className='mx-auto px-4 md:px-8'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl lg:text-3xl text-white'>
              My <span>Projects</span>
            </h2>
            <p className='text-gray-500'>
              These are my latest projects for different clients:
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8'>
          <Link to="/research" className='group relative h-48 overflow-hidden rounded-lg shadow-lg md:h-80 '>
            <img src={proj1} alt='' className='absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110' />
          </Link>

          <a href='https://github.com/AinzOolGown/finalProject' className='group h-48 overflow-hidden rounded-lg shadow-lg md:col-span-2 md:h-80'>
            <img src={proj4} alt='' className='inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-105' />
          </a>

          <a href='/' className='group h-48 overflow-hidden rounded-lg shadow-lg md:col-span-2 md:h-80'>
            <img src={proj3} alt='' className='inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-105' />
          </a>

          <a href='https://github.com/ArtificialIdriss/MAD_QuizApp' className='group relative overflow-hidden rounded-lg flex h-48 items-end shadow-lg md:h-80'>
            <img src={proj2} alt='' className='absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110' />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Work;
