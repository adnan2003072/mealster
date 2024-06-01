'use client';

import { useState } from "react";
import GoogleIcon from "./Icons/GoogleIcon";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NewWindow from "react-new-window";

export default function SignInForm({ isSignInOpen, signInClose }) {
  const router = useRouter();
  const {data: session } = useSession();

  const [name, setName] = useState('');
  const [googlePopUp, setGooglePopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');

  async function credentialsSignIn(event) {
    event.preventDefault();
    try {
      const resUserExists = await fetch('api/userExists', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({email}),
      });

      const { user } = await resUserExists.json();
      if(user) {
        setError("User already exists !");
        return;
      }
      
      try {
        const form = event.target;
        form.reset();
        await fetch('api/signIn', {
          method: 'POST',
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name, email, password,
          }),
        });

        console.log("user created successfully !");

        const resAuthentication = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        router.push("chatbot");
        console.log("registration successfull !");
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error("Error during sign in : ", error);
    }
  }

  return (
    <>
      {isSignInOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center h-screen p-4">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
              <button
                onClick={signInClose}
                className="absolute top-0 sm:-top-2 right-0 sm:-right-12 m-2 p-1 text-black rounded-full hover:bg-gray-200 transition-all"
              >
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl mb-1">Sign In</h2>

              {/* Sign In Form */}
              <form onSubmit={credentialsSignIn}>
                {/* username */}
                <div className="mb-4">
                  <label
                    className="flex text-gray-700 text-sm mb-2"
                    htmlFor="username"
                  >
                    Full name<p className="text-red-800 pl-1">*</p>
                  </label>
                  <input
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline hover:border-black focus:border-black hover:shadow-lg transition-all"
                    id="username"
                    type="username"
                    placeholder="Enter your username"
                    required
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                {/* email */}
                <div className="mb-4">
                  <label
                    className="flex text-gray-700 text-sm mb-2"
                    htmlFor="email"
                  >
                    Email Address<p className="text-red-800 pl-1">*</p>
                  </label>
                  <input
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline hover:border-black focus:border-black hover:shadow-lg transition-all"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                {/* password */}
                <div className="mb-5">
                  <label
                    className="flex text-gray-700 text-sm mb-2"
                    htmlFor="password"
                  >
                    Password<p className="text-red-800 pl-1">*</p>
                  </label>
                  <input
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline hover:border-black focus:border-black hover:shadow-lg transition-all"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                {/* password again */}
                <div className="mb-5">
                  <label
                    className="flex text-gray-700 text-sm mb-2"
                    htmlFor="password-again"
                  >
                    Confirm Password<p className="text-red-800 pl-1">*</p>
                  </label>
                  <input
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline hover:border-black focus:border-black hover:shadow-lg transition-all"
                    id="password-again"
                    type="password-again"
                    placeholder="Enter your password again"
                    required
                    onChange={(event) => setPasswordAgain(event.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-center text-red-500">{error}</p>}
                <div className="items-center rounded-3xl my-3 hover:shadow-lg transition-all">
                  <button
                    className="bg-[#7B171C] hover:bg-red-900 text-white py-2 px-4 rounded-3xl w-full disabled:bg-gray-400"
                    type="submit"
                    disabled={!name || !email || !password || !passwordAgain}
                  >
                    Sign In
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