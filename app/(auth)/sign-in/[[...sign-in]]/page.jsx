"use client";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // If the user logs in, reset form count and redirect to form creation
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      localStorage.setItem("formCount", "0"); // Reset form count
      localStorage.removeItem("isLoggedIn"); // Cleanup temp storage
      router.push("/dashboard"); // Change to where you want users to go after login
    }
  }, [router]);

  return (
    <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 gap-12">
      {/* Left Section - Text Content */}
      <div className="text-center lg:text-left text-white max-w-lg space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              ReForm
            </span>{" "}
            AI Form Builder
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Create, automate, and manage forms effortlessly with the power of
            artificial intelligence.
          </p>
        </div>

        {/* Simple feature highlights */}
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full text-sm font-medium border border-blue-500 border-opacity-30">
            AI-Powered
          </span>
          <span className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-300 rounded-full text-sm font-medium border border-purple-500 border-opacity-30">
            Lightning Fast
          </span>
          <span className="px-3 py-1 bg-indigo-500 bg-opacity-20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500 border-opacity-30">
            Secure
          </span>
        </div>
      </div>

      {/* Right Section - SignIn Component */}
      <div className="w-full max-w-md">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20 shadow-xl">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Sign In</h3>
            <p className="text-gray-300 text-sm">
              Access your dashboard and start building
            </p>
          </div>

          <SignIn afterSignInUrl="/dashboard" />
        </div>
      </div>
    </section>
  );
}
