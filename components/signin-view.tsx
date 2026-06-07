"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, UserPlus, Globe, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import ShowcaseSidebar from "./showcase-sidebar"

export default function SigninView() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    try {
      await login(formData)
      toast.success("Signed in successfully!")
    } catch (error: any) {
      const message = error.message || "Sign in failed. Please try again."
      toast.error(message)
      
      if (error.code === "INVALID_CREDENTIALS") {
        setErrors({ email: "Invalid email or password" })
      } else if (error.code === "ACCOUNT_LOCKED") {
        setErrors({ email: "Account locked due to too many failed attempts" })
      } else if (error.code === "ACCOUNT_DISABLED") {
        setErrors({ email: "Account has been disabled" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white md:bg-[#1b1614] font-sans selection:bg-orange-500/20 text-[#2a2926] overflow-x-hidden">
      
      {/* Left Panel: Shared Showcase Sidebar */}
      <ShowcaseSidebar />

      {/* Right Panel: White Card Form */}
      <div className="w-full md:w-1/2 bg-white md:rounded-l-[48px] lg:rounded-l-[64px] flex flex-col justify-between p-6 sm:p-12 md:p-16 min-h-screen relative z-20 shadow-2xl">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between w-full mb-6 md:mb-0">
          {/* Logo */}
          <div className="flex items-center">
            <Image 
              src="/logos/logo.png" 
              alt="EngageIQ Logo" 
              width={160} 
              height={48}
              className="w-40 h-auto object-contain"
              priority
            />
          </div>

          {/* Top Right Toggle */}
          <div>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-neutral-400" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>

        {/* Sign In Form Container */}
        <motion.div 
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
          className="my-auto max-w-[420px] w-full mx-auto py-4 md:py-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 mb-6 sm:mb-8 tracking-tight font-sans text-center sm:text-left">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pl-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="amelie.laurent@example.com"
                className={`w-full px-5 py-3 sm:py-4 bg-white border ${errors.email ? 'border-red-500' : 'border-neutral-200'} rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium`}
                required
              />
              {errors.email && <p className="text-xs text-red-500 pl-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full px-5 py-3 sm:py-4 bg-white border ${errors.password ? 'border-red-500' : 'border-neutral-200'} rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 stroke-[1.5]" />
                  ) : (
                    <Eye className="w-5 h-5 stroke-[1.5]" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 pl-1">{errors.password}</p>}
            </div>

            {/* Forgot password link */}
            <div className="pl-1">
              <Link href="/forgot-password" className="text-sm font-semibold text-[#ff5e36] hover:text-[#e04f2b] transition-colors hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4.5 bg-gradient-to-r from-[#ff5e36] to-[#ff2a6d] hover:brightness-105 active:scale-[0.995] text-white font-semibold rounded-2xl text-base tracking-wide transition-all shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2.5]">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 pt-4 mt-6 sm:pt-6 sm:mt-8 w-full gap-4 md:gap-0 font-sans">
          {/* Copyright */}
          <div>
            <span>© 2005-2026 EngageIQ Inc.</span>
          </div>

          {/* Help & Language selectors */}
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-neutral-800 transition-colors font-medium">
              Contact Us
            </Link>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-800 transition-colors font-medium">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>English</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
          </div>
        </div>

      </div>

    </main>
  )
}
