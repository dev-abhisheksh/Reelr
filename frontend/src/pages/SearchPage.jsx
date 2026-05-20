import React, { useEffect, useState } from 'react'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { SearchAPI } from '../api/search.api';
import { useNavigate } from 'react-router-dom';

const SearchSkeleton = () => {
  return (
    <div className='mt-5 flex flex-col gap-4'>
      {
        Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className='flex items-center gap-3 animate-pulse'
          >
            <div className='w-12 h-12 rounded-full bg-[#24292f]'></div>

            <div className='flex flex-col gap-2'>
              <div className='w-32 h-3 rounded bg-[#24292f]'></div>
              <div className='w-24 h-3 rounded bg-[#24292f]'></div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

const SearchPage = () => {

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearInputField = () => {
    setSearch("");
    setUsers([]);
  }

  useEffect(() => {

    if (!search.trim()) {
      setUsers([]);
      return;
    }

    let isActive = true;

    const delayDebounceFn = setTimeout(() => {

      const searchUsers = async () => {

        try {

          setLoading(true);

          const result = await SearchAPI(search);

          if (isActive) {
            setUsers(result.data.users);
          }

        } catch (error) {

          console.error("Error searching users:", error);

        } finally {

          if (isActive) {
            setLoading(false);
          }

        }
      }

      searchUsers();

    }, 500);

    return () => {
      isActive = false;
      clearTimeout(delayDebounceFn);
    };

  }, [search]);

  return (
    <div className='flex justify-center min-h-screen w-full bg-[#0c1115] text-white'>

      <div className='w-full max-w-2xl px-4'>

        {/* Search Input */}

        <div className='flex px-4 items-center justify-between mt-5 h-10 w-full bg-[#24292f] rounded-3xl'>

          <input
            className='text-white bg-transparent border-0 outline-0 w-full placeholder:text-gray-400'
            type="text"
            placeholder='Search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {
            search && (
              <IoIosCloseCircleOutline
                onClick={clearInputField}
                size={22}
                className='text-gray-300 cursor-pointer hover:text-white transition'
              />
            )
          }

        </div>

        {/* Loading Skeleton */}

        {
          loading && <SearchSkeleton />
        }

        {/* Results */}

        {
          !loading && users.length > 0 && (
            <div className='mt-5 flex flex-col gap-1'>

              {
                users.map((user) => (

                  <div
                    key={user._id}
                    onClick={()=> navigate(`/user/${user.username}`)}
                    className='flex items-center justify-between p-3 rounded-2xl hover:bg-[#161b22] transition cursor-pointer'
                  >

                    <div className='flex items-center gap-3'>

                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className='w-12 h-12 rounded-full object-cover'
                      />

                      <div>

                        <h2 className='font-semibold text-sm'>
                          {user.username}
                        </h2>

                        <p className='text-gray-400 text-sm'>
                          {user.fullName}
                        </p>

                      </div>

                    </div>

                    <div className='text-xs text-gray-400'>
                      {user.followersCount} followers
                    </div>

                  </div>
                ))
              }

            </div>
          )
        }

        {/* Empty State */}

        {
          !loading &&
          search &&
          users.length === 0 && (
            <div className='flex justify-center items-center mt-20 text-gray-500'>
              No users found
            </div>
          )
        }

      </div>

    </div>
  )
}

export default SearchPage