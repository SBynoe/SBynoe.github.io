import React from 'react'
import aboutImg from "../assets/sydBass.png"

const About = () => {
  return (
    <div className='py-10 text-white bg-[#0a0a0a] h-auto' id="About">
        <div className='flex sm:flex-row flex-col-reverse items-center md:gap-6 gap-12 px-10 max-w-6xl mx-auto'>
            <div>
                <div className='w-[400px] h-full'>
                    <img
                        src={aboutImg}
                        alt=''
                        className='object-cover bg-gray-700 rounded-xl h-[300px] filter saturate brightness-100'
                    />
                </div>
            </div>

            <div>
                <div className='p-2'>
                    <div className='text-gray-300 my-3'>
                        <h3 className='text-4xl font-semibold mb-5'>About<span className='primary-text'> Me</span></h3>
                        <p className='text-justify leading-7 w-11/12 mx-auto'>
                        I am a senior at Georgia State University majoring in Computer Science.
                        My main expertise is front-end Development.
                        Future goals I have are to create a start-up centering around the music scene.
                        Let's connect!
                        </p>
                    </div>
                </div>

                <div className='flex mt-10 items-center gap-7'>
                    <div className='bg-[#333333]/40 p-5 rounded-lg'>
                        <h3 className='md:text-4xl text-2xl font-semibold text-white'>5
                            <span>+</span>
                        </h3>
                        <p><span className='md:text-base text-xs'>Projects</span></p>
                    </div>

                    <div className='bg-[#333333]/40 p-5 rounded-lg'>
                        <h3 className='md:text-4xl text-2xl font-semibold text-white'>3
                            <span>+</span>
                        </h3>
                        <p><span className='md:text-base text-xs'>Years of Experience</span></p>
                    </div>

                    <div className='bg-[#333333]/40 p-5 rounded-lg'>
                        <h3 className='md:text-4xl text-2xl font-semibold text-white'>15
                            <span>+</span>
                        </h3>
                        <p><span className='md:text-base text-xs'>Song Showcases</span></p>
                    </div>
                </div>
            </div>

        </div>
        
    </div>
  )
}

export default About