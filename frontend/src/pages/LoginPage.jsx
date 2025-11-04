import React, { useEffect, useState } from 'react'
import { loginUser } from '../api/auth.api'
import { useNavigate } from 'react-router-dom'


const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async(e)=>{
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
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    type="text"
                    placeholder='Enter email'
                    className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder='enter password'
                    className='border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type='submit'
                >
                    Login
                </button>
            </form>

        </div>
    )
}

export default LoginPage