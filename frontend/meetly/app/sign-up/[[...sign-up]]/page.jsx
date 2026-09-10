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
    <div
      className="min-h-screen w-full bg-cover bg-center p-4 font-sans text-slate-800 md:p-6 lg:p-8"
      style={{ backgroundImage: "url('/login_bg.png')" }}
    >
      <div className="w-full flex justify-center py-2">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}

export default Register
