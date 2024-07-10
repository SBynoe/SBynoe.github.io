import React from 'react'
import { FaGithubSquare,FaInstagram, FaLinkedin, FaMailchimp} from 'react-icons/fa'

const Foot = () => {
  return (
    <div className='mt-12 w-max-[800px] border-t border-gray-500 text-center'>
        <p className='my-5 text-gray-500'>176 Sams Drive <br/> Fayetteville, GA, 30214</p>

        <div className='inline-flex text-gray-500 gap-4 text-3xl'>
          
          <a href='https://github.com/SBynoe'>
            <FaGithubSquare/>
          </a>
          
          <a href='https://www.instagram.com/s.m.bynoe/'>
            <FaInstagram/>
          </a>
          
          <a href='https://www.linkedin.com/in/sydney-bynoe-9023b4237/'>
            <FaLinkedin/>
          </a>
          
          <a href='mailto:sbynoe1@student.gsu.edu'>
            <FaMailchimp/>
          </a>

        </div>
    </div>
  )
}

export default Foot