import React from 'react'

const SearchPage = () => {
  return (
    <div className='flex justify-center h-screen w-full bg-[#0c1115]'>
      <div className='flex px-4  items-center justify-between  mt-5 h-10 w-[95%] bg-[#24292f] rounded-3xl'>
        <input className='text-white broder-0 outline-0' type="text" placeholder='Search' />
        <div className='rounded-full bg-[#e9e9e9] w-5 h-5 flex items-center justify-center'>
          <span className='text-s leading-none'>×</span>
        </div>
      </div>
    </div>
  )
}

export default SearchPage