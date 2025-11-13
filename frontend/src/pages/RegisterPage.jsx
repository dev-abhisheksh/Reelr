import React, { useState } from "react";
import { registerUser } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser({ email, password, username, fullName, role: "viewer" });
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Register error", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A] px-4">
      <div className="w-full max-w-md bg-[#1F1A30] rounded-xl shadow-2xl p-8">
        {/* Header */}
        <h1 className="text-white font-bold text-3xl mb-1">Register</h1>
        <p className="text-[#8F8A99] mb-8 text-sm">Create your new account</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username"
            className="border-b border-gray-400 bg-transparent p-2 text-white text-sm focus:border-[#0DF6E3] transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Full Name"
            className="border-b border-gray-400 bg-transparent p-2 text-white text-sm focus:border-[#0DF6E3] transition"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="border-b border-gray-400 bg-transparent p-2 text-white text-sm focus:border-[#0DF6E3] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border-b border-gray-400 bg-transparent p-2 text-white text-sm focus:border-[#0DF6E3] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-[#0DF6E3] text-black py-3 rounded-lg font-bold tracking-wide uppercase 
            active:scale-95 transition"
          >
            Register
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-between mt-6 text-sm">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white transition"
          >
            Login
          </Link>

          <p className="text-gray-400 hover:text-white transition cursor-pointer">
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
