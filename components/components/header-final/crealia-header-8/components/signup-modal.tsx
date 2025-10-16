"use client"

import type React from "react"
import { useState } from "react"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup:", formData)
  }

  const handleGoogleSignup = () => {
    console.log("Google signup")
  }

  const handleSkip = () => {
    console.log("Skip for now")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.4))",
        }}
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* User icon at top */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Create a new account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-3 rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            Sign up
          </button>
        </form>

        {/* OR divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon className="w-5 h-5 mr-3" />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        {/* Login link */}
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button className="text-blue-600 font-medium hover:underline">Login</button>
        </div>

        {/* Skip button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleSkip}
            className="flex items-center justify-center mx-auto text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="mr-1">Skip for now</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
