"use client"
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import Loader from "../components/Loader";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { dummySessions } from "@/asset";
import EmptySessions from "../components/sessions/EmptySessions";
import SessionCard from "../components/sessions/SessionCard";


function Session() {
  const [sessions] = useState(dummySessions)
  const[selectedSession, setSelectedSession] = useState(null)
   const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  
   
  
       if(!isLoaded){
        return <Loader text='Authenticating..'/>
       }
  
       if(!isSignedIn){
           router.push('/login');
       }
  return (
     <div
      className="h-screen overflow-y-scroll bg-gray-50 text-slate-900 flex flex-col font-sans"
      style={{
        backgroundImage: "url('/layout_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />
    <main className="flex-1 max-w-7xl w-full max-auto p-6 md:p-12">
      {/* Page Title & Navigate Header */}
      <Link href="/dashboard" className="flex items-center text-sm gap-1 mb-4 text-slate-500 hover:text-slate-900 transition-colors">
      <ArrowLeftIcon size={14}/>Go to Dashboard</Link>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight text-slate-900">Meeting sessions</h1>
        <p className="text-sm text-slate-500 mt-1">Review your past and active meeting history, participants logs, and chat transcription</p>
      </div>
      {/* Sessions Grid / Empty State */}
      {sessions.length === 0  ?(
       <EmptySessions />
      ) :(
        <div>
         {sessions.map((session)=> (<SessionCard key={session.id} session={session} onOpenDetails={() => setSelectedSession(session)} onRejoin={(meetingId)=> router.push(`/meetingroom/${meetingId}`)}/>))}
        </div>
      )}

      {/* Session Detail Modal */}
      <p>Session Detail Modal</p>
    </main>
      <Footer />
    </div>
  )
}

export default Session