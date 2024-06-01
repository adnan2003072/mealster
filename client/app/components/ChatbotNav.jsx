'use client';

import { signOut, useSession } from "next-auth/react";

export default function ChatbotNav({ show, setShowNav, clearChat, chatHistory, setChatHistory, openLogIn, openSignIn}) {
  const {data: session } = useSession();

  return <aside
      className={`aside ${
        show ? "left-0" : "-left-full"
      } justify-between h-dvh flex flex-col`}
    >
    <div className="flex mb-4 relative w-full">
      <button 
        className="flex w-full gap-2 text-center text-white p-2 m-2 rounded-lg bg-[#7B171C] hover:bg-red-900 hover:shadow-lg transition-all duration-300"
        type="button"
        onClick={clearChat}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
        Clear chat history
      </button>
      {show && (
        <button
          onClick={() => setShowNav(false)}
          type="button"
          className="absolute p-2 -right-12 top-2 rounded-lg text-white bg-gray-900 lg:hidden transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"/>
          </svg>
        </button>
      )}
    </div>
    {session ? 
      <div className="flex flex-col gap-2 mx-2 mb-4 mt-2">
        <div className="flex items-center gap-1">
          {session?.user?.image ? <img src={session?.user?.image} className="w-9 rounded-full" /> : <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#7B171C] text-gray-100 uppercase">{session.user.name.charAt(0)}</div>}
          <p className="text-sm uppercase">{session?.user?.name}</p>
        </div>
        <button 
          className="flex justify-between px-3 py-1.5 border-2 border-[#7B171C] text-[#7B171C] rounded-md hover:shadow-lg hover:text-red-900 transition-all duration-500"
          onClick={() => signOut()}
        >
          Log out
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
        </button>
      </div> :
      <div className="flex flex-col gap-2 m-4">
        <button 
          className="px-3 py-1.5 border-2 border-[#7B171C] text-[#7B171C] rounded-md hover:shadow-lg hover:text-red-900 transition-all duration-500"
          onClick={openLogIn}
        >
          Log In
        </button>
        <button 
          className="px-3 py-2 bg-[#7B171C] text-white font-bold rounded-lg hover:shadow-lg hover:bg-red-900 transition-all duration-500"
          onClick={openSignIn}
        >
          Sign In
        </button>
      </div>
    }
  </aside>
}