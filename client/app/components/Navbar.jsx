"use client";

import Logo from "./Logo";

export default function Navbar({openLogIn, openSignIn}) {
  
  return (
    <nav className="w-full bg-gray-50 p-4 flex justify-center sm:justify-between items-center border border-x-0 border-t-0 border-b-[#7B171C] border-b-2 shadow-md">
      <Logo />

      <div className="hidden sm:flex items-center gap-3">
        <button 
          type="button" 
          className="px-3 py-2 bg-[#7B171C] text-white font-bold rounded-lg hover:shadow-lg hover:bg-red-900 transition-all duration-500"
          onClick={openSignIn}
        >
          Sign In
        </button>
        <button 
          type="button" 
          className="px-3 py-1.5 border-2 border-[#7B171C] text-[#7B171C] rounded-md hover:shadow-lg hover:text-red-900 transition-all duration-500"
          onClick={openLogIn}
        >
          Log In
        </button>
      </div>
    </nav>
  );
}
