import React from 'react'
import profilepic from '../assets/profilepicMain.png'
import {AiFillLinkedin, AiFillGithub, AiFillInstagram} from 'react-icons/ai'
// import { SocialIcon } from 'react-social-icons'
import {TypeAnimation} from 'react-type-animation'

const Hero = () => {
  return (
    <div>
        <div className='my-7 sm:my-0 max-w-[1200px] h-auto mx-auto flex flex-col-reverse sm:flex-row
                        justify-center align-center'>


            <div className='flex-col my-auto mx-auto md:mx-0'>
                <p className='md:text-5xl sm:text-4xl font-bold text-gray-200'>Hi! I'm Sydney Bynoe</p>
                    <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
                        <TypeAnimation sequence={[
                            "Frontend Dev",
                            1000,
                            "Webdesigner",
                            1000,
                            "Musician",
                            1000,

                        ]}
                        wrapper='span'
                        speed={10}
                        repeat={Infinity}
                        />
                    </h1>
                    <div className='flex justify-center items-center'>
                        <p className='md:text-5xl sm:text-4xl text-xl font-bold text-gray-500'>with a 3+ years experience</p>
                    </div>
                    <div className='text-5xl flex justify-start gap-16 my-7 text-red-950'>
                        <a href='https://www.linkedin.com/in/sydney-bynoe-9023b4237/'>
                            <AiFillLinkedin/>
                        </a>
                        <a href='https://github.com/SBynoe'>
                            <AiFillGithub/>
                        </a>
                        <a href='https://www.instagram.com/s.m.bynoe/'>
                            <AiFillInstagram/>
                        </a>
                    </div>
                    <div class="relative inline-flex group my-3">
                        <div class="absolute transition-all duration-1000 opacity-40 -inset-px bg-gradient-to-r
                        
                        from-[#ff7a7a] via-[#ffbe44] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-70 group-hover:-inset-1 group-hover:duration-200">
                        </div>
                        <a href='../2024_Resume.pdf' title='Download Resume' role='button' download="Resume"
                            class="w-[190px] h-[60px] relative inline-flex items-center justify-center px-8 py-4 text-lg
                                font-bold text-white transition-all duration-200 bg-primary-color font-pj rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">Download Resume
                        </a>
                    </div>
            </div>

            <div className='my-auto'>
                <img className='w-[300px] sm:w-[500px] mx-auto h-auto' src={profilepic} alt='profile pic'/>
            </div>
        </div>

    </div>
  )
}

export default Hero