import React, { useEffect, useState } from 'react'
import { loginUser } from '../api/auth.api'
import { useNavigate } from 'react-router-dom'


const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Form submitted with:", { email, password });

        try {
            const res = await loginUser({ email, password })
            console.log("Login response:", res);
            navigate("/")
        } catch (error) {
            console.error("Login error:", error);
        }
    }



    return (
        <div>
            <div className='flex justify-center items-center w-full h-screen gap-10 bg-[#777777]'>

                <div className='bg-[#1F1A30] h-[85%] w-[80%] rounded-lg flex flex-col gap-2'>
                    <div>
                        <img src="https://images3.alphacoders.com/134/1346768.jpeg" alt=""
                            className='rounded-t-lg'
                        />
                    </div>
                    <div className='flex flex-col justify-around h-full w-full'>
                        <div className='flex flex-col pl-7'>
                            <h1 className='text-white font-bold text-3xl'>Login</h1>
                            <p className='text-[#76727D] font-semibold'>Please login to continue</p>
                        </div>
                        <div className='flex flex-col justify-center items-center gap-4'>
                            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                <input
                                    type="text"
                                    placeholder='Enter email'
                                    className=" border-white border-b-2 p-2  outline-none text-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder='Enter password'
                                    className='border-white border-b-2 p-2  outline-none text-white'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                className='bg-[#0DF6E3] rounded-lg py-2 text-xl font-black uppercase'
                                    type='submit'
                                >
                                    Login
                                </button>
                            </form>
                            <div className='flex gap-5'>
                                <p className='text-gray-400 hover:text-white text-[13px] font-semibold'>Sign Up</p>
                                <p className='text-gray-400 hover:text-white text-[13px] font-semibold'>Forgot Password?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage