"use client"
import { dummyUser } from "@/asset"
import { UserButton, useUser } from "@clerk/nextjs"
import { AstroidIcon, HistoryIcon, LayoutDashboardIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


function Navbar() {
  const {isSignedIn, user} = useUser()
  const pathname = usePathname()
  const userName  = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "user";
  return (
  <header  className="w-full max-w-305 mx-auto bg-white/90 backdrop-blur xl:rounded-b-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between border border-slate-200">
    {/* Brand Logo & Navigation Links */}
    <div className="flex items-center gap-6">
      <Link href="/dashboard" className="flex items-center gap-1.5">
      <Image src="/logo.svg" alt="logo" width={30} height={30}/>
      <span className="text-2xl font-medium tracking-tight text-slate-900 flex items-center">
        Meetly
      </span>
      </Link>
      {isSignedIn && (
        <nav className="hidden md:flex items-center gap-1.5 ml-2">
          <Link href="/dashboard" className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${pathname === '/dashboard' ? "ring ring-blue-100 bg-blue-50 text-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
          <LayoutDashboardIcon className="w-3.5 h-3.5"/>
          Dashboard</Link>

          <Link href="/session" className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${pathname === '/sessions' ? "ring ring-blue-100 bg-blue-50 text-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
          <HistoryIcon className="w-3.5 h-3.5"/>
          Sessions</Link>

          <Link href="/pricing" className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${pathname === '/pricing' ? "ring ring-blue-100 bg-blue-50 text-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
          <AstroidIcon className="w-3.5 h-3.5"/>
          Pricing</Link>
        </nav>
      )}

    </div>

    {/*! Right Profile / UserButton */}
    {isSignedIn && (
      <div className="flex items-center gap-4">
        <Link href="/sessions" className="md:hidden text-xs font-medium text-slate-600 hover:text-primary flex items-center gap-1">
         <HistoryIcon className="w-4 h-4"/>Sessions</Link>
         <span className="font-medium hidden sm:inline tracking-wide text-sm text-slate-700">Welcome, {userName}</span>
         <UserButton afterSwitchSessionUrl="/login"/>
      </div>
    )}
   </header>
  )
}

export default Navbar