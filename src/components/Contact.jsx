import React from 'react'

const Contact = () => {
  return (
    <div className='flex justify-center my-5 h-full sm:h-[70vh] items-center'>
        <div className='max-w-[1200px] mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2'>

                <div className='p-6 mr-2 bg-gray-800 rounded-xl flex flex-col justify-around' id="Contact">
                    <h1 className='text-4xl sm:text-5xl text-white'>
                        Contact <span>Me</span>
                    </h1>

                    <p className='text-normal text-lg text-gray-400 mt-2'>
                        Let's connect on LinkedIn <br/> or send me an Email
                    </p>

                    <div className='flex items-center mt-2 text-gray-400'>
                    <a href='mailto:sbynoe1@student.gsu.edu'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                    </a>
                    

                        
                        <div className='ml-4 text-md tracking-wide font-semibold w-40'>
                            <p>Sydney Bynoe</p>
                        </div>
                    </div>
                </div>
                
                <form action='https://getform.io/f/panvvrka' method='post' className='p-6 flex flex-col justify-center max-w-[700px]'>
                    <div className='flex flex-col'>
                        <input type='name' name='name' id='name' placeholder='Full Name' className='w-100 mt-2 p-3 rounded-lg bg-gray-800 border-gray-700 text-white'/>
                    </div>

                    <div className='flex flex-col mt-2'>
                        <input type='email' name='email' id='email' placeholder='Email' className='w-100 mt-2 py-3 px-3 rounded-lg bg-gray-800 border-gray-700 text-white'/>
                    </div>

                    <div className='flex flex-col mt-2'>
                        <textarea name='message' id='message' placeholder='Your Message' className='w-100 mt-2 py-3 px-3 rounded-lg bg-gray-800 border-gray-700 text-white'/>
                    </div>

                    <button type='submit' className='bg-primary-color text-white py-3 px-6 rounded-lg mt-3'>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Contact