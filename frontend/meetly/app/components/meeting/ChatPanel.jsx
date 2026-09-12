import { SendIcon, XIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

function ChatPanel({isOpen, onClose , messages, onSendMessage, currentUser}) {
    const [text, setText] = useState("")
    const messageEndRef = useRef(null)

    useEffect(()=> {
  if(isOpen){
    messageEndRef.current?.scrollIntoView({behavior: "smooth"})
  }
    },[messages, isOpen])

    const handleSubmit = (e) => {
        e.preventDefault();
        if(text.trim()){
            onSendMessage(text);
            setText("")
        }
    }

    if(!isOpen) return null;
  return (
    <aside className='w-full sm:w-80 h-full min-h-0 bg-white border-l border-slate-200 flex flex-col z-30 shadow-2xl animate-in slide-in-from-right duration-200'>
         <div className='shrink-0 px-4 py-3.5 border-b border-slate-200 flex items-center justify-between'>
            <div>
                <h3 className='font-semibold text-slate-900 text-base tracking-tight'>In-Meeting Chat</h3>
                <p className='text-xs text-slate-400 mt-0.5'>Messages are visible to everyone</p>
            </div>
            <button type='button' onClick={onClose} aria-label='Close chat' className='p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer'>
                <XIcon className='w-5 h-5'/>
            </button>
         </div>

            <div className='flex-1 min-h-0 p-4 overflow-y-auto space-y-4'>
                {messages.length === 0 ? (
                    <div className='h-full flex flex-col items-center justify-center text-center text-slate-400 text-sm'>
                        <p className='font-medium text-slate-500'>No messages yet</p>
                        <p className='text-xs mt-1 text-slate-400'>Send a message to start chatting.</p>
                    </div>
                ) : (
                    messages.map((msg, index)=> {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                        <div key={msg.id || index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className='flex items-center gap-2 mb-1'>
                                <span className='text-xs font-semibold text-slate-500'>{isMe ? "You" : msg.senderName}</span>
                                <span className='text-[10px] text-slate-400'>{msg.time}</span>
                            </div>
                               <div className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${isMe ? "bg-primary text-white rounded-tr-none font-medium" : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 font-medium"}`}>
                                 {msg.text}
                            </div>
                        </div>
                    )
                    })
                )}
                <div ref={messageEndRef}/>
            </div>

            <form onSubmit={handleSubmit} className='shrink-0 p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2'>
                <input type='text' placeholder='Type a message...' value={text} onChange={(e) => setText(e.target.value)} className='min-w-0 flex-1 h-10 bg-white border border-slate-200 focus:border-primary rounded-lg px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-sm'/>

                <button type='submit' aria-label='Send message' disabled={!text.trim()} className='size-10 shrink-0 flex items-center justify-center rounded-lg bg-primary-hover text-white disabled:opacity-40 transition-all cursor-pointer shadow-sm'>
                    <SendIcon className='w-4 h-4' />
                </button>

            </form>
    </aside>
  )
}

export default ChatPanel
