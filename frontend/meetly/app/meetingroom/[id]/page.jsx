"use client"

import ChatPanel from "@/app/components/meeting/ChatPanel"
import ControlBar from "@/app/components/meeting/ControlBar"
import ParticipantsList from "@/app/components/meeting/ParticipantsList"
import { useAuth } from "@clerk/nextjs"
import VideoGrid from "@/app/components/meeting/VideoGrid"
import { useChat } from "@/app/hooks/useChat"
import useWebRTC from "@/app/hooks/useWebRTC"
import { dummyMeetingDetails, dummyUser } from "@/asset"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import Loader from "@/app/components/Loader"


function page() {
  const {meetingId} = useParams()
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const userdata = dummyUser;

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const handleMeetingEnded = useCallback(()=> {
    router.push('/dashboard')
  },[router])

  //* Initialize WebRTc
  const {localStream, remoteUsers, audioEnabled, videoEnabled, toggleAudio, toggleVideo, endMeeting} = useWebRTC(meetingId, userdata, handleMeetingEnded)

  //* Initialize Chat
  const {messages, sendMessage, unreadCount, isChatOpen, toggleChat} = useChat(meetingId, userdata)

  if(!isLoaded){
    return <Loader text='Authenticating..'/>
  }

  if(!isSignedIn){
    router.push('/login');
    return null
  }

  const isHost = true;

  //* fxn to handle leave
  const handleLeave = () => {
    toast("You left the meeting")
    router.push("/dashboard")

  }

  //* fxn to handle end meeting
  const handleEndMeeting = () => {
  endMeeting();
  toast("Meeting ended for all participants");
  router.push("/dashboard")
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
  {/* Video Grid Center */}
  <VideoGrid localStream={localStream} localUser={userdata} remoteUsers={remoteUsers} audioEnabled={audioEnabled} videoEnabled={videoEnabled}/>

  {/* Meeting Chat Drawer */}
  <ChatPanel isOpen={isChatOpen} onClose={toggleChat} messages={messages} onSendMessage={sendMessage} currentUser={userdata}/>

  {/* ParticipantsList */}
  <ParticipantsList  isOpen={isParticipantsOpen} onClose={()=> setIsParticipantsOpen(false)} localUser={userdata} localAudio={audioEnabled} localVideo={videoEnabled} remoteUsers={remoteUsers} meetingHostId={dummyUser.id}/>

   


</div>
 {/* Floating Control bar */}
    <ControlBar roomId={meetingId || dummyMeetingDetails.meetingId} audioEnabled={audioEnabled} videoEnabled={videoEnabled} onToggleAudio={toggleAudio} onToggleVideo={toggleVideo} onToggleChat={toggleChat} onToggleParticipants={()=> setIsParticipantsOpen((prev)=> !prev)} isChatOpen={isChatOpen} isParticipantsOpen={isParticipantsOpen} unreadCount={unreadCount} participantsCount={1 + remoteUsers.length} isHost={isHost} onLeave={handleLeave} onEndMeeting={handleEndMeeting}/>
    </div>
  )
}

export default page
