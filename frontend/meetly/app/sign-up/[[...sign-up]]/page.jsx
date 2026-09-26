"use client"

import { useEffect } from "react"
import { SignUp, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

function Register() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || isSignedIn) return null

  return (
    <div className="min-h-screen w-full flex font-sans text-slate-800">
      {/* Left side - image (hidden on mobile, shown from md breakpoint up) */}
      <div
        className="relative hidden overflow-hidden md:block md:w-1/2 lg:w-3/5 bg-cover bg-center"
        style={{ backgroundImage: "url('/meetly3.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex h-full items-center justify-center p-8 text-center text-white lg:p-12">
          <div className="max-w-lg">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
              Join Meetly
            </p>
            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
              Bring your best conversations to life.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 lg:text-lg">
              Create your space to meet, share ideas, and stay connected from anywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - auth form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8 bg-white">
        <div className="w-full max-w-md">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  )
}

export default Register