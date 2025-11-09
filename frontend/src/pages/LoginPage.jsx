import React, { useEffect, useState } from 'react'
import { loginUser } from '../api/auth.api'
import { Link, useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'


const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await loginUser({ email, password })
                // console.log("Login response:", res);
                    toast.success("LoggedIn Success")
            navigate("/")
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className='h-screen w-full flex justify-center items-center'>
            <div className="bg-[#1F1A30] h-[85%] w-[90%] max-w-4xl rounded-lg flex flex-col md:flex-row overflow-hidden shadow-2xl m-auto">

                {/* LEFT — IMAGE */}
                <div className="w-full md:w-1/2 h-[250px] md:h-auto">
                    <img
                        src="https://res.cloudinary.com/dranpsjot/image/upload/v1762708923/sukuna_xuixpc.jpg"
                        className="w-full h-full object-cover"
                        alt="Login visual"
                    />
                </div>

                {/* RIGHT — FORM */}
                <div className="flex flex-col justify-center gap-5 h-full w-full md:w-1/2 px-8 py-6 md:py-12">
                    <div>
                        <h1 className="text-white font-bold text-3xl mb-2">Login</h1>
                        <p className="text-[#76727D] font-semibold">Please login to continue</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">

                            <input
                                type="email"
                                placeholder="Enter email"
                                className="bg-transparent border-white/30 border-b-2 p-3 outline-none text-white placeholder:text-gray-500 focus:border-[#0DF6E3] transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Enter password"
                                className="bg-transparent border-white/30 border-b-2 p-3 outline-none text-white placeholder:text-gray-500 focus:border-[#0DF6E3] transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                className="bg-[#0DF6E3] hover:bg-[#0BE3D1] rounded-lg py-3 text-xl font-black uppercase transition-colors mt-2 text-black flex justify-center items-center"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-6 border-white rounded-full animate-spin"></div>
                                ) : (
                                    "Login"
                                )}

                            </button>
                        </form>

                        <div className="flex justify-center gap-6 pb-2">
                            <p className="text-gray-400 hover:text-white text-sm font-semibold cursor-pointer transition-colors">
                                <Link to="/register">Sign Up</Link>
                            </p>
                            <p className="text-gray-400 hover:text-white text-sm font-semibold cursor-pointer transition-colors">
                                Forgot Password?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage