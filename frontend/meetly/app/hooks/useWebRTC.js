"use client"

import { dummyRemoteParticipants } from '@/asset'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Mic, MicOff } from 'lucide-react';

const useWebRTC = (_roomId, user, onMeetingEnded, _enabled = true) => {

    const [localStream, setLocalStream] = useState(null)
    const [remoteUsers, setRoteUsers] = useState(dummyRemoteParticipants)
     const [videoEnabled, setVideoEnabled] = useState(true)
     const [audioEnabled, setAudioEnabled] = useState(true)

     const localStreamRef = useRef(null)

     //* Initialize local camera stream if available
     const initLocalStream = useCallback(async () => {
        try {
           if(navigator?.mediaDevices?.getUserMedia){
            const stream = await navigator.mediaDevices.getUserMedia({
                 video: true,
                audio:true
            })
            localStreamRef.current = stream;
            setLocalStream(stream)
            return stream;
           }

        } catch (_error) {
            console.log("Mock WebRTC: Running in camera preview fallback mode");
        }
     }, [])

     useEffect(()=> {
        initLocalStream()

        return ()=> {
            if(localStreamRef.current){
                localStreamRef.current.getTracks().forEach((track)=>track.stop())
            }
        }
     },[initLocalStream])

     //*Toggle local mic
     const toggleAudio = () => {
        const newState = !audioEnabled
        setAudioEnabled(newState);
        if(localStreamRef.current){
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) audioTrack.enabled = newState;
        }
        toast(newState ? "Microphone turned on" : "Microphone muted",{icon: newState ? <Mic size={20} /> : <MicOff size={20} />})
     }
  return (
    <div>
      
    </div>
  )
}

export default useWebRTC
