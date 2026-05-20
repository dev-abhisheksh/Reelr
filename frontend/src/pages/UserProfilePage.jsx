import React from 'react'

const UserProfilePage = () => {
    return (
        <div className='w-full h-screen flex  justify-center text-2xl font-bold'>

            {/* User Details */}
            <div className='p-10 w-full h-full flex flex-col items-center gap-5'>
                <div className='h-50 w-50 rounded-full overflow-hidden flex justify-center items-center'>
                    <img src="https://imgs.search.brave.com/EKKYeZmGXbbdpm0vz1aQEhEqWkO08dfqpEBFrlOFsS4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/dWhkcGFwZXIuY29t/L3dhbGxwYXBlci9z/YXRvcnUtZ29qby1q/amstc3VuZ2xhc3Nl/cy0zMzJANUBt" alt="" />
                </div>

                <div>
                    <h2>Abhishek </h2>
                </div>
            </div>

        </div>
    )
}

export default UserProfilePage