'use client';

import { Poppins } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogInFrom from "./components/LogInForm";
import SignInForm from "./components/SignInForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  useEffect(() => {
    if(session) {
      router.push("/chatbot");
    }
  }, [session]);

  return <main className={`h-screen bg-gray-100 flex flex-col items-center ${poppins.className} scrollbar`}>
    <LogInFrom
      isLogInOpen={isLogInOpen}
      logInClose={() => setIsLogInOpen(false)}
    />

    <SignInForm
      isSignInOpen={isSignInOpen}
      signInClose={() => setIsSignInOpen(false)}
    />

    <Navbar
      openLogIn={() => {
        setIsLogInOpen(true);
        setIsSignInOpen(false);
      }}
      openSignIn={() => {
        setIsSignInOpen(true)
        setIsLogInOpen(false);
      }}
    />

    <div className="w-full flex my-auto md:my-8 gap-10 justify-center items-center">
      <div className="md:w-1/2 max-w-[500px] flex flex-col justify-between text-center md:text-start items-center md:items-start">
        <h1 className="text-3xl text-[#7B171C] font-bold mb-4">
          Welcom to Mealster !
        </h1>
        <p className="mb-4 px-4 sm:px-0">
          Are you looking for delicious and personalized meal ideas?
          MealMaster is here to help! Our chatbot is designed to suggest
          dishes and restaurants in Agadir based on your preferences.
        </p>
        <Link
          href={"./chatbot"}
          className="flex w-fit px-3 py-2 gap-2 bg-[#7B171C] text-white rounded-lg hover:shadow-lg hover:bg-red-900 transition-all duration-500 font-bold"
        >
          Try Now !
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
        <div className="flex sm:hidden items-center gap-10 mt-6">
          <button
            type="button"
            className="w-36 px-3 py-2 bg-[#7B171C] text-white font-bold rounded-lg hover:shadow-lg hover:bg-red-900 transition-all duration-500"
            onClick={() => setIsSignInOpen(true)}
          >
            Sign In
          </button>
          <button
            type="button"
            className="w-36 px-3 py-1.5 border-2 border-[#7B171C] text-[#7B171C] rounded-md hover:shadow-lg hover:text-red-900 transition-all duration-500"
            onClick={() => setIsLogInOpen(true)}
          >
            Log in
          </button>
        </div>
      </div>
      <img
        src="./illustration.png"
        className="hidden md:block max-w-60"
        alt=""
      />
    </div>
    <Footer />
  </main>
}
