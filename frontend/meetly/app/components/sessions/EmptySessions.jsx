import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function EmptySessions() {
  return (
    <div className='w-full bg-white/50 backdrop-blur rounded-3xl p-12 xl:py-24 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-4'>
      <h3 className='text-xl lg:text-2xl font-medium text-slate-700'>No meeting history yet</h3>
      <p>Once you create or join meeting calls, your meeting sessions, participants, and chat logs will appear here</p>
      <Link href="/dashboard" className='bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3 rounded-full text-sm transition-all inline-flex items-center gap-2 mt-2'>
      Start a Meeting
      <ArrowRightIcon className='w-4 h-4'/>
      </Link>
    </div>
  )
}

export default EmptySessions
