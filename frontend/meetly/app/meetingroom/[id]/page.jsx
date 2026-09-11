"use client"

import { dummyMeetingDetails, dummyUser } from "@/asset"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useState } from "react"


function page() {
  const {meetingId} = useParams()
  const router = useRouter()
  const userdata = dummyUser;

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const handleMeetingEnded = useCallback(()=> {
    router.push('/dashboard')
  },[router])

  const isHost = true;

  const handleLeave = () => {

  }

  const handleEndMeeting = () => {

  }
  return (
    <div  className="h-screen w=screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden relative font-sans">
    {/* Top bar */}
    <header className="w-full bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200 flex items-center justify-between z-30 shadow-xs">
    <div className="flex items-center gap-3">
      <h2 className="text-base font-semibold text-slate-900 tracking-tight">
        {dummyMeetingDetails.title} ({meetingId || dummyMeetingDetails.meetingId})</h2>
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div></header>

{/*   Main Content Area */}
<div className="flex-1 flex overflow-hidden relative">

</div>
    </div>
  )
}

export default page
