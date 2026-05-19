import React, { useState } from 'react'
import { IoIosCloseCircleOutline } from "react-icons/io";

const SearchPage = () => {

  const [search, setSearch] = useState("");

  const clearInputField = () => {
    setSearch("");
  }

  return (
    <div className='flex justify-center h-screen w-full bg-[#0c1115]'>
      <div className='flex px-4 items-center justify-between mt-5 h-10 w-[95%] bg-[#24292f] rounded-3xl'>

        <input
          className='text-white bg-transparent border-0 outline-0 w-full'
          type="text"
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {
          search && (
            <IoIosCloseCircleOutline
              onClick={clearInputField}
              size={20}
              className='text-white'
            />
          )
        }

      </div>
    </div>
  )
}

export default SearchPage