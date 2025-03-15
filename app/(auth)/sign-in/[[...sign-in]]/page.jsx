"use client"
import { SignIn } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter

  useEffect(() => {
    // If the user logs in, reset form count and redirect to form creation
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn) {
      localStorage.setItem("formCount", "0") // Reset form count
      localStorage.removeItem("isLoggedIn")  // Cleanup temp storage
      router.push("/dashboard") // Change to where you want users to go after login
    }
  }, [])

  return (
    <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-900 px-6 gap-10">
      {/* Left Section - Text Content */}
      <div className="text-center text-white max-w-lg">
        <h2 className="text-2xl font-extrabold sm:text-4xl">
          Welcome to ReForm AI Form Builder
        </h2>
        <p className="mt-4 text-lg opacity-90">
          Create, automate, and manage forms effortlessly.
        </p>
      </div>

      {/* Right Section - SignIn Component */}
      <div className="w-full max-w-xs flex justify-center lg:justify-start">
        <SignIn afterSignInUrl="/dashboard" />
      </div>
    </section>
  )
}
