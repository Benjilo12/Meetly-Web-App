import React from 'react'

const SessionCard = ({session, onOpenDetails, onRejoin}) => {
    const isEnded = session.status === "ended"
  return (
    <div className='bg-white/70 backdrop-blur rounded-3xl p-6 transition-all flex flex-col justify-between space-y-5 border border-slate-100/60 shadow-xs'>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
            <span className='text-xs font-mono text-slate-500 font-medium bd-slate-500/5 px-2.5 py-1 rounded-md'>ID: {session.meetingId}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${isEnded ? "bg-slate-500/5  text-slate-500": "bg-emerald-500/5 text-emerald-500"}`}>
        <span className={`size-1.25 rounded-full ${isEnded ? "bg-slate-400" : "bg-emerald-500"}`} >
                {isEnded ? "Ended" : "Active"}
            </span>
            </span>
        </div>
      </div>
    </div>
  )
}

export default SessionCard
