'use client';

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleIcon from "./Icons/GoogleIcon";
import NewWindow from "react-new-window";

export default function LogInFrom({ isLogInOpen, logInClose }) {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if(session) {
      setGooglePopup(false);
      router.push("/chatbot");
    }
  }, [session]);

  const [googlePopUp, setGooglePopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error === "OAuthAccountNotLinked") {
        router.push("chatbot");
      } else {
        console.log(res.error);
        setError("Invalid Credentials ! Verify your informations or create an account !");
        return;
      }
      router.push("chatbot");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLogInOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
              <button
                onClick={logInClose}
                className="absolute top-0 sm:-top-2 right-0 sm:-right-12 m-2 p-1 text-black rounded-full hover:bg-gray-200 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-2xl mb-4">Log In</h2>

              {/* Log In Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline hover:border-black focus:border-black hover:shadow-lg transition-all"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline hover:border-black focus:border-black hover:shadow-lg transition-all"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-center text-red-500">{error}</p>}
                <div className="items-center z-50 rounded-3xl my-3 hover:shadow-lg transition-all">
                  <button
                    className="bg-[#7B171C] hover:bg-red-900 text-white py-2 px-4 rounded-3xl w-full disabled:bg-gray-400"
                    type="submit"
                    disabled={!email || !password}
                  >
                    Log In
                  </button>
                </div>
                <div className="relative flex items-center justify-center w-full my-5 border border-t">
                  <div className="absolute px-5 bg-white">Or</div>
                </div>
                <div className="items-center rounded-3xl my-3 hover:shadow-lg transition-all">
                  <button 
                    className="flex justify-center py-2 px-4 rounded-3xl border w-full"
                    type="button"
                    onClick={() => setGooglePopup(true)}
                  >
                    <GoogleIcon />
                    <p className="ml-3">Continue with Google</p>
                  </button>
                </div>  
              </form>
            </div>
          </div>
          {googlePopUp && !session ? (
            <NewWindow url="/google-sign-in"/>
          ): null}
        </div>
      )}
    </>
  );
};