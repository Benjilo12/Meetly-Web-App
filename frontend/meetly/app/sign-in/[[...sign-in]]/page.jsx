"use client"

import { useEffect } from "react"
import { SignIn, SignUp, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

function Login({ mode = 'login' }) {
  const isRegister = mode === "register"
  const {isLoaded, isSignedIn} = useUser()
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
      <div className='w-full flex justify-center py-2'>
        {isRegister ? (
          <SignUp routing="path" path="/sign-in" signInUrl="/sign-in" />
        ) : (<SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard"/>)}

      </div>
    
    </div>
  )
}

export default Login